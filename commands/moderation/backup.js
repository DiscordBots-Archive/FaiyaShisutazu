const Command = require(`${process.cwd()}/base/Command.js`);
const config = require(`${process.cwd()}/config.js`);
const git = require("simple-git")(`${process.cwd()}`);
const moment = require("moment");

class Backup extends Command {

  constructor(client) {
    super(client, {
      name: "backup",
      description: "Returns a backup of the bot's leaderboard data.",
      category: "8. Utilities",
      usage: "backup",
      extended: "Returns a backup of the server's leaderboard data in a zip file.",
      cost: 0,
      cooldown: 0,
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: "Bot Owner"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const remote = `https://${config.githubUser}:${config.githubPass}@${config.githubRepo}`;
    const timestamp = `**[${moment().format("YYYY-MM-DD HH:mm:ss")}]**`;
    git.add(['data'], (err, result) => {
      if (err)
        console.log(err);
      else
        console.log(result);
    });
    git.commit(`Push ${timestamp} data`, {'--author': `${config.githubCommitAuthor}`}, (err, result) => {
      if (err)
        console.log(err);
      else
        console.log(result);
    });
    git.push(remote, 'master', (err, result) => {
      if (err)
        console.log(err);
      else
        console.log(result);
    });
    message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content} | ${timestamp}`);
  }
}

module.exports = Backup;