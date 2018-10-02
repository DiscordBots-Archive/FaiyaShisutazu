const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class RedPanda extends Social {

  constructor(...args) {
    super(...args, {
      name: "redpanda",
      description: "Returns an image of a red panda",
      category: "2. Animals",
      usage: "redpanda",
      extended: "This returns an image of a red panda.",
      cost: 5,
      cooldown: 5,
      aliases: [],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://animals.anidiots.guide/red_panda");

    const embed = new MessageEmbed();
    embed
      .setDescription(body.link)
      .setColor(message.client.config.colors.random())
      .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.link)
      .setTimestamp();

    await message.channel.send(`Requested by **${message.author.tag}**`, embed);
  }
}

module.exports = RedPanda;