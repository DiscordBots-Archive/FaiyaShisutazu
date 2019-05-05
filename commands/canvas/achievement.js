const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');

module.exports = class Achievement extends Command {
  constructor (client) {
    super(client, {
      name: 'achievement',
      memberName: 'achievement',
      aliases: ['achieve'],
      group: 'canvas',
      description: 'Creates an user-defined achievement',
      examples: ['achievement [text]', 'achievement Tru Weeb'],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'text',
          prompt: 'you need to provide some texts to define your achievement!\n',
          type: 'string'
        }
      ]
    });
  }

  async run (message, args) {
    const text = args.text.toUpperCase();
    const attachment = new MessageAttachment(await this.client.idiotAPI
      .achievement(message.author.displayAvatarURL({ format: 'png', size: 32 }), text), 'achievement.png');

    await message.channel.send(`Requested by **${message.author.tag}**`, { files: [attachment] });
  }
};
