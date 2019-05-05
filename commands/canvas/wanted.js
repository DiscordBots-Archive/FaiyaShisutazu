const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Wanted extends Command {
  constructor (client) {
    super(client, {
      name: 'wanted',
      memberName: 'wanted',
      aliases: [],
      group: 'canvas',
      description: 'Puts someone on a wanted poster',
      examples: ['wanted', 'wanted @mention'],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'member',
          prompt: 'you need to mention someone!\n',
          type: 'member',
          default: ''
        }
      ]
    });
  }

  async run (message, args) {
    const member = args.member || message.member;
    const attachment = new MessageAttachment(await message.client.idiotAPI
      .wanted(member.user.displayAvatarURL({ format: 'png', size: 256 }), 'wanted.png'));

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
