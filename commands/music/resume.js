const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class Resume extends Command {
  constructor (client) {
    super(client, {
      name: 'resume',
      memberName: 'resume',
      group: 'music',
      description: 'Resumes the music stream',
      examples: ['resume'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5
      }
    });
  }

  async run (message) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voice
      ? message.member.voice.channel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || !message.member.voice) {
      return message.channel.send(oneLine`
      <:tsukihi:559908175906734097> Please be in a voice channel first ${message.member.displayName}-san!
    `);
    }

    if (!this.client.playlists.get(message.guild.id).dispatcher.paused) { return message.channel.send(`<:tsukihi:559908175906734097> Stream isn't paused ${message.member.displayName}-san!`); }

    await message.channel.send('▶ Resuming music stream...');
    this.client.playlists.get(message.guild.id).dispatcher.resume();
  }
};
