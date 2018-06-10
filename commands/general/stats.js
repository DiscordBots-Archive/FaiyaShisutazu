const Command = require(`${process.cwd()}/base/Command.js`);
const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

class Stats extends Command {
  constructor(client) {
    super(client, {
      name: "stats",
      description: "Gives some useful bot statistics.",
      usage: "stats",
      aliases: ["invite"],
      category: "1. General"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

    const msg = await message.channel.send(`**Current bot's status**`);
    await message.channel.send({
      "embed": {
        "title": `Estimated ping: ${msg.createdTimestamp - message.createdTimestamp}ms`,
        "color": 0x8000ff,
        "footer": {
          "text": "Hosted by @Jjeuweiii senpai"
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
        }]
      }
    });
  }
}

module.exports = Stats;
