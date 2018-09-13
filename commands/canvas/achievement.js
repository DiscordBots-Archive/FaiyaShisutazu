const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Achievement extends Social {

  constructor(client) {
    super(client, {
      name: "achievement",
      description: "Creates an user-defined achievement",
      category: "03. Canvas",
      usage: "achievement [description]",
      extended: "This uses the provided text to create a custom achievement.",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["get", "achieveget", "achievementget", "achieve"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);

    try {
      let text = args.join(" ").toUpperCase();
      if (message.mentions.users.size !== 0) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
      if (!text) return loadingMessage.edit(`B-baka!! ${message.member.displayName}-san must input something in order for this to work!!`);
      if (text.length > 22) return loadingMessage.edit(`The maximum length is 22 characters ${message.member.displayName}-san!`);
      
      const attachment = new MessageAttachment(await this.client.idiotAPI.achievement((message.mentions.users.first() || message.author).displayAvatarURL({ format:"png", size:32 }), text), "achievement.png");
      
      await loadingMessage.delete();
      return message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {files: [attachment]});
    } catch (error) {
      await loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      console.log(error);
    }
  }
}

module.exports = Achievement;