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
    const voiceChannel = message.member.voice
      ? message.member.voice.channel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || !message.member.voice) {
      return message.channel.send(oneLine`
      <:tsukihi:559908175906734097> Please be in a voice channel first ${message.member.displayName}-san!
    `);
    }

    await message.channel.send('⏭ Skipping to the next song...');
    const currentPlaylist = message.client.playlists.get(message.guild.id);
    const currentPosition = currentPlaylist.queue[currentPlaylist.position];
    if (currentPosition.loopOne) currentPosition.loopOne = false;
    currentPlaylist.dispatcher.end('skip');
  }
};
