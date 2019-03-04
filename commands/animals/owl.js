const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

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
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    const owl = await get("http://pics.floofybot.moe/owl").then(r => r.body.image); // API Provided by Lewdcario

    const embed = new MessageEmbed();
    embed
      .setDescription(owl)
      .setColor(message.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(owl)
      .setTimestamp();

    await replyMessage.edit(embed);
  }
}

module.exports = Owl;