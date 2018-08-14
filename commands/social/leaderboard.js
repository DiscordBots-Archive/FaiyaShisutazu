const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");

class Leaderboard extends Social {
  constructor(client) {
    super(client, {
      name: "leaderboard",
      description: "Displays the top 20 active users.",
      usage: "leaderboard",
      category: "9. Social",
      cost: 0,
      aliases: ["top20", "top", "leader", "lb"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem !== "true") return message.response(undefined, "The social system is disabled.");

    try {
      const top3 = [];
      const leaderboard = [];
      const lbServer = [];

      const list = this.client.points.filter(p => p.guild === message.guild.id && message.guild.members.get(p.user) && p.points > 0);
   
      let page = 0;
      const totalPages = Math.round(list.size / 20);
      if (totalPages === 0) return message.channel.send("There is no leaderboard in the server, maybe its a dead place???");

      list.map(p => ({points: p.points, user: p.user}))
        .sort((a, b) => b.points > a.points ? 1 : -1)
        .map(us => {
          lbServer.push(us.user);
        });

      list.map(p => ({points: p.points, user: p.user}))
        .sort((a, b) => b.points > a.points ? 1 : -1).slice(page*20, (page+1)*20)
        .map((u, i) => {
          if (i <= 2) {
            top3.push(`${this.client.users.get(u.user).tag}`);
            top3.push(`${u.points.toLocaleString()}`);
          } else {
            leaderboard.push(`${(page*20 + (i + 1)).toString().padStart(2, "0")}❯ 💎 ${u.points.toLocaleString()} ${" ".repeat(10 - u.points.toLocaleString().length)} ::  ${this.client.users.get(u.user).tag}`);
          }
        });

      // Get the message author's position on leaderboard
      const authorPosition = lbServer.indexOf(message.author.id).toString().padStart(2, "0") == -1 ? "??" : (lbServer.indexOf(message.author.id) + 1).toString();

      const embed = new Discord.MessageEmbed();
      if (message.author.bot) 
        embed.addBlankField();
      else
        embed.addField(`${message.author.tag}'s current position: #${authorPosition} with 💎 ${this.client.points.get(`${message.guild.id}-${message.author.id}`).points.toLocaleString()}`, "\u200b");

      embed
        .setDescription(`**Position 4 to 20:**\`\`\`${leaderboard.join("\n")}\`\`\``)
        .setColor(this.client.config.colors.random())
        .setFooter(`${message.author.bot ? "REmibot by @Jjeuweiii" : `Requested by ${message.author.tag} | REmibot by @Jjeuweiii`}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setTimestamp()
        .addField(`🥇 ${top3[0]}`, `💎 ${top3[1]}`, true)
        .addField(`🥈 ${top3[2]}`, `💎 ${top3[3]}`, true)
        .addField(`🥉 ${top3[4]}`, `💎 ${top3[5]}`, true);  

      await message.channel.send(`${message.author.bot ? `🌺 **${message.author.tag}** ❯ ${message.content} | ` : ""}**${message.guild.name}'s Leaderboard**`, {embed});
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Leaderboard;
