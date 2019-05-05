const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Waifu extends Command {
  constructor (client) {
    super(client, {
      name: 'waifu',
      memberName: 'waifu',
      aliases: [],
      group: 'canvas',
      description: 'Insults someone\'s waifu',
      examples: ['waifu', 'waifu @mention'],
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
      .waifuInsult(member.user.displayAvatarURL({ format: 'png', size: 256 }), 'waifu.png'));

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
