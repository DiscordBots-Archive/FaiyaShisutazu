const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const snek = require("snekfetch");

class Reddit extends Social {
  constructor(client) {
    super(client, {
      name: "reddit",
      description: "Posts a random subreddit entry.",
      usage: "reddit [-new|-random|-hot|-top] [subreddit]",
      category: "6. NSFW?",
      cost: 2,
      cooldown: 4
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const subreddit = args.join(" ") || "random";
    const subRedCat = message.flags[0] || "random";
    try {
      const { body } = await snek.get(`https://www.reddit.com/r/${subreddit}/${subRedCat}.json`);
      let meme;
      if (body[0]) {
        meme = body[0].data.children[Math.floor(Math.random() * body[0].data.children.length)].data;
      } else {
        meme = body.data.children[Math.floor(Math.random() * body.data.children.length)].data;
      }

      if (!message.channel.nsfw && meme.over_18) {
        message.response("🔞", "Cannot display NSFW content in a SFW channel.");
        return;
      }
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`Fetching from **${meme.subreddit_name_prefixed}...**`);
      
      const embed = new Discord.MessageEmbed();
      embed
        .setTitle(`🌺 **${message.author.tag}** ❯ ${message.content}`)
        .setDescription(`${meme.title} submitted by ${meme.author}\n\nPermalink: https://www.reddit.com${meme.permalink}`)
        .setColor(0x9575cd)
        .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(`${meme.url}`)
        .setTimestamp()
        .addField("Subreddit:", `${meme.subreddit_name_prefixed}`, true)
        .addField("Reddit score:", `${meme.score}`, true);
      
      await msg.edit({embed});
    } catch (error) {
      console.log(error);
      this.client.logger.error(error);
    }
  }
}

module.exports = Reddit;