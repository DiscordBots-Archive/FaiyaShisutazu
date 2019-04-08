const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');
const parse = require('url-parse');
const YoutubeAPI = require('simple-youtube-api');
const youtube = new YoutubeAPI(process.env.GOOGLE_KEY);

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
      }
    });
  }

  async run (message, args) { // eslint-disable-line no-unused-vars
    try {
      const voiceChannel = message.member.voice
        ? message.member.voice.channel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
      if (!voiceChannel || !message.member.voice) {
        return message.channel.send(oneLine`
        <:tsukihi:559908175906734097> Please be in a voice channel first ${message.member.displayName}-san!
      `);
      }

      const song = args;
      if (!song.length) {
        return message.channel.send(oneLine`
        <:tsukihi:559908175906734097> B-baka! Input something **${message.member.displayName}-san**!
      `);
      }
      if (song.search(/(www\.)?youtube\.com\/playlist\?list=/) !== -1) {
        return message.channel.send(oneLine`
        <:tsukihi:559908175906734097> It seems like you are trying to give me a YouTube playlist.
        Please use \`${message.settings.prefix}playlist\` instead **${message.member.displayName}-san**!
      `);
      }

      let id = (() => {
        const parsed = parse(song, true);
        if (/(www\.)?youtube\.com/.test(parsed.hostname)) {
          return parsed.query.v;
        } else if (/(www\.)?youtu\.be/.test(parsed.hostname)) {
          return parsed.pathname.slice(1);
        }
      })();

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
      }

      const addSong = async () => {
        const info = await youtube.getVideoByID(id);
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

        if (this.client.playlists.get(message.guild.id).firstSong) {
          await this.client.playNext(message);
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
      };

      if (id) await addSong();
      else {
        const results = await youtube.searchVideos(song, 5);
        const choices = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '❎'];

        const embed = new MessageEmbed()
          .setColor(this.client.colors.random())
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 32 }))
          .setTimestamp();

        results.forEach(i => embed
          .addField(`${results.indexOf(i) + 1} ❯ ${i.title}`, `https://www.youtube.com/watch?v=${i.id}`));

        const selectionPrompt = await message.channel.send(`I found these results for **"${song}"**`, embed);
        for (let i = 0; i < choices.length; i++) { await selectionPrompt.react(choices[i]); }

        const filter = (reaction, user) => user.id === message.author.id && choices.includes(reaction.emoji.name);
        const collector = selectionPrompt.createReactionCollector(filter, { max: 1, time: 10000, errors: ['time'] });

        collector.on('end', async (collected) => {
          await selectionPrompt.delete();

          if (collected.first()) {
            if (collected.first().emoji.name === '❎') {
              await message.channel
                .send(this.client.responses.musicCancelMessages.random()
                  .replaceAll('{{user}}', `${message.member.displayName}`));
            } else { id = results[choices.indexOf(collected.first().emoji.name)].id; }
          } else id = results[0].id;

          await addSong();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
