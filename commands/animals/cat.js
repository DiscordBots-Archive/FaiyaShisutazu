const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Cat extends Social {

  constructor(...args) {
    super(...args, {
      name: "cat",
      description: "Returns an image of a cat",
      category: "2. Animals",
      usage: "cat",
      extended: "This returns an image of a cat.",
      cost: 5,
      cooldown: 5,
      aliases: ["meow", "nyan"],
      botPerms: ["EMBED_LINKS"],
      replyMessage: [
        "<:tsukihi:559908175906734097> I got you a cat **{{user}}-san**!",
        "<:karen:559907412425834497> A random cat for **{{user}}-san**!",
        "<:tsukihi:559908175906734097> *nyan nyan*"
      ]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const body = await fetch("https://nekos.life/api/v2/img/meow")
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

module.exports = Cat;