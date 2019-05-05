const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Thumbs extends Command {
  constructor (client) {
    super(client, {
      name: 'thumbs',
      memberName: 'thumbs',
      aliases: [],
      group: 'canvas',
      description: 'Gives someone a thumbs up',
      examples: ['thumbs', 'thumbs @mention'],
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
      .vaultBoy(member.user.displayAvatarURL({ format: 'png', size: 256 }), 'vault.png'));

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
