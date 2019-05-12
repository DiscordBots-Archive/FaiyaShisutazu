const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class Shuffle extends Command {
  constructor (client) {
    super(client, {
      name: 'shuffle',
      memberName: 'shuffle',
      group: 'music',
      description: 'Shuffle the current queue',
      examples: ['shuffle'],
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
    if (!voiceChannel || !message.member.voice)
      return message.channel.send(oneLine`
        <:tsukihi:559908175906734097> Please be in a voice channel first ${message.member.displayName}-san!
      `);

    if (!this.client.playlists.has(message.guild.id))
      return message.channel.send(`
        <:tsukihi:559908175906734097> There is no active playlist on this server  ${message.member.displayName}-san!
      `)

    await message.channel.send('🔀 Shuffling the queue...');
    const currentPlaylist = message.client.playlists.get(message.guild.id);
    await this.shuffle(currentPlaylist.queue);
    currentPlaylist.position = 0;
  }

  async shuffle (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
};
