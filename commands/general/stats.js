const Command = require(`${process.cwd()}/base/Command.js`);
const { version } = require("discord.js");
const moment = require("moment");
const os = require("os");
require("moment-duration-format");

class Stats extends Command {

  constructor(client) {
    super(client, {
      name: "stats",
      description: "Trả về các ping của bot kèm theo một số thông số hữu ích.",
      category: "1. General",
      usage: "stats",
      extended: "Trả về ping, thông tin cơ bản của bot cũng như server mà bot đang được host.",
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

    const msg = await message.channel.send(`${message.content.includes("ping") ? "**Pong!**" : `**${this.client.user.tag}'s Status**`}`);
    await message.channel.send({
      "embed": {
        "title": `Estimated ping: ${msg.createdTimestamp - message.createdTimestamp}ms`,
        "color": 0x8000ff,
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | REmibot by @Jjeuweiii`
        },
        "fields": [{
          "name": "NodeJS version",
          "value": `${process.version}`,
          "inline": true
        },
        {
          "name": "Discord.js",
          "value": `v${version}`,
          "inline": true
        },
        {
          "name": "Uptime",
          "value": `${duration}`,
          "inline": true
        },
        {
          "name": "Memory usage",
          "value": `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
          "inline": true
        },
        {
          "name": "Users",
          "value": `${this.client.users.size.toLocaleString()}`,
          "inline": true
        },
        {
          "name": "Channels/Servers",
          "value": `${this.client.channels.size.toLocaleString()}/${this.client.guilds.size.toLocaleString()}`,
          "inline": true
        },
        {
          "name": "Bot's host system infomation",
          "value": `${os.platform} ${os.release()}, ${os.cpus().length} cores @ ${os.cpus()[0].speed}MHz, ${os.totalmem / 1024 / 1024}MB RAM`
        }]
      }
    });
  }
}

module.exports = Stats;
