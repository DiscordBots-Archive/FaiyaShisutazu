const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Crush extends Social {

  constructor(client) {
    super(client, {
      name: "crush",
      description: "Shows everyone who you missed",
      category: "03. Canvas",
      usage: "crush [@mention|userid]",
      extended: "This uses the provided tag to tell everyone who you missed the most. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["miss"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);

    try {
      const target = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      const crusher = message.author;
      const attachment = new MessageAttachment(await this.client.idiotAPI.crush(target.displayAvatarURL({format:"png", size:512}), crusher.displayAvatarURL({format:"png", size:128})), "crush.png");
      
      await loadingMessage.delete();
      return message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {files: [attachment]});
    } catch (error) {
      loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      console.log(error);
    }
  }
}

module.exports = Crush; //