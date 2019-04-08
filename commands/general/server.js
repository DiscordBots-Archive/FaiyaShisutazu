const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const moment = require('moment');

const verificationLevels = {
  0: stripIndents`None
    Unrestricted`,
  1: stripIndents`Low
    Must have a verified email on their Discord account`,
  2: stripIndents`Medium
    Must also be registered on Discord for longer than 5 minutes`,
  3: stripIndents`(╯°□°）╯︵ ┻━┻
    Must also be a member of this server for longer than 10 minutes`,
  4: stripIndents`┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻
    Must have a verified phone on their Discord account`
};

module.exports = class ServerInfo extends Command {
  constructor (client) {
    super(client, {
      name: 'server',
      memberName: 'server',
      aliases: ['server-info'],
      group: 'general',
      description: 'Fetchs info about this server',
      examples: ['server'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5
      }
    });
  }

  async run (message) {
    const embed = new MessageEmbed()
      .setColor(this.client.colors.random())
      .setThumbnail(message.guild.iconURL)
      .setDescription(`Information on **${message.guild.name}** (ID: ${message.guild.id})`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 32 }))
      .setTimestamp()
      .addField('Channels', stripIndents`
        • ${message.guild.channels.filter(ch => ch.type === 'text').size} Text, ${message.guild.channels.filter(ch => ch.type === 'voice').size} Voice
        • Default: ${message.guild.defaultChannel ? message.guild.defaultChannel : 'None'}
        • AFK: ${message.guild.afkChannelID ? `<#${message.guild.afkChannelID}> after ${message.guild.afkTimeout / 60} minutes` : 'None.'}
      `, true)
      .addField('Members', stripIndents`
        • ${message.guild.memberCount} members
        • Owner: ${message.guild.owner.user.tag} 
        (ID: ${message.guild.ownerID})
      `, true)
      .addField('Others', stripIndents`
        • Region: ${message.guild.region}
        • Created at: ${moment.utc(message.guild.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss ZZ')}
        • Verification Level: ${verificationLevels[message.guild.verificationLevel]}
      `);

    await message.channel.send(embed);
  }
};
