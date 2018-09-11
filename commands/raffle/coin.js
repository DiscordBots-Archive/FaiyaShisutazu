const Social = require(`${process.cwd()}/base/Social.js`);
const fsn = require("fs-nextra");

class Coin extends Social {

  constructor(client) {
    super(client, {
      name: "coin",
      description: "Flips a coin",
      category: "05. Random generators, raffles & votes",
      usage: "coin",
      extended: "This returns a flipped coin.",
      cost: 5,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }

    try {
      const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`)
      const heads = await fsn.readFile("./assets/images/heads.png");
      const tails = await fsn.readFile("./assets/images/tails.png");
      const number = Math.floor(Math.random() * 2) + 1;
      let result = heads;
      if (number !== 1) result = tails;
      const attachment = new Discord.MessageAttachment(result, "coin.png");

      loadingMessage.delete();
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {files: [attachment]})
    } catch (error) {
      loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}

module.exports = Coin;