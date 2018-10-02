const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Lion extends Social {

  constructor(...args) {
    super(...args, {
      name: "lion",
      description: "Returns an image of a lion",
      category: "2. Animals",
      usage: "lion",
      extended: "This returns an image of a lion.",
      cost: 5,
      cooldown: 5,
      aliases: ["mufasa"],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://animals.anidiots.guide/lion");

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

module.exports = Lion;