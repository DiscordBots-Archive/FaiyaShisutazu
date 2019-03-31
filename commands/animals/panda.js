const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Panda extends Social {

  constructor(...args) {
    super(...args, {
      name: "panda",
      description: "Returns an image of a panda",
      category: "2. Animals",
      usage: "panda",
      extended: "This returns an image of a panda.",
      cost: 5,
      cooldown: 5,
      aliases: [],
      botPerms: ["EMBED_LINKS"],
      replyMessage: [
        "<:tsukihi:559908175906734097> I got you a panda **{{user}}-san**!",
        "<:karen:559907412425834497> A random panda for **{{user}}-san**!"
      ]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const body = await fetch("https://animals.anidiots.guide/panda")
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

module.exports = Panda;