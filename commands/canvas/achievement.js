const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Achievement extends Social {

  constructor(...args) {
    super(...args, {
      name: "achievement",
      description: "Creates an user-defined achievement",
      category: "3. Canvas",
      usage: "achievement [description] [@mention]",
      extended: "This uses the provided text to create a custom achievement.",
      cost: 15,
      cooldown: 10,
      aliases: ["get", "achieveget", "achievementget", "achieve"],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars     
    try {
      let text = args.join(" ").toUpperCase();
      if (message.mentions.users.size !== 0) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
      if (!text) return message.reply("B-baka!! You must input something in order for message to work!!");
      if (text.length > 22) return message.reply("The maximum length is 22 characters!");
      const attachment = new MessageAttachment(await message.client.idiotAPI.achievement(message.author.displayAvatarURL({ format: "png", size: 32 }), text), "achievement.png");
      
      await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
    } catch (error) {
      await message.channel.send(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Achievement;