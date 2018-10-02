const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Dog extends Social {

  constructor(...args) {
    super(...args, {
      name: "dog",
      description: "Returns an image of a dog",
      category: "2. Animals",
      usage: "dog",
      extended: "This returns an image of a dog.",
      cost: 5,
      cooldown: 5,
      aliases: ["doggo"],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { body } = await get(args[0] ? `https://dog.ceo/api/breed/${args[0]}/images/random` : "https://dog.ceo/api/breeds/image/random");

    const embed = new MessageEmbed();
    embed
      .setDescription(body.message)
      .setColor(message.client.config.colors.random())
      .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.message)
      .setTimestamp();

    await message.channel.send(`Requested by **${message.author.tag}**`, embed);
  }
}

module.exports = Dog;