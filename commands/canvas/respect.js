const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Respect extends Social {

  constructor(client) {
    super(client, {
      name: "respect",
      description: "Pays respect to a person",
      category: "03. Canvas",
      usage: "respect [@mention|userid]",
      extended: "This uses the provided tag to allow everyone to pay respect to a person using the F react. If there was no tag provided, this command will use the image of the message's author!",
      cost: 30,
      cooldown: 30,
      hidden: false,
      guildOnly: true,
      aliases: ["pressf", "f", "rip", "ripme"],
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
      const attachment = new MessageAttachment(await this.client.idiotAPI.respect(target.displayAvatarURL({format:"png", size:128})), "respect.png");
      
      await loadingMessage.delete();
      const respectMessage = await message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content} | Press **F** to pay respect!`, {files: [attachment]});
      await respectMessage.react("🇫");
    } catch (error) {
      await loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      console.log(error);
    }
  }
}

module.exports = Respect; //