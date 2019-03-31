const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Bunny extends Social {

  constructor(...args) {
    super(...args, {
      name: "bunny",
      description: "Returns an image of a bunny",
      category: "2. Animals",
      usage: "bunny",
      extended: "This returns an image of a bunny.",
      cost: 5,
      cooldown: 5,
      aliases: ["bunbun"],
      botPerms: ["EMBED_LINKS"],
      replyMessage: [
        "<:karen:559907412425834497> A bunny for you **{{user}}-san**!",
        "<:tsukihi:559908175906734097> A random bunny for **{{user}}-san**!"
      ]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const body = await fetch("https://api.bunnies.io/v2/loop/random/?media=gif,png")
        .then(res => res.json());

      const embed = new MessageEmbed()
        .setDescription(body.media.gif)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(body.media.gif)
        .setTimestamp();

      await replyMessage.edit(this.replyMessage.random().replaceAll("{{user}}", message.member.displayName),embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Bunny;