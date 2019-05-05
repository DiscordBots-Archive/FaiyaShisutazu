const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Trigger extends Command {
  constructor (client) {
    super(client, {
      name: 'trigger',
      memberName: 'trigger',
      aliases: [],
      group: 'canvas',
      description: 'Triggers someone',
      examples: ['trigger', 'trigger @mention'],
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
      .triggered(member.user.displayAvatarURL({ format: 'png', size: 512 }), 'triggered.gif'));

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
