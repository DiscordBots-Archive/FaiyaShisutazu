const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Virtual extends Social {
  constructor(...args) {
    super(...args, {
      name: "virtual",
      description: "Brings Virtual Reality to the provided tag",
      category: "3. Canvas",
      usage: "virtual [@mention target]",
      extended: "This uses the provided tag to bring that user to virtual reality. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 5,
      aliases: [],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars 
    try {
      const target = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      const attachment = new MessageAttachment(await message.client.idiotAPI.virtual(target.displayAvatarURL({ format: "png", size: 256 })), "virtual.png");

      await replyMessage.delete();
      await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Virtual;
