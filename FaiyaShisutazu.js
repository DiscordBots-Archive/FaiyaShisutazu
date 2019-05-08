require('dotenv').config();
require('./util/Prototypes.js');

const path = require('path');
const FaiyaClient = require('./structures/FaiyaClient');
const { oneLine } = require('common-tags');

const client = new FaiyaClient({
  owner: process.env.OWNER_ID,
  commandPrefix: process.env.PREFIX,
  unknownCommandResponse: false,
  disableEveryone: true
});

client.on('error', client.logger.error)
  .on('warn', client.logger.warn)
  .on('ready', () => {
    let count = 0;
    setInterval(() => {
      if (count === 0) {
        client.user.setActivity(`with ${client.users.size} users`);
        count++;
      } else if (count === 1) {
        client.user.setActivity(`over ${client.guilds.size} servers`, { type: 'WATCHING' });
        count++;
      } else {
        client.user.setActivity(`@${client.user.username} help`, { type: 'LISTENING' });
        count = 0;
      }
    }, 5000);

    client.logger.info(`[Discord]: Ready! Logged in as ${client.user.tag} (${client.user.id})`);
  })
  .on('disconnect', () => client.logger.warn('[Discord]: Disconnected!'))
  .on('reconnect', () => client.logger.warn('[Discord]: Reconnecting...'))
  .on('message', async (message) => {
    if (message.channel.type === 'dm') return;
    if (message.author.bot) return; // eslint-disable-line no-useless-return
  })
  .on('commandRun', (command, promise, message, args) =>
    client.logger.info(oneLine`[Discord]: ${message.author.tag} (${message.author.id}) 
      > ${message.guild ? `${message.guild.name} (${message.guild.id})` : 'DM'} 
      > ${command.groupID}:${command.memberName} ${Object.values(args).length ? `
      > ${Object.values(args)}` : ''}`)
  );

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['general', 'General'],
    ['canvas', 'Canvas'],
    ['music', 'Music']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    help: false,
    ping: false,
    prefix: false,
    unknownCommand: false
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.DISCORD_KEY);
