const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Religion extends Command {
  constructor (client) {
    super(client, {
      name: 'religion',
      memberName: 'religion',
      aliases: [],
      group: 'canvas',
      description: 'Gets someone to join your religion',
      examples: ['religion', 'religion @mention'],
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
      .religion(member.user.displayAvatarURL({ format: 'png', size: 256 }), 'religion.png'));

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
