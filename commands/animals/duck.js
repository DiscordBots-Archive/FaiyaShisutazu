const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Duck extends Social {

  constructor(...args) {
    super(...args, {
      name: "duck",
      description: "Returns an image of a duck",
      category: "2. Animals",
      usage: "duck",
      extended: "This returns an image of a duck.",
      cost: 5,
      cooldown: 5,
      aliases: [],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, client, level, replyMessage) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://random-d.uk/api/v1/random?type=gif");

    const embed = new MessageEmbed();
    embed
      .setDescription(body.url)
      .setColor(message.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.url)
      .setTimestamp();

    await replyMessage.edit(embed);
  }
}

module.exports = Duck;