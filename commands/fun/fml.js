const Social = require(`${process.cwd()}/base/Social.js`);
const request = require("snekfetch");
const HTMLParser = require("fast-html-parser");
const { MessageEmbed } = require("discord.js");

class FML extends Social {

  constructor(client) {
    super(client, {
      name: "fml",
      description: "Returns a FML story",
      category: "04. Fun",
      usage: "fml",
      extended: "This returns a random story on FML.",
      cost: 10,
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
    const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    
    try {
      const { text } = await request.get("http://www.fmylife.com/random");
      const root = HTMLParser.parse(text);
      const article = root.querySelector(".block a");
      const downdoot = root.querySelector(".vote-down");
      const updoot = root.querySelector(".vote-up");
      const embed = new MessageEmbed()
        .setTitle("A FML story")
        .setColor(this.client.config.colors.random())
        .setThumbnail("http://i.imgur.com/5cMj0fw.png")
        .setFooter(`Requested by: ${message.member.displayName}`)
        .setDescription(`_${article.childNodes[0].text}\n\n_`)
        .addField("😭", updoot.childNodes[0].text, true)
        .addField("🤨", downdoot.childNodes[0].text, true);
      if (article.childNodes[0].text.length < 5) {
        return message.response(undefined, "I encountered an error, please try again!");
      }

      loadingMessage.delete();
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {embed});
    } catch (error) {
      if (error.message === "Cannot send an empty message") {
        loadingMessage.delete();
        message.response(undefined, `${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      } //else {
      //   loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      // }
      this.client.logger.error(error);
    }
  }
}

module.exports = FML;