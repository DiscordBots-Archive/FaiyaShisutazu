const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

const YoutubeAPI = require('simple-youtube-api');
const youtube = new YoutubeAPI(process.env.GOOGLE_KEY);
const ytdl = require('ytdl-core-discord');
const parse = require('url-parse');

module.exports = class Play extends Command {
  constructor (client) {
    super(client, {
      name: 'play',
      memberName: 'play',
      group: 'music',
      description: 'Starts the music stream',
      examples: ['play [YouTube URL/search term]'],
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 10
      },
      args: [
        {
          key: 'text',
          prompt: 'you need to input a YouTube url or some search terms!\n',
          type: 'string'
        }
      ]
    });
  }

  async run (message, args) {
    if (!message.member.voice.channel) {
      return message.channel.send(oneLine`
        <:tsukihi:559908175906734097> Please be in a voice channel first **${message.member.displayName}-san**!
      `);
    }

    if (!this.client.playlists.has(message.guild.id)) {
      this.client.playlists.set(message.guild.id, {
        firstSong: true,
        dispatcher: null,
        queue: [],
        connection: null,
        position: -1,
        volume: 0.2,
        loopAll: null
      });
      await message.member.voice.channel.join();
    } else if (message.member.voice.channel !== message.guild.me.voice.channel) {
      return message.channel.send(oneLine`
        B-baka! Yamete kudasai **${message.member.displayName}-san**! 
        I'm already serving another channel can't you see? 
        If you want to add more songs, please connect to the same channel!
      `);
    }

    const url = args.text;

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      await this.playlistsHandler(message, url);
    } else {
      await this.videosHandler(message, url)
        .catch(async () => {
          try {
            const results = await youtube.searchVideos(url, 5);
            const choices = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '❎'];
            if (results.length != 0) {
              const embed = new MessageEmbed()
                .setColor(this.client.colors.random())
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 32 }))
                .setTimestamp();

              results.forEach(i => embed.addField(`${results.indexOf(i) + 1} ❯ ${i.title}`, `https://www.youtube.com/watch?v=${i.id}`));

              const selectionPrompt = await message.channel.send(`I found these results for **"${url}"**`, embed);
              for (let i = 0; i < choices.length; i++) {
                await selectionPrompt.react(choices[i]);
              }

              const filter = (reaction, user) => user.id === message.author.id && choices.includes(reaction.emoji.name);
              const collector = selectionPrompt.createReactionCollector(filter, { max: 1, time: 10000, errors: ['time'] });

              collector.on('end', async (collected) => {
                await selectionPrompt.delete();

                let id;
                if (collected.first()) {
                  if (collected.first().emoji.name === '❎') {
                    return message.channel.send(this.client.responses.musicCancelMessages.random()
                      .replaceAll('{{user}}', message.member.displayName));
                  } else {
                    id = results[choices.indexOf(collected.first().emoji.name)].id;
                  }
                } else id = results[0].id;

                await this.addSong(message, id);
                await this.playNext(message);
              });
            }
          } catch (error) {
            this.logger.error(error);
          }
        });
    }
  }
  
  async playNext (message) {
    const currentPlaylist = this.client.playlists.get(message.guild.id);
    const currentPosition = currentPlaylist.queue[currentPlaylist.position];

    let nextSong;
    if (currentPlaylist.firstSong) {
      nextSong = currentPlaylist.queue[++currentPlaylist.position];
    } else {
      if (currentPosition.loopOne) nextSong = currentPosition;
      else nextSong = currentPlaylist.queue[++currentPlaylist.position];
    }

    const streamOptions = {
      type: 'opus',
      volume: currentPlaylist.volume,
      bitrate: 'auto'
    };
    
    const dispatcher = this.client.voice.connections.get(message.guild.id).play(await ytdl(nextSong.url), streamOptions);
    currentPlaylist.dispatcher = dispatcher;

    if (!nextSong.loopOne) {
      const embed = new MessageEmbed()
        .setDescription(nextSong.url)
        .setColor(this.client.colors.random())
        .setFooter(`Requested by ${nextSong.requester}`, message.author.displayAvatarURL({ format: 'png', size: 32 }))
        .setThumbnail(`https://i.ytimg.com/vi/${nextSong.id}/mqdefault.jpg`)
        .setTimestamp()
        .addField('Length', `${nextSong.playTime} (${nextSong.playTimeInSec}s)`, true)
        .addField('Volume', `${currentPlaylist.volume * 100}%`, true);

      const nowPlaying = await message.channel.send(oneLine`▶ Now playing 
        **${nextSong.title.length > 40 ? `${nextSong.title.substring(0, 40)}...` : `${nextSong.title}`}**`, embed);
      
      await nowPlaying.react('🔂');
      if (!currentPlaylist.loopAll) await nowPlaying.react('🔁');

      const filter = (reaction, user) => user.id === nextSong.requesterID && (reaction.emoji.name === '🔂' || reaction.emoji.name === '🔁');
      const collector = nowPlaying.createReactionCollector(filter, { max: 1, time: nextSong.playTimeInSec * 1000, errors: ['time'] });

      collector.on('end', async (collected) => {
        const prefix = message.guild ? message.guild.commandPrefix : this.client.commandPrefix;
        if (collected.first() && collected.first().emoji.name === '🔂') {
          nextSong.loopOne = true;
          await message.channel.send(stripIndents`🔂 Looping **${nextSong.title}**...
            **${message.member.displayName}-san** can end the loop by running \`${prefix}skip\`
          `);
        } else if (collected.first() && collected.first().emoji.name === '🔁') {
          currentPlaylist.loopAll = true;
          await message.channel.send(stripIndents`🔁 Looping the whole playlist...
            **${message.member.displayName}-san** can end the loop by running \`${prefix}stop\`
          `);
        }
      });
    }

    dispatcher.on('end', async () => {
      if (currentPlaylist.queue.length > 0 && (nextSong.loopOne || currentPlaylist.position + 1 < currentPlaylist.queue.length)) {
        this.playNext(message);
      } else {
        if (currentPlaylist.loopAll) {
          currentPlaylist.position = 0;
          this.playNext(message);
        } else {
          this.client.playlists.delete(message.guild.id);
          this.client.voice.connections.get(message.guild.id).disconnect();
          await message.channel.send('End of the queue!');
        }
      }
    });
  }

  async addSong(message, id) {
    const info = await youtube.getVideoByID(id);

    if (info.durationSeconds === 0) {
      return message.channel.send(oneLine`
        <:tsukihi:559908175906734097> S-sumimasen **${message.member.displayName}-san**, 
        I can't play live stream videos yet!
      `);
    }

    const time = parseInt(info.durationSeconds, 10);
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) seconds = '0' + seconds;
    this.client.playlists.get(message.guild.id).queue.push({
      url: `https://www.youtube.com/watch?v=${info.id}`,
      id: info.id,
      channel: info.channel.title,
      title: info.title,
      playTime: `${minutes}:${seconds}`,
      playTimeInSec: info.durationSeconds,
      requester: message.author.tag,
      requesterID: message.author.id,
      loopOne: null
    });
  }

  async playlistsHandler (message, url) {
    const id = (() => {
      const parsed = parse(url, true);
      if (/(www\.)?youtube\.com/.test(parsed.hostname)) {
        return parsed.query.list;
      }
    })();

    const playlistInfo = await youtube.getPlaylistByID(id)
      .catch(() => {
        return message.channel.send(oneLine`
          <:tsukihi:559908175906734097> Aa yoisho... Either this playlist is empty or I don't have permission to see it.
          I can only access public playlist **${message.member.displayName}-san**!
        `);
      });

    const videoList = await playlistInfo.getVideos();
    for (const video of videoList) {
      await this.addSong(message, video.id);
    }

    if (this.client.playlists.get(message.guild.id).firstSong) {
      await this.playNext(message);
      this.client.playlists.get(message.guild.id).firstSong = false;
    }

    await message.channel.send(`⏏ Songs in playlist **${playlistInfo.title}** have been added to the queue.`);
  }

  async videosHandler (message, url) {
    const id = (() => {
      const parsed = parse(url, true);
      if (/(www\.)?youtube\.com/.test(parsed.hostname)) {
        return parsed.query.v;
      } else if (/(www\.)?youtu\.be/.test(parsed.hostname)) {
        return parsed.pathname.slice(1);
      }
    })();

    await this.addSong(message, id);

    if (this.client.playlists.get(message.guild.id).firstSong) {
      await this.playNext(message);
      this.client.playlists.get(message.guild.id).firstSong = false;
    } else {
      const embed = new MessageEmbed()
        .setDescription(oneLine`
          **${info.title}** (${minutes}:${seconds}) has been added to the queue.
          \n\nRequested by **${message.author.tag}**!
        `)
        .setColor(this.client.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 32 }))
        .setThumbnail(`https://i.ytimg.com/vi/${info.id}/mqdefault.jpg`)
        .setTimestamp();

      await message.channel.send(embed);
    }
  }
};
