const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Tattoo extends Command {
  constructor (client) {
    super(client, {
      name: 'tattoo',
      memberName: 'tattoo',
      aliases: [],
      group: 'canvas',
      description: 'Gets a tattoo of someone',
      examples: ['tattoo', 'tattoo @mention'],
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
      .tattoo(member.user.displayAvatarURL({ format: 'png', size: 256 }), 'tattoo.png'));

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
