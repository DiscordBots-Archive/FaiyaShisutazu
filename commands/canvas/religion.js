const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Religion extends Social {
  constructor(...args) {
    super(...args, {
      name: "religion",
      description: "Gets someone to join your religion",
      category: "3. Canvas",
      usage: "religion [@mention target]",
      extended: "This uses the provided tag to get that person to join your religion. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 5,
      aliases: [],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars 
    try {
      const target = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      const attachment = new MessageAttachment(await message.client.idiotAPI.religion(target.displayAvatarURL({ format: "png", size: 256 })), "religion.png");

      await replyMessage.delete();
      await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Religion;
