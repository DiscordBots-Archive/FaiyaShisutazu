const Social = require("../../structures/Social.js");
const request = require("snekfetch");
const HTMLParser = require("fast-html-parser");
const { MessageEmbed } = require("discord.js");

class FML extends Social {

  constructor(...args) {
    super(...args, {
      name: "fml",
      description: "Returns a FML story",
      category: "4. Fun",
      usage: "fml",
      extended: "This returns a random story on FML.",
      cost: 10,
      cooldown: 10,
      aliases: [],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars 
    try {
      const { text } = await request.get("http://www.fmylife.com/random");
      const root = HTMLParser.parse(text);
      const article = root.querySelector(".block a");
      const downdoot = root.querySelector(".vote-down");
      const updoot = root.querySelector(".vote-up");
      if (article.childNodes[0].text.length < 5) {
        return message.reply(`There is an error on my side, please try again ${message.member.displayName}!`);
      }

      const embed = new MessageEmbed()
        .setTitle("A FML story | Powered by FML")
        .setDescription(`_${article.childNodes[0].text}\n\n_`)
        .setColor(message.client.config.colors.random())
        .setThumbnail("http://i.imgur.com/5cMj0fw.png")
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .addField("😭", updoot.childNodes[0].text, true)
        .addField("🤨", downdoot.childNodes[0].text, true)
        .setTimestamp();

      await replyMessage.edit(embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = FML;