const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Beautiful extends Command {
  constructor (client) {
    super(client, {
      name: 'beautiful',
      memberName: 'beautiful',
      aliases: ['painting'],
      group: 'canvas',
      description: 'Paints a beatiful canvas with the person you like on it',
      examples: ['beautiful', 'beautiful @mention'],
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
    const member = args.member || message.member;
    const attachment = new MessageAttachment(await message.client.idiotAPI
      .beautiful(member.user.displayAvatarURL({ format: 'png', size: 256 })), 'beautiful.png');

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
