const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Yomomma extends Social {

  constructor(client) {
    super(client, {
      name: "yomomma",
      description: "Disrespects someone's mother with this.",
      category: "04. Fun",
      usage: "yomomma [@mention|userid]",
      extended: "This returns an insult to the tagged person's mum.",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const response = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      const { text } = await snek.get("http://api.yomomma.info/");

      response.edit(`🌺 **${message.author.tag}** ❯ ${message.content} | _${JSON.parse(text).joke}_`);
    } catch (error) {
      response.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}

module.exports = Yomomma;