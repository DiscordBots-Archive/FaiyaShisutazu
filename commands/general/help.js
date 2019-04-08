// Modified version of Commando's default help command

const { Command, disambiguation } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { stripIndents, oneLine } = require('common-tags');

module.exports = class Help extends Command {
  constructor (client) {
    super(client, {
      name: 'help',
      memberName: 'help',
      aliases: ['commands'],
      group: 'general',
      description: 'Displays a list of available commands, or detailed information for a specified command.',
      examples: ['help', 'help prefix'],
      guarded: true,
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'command',
          prompt: 'Which command would you like to view the help for?',
          type: 'string',
          default: ''
        }
      ]
    });
  }

  async run (message, args) { // eslint-disable-line complexity
    const groups = this.client.registry.groups;
    const commands = this.client.registry.findCommands(args.command, false, message);
    const showAll = args.command && args.command.toLowerCase() === 'all';
    const prefix = message.guild ? message.guild.commandPrefix : this.client.commandPrefix;

    if (args.command && !showAll) {
      if (commands.length === 1) {
        const embed = new MessageEmbed()
          .setColor(this.client.colors.random())
          .setTitle(commands[0].name)
          .setDescription(oneLine`
            ${commands[0].description}
            ${commands[0].guildOnly ? ' (Usable only in servers)' : ''}
            ${commands[0].nsfw ? ' (NSFW)' : ''}
          `)
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 32 }))
          .setTimestamp()
          .addField('Group', oneLine`
            ${commands[0].group.name}
            (\`${commands[0].groupID}:${commands[0].memberName}\`)
          `, true);

        if (commands[0].aliases.length > 0) embed.addField('Aliases', commands[0].aliases.join(', '), true);
        if (commands[0].details) embed.addField('Details', commands[0].details);
        if (commands[0].examples) embed.addField('Examples', commands[0].examples.join('\n'));

        const messages = [];
        try {
          messages.push(await message.direct(embed));
          if (message.channel.type !== 'dm') messages.push(await message.reply('Sent you a DM with information.'));
        } catch (err) {
          messages.push(await message.reply('Unable to send you the help DM. You probably have DMs disabled.'));
        }
        return messages;
      } else if (commands.length > 15) {
        await message.channel.send('Multiple commands found. Please be more specific.');
      } else if (commands.length > 1) {
        await message.channel.send(disambiguation(commands, 'commands'));
      } else {
        await message.channel.send(
          `I was unable to identify this command. Use ${message.usage(
            null, message.channel.type === 'dm' ? null : undefined, message.channel.type === 'dm' ? null : undefined
          )} to view the list of all commands.`
        );
      }
    } else {
      const messages = [];
      try {
        messages.push(await message.direct(stripIndents`
          Use ${this.usage('<command>', null, null)} to view detailed information about a specific command.
          Use ${this.usage('all', null, null)} to view a list of *all* commands, not just the available ones.

          ${oneLine`
            To run a command in ${message.guild ? message.guild.name : 'any server'},
            use \`${prefix}command\`
            or ${this.client.user} \`command\`.
            For example, \`${message.guild ? message.guild.commandPrefix : this.client.commandPrefix}prefix\`
            or ${this.client.user} \`prefix\`.
          `}
          
          To run a command in this DM, simply use ${Command.usage('command', null, null)} with no prefix.
          
          __**${showAll ? 'All commands' : `Available commands for ${message.guild || 'this DM'}`}**__
          
          ${groups.filter(grp => grp.commands.some(cmd => !cmd.hidden && (showAll || cmd.isUsable(message)))).map(grp => stripIndents`
            **${grp.name}** ${grp.commands.filter(cmd => !cmd.hidden && (showAll || cmd.isUsable(message))).map(cmd => `\`${cmd.name}\`
             ${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}`).join('\n')}`).join('\n\n')}
          `, { split: true }));

        if (message.channel.type !== 'dm') { messages.push(await message.channel.send('I sent you a DM with information about all my commands!')); }
      } catch (err) {
        messages.push(await message.channel.send('I was unable to send you the help DM. You probably have DMs disabled.'));
      }
      return messages;
    }
  }
};
