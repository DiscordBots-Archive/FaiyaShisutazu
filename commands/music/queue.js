const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class Queue extends Command {
  constructor (client) {
    super(client, {
      name: 'queue',
      memberName: 'queue',
      group: 'music',
      description: 'Retrieves the current queue',
      examples: ['queue'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5
      }
    });
  }

  async run (message) {
    if (!this.client.streams.has(message.guild.id)) {
      return message.channel.send(`<:tsukihi:559908175906734097> The queue is empty ${message.member.displayName}-san.`);
    }

    let playlist = this.client.streams.get(message.guild.id);
    playlist = playlist.queue.slice(playlist.position);

    const current = playlist.shift();
    const singular = playlist.length === 1;
    const embed = new MessageEmbed()
      .setColor(this.client.colors.random())
      .setTitle(`Currently playing: **${current.title.substring(0, 50)}** (${current.playTime})!`)
      .setDescription(oneLine`
        There ${singular ? 'is' : 'are'} currently ${playlist.length} other song${singular ? '' : 's'} in the queue.
      `)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 32 }))
      .setTimestamp()
      .setThumbnail(`https://i.ytimg.com/vi/${current.id}/mqdefault.jpg`)
      .setURL(current.url);

    for (let i = 0; i < playlist.length && i < 5; i++) {
      embed.addField(oneLine`
        ${playlist[i].title.length > 40 ? `${playlist[i].title.substring(0, 40)}...` : `${playlist[i].title}`} (${playlist[i].playTime})
      `, `Requested by **${playlist[i].requester}**`);
    }

    await message.channel.send(embed);
  }
};
