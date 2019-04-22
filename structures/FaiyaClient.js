const { Client } = require('discord.js-commando');
const { Collection, MessageEmbed } = require('discord.js');
const { createLogger, format, transports } = require('winston');
const { stripIndents, oneLine } = require('common-tags');
const idioticAPI = require('idiotic-api');
const ytdl = require('ytdl-core-discord');

module.exports = class FaiyaClient extends Client {
  constructor (options) {
    super(options);
    this.responses = require('../assets/responses.js');
    this.colors = [16747146, 16746211, 16746178, 16681968, 15371774, 14518525, 11373566];
    this.logger = createLogger({
      transports: [new transports.Console()],
      format: format.combine(
        format.colorize({ all: true }),
        format.simple()
      )
    });

    this.idiotAPI = new idioticAPI.Client(`${process.env.IDIOT_KEY}`, { dev: true });

    this.playlists = new Collection();
  }

  async playNext (message) {
    const currentPlaylist = message.client.playlists.get(message.guild.id);
    const currentPosition = currentPlaylist.queue[currentPlaylist.position];

    let nextSong;
    if (currentPlaylist.firstSong) nextSong = currentPlaylist.queue[++currentPlaylist.position];
    else {
      if (currentPosition.loopOne) nextSong = currentPosition;
      else nextSong = currentPlaylist.queue[++currentPlaylist.position];
    }

    const streamOptions = {
      type: 'opus',
      volume: currentPlaylist.volume,
      bitrate: 'auto'
    };

    const dispatcher = message.guild.voiceConnection
      .play(await ytdl(nextSong.url), streamOptions);
    currentPlaylist.dispatcher = dispatcher;

    if (!nextSong.loopOne) {
      const embed = new MessageEmbed()
        .setDescription(nextSong.url)
        .setColor(message.client.colors.random())
        .setFooter(`Requested by ${nextSong.requester}`, message.author.displayAvatarURL({ format: 'png', size: 32 }))
        .setThumbnail(`https://i.ytimg.com/vi/${nextSong.id}/mqdefault.jpg`)
        .setTimestamp()
        .addField('Length', `${nextSong.playTime} (${nextSong.playTimeInSec}s)`, true)
        .addField('Volume', `${currentPlaylist.volume * 100}%`, true);

      const nowPlaying = await message.channel.send(oneLine`▶ Now playing 
        **${nextSong.title.length > 40 ? `${nextSong.title.substring(0, 40)}...` : `${nextSong.title}`}**`, embed);
      await nowPlaying.react('🔂');
      if (!currentPlaylist.loopAll) { await nowPlaying.react('🔁'); }

      const filter = (reaction, user) => user.id === nextSong.requesterID && (reaction.emoji.name === '🔂' || reaction.emoji.name === '🔁');
      const collector = nowPlaying
        .createReactionCollector(filter, { max: 1, time: nextSong.playTimeInSec * 1000, errors: ['time'] });

      collector.on('end', async (collected) => {
        if (collected.first()) {
          const prefix = message.guild ? message.guild.commandPrefix : message.client.commandPrefix;
          if (collected.first().emoji.name === '🔂') {
            nextSong.loopOne = true;
            await message.channel.send(stripIndents`🔂 Looping **${nextSong.title}**...
              **${message.member.displayName}-san** can end the loop by running\`${prefix}skip\`
            `);
          } else if (collected.first().emoji.name === '🔁') {
            currentPlaylist.loopAll = true;
            await message.channel.send(stripIndents`🔁 Looping the whole playlist...
              **${message.member.displayName}-san** can end the loop by running\`${prefix}stop\`
            `);
          }
        }
      });
    }

    dispatcher.on('end', async () => {
      if (currentPlaylist.queue.length > 0 && (nextSong.loopOne || currentPlaylist.position + 1 < currentPlaylist.queue.length)) {
        await this.playNext(message);
      } else {
        if (currentPlaylist.loopAll) {
          currentPlaylist.position = 0;
          await this.playNext(message);
        } else {
          message.client.playlists.delete(message.guild.id);
          await message.guild.voiceConnection.disconnect();
          await message.channel.send('End of the queue!');
        }
      }
    });
  }
};
