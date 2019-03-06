const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Kitsune extends Social {

  constructor(...args) {
    super(...args, {
      name: "kitsune",
      description: "Returns an entry from Kitsune",
      category: "6. NSFW",
      usage: "kitsune [search term]",
      extended: "This returns an entry from Kitsune.",
      cost: 15,
      cooldown: 10,
      aliases: [],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return replyMessage.edit("🔞 You need to be in a NSFW channel to use this command!");

    try {
      const { body } = await get("https://nekobot.xyz/api/image?type=lewdkitsune");
      const embed = new MessageEmbed();
      embed
        .setDescription(body.message)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(body.message)
        .setTimestamp();

      await replyMessage.edit(embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Kitsune;