const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const parse = require('url-parse');
const YoutubeAPI = require('simple-youtube-api');
const youtube = new YoutubeAPI(process.env.GOOGLE_KEY);

module.exports = class Playlist extends Command {
  constructor (client) {
    super(client, {
      name: 'playlist',
      memberName: 'playlist',
      group: 'music',
      description: 'Adds a YouTube playlist to the current queue',
      examples: ['playlist [YouTube playlist URL]'],
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  async run (message, args) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voice
      ? message.member.voice.channel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || !message.member.voice) {
      return message.channel.send(oneLine`
      <:tsukihi:559908175906734097> Please be in a voice channel first ${message.member.displayName}-san!
    `);
    }

    const playlist = args.join(' ');
    if (!playlist.length) return message.channel.send(`B-baka! Input something **${message.member.displayName}-san**!`);
    if (playlist.search(/(www\.)?youtube\.com\/playlist\?list=/) === -1) {
      const prefix = message.guild ? message.guild.commandPrefix : this.client.commandPrefix;
      return message.channel.send(oneLine`
        <:tsukihi:559908175906734097> This doesn't look like a YouTube playlist!
        For individual songs, please try \`${prefix}play\` instead **${message.member.displayName}-san**!
      `);
    }

    const id = (() => {
      const parsed = parse(playlist, true);
      if (/(www\.)?youtube\.com/.test(parsed.hostname)) {
        return parsed.query.list;
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

    const playlistInfo = await youtube.getPlaylistByID(id)
      .catch(() => {
        return message.channel.send(oneLine`
            <:tsukihi:559908175906734097> Aa yoisho... Either this playlist is empty or I don't have permission to see it.
            I can only access public playlist **${message.member.displayName}-san**!
        `);
      });

    const videoList = await playlistInfo.getVideos();
    for (const video of videoList) {
      const info = await youtube.getVideoByID(video.id);
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

    if (this.client.playlists.get(message.guild.id).firstSong) {
      await this.client.playNext(message);
      this.client.playlists.get(message.guild.id).firstSong = false;
    }

    await message.channel.send(`⏏ Songs in playlist **${playlistInfo.title}** have been added to the queue.`);
  }
};
