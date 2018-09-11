const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const snek = require("snekfetch");

class Reddit extends Social {

  constructor(client) {
    super(client, {
      name: "reddit",
      description: "Posts a random subreddit entry",
      category: "06. NSFW?",
      usage: "reddit [-new|-random|-hot|-top] [subreddit]",
      extended: "This returns a random entry from the requested subreddit.",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }

    const response = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);

    const subreddit = args.join(" ") || "random";
    const subRedCat = message.flags[0] || "random";
    try {
      const { body } = await snek.get(`https://www.reddit.com/r/${subreddit}/${subRedCat}.json`);
      let entry;
      if (body[0]) {
        entry = body[0].data.children[Math.floor(Math.random() * body[0].data.children.length)].data;
      } else {
        entry = body.data.children[Math.floor(Math.random() * body.data.children.length)].data;
      }
      
      if (!message.channel.nsfw && entry.over_18) {
        message.response("🔞", "You need to be in a NSFW channel to use this command!");
        return;
      }

      const embed = new Discord.MessageEmbed();
      embed
        .setTitle(`🌺 **${message.author.tag}** ❯ ${message.content}`)
        .setDescription(`${entry.title} submitted by ${entry.author}\n\nPermalink: https://www.reddit.com${entry.permalink}`)
        .setColor(this.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(`${entry.url}`)
        .setTimestamp()
        .addField("Subreddit:", `${entry.subreddit_name_prefixed}`, true)
        .addField("Reddit score:", `${entry.score}`, true);
      
      response.edit({embed});
    } catch (error) {
      response.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}

module.exports = Reddit;