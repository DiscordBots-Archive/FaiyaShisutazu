const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");
class Yomomma extends Social {

  constructor(...args) {
    super(...args, {
      name: "yomomma",
      description: "Disrespects someone's mother with this.",
      category: "4. Fun",
      usage: "yomomma [@mention|userid]",
      extended: "This returns an insult to the tagged person's mum.",
      cost: 15,
      cooldown: 10,
      aliases: ["yomum", "yomom", "yamum", "yamum", "yomama", "yamama"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      let target;
      if (message.mentions.users.first())
        target = await this.verifyUser(message, message.mentions.users.first().id);

      const { text } = await get("http://api.yomomma.info/");

      await message.channel.send(`_${JSON.parse(text).joke} @${target.tag}_`);
    } catch (error) {
      await message.channel.send(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Yomomma;