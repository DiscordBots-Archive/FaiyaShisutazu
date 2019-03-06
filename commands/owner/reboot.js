const Owner = require("../../structures/Owner.js");
const {promisify} = require("util");
const write = promisify(require("fs").writeFile);

class Reboot extends Owner {

  constructor(...args) {
    super(...args, {
      name: "reboot",
      description: "Restarts the bot",
      category: "Owner",
      usage: "reboot",
      extended: "This restarts the bot if running under PM2.",
      aliases: ["restart"],
      permLevel: "Bot Admin"
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    await replyMessage.delete();
    try {
      const msg = await message.channel.send(`${message.client.responses.rebootMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      await write(`${process.cwd()}/assets/json/reboot.json`, `{ "id": "${msg.id}", "channel": "${message.channel.id}", "user": "${message.author.id}"}`).catch(console.error);
      message.client.commands.forEach(async cmd => {
        await message.client.unloadCommand(cmd);
      });
      process.exit(1);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reboot;