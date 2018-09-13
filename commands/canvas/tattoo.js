const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Tattoo extends Social {

  constructor(client) {
    super(client, {
      name: "tattoo",
      description: "Gets a tattoo of someone's face",
      category: "03. Canvas",
      usage: "tattoo [@mention|userid]",
      extended: "This uses the provided tag to let you get a tattoo of someone's face. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["ink"],
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
      const attachment = new MessageAttachment(await this.client.idiotAPI.tattoo(target.displayAvatarURL({ format:"png", size:512 })), "tattoo.png");
      
      await loadingMessage.delete();
      return message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {files: [attachment]});
    } catch (error) {
      await loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      console.log(error);
    }
  }
}

module.exports = Tattoo; //