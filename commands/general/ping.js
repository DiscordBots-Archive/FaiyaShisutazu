// Modified version of Commando's default ping command

const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class Ping extends Command {
	constructor(client) {
		super(client, {
      name: 'ping',
      memberName: 'ping',
      aliases: ['latency'],
			group: 'general',
      description: 'Checks the bot\'s ping to the Discord server.',
      examples: ['ping'],
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		const ping = await message.reply('Pinging...');
		return ping.edit(oneLine`
      🏓 Pong! The message round-trip took
      ${(ping.editedTimestamp || ping.createdTimestamp) 
        - (message.editedTimestamp || message.createdTimestamp)}ms.
			${this.client.ws.ping ? `The heartbeat ping is ${Math.round(this.client.ws.ping)}ms.` : ''}
		`);
	}
};