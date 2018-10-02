const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Lizard extends Social {

  constructor(...args) {
    super(...args, {
      name: "lizard",
      description: "Returns an image of a lizard",
      category: "2. Animals",
      usage: "lizard",
      extended: "This returns an image of a lizard.",
      cost: 5,
      cooldown: 5,
      aliases: ["gecko"],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://nekos.life/api/v2/img/lizard");

    const embed = new MessageEmbed();
    embed
      .setDescription(body.url)
      .setColor(message.client.config.colors.random())
      .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.url)
      .setTimestamp();

    await message.channel.send(`Requested by **${message.author.tag}**`, embed);    
  }
}

module.exports = Lizard;