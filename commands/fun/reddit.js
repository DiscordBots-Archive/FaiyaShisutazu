const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Reddit extends Social {

  constructor(...args) {
    super(...args, {
      name: "reddit",
      description: "Posts a random subreddit entry",
      category: "4. Fun",
      usage: "reddit [-new|-random|-hot|-top] [subreddit]",
      extended: "This returns a random entry from the requested subreddit.",
      cost: 15,
      cooldown: 10,
      aliases: [],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const subreddit = args.join(" ") || "random";
    const subRedCat = message.flags[0] || "random";
    try {
      const { body } = await get(`https://www.reddit.com/r/${subreddit}/${subRedCat}.json`);
      let entry;
      if (body[0]) {
        entry = body[0].data.children[Math.floor(Math.random() * body[0].data.children.length)].data;
      } else {
        entry = body.data.children[Math.floor(Math.random() * body.data.children.length)].data;
      }
      
      if (!message.channel.nsfw && entry.over_18) {
        return message.reply("🔞", "You need to be in a NSFW channel view this content!");
      }

      const embed = new MessageEmbed();
      embed
        .setDescription(`${entry.title} submitted by ${entry.author}\n\nPermalink: https://www.reddit.com${entry.permalink}`)
        .setColor(message.client.config.colors.random())
        .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(`${entry.url}`)
        .setTimestamp()
        .addField("Subreddit:", `${entry.subreddit_name_prefixed}`, true)
        .addField("Reddit score:", `${entry.score}`, true);
      
      await message.channel.send(`Requested by **${message.author.tag}**`, embed);
    } catch (error) {
      await message.channel.send(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Reddit;