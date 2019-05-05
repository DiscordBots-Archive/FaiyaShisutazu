const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Respect extends Command {
  constructor (client) {
    super(client, {
      name: 'respect',
      memberName: 'respect',
      aliases: [],
      group: 'canvas',
      description: 'Pays respect to a person',
      examples: ['respect', 'respect @mention'],
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
      .respect(member.user.displayAvatarURL({ format: 'png', size: 256 }), 'respect.png'));

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
