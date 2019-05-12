const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class Stop extends Command {
  constructor (client) {
    super(client, {
      name: 'stop',
      memberName: 'stop',
      group: 'music',
      description: 'Stops the current stream',
      examples: ['stop'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  async run (message) {
    const voiceChannel = message.member.voices
      ? message.member.voice.channel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || !message.member.voice)
      return message.channel.send(`
        <:tsukihi:559908175906734097> Please be in a voice channel first ${message.member.displayName}-san!
      `);

    if (!this.client.playlists.has(message.guild.id))
      return message.channel.send(`
        <:tsukihi:559908175906734097> There is no active playlist on this server  ${message.member.displayName}-san!
      `);

    await message.channel.send('⏹ Stopping music stream...');
    const currentPlaylist = this.client.playlists.get(message.guild.id);
    currentPlaylist.queue = [];
    currentPlaylist.loopAll = null;
    if (currentPlaylist.dispatcher) currentPlaylist.dispatcher.end();
  }
};
