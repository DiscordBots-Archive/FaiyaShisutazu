const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Shibe extends Social {

  constructor(...args) {
    super(...args, {
      name: "shibe",
      description: "Returns an image of a Shiba Inu",
      category: "2. Animals",
      usage: "shibe",
      extended: "This returns an image of a Shiba Inu.",
      cost: 5,
      cooldown: 5,
      aliases: ["shibe", "doge", "shiba"],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    const { body } = await get("http://shibe.online/api/shibes");

    const embed = new MessageEmbed();
    embed
      .setDescription(body[0])
      .setColor(message.client.config.colors.random())
      .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body[0])
      .setTimestamp();

    await replyMessage.edit(embed);
  }
}

module.exports = Shibe;