const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Owl extends Social {

  constructor(...args) {
    super(...args, {
      name: "owl",
      description: "Returns an image of an owl",
      category: "2. Animals",
      usage: "owl",
      extended: "This returns an image of an owl.",
      cost: 5,
      cooldown: 5,
      aliases: [],
      botPerms: ["EMBED_LINKS"],
      replyMessage: [
        "<:tsukihi:559908175906734097> I got you a owl **{{user}}-san**!",
        "<:karen:559907412425834497> A random owl for **{{user}}-san**!"
      ]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const body = await fetch("http://pics.floofybot.moe/owl") // API Provided by Lewdcario
        .then(res => res.json());
    
      const embed = new MessageEmbed()
        .setDescription(body.image)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(body.image)
        .setTimestamp();

      await replyMessage.edit(this.replyMessage.random().replaceAll("{{user}}", message.member.displayName),embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Owl;