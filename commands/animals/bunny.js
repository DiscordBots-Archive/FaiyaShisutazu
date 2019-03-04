const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

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
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
    
    const embed = new MessageEmbed();
    embed
      .setDescription(body.media.gif)
      .setColor(message.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.media.gif)
      .setTimestamp();

    await replyMessage.edit(embed);
  }
}

module.exports = Bunny;