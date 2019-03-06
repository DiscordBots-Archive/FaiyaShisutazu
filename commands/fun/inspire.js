const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const snek = require("snekfetch");

class Inspire extends Social {

  constructor(...args) {
    super(...args, {
      name: "inspire",
      description: "Returns an inspirational quote",
      category: "4. Fun",
      usage: "inspire",
      extended: "This returns an inspirational quote from an AI.",
      cost: 15,
      cooldown: 10,
      aliases: [],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {  
      const xmas = message.flags[0] === "xmas" ? "&season=xmas" : "";
      const { text } = await snek.get(`http://inspirobot.me/api?generate=true${xmas}`);

      const embed = new MessageEmbed()
        .setDescription(text)
        .setColor(this.client.config.colors.random())
        .setImage(text)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setTimestamp();

      await replyMessage.edit(embed);
    } catch (error) {
      await replyMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.console.error(error);
    }
  }
}

module.exports = Inspire;