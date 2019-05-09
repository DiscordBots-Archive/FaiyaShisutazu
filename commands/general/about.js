const { Command } = require('discord.js-commando');

module.exports = class About extends Command {
  constructor (client) {
    super(client, {
      name: 'about',
      memberName: 'about',
      aliases: ['intro'],
      group: 'general',
      description: 'Introduces myself',
      examples: ['about'],
      throttling: {
        usages: 3,
        duration: 5
      }
    });
  }

  async run (message) {
    await message.channel.send(this.client.responses.aboutMessages.random()
      .replaceAll('{{prefix}}', process.env.PREFIX));
  }
};
