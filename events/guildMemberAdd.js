const Event = require("../structures/Event.js");

module.exports = class extends Event {

  async run(member) {
    if (this.client.user.id === "475552332138938378") {
      if (!member.guild.available) return;
      if (!member || !member.id || !member.guild) return;

      const settings = this.client.getGuildSettings(member.guild);
      
      if (settings.welcomeEnabled !== "true") return;
      member.guild.channels.find("name", settings.welcomeChannel)
        .send(`${this.client.responses.welcomeMessages.random()
          .replaceAll("{{user}}", member.user.username)
          .replaceAll("{{amount}}", member.guild.memberCount)
          .replaceAll("{{guild}}", member.guild.name).trim()}`)
        .catch(console.error);
    }
  }
};
