const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");
const fsn = require("fs-nextra");

class Coin extends Social {

  constructor(...args) {
    super(...args, {
      name: "coin",
      description: "Flips a coin",
      category: "4. Fun",
      usage: "coin",
      extended: "This returns a flipped coin.",
      cost: 5,
      cooldown: 10,
      aliases: ["flip"],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const heads = await fsn.readFile("./assets/images/heads.png");
      const tails = await fsn.readFile("./assets/images/tails.png");
      const number = Math.floor(Math.random() * 2) + 1;
      let result = heads;
      if (number !== 1) result = tails;
      const attachment = new MessageAttachment(result, "coin.png");

      await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
    } catch (error) {
      await message.channel.send(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Coin;