const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

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
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://animals.anidiots.guide/panda");
    
    const embed = new MessageEmbed();
    embed
      .setDescription(body.link)
      .setColor(message.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.link)
      .setTimestamp();

    await replyMessage.edit(embed);
  }
}

module.exports = Panda;