const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Beautiful extends Social {

  constructor(...args) {
    super(...args, {
      name: "beautiful",
      description: "Returns a beatiful canvas with the person you like on it",
      category: "3. Canvas",
      usage: "beautiful [@mention target]",
      extended: "This uses the provided tag to create a beautiful canvas with the person you like. If there was no tag provided, message command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      aliases: ["painting"],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const target = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      const attachment = new MessageAttachment(await message.client.idiotAPI.beautiful(target.displayAvatarURL({ format: "png", size: 256 })), "beautiful.png");
      
      await replyMessage.delete();
      await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Beautiful; //