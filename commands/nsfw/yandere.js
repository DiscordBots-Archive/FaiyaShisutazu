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

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return replyMessage.edit("🔞 You need to be in a NSFW channel to use this command!");

    try {
      const tags = args.join("_");
      const { body } = await get(`http://yande.re/post.json?limit=100&tags=${tags}`);
      const result = body.random();
      if (!result) return replyMessage.edit(`I could not find results for \`${tags}\`.`);
      const embed = new MessageEmbed();
      embed
        .setDescription(`http://yande.re/post/show/${result.id}`)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(result.file_url)
        .setTimestamp();

      await replyMessage.edit(embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Yandere;