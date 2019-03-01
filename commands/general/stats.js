const Command = require("../../structures/Command.js");
const { MessageEmbed, version } = require("discord.js");
const moment = require("moment");
const os = require("os");
require("moment-duration-format");

class Stats extends Command {

  constructor(...args) {
    super(...args, {
      name: "stats",
      description: "Returns the current status of the bot",
      category: "1. General",
      usage: "stats",
      extended: "This returns the bot's status and statistics like ping, memory usage, etc.",
      cost: 2,
      cooldown: 5,
      aliases: ["ping"],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const duration = moment.duration(message.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    const response = await message.channel.send(`${message.content.includes("ping") ? "**Pong!**" : `**${message.client.user.tag}'s Status**`}`);
    
    const embed = new MessageEmbed();
    embed
      .setTitle(`API ping: ${Math.round(message.client.ws.ping)}ms | Client ping: ${response.createdTimestamp - message.createdTimestamp}ms`)
      .setColor(message.client.config.colors.random())
      .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
      .setTimestamp()
      .addField("NodeJS version", `${process.version}`, true)
      .addField("Discord.js", `v${version}`, true)
      .addField("Uptime", `${duration}`, true)
      .addField("Memory usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
      .addField("Users", `${message.client.users.size.toLocaleString()}`, true)
      .addField("Channels/Servers", `${message.client.channels.size.toLocaleString()}/${message.client.guilds.size.toLocaleString()}`, true)
      .addField("Bot's host system infomation", `${os.platform} ${os.release()}, ${os.cpus().length} cores @ ${os.cpus()[0].speed}MHz, ${Math.floor(os.totalmem / 1024 / 1024)}MB RAM`);

    await response.delete();
    await message.channel.send(`Requested by **${message.author.tag}**`, embed);
  }
}

module.exports = Stats;