const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Fear extends Command {
  constructor (client) {
    super(client, {
      name: 'fear',
      memberName: 'fear',
      aliases: ['scared'],
      group: 'canvas',
      description: 'Displays your fear of something',
      examples: ['fear', 'fear @mention'],
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
      .heavyFear(member.user.displayAvatarURL({ format: 'png', size: 256 })), 'fear.png');

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
