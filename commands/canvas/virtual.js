const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Virtual extends Command {
  constructor (client) {
    super(client, {
      name: 'virtual',
      memberName: 'virtual',
      aliases: [],
      group: 'canvas',
      description: 'Brings VR to your life',
      examples: ['virtual', 'virtual @mention'],
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
      .virtual(member.user.displayAvatarURL({ format: 'png', size: 256 }), 'virtual.png'));

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
