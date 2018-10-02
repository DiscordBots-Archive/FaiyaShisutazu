const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Fox extends Social {
  
  constructor(...args) {
    super(...args, {
      name: "fox",
      description: "Returns an image of a fox",
      category: "2. Animals",
      usage: "fox",
      extended: "This returns an image of a fox.",
      cost: 5,
      cooldown: 5,
      aliases: [],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://randomfox.ca/floof/");
    
    const embed = new MessageEmbed();
    embed
      .setDescription(body.link)
      .setColor(message.client.config.colors.random())
      .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.image)
      .setTimestamp();

    await message.channel.send(`Requested by **${message.author.tag}**`, embed);
  }
}

module.exports = Fox;