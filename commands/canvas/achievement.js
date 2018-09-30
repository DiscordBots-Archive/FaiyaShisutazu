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

  async run(message, [...text], level) { // eslint-disable-line no-unused-vars 
    const response = await message.channel.send(`${message.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    
    try {
      let text = text.join(" ").toUpperCase();
      if (message.mentions.users.size !== 0) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
      if (!text) return response.edit(`B-baka!! ${message.author.username}-san must input something in order for message to work!!`);
      if (text.length > 22) return response.edit(`The maximum length is 22 characters ${message.author.username}-san!`);
      
      const attachment = new MessageAttachment(await message.client.idiotAPI.achievement((message.mentions.users.first()).displayAvatarURL({ format:"png", size:32 }), text), "achievement.png");
      
      await response.delete();
      await message.channel.send(`Requested by **${message.author.tag}** ❯ \`${message.content}\``, {files: [attachment]});
    } catch (error) {
      await response.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.author.username)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Achievement;