const { Command } = require('discord.js-commando');
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require('common-tags');
const moment = require('moment');

class UserInfo extends Command {
	constructor(client) {
		super(client, {
      name: 'user',
      memberName: 'user',
			aliases: ['user-info'],
			group: 'general',
			description: 'Returns info about a user',
			details: 'Returns detailed information about a user.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 5
      },
      args: [
				{
					key: 'member',
					prompt: 'Who would you want to have information on?\n',
					type: 'member',
					default: ''
				}
			]
		});
	}

	async run(message, args) {
    const member = args.member || message.member;
		const { user } = member;
    
    const embed = new MessageEmbed()
      .setColor(this.client.colors.random())
      .setThumbnail(message.guild.iconURL)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setTimestamp()
      .addField('Member\'s details', stripIndents`
        ${member.nickname !== null ? ` • Nickname: ${member.nickname}` : '• No nickname'}
        • Highest role: ${member.roles.highest}
        • Joined at: ${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss ZZ')}
      `)
      .addField('User\'s detail', stripIndents`
        • Created at: ${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss ZZ')}${user.bot ? '\n• Is a bot account' : ''}
        • Status: ${user.presence.status}
        • Game: ${user.presence.game ? user.presence.game.name : 'None'}
      `);
    
    await message.channel.send(embed);
	}
};

module.exports = UserInfo;