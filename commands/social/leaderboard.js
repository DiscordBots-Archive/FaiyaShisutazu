const Social = require(`${process.cwd()}/base/Social.js`);

class Leaderboard extends Social {
  constructor(client) {
    super(client, {
      name: "leaderboard",
      description: "Displays the top 10 active users.",
      usage: "leaderboard",
      category: "9. Social",
      cost: 0,
      aliases: ["top10", "top", "leader", "lb"]
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

      if (!message.author.bot) {
        leaderboard.push(`🌺 ${message.author.tag}'s current point: ${this.client.points.get(`${message.guild.id}-${message.author.id}`).points.toLocaleString()}`);
        leaderboard.push("-------------------------------------------------------");
        leaderboard.push("❯❯❯ Position 4 to 20:");
      } else {
        leaderboard.push("❯❯❯ Position 4 to 20:");
      }

      list.map(p => ({points: p.points, user: p.user}))
        .sort((a, b) => b.points > a.points ? 1 : -1).slice(page*20, (page+1)*20)
        .map((u, i) => {
          if (i <= 2) {
            top3.push(`${this.client.users.get(u.user).tag}`);
            top3.push(`${u.points.toLocaleString()}`);
          } else {
            leaderboard.push(`${(page*20 + (i + 1)).toString().padStart(2, "0")}❯ ${u.points.toLocaleString()} ${" ".repeat(23 - u.points.toLocaleString().length)} ::  ${this.client.users.get(u.user).tag}`);
          }
        });

      await message.channel.send({
        "embed": {
          "title": `**${message.guild.name}'s Leaderboard**`,
          "description": `\`\`\`${leaderboard.join("\n")}\`\`\``,
          "color": 0x9575CD,
          "fields": [{
              "name": `**${message.guild.name}'s Top 3**`,
              "value": `\u200b`
            },
            {
              "name": `🥇 ${top3[0]}`,
              "value": `${top3[1]}`,
              "inline": true
            },
            {
              "name": `🥈 ${top3[2]}`,
              "value": `${top3[3]}`,
              "inline": true
            },
            {
              "name": `🥉 ${top3[4]}`,
              "value": `${top3[5]}`,
              "inline": true
            }
          ]
        }
      });

    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Leaderboard;
