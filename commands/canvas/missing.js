const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Missing extends Social {
  constructor(...args) {
    super(...args, {
      name: "missing",
      description: "Posts a missing poster of someone",
      category: "3. Canvas",
      usage: "missing [@mention target]",
      extended: "This uses the provided tag to post a missing poster of that person. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 5,
      aliases: [],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars 
    try {
      const target = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      const attachment = new MessageAttachment(await message.client.idiotAPI.missing(target.displayAvatarURL({ format: "png", size: 256 }), (message.mentions.members.first() || message.member).displayName, "missing.png"));

      await replyMessage.delete();
      await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Missing;
