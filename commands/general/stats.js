const Command = require(`${process.cwd()}/base/Command.js`);
const Discord = require("discord.js");
const moment = require("moment");
const os = require("os");
require("moment-duration-format");

class Stats extends Command {

  constructor(client) {
    super(client, {
      name: "stats",
      description: "Returns the current status of the bot",
      category: "01. General",
      usage: "stats",
      extended: "This returns the bot's status and statistics like ping, memory usage, etc.",
      cost: 2,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: ["ping"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

    const response = await message.channel.send(`${message.content.includes("ping") ? "**Pong!**" : `**${this.client.user.tag}'s Status**`}`);
    const embed = new Discord.MessageEmbed();
    embed
      .setTitle(`Estimated ping: ${response.createdTimestamp - message.createdTimestamp}ms`)
      .setColor(this.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setTimestamp()
      .addField("NodeJS version", `${process.version}`, true)
      .addField("Discord.js", `v${Discord.version}`, true)
      .addField("Uptime", `${duration}`, true)
      .addField("Memory usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
      .addField("Users", `${this.client.users.size.toLocaleString()}`, true)
      .addField("Channels/Servers", `${this.client.channels.size.toLocaleString()}/${this.client.guilds.size.toLocaleString()}`, true)
      .addField("Bot's host system infomation", `${os.platform} ${os.release()}, ${os.cpus().length} cores @ ${os.cpus()[0].speed}MHz, ${Math.floor(os.totalmem / 1024 / 1024)}MB RAM`);

    response.edit(`🌺 **${message.author.tag}** ❯ ${message.content}`, {embed});
  }
}

module.exports = Stats;
