const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class Pause extends Command {
  constructor (client) {
    super(client, {
      name: 'pause',
      memberName: 'pause',
      group: 'music',
      description: 'Pauses the music stream',
      examples: ['pause'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  async run (message) {
    const voiceChannel = message.member.voice
      ? message.member.voice.channel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || !message.member.voice) {
      return message.channel.send(oneLine`
      <:tsukihi:559908175906734097> Please be in a voice channel first ${message.member.displayName}-san!
    `);
    }

    if (this.client.playlists.get(message.guild.id).dispatcher.paused) { return message.channel.send(`<:tsukihi:559908175906734097> Playback is already paused ${message.author.tag}-san!`); }

    await message.channel.send('⏸ Pausing music stream...');
    this.client.playlists.get(message.guild.id).dispatcher.pause();
  }
};
