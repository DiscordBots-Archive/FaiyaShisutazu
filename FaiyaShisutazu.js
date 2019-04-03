const dotenv = require('dotenv').config();
const path = require('path');
const FaiyaClient = require('./structures/FaiyaClient');

const client = new FaiyaClient({
	owner: process.env.OWNER_ID,
	commandPrefix: process.env.PREFIX,
	unknownCommandResponse: false,
	disableEveryone: true
});

client.on('error', client.logger.error)
	.on('warn', client.logger.warn)
	.on('ready', () => client.logger.info(`[DISCORD]: Ready! Logged in as ${client.user.tag} (${client.user.id})`))
	.on('disconnect', () => client.logger.warn('[Discord]: Disconnected!'))
	.on('reconnect', () => client.logger.warn('[Discord]: Reconnecting...'))
	.on('message', async (message) => {
		if (message.channel.type === 'dm') return;
		if (message.author.bot) return;

    await message.channel.send('Check!');
	});

  client.registry
  .registerDefaultTypes()
  .registerGroups([])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.DISCORD_KEY);