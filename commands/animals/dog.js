const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Dog extends Social {

  constructor(...args) {
    super(...args, {
      name: "dog",
      description: "Returns an image of a dog",
      category: "2. Animals",
      usage: "dog",
      extended: "This returns an image of a dog.",
      cost: 5,
      cooldown: 5,
      aliases: ["doggo"],
      botPerms: ["EMBED_LINKS"],
      replyMessage: [
        "<:tsukihi:559908175906734097> I got you a dog **{{user}}-san**!",
        "<:karen:559907412425834497> A random dog for **{{user}}-san**!",
        "<:tsukihi:559908175906734097> *wan wan*",
      ]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const body = await fetch("https://dog.ceo/api/breeds/image/random")
        .then(res => res.json());

      const embed = new MessageEmbed()
        .setDescription(body.message)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(body.message)
        .setTimestamp();

      await replyMessage.edit(this.replyMessage.random().replaceAll("{{user}}", message.member.displayName),embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Dog;