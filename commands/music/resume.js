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

  async run (message) {
    if (!message.member.voice) {
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

    if (!this.client.playlists.get(message.guild.id).dispatcher.paused) {
      await message.channel.send(`<:tsukihi:559908175906734097> Stream isn't paused **${message.member.displayName}-san**!`);
    } else {
      await message.channel.send('▶ Resuming music stream...');
      this.client.playlists.get(message.guild.id).dispatcher.resume();
    }
  }
};
