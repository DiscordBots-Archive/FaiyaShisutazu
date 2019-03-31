const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Lion extends Social {

  constructor(...args) {
    super(...args, {
      name: "lion",
      description: "Returns an image of a lion",
      category: "2. Animals",
      usage: "lion",
      extended: "This returns an image of a lion.",
      cost: 5,
      cooldown: 5,
      aliases: ["mufasa"],
      botPerms: ["EMBED_LINKS"],
      replyMessage: [
        "<:tsukihi:559908175906734097> I got you a lion **{{user}}-san**!",
        "<:karen:559907412425834497> A random lion for **{{user}}-san**!"
      ]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const body = await fetch("https://animals.anidiots.guide/lion")
        .then(res => res.json());

      const embed = new MessageEmbed()
        .setDescription(body.link)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(body.link)
        .setTimestamp();

      await replyMessage.edit(this.replyMessage.random().replaceAll("{{user}}", message.member.displayName),embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Lion;