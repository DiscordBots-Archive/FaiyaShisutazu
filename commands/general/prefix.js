// Modified version of Commando's default prefix command

const { Command } = require('discord.js-commando');
const { stripIndents, oneLine } = require('common-tags')

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
      name: 'prefix',
      memberName: 'prefix',
      aliases: [],
			group: 'general',
			description: 'Shows or sets the command prefix.',
			format: '[prefix/"default"/"none"]',
			details: oneLine`
				If no prefix is provided, the current prefix will be shown.
				If the prefix is "default", the prefix will be reset to the bot's default prefix.
				If the prefix is "none", the prefix will be removed entirely, only allowing mentions to run commands.
				Only administrators may change the prefix.
			`,
			examples: ['prefix', 'prefix -', 'prefix omg!', 'prefix default', 'prefix none'],
      guarded: true,
			args: [
				{
					key: 'prefix',
					prompt: 'what would you like to set the bot\'s prefix to?',
					type: 'string',
					max: 15,
					default: ''
				}
			]
		});
	}

	async run(message, args) {
		// Just output the prefix
		if (!args.prefix) {
			const prefix = message.guild ? message.guild.commandPrefix : this.client.commandPrefix;
			return message.reply(stripIndents`
				${prefix ? `the command prefix is \`\`${prefix}\`\`.` : 'there is no command prefix.'}
        To run commands, see \`${prefix}help\`.
      `);
		}

		// Check the user's permission before changing anything
		if (message.guild) {
			if (!message.member.hasPermission('ADMINISTRATOR') && !this.client.isOwner(message.author)) {
				return message.reply('only administrators may change the command prefix.');
			}
		} else if (!this.client.isOwner(message.author)) {
			return message.reply('only the bot owner(s) may change the global command prefix.');
		}

		// Save the prefix
		const lowercase = args.prefix.toLowerCase();
		const prefix = lowercase === 'none' ? '' : args.prefix;
		let response;
		if (lowercase === 'default') {
      if (message.guild) message.guild.commandPrefix = null;
      else this.client.commandPrefix = null;
			const current = this.client.commandPrefix ? `\`\`${this.client.commandPrefix}\`\`` : 'no prefix';
			response = `I restored the command prefix to the default (currently ${current}).`;
		} else {
      if (message.guild) message.guild.commandPrefix = prefix; 
      else this.client.commandPrefix = prefix;
			response = prefix ? `I set the command prefix to \`\`${args.prefix}\`\`.` : 'I removed the command prefix entirely!';
		}

		await message.reply(`${response} To run commands, ${prefix ? `see \`${prefix}help\`.` : 'mention me with your command!'}`);
		return null;
	}
};