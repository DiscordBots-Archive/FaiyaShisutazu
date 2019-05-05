const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Step extends Command {
  constructor (client) {
    super(client, {
      name: 'step',
      memberName: 'step',
      aliases: [],
      group: 'canvas',
      description: 'Steps on someone you dislike',
      examples: ['step', 'step @mention'],
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
      .stepped(member.user.displayAvatarURL({ format: 'png', size: 256 }), 'stepped.png'));

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
