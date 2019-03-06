const Owner = require("../../structures/Owner.js");
const exec = require("child_process").exec;

class Exec extends Owner {

  constructor(...args) {
    super(...args, {
      name: "exec",
      description: "Executes a new process, very dangerous",
      category: "Owner",
      usage: "exec [expression]",
      extended: "This spawns a child process and execute the given command.",
      aliases: ["shell"],
      permLevel: "Bot Owner"
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    await replyMessage.delete();
    exec(`${args.join(" ")}`, (error, stdout) => {
      const response = (error || stdout);
      message.channel.send(`Ran: ${message.content}\n\`\`\`${response}\`\`\``, {split: true}).catch(console.error);
    });
  }
}

module.exports = Exec;
