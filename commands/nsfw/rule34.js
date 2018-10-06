const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Rule34 extends Social {

  constructor(...args) {
    super(...args, {
      name: "rule34",
      description: "Returns an entry from Rule34",
      category: "6. NSFW",
      usage: "rule34 [search term]",
      extended: "This returns an entry from Rule34.",
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
      const { body } = await get(`https://rule34.xxx?page=dapi&s=post&q=index&limit=100&tags=${encodeURI(`${tags}+rating:explicit`)}&json=1`);
      const result = JSON.parse(body).random();
      if (!result) return message.channel.send(`I could not find results for \`${tags}\` **${message.member.displayName}-san**.`);
      const embed = new MessageEmbed();
      embed
        .setDescription(`https://rule34.xxx/index.php?page=post&s=view&id=${result.id}`)
        .setColor(message.client.config.colors.random())
        .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(`https://rule34.xxx/images/${result.directory}/${result.image}`)
        .setTimestamp()
        .addField("Score", `${result.score}`, true)
        .addField("Rating", `${this.getRating(result.rating)}`, true);

      await message.channel.send(`Requested by **${message.author.tag}**`, embed);
    } catch (error) {
      await message.channel.send(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Rule34;