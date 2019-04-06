const { Command } = require('discord.js-commando');

class About extends Command {
	constructor(client) {
		super(client, {
      name: 'about',
      memberName: 'about',
			aliases: ['intro'],
			group: 'general',
			description: 'Returns a general description about me',
			details: 'This returns a description/introduction about me.',
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 5
			}
		});
	}

	async run(message) {
		await message.channel.send(this.client.responses.aboutMessages.random().replaceAll('{{prefix}}', `${process.env.PREFIX}`));
	}
};

module.exports = About;