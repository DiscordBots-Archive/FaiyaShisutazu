const Owner = require(`${process.cwd()}/base/Owner.js`);
const exec = require("child_process").exec;

class Exec extends Owner {

  constructor(client) {
    super(client, {
      name: "exec",
      description: "Executes a new process, very dangerous",
      category: "11. Moderation",
      usage: "exec [expression]",
      extended: "This spawns a child process and execute the given command.",
      cost: 0,
      cooldown: 0,
      hidden: false,
      guildOnly: true,
      aliases: ["shell"],
      permLevel: "Bot Owner"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    exec(`${args.join(" ")}`, (error, stdout) => {
      const response = (error || stdout);
      message.channel.send(`Ran: ${message.content}\n\`\`\`${response}\`\`\``, {split: true}).catch(console.error);
    });
  }
}

module.exports = Exec;
