const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Stepped extends Social {

  constructor(...args) {
    super(...args, {
      name: "stepped",
      description: "Steps on someone you dislike",
      category: "3. Canvas",
      usage: "stepped [@mention target]",
      extended: "This uses the provided tag to let you step on a person you dislike. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      aliases: ["step"],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const target = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      const attachment = new MessageAttachment(await message.client.idiotAPI.stepped(target.displayAvatarURL({ format: "png", size: 128 })), "stepped.png");
      
      await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
    } catch (error) {
      await message.channel.send(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Stepped; //