const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");

class Leaderboard extends Social {

  constructor(...args) {
    super(...args, {
      name: "leaderboard",
      description: "Displays the top 20 active users",
      category: "7. Social",
      usage: "leaderboard",
      extended: "This returns the top 20 active users in message guild",
      cooldown: 15,
      aliases: ["top20", "top", "leader", "lb"],
      permLevel: "User"
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const top3 = [];
      const leaderboard = [];
      const lbServer = [];
      const list = message.client.points.filter(p => p.guild === message.guild.id && message.guild.members.get(p.user) && p.points > 0);

      const page = 0;
      const totalPages = Math.round(list.size / 10);
      if (totalPages === 0) return message.channel.send("There is no leaderboard in the server, is this a new server under my watch or is this a dead place???");

      list.map(p => ({points: p.points, user: p.user}))
        .sort((a, b) => b.points > a.points ? 1 : -1)
        .map(us => {
          lbServer.push(us.user);
        });

      list.map(p => ({points: p.points, user: p.user}))
        .sort((a, b) => b.points > a.points ? 1 : -1).slice(page*10, (page+1)*10)
        .map((u, i) => {
          leaderboard.push(`${(page*10 + (i + 1)).toString().padStart(2, "0")}❯ ${u.points.toLocaleString()} ${" ".repeat(10 - u.points.toLocaleString().length)} ::  ${message.client.users.get(u.user).tag}`);
          if (i <= 2) {
            top3.push(`${message.client.users.get(u.user).tag}`);
            top3.push(`${u.points.toLocaleString()}`);
          }
        });

      // Get the message author's position on leaderboard
      const authorPosition = lbServer.indexOf(message.author.id).toString().padStart(2, "0") == -1 ? "??" : (lbServer.indexOf(message.author.id) + 1).toString();

      const embed = new MessageEmbed();
      embed
        .setDescription(`**Position 1 to 10:**\`\`\`${leaderboard.join("\n")}\`\`\``)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setTimestamp()
        .addField(`${message.author.tag}'s current position: #${authorPosition} with 🍩  ${message.client.points.get(`${message.guild.id}-${message.author.id}`).points.toLocaleString()}`, "\u200b")
        .addField(`🥇 ${top3[0]}`, `🍩  ${top3[1]}`, true)
        .addField(`🥈 ${top3[2]}`, `🍩  ${top3[3]}`, true)
        .addField(`🥉 ${top3[4]}`, `🍩  ${top3[5]}`, true);  

      await replyMessage.edit(embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Leaderboard;
