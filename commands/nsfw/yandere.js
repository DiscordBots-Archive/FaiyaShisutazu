const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Yandere extends Social {

  constructor(...args) {
    super(...args, {
      name: "yandere",
      description: "Returns an entry from Yandere",
      category: "6. NSFW",
      usage: "yandere [search term]",
      extended: "This returns an entry from Yandere.",
      cost: 15,
      cooldown: 10,
      aliases: [],
      botPerms: ["EMBED_LINKS"]
    });
  }

  getRating(rating) {
    if (rating === "s") return "Safe";
    if (rating === "q") return "Questionable";
    if (rating === "e") return "Explicit";
    if (rating === "u") return "Unrated";
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return message.response("🔞", "You need to be in a NSFW channel to use this command!");

    try {
      const tags = args.join("_");
      const { body } = await get(`http://yande.re/post.json?limit=100&tags=${tags}`);
      const result = body.random();
      if (!result) return message.channel.send(`I could not find results for \`${tags}\` **${message.member.displayName}-san**.`);
      const embed = new MessageEmbed();
      embed
        .setDescription(`http://yande.re/post/show/${result.id}`)
        .setColor(message.client.config.colors.random())
        .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(result.file_url)
        .setTimestamp();

      await message.channel.send(`Requested by **${message.author.tag}**`, embed);
    } catch (error) {
      await message.channel.send(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Yandere;