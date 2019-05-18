const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class Skip extends Command {
  constructor (client) {
    super(client, {
      name: 'skip',
      memberName: 'skip',
      group: 'music',
      description: 'Skips the current song',
      examples: ['skip'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  async run (message) { // eslint-disable-line no-unused-vars
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

    await message.channel.send('⏭ Skipping to the next song...');
    const currentPlaylist = message.client.playlists.get(message.guild.id);
    const currentPosition = currentPlaylist.queue[currentPlaylist.position];
    if (currentPosition.loopOne) currentPosition.loopOne = false;
    currentPlaylist.dispatcher.end('skip');
  }
};
