const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Waifu extends Social {
  constructor(...args) {
    super(...args, {
      name: "waifu",
      description: "Displays a color sample with any supplied HEX, RGB or RGBA colour code",
      category: "3. Canvas",
      usage: "waifu [@mention target]",
      extended: "This uses the provided HEX, RGB, RGBA color code to create a color sample. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      aliases: [],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars 
    try {
      const target = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      const attachment = new MessageAttachment(await message.client.idiotAPI.waifuInsult(target.displayAvatarURL({ format: "png", size: 256 })), "waifu.png");

      await replyMessage.delete();
      await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Waifu;
