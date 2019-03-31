const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Penguin extends Social {

  constructor(...args) {
    super(...args, {
      name: "penguin",
      description: "Returns an image of a penguin",
      category: "2. Animals",
      usage: "penguin",
      extended: "This returns an image of a penguin.",
      cost: 5,
      cooldown: 5,
      aliases: [],
      botPerms: ["EMBED_LINKS"],
      replyMessage: [
        "<:tsukihi:559908175906734097> I got you a penguin **{{user}}-san**!",
        "<:karen:559907412425834497> A random penguin for **{{user}}-san**!"
      ]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const body = await fetch("https://animals.anidiots.guide/penguin")
        .then(res => res.json());

      const embed = new MessageEmbed()
        .setDescription(body.link)
        .setColor(message.client.config.colors.random())
        .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(body.link)
        .setTimestamp();

      await replyMessage.edit(this.replyMessage.random().replaceAll("{{user}}", message.member.displayName),embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Penguin;