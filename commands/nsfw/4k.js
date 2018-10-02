const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class FourK extends Social {

  constructor(...args) {
    super(...args, {
      name: "fourk",
      description: "Returns 4K porn",
      category: "6. NSFW",
      usage: "fourk",
      extended: "This returns some sweet 4K porn.",
      cost: 15,
      cooldown: 10,
      aliases: ["4k"],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return message.response("🔞", "You need to be in a NSFW channel to use this command!");

    try {
      const { body } = await get("https://nekobot.xyz/api/image?type=4k");
      const embed = new MessageEmbed();
      embed
        .setTitle(`🌺 **${message.author.tag}** ❯ ${message.content}`)
        .setDescription(body.message)
        .setColor(message.client.config.colors.random())
        .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(body.message)
        .setTimestamp();

      await message.channel.send(`Requested by **${message.author.tag}** ❯ \`${message.content}\``, embed);
    } catch (error) {
      await message.channel.send(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = FourK;