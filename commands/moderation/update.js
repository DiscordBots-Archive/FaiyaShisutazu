const Owner = require(`${process.cwd()}/base/Owner.js`);
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const path = require("path");

class Update extends Owner {

  constructor(client) {
    super(client, {
      name: "update",
      description: "Updates the bot source code",
      category: "11. Moderation",
      usage: "update",
      extended: "This updates the bot after pulling the latest changes on the bot's repo.",
      cost: 0,
      cooldown: 0,
      hidden: false,
      guildOnly: true,
      aliases: ["git", "pull"],
      permLevel: "Bot Owner"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { stdout, stderr, err } = await exec(`git pull ${require(`${process.cwd()}/package.json`).repository.url.split("+")[1]}`, { cwd: path.join(__dirname, "../../") }).catch(err => ({ err }));
    if (err) return console.error(err);
    const out = [];
    if (stdout) out.push(stdout);
    if (stderr) out.push(stderr);
    await message.channel.send(out.join("---\n"), { code: true });
    if (!stdout.toString().includes("Already up-to-date.")) {
      this.client.commands.get("reboot").run(message, args, level);
    }
  }
}

module.exports = Update;