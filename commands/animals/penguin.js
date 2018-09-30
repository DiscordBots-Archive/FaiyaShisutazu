const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Penguin extends Social {

  constructor(...args) {
    super(...args, {
      name: "penguin",
      description: "Returns an image of a penguin",
      category: "2. Animals",
      usage: "penguin",
      extended: "This returns an image of a penguin.",
      cost: 5,
      cooldown: 5,
      aliases: [],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const response = await message.channel.send(`${message.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    const { body } = await get("https://animals.anidiots.guide/penguin");

    const embed = new MessageEmbed();
    embed
      .setDescription(body.link)
      .setColor(message.client.config.colors.random())
      .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.link)
      .setTimestamp();

    await response.edit(`Requested by **${message.author.tag}** ❯ \`${message.content}\``, embed);
  }
}

module.exports = Penguin;