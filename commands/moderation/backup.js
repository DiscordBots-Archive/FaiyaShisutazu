const Command = require(`${process.cwd()}/base/Command.js`);
const fs = require('fs');
const archiver = require('archiver');
const moment = require("moment");

class Backup extends Command {

  constructor(client) {
    super(client, {
      name: "backup",
      description: "Returns a backup of the bot's leaderboard data.",
      category: "8. Utilities",
      usage: "backup",
      extended: "Returns a backup of the server's leaderboard data in a compressed zip file.",
      cost: 0,
      cooldown: 0,
      hidden: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Moderator"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const timestamp = `**[${moment().format("YYYY-MM-DD HH:mm:ss")}]**`;
    const output = fs.createWriteStream(`${process.cwd()}/Backup.zip`);
    const archive = archiver('zip');
    archive.pipe(output);
    archive.directory(`${process.cwd()}/data/`, false);
    archive.finalize();
    message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content} | Backup ${timestamp}`, {
      files: [
        `${process.cwd()}/Backup.zip`
      ]
    })
  }
}

module.exports = Backup;