const { Command } = require('discord.js-commando');

module.exports = class Stop extends Command {

  constructor(client) {
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

  async run(message) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voice ?
      message.member.voice.channel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
    if (!voiceChannel || !message.member.voice) return message.channel.send(oneLine`
      <:tsukihi:559908175906734097> Please be in a voice channel first ${message.member.displayName}-san!
    `);

    await message.channel.send("⏹ Stopping music stream...");
    if (this.client.playlists.has(message.guild.id)) {
      const currentPlaylist = this.client.playlists.get(message.guild.id);
      
      currentPlaylist.queue = [];
      currentPlaylist.loopAll = null;
      currentPlaylist.dispatcher.end();
    }
  }
}