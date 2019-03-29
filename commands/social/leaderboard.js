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
      const filtered = message.client.points.filter( p => p.guild === message.guild.id ).array();

      const sorted = filtered.sort((a, b) => b.points - a.points);

      const top10 = sorted.splice(0, 10);

      const embed = new MessageEmbed()
        .setTitle("Leaderboard")
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }));

      for (const data of top10) {
        if (top10.indexOf(data) === 0) embed.addField(`🥇 ${message.client.users.get(data.user).tag}`, `🍩 ${data.points} points`);
        else if (top10.indexOf(data) === 1) embed.addField(`🥈 ${message.client.users.get(data.user).tag}`, `🍩 ${data.points} points`);
        else if (top10.indexOf(data) === 2) embed.addField(`🥉 ${message.client.users.get(data.user).tag}`, `🍩 ${data.points} points`);
        else embed.addField(`🏅 ${message.client.users.get(data.user).tag}`, `🍩 ${data.points} points`);
      }

      await replyMessage.edit(embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Leaderboard;
