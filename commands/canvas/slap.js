const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Slap extends Command {
  constructor (client) {
    super(client, {
      name: 'slap',
      memberName: 'slap',
      aliases: [],
      group: 'canvas',
      description: 'Slaps a person in the face',
      examples: ['slap', 'slap @mention'],
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
      .batSlap(message.author.displayAvatarURL({ format: 'png', size: 256 }), member.user.displayAvatarURL({ format: 'png', size: 256 }), 'slap.png'));

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
