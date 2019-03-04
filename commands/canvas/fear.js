const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Fear extends Social {
  constructor(...args) {
    super(...args, {
      name: "fear",
      description: "Displays your fear toward something",
      category: "3. Canvas",
      usage: "fear [@mention target]",
      extended: "This uses the provided tag to help you express your fear. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      aliases: [],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars 
    try {
      const target = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      const attachment = new MessageAttachment(await message.client.idiotAPI.heavyFear(target.displayAvatarURL({ format: "png", size: 256 })), "fear.png");

      await replyMessage.delete();
      await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Fear;
