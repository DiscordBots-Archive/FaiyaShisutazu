const { version, Command } = require('discord.js-commando');
const Discord = require("discord.js");
const os = require("os");
const moment = require("moment");
require("moment-duration-format");

module.exports = class Stats extends Command {
	constructor(client) {
		super(client, {
      name: 'stats',
      memberName: 'stats',
			aliases: ['status'],
			group: 'general',
      description: 'Fetchs current bot\'s stats',
      examples: ['stats'],
			throttling: {
				usages: 2,
				duration: 5
      }
		});
	}

	async run(message) {
    const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

    const embed = new Discord.MessageEmbed()
      .setColor(this.client.colors.random())
      .setThumbnail(this.client.user.avatarURL)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setTimestamp()
      .addField("NodeJS version", `${process.version}`, true)
      .addField("Discord.js", `v${Discord.version}`, true)
      .addField("Discord.js-Commando", `v${version}`, true)
      .addField("Uptime", `${duration}`, true)
      .addField("Memory usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, true)
      .addField("Users/Servers", `${this.client.users.size.toLocaleString()}/${this.client.guilds.size.toLocaleString()}`, true)
      .addField("Bot's host system infomation", `${os.platform} ${os.release()}, ${os.cpus().length} cores @ ${os.cpus()[0].speed}MHz, ${Math.floor(os.totalmem / 1024 / 1024)}MB RAM`);

    await message.channel.send(embed);
	}
};