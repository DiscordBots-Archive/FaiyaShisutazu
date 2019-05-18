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
    if (!message.member.voice.channel) {
      return message.channel.send(oneLine`
        <:tsukihi:559908175906734097> Please be in a voice channel first **${message.member.displayName}-san**!
      `);
    } else if (!message.guild.me.voice || !this.client.playlists.has(message.guild.id)) {
      return message.channel.send(`
        <:tsukihi:559908175906734097> There is no active stream on this server **${message.member.displayName}-san**!
      `);
    } else if (message.member.voice.channel !== message.guild.me.voice.channel) {
      return message.channel.send(oneLine`
        <:tsukihi:559908175906734097> You must be in the same channel that I'm streaming in run this command 
        **${message.member.displayName}-san**!
      `);
    }

    if (this.client.playlists.get(message.guild.id).dispatcher.paused) {
      await message.channel.send(`<:tsukihi:559908175906734097> Playback is already paused **${message.member.displayName}-san**!`);
    } else {
      await message.channel.send('⏸ Pausing music stream...');
      this.client.playlists.get(message.guild.id).dispatcher.pause();
    }
  }
};
