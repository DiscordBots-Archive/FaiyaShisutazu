const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Lizard extends Social {

  constructor(...args) {
    super(...args, {
      name: "lizard",
      description: "Returns an image of a lizard",
      category: "2. Animals",
      usage: "lizard",
      extended: "This returns an image of a lizard.",
      cost: 5,
      cooldown: 5,
      aliases: ["gecko"],
      botPerms: ["EMBED_LINKS"],
      replyMessage: [
        "<:tsukihi:559908175906734097> I got you a lizard **{{user}}-san**!",
        "<:karen:559907412425834497> A random lizard for **{{user}}-san**!"
      ]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const body = await fetch("https://nekos.life/api/v2/img/lizard")
        .then(res => res.json());

      const embed = new MessageEmbed()
        .setDescription(body.url)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(body.url)
        .setTimestamp();

      await replyMessage.edit(this.replyMessage.random().replaceAll("{{user}}", message.member.displayName),embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Lizard;