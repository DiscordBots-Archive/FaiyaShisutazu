const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Crush extends Command {
  constructor (client) {
    super(client, {
      name: 'crush',
      memberName: 'crush',
      aliases: [],
      group: 'canvas',
      description: 'Shows everyone who you missed the most',
      examples: ['crush', 'crush @mention'],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'member',
          prompt: 'You need to mention someone!\n',
          type: 'member',
          default: ''
        }
      ]
    });
  }

  async run (message, args) {
    const target = args.member || message.member;
    const attachment = new MessageAttachment(await message.client.idiotAPI
      .crush(target.user.displayAvatarURL({ format: 'png', size: 512 }), message.author.displayAvatarURL({ format: 'png', size: 128 }), 'crush.png'));

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
