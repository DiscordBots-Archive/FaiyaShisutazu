const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class Volume extends Command {
  constructor (client) {
    super(client, {
      name: 'volume',
      memberName: 'volume',
      group: 'music',
      description: 'Adjusts the stream volume',
      examples: ['volume 0', 'volume 20', 'volume 100'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  async run (message, args) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voice ? message.member.voice.channel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || !message.member.voice)
      return message.channel.send(oneLine`
        <:tsukihi:559908175906734097> Please be in a voice channel first ${message.member.displayName}-san!
      `);

    if (!this.client.playlists.has(message.guild.id))
      return message.channel.send(`
        <:tsukihi:559908175906734097> There is no active playlist on this server  ${message.member.displayName}-san!
      `);

    const vol = args;
    const currentPlaylist = message.client.playlists.get(message.guild.id);

    if (!vol) {
      return message.channel.send(oneLine`
      Aa yoisho.. how can I adjust the volume if you don't specify a value you bakaa!
      Current volume is set at ${currentPlaylist.volume * 100}%
    `);
    }
    if (vol <= 0 || vol > 100) { return message.channel.send(`Volume must be a value between 1% and 100% ${message.member.displayName}-san!`); }

    await message.channel.send(`The stream volume is now ${vol}%!`);
    currentPlaylist.volume = vol / 100;
    this.client.playlists.get(message.guild.id).dispatcher.setVolume(currentPlaylist.volume);
  }
};
