const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Wreck extends Command {
  constructor (client) {
    super(client, {
      name: 'wreck',
      memberName: 'wreck',
      aliases: [],
      group: 'canvas',
      description: 'Gets a Wreck-It Ralph meme',
      examples: ['wreck', 'wreck @mention'],
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
      .wreckIt(member.user.displayAvatarURL({ format: 'png', size: 256 }), 'wreck.png'));

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
