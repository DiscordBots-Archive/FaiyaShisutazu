const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Respect extends Social {

  constructor(...args) {
    super(...args, {
      name: "respect",
      description: "Pays respect to a person",
      category: "3. Canvas",
      usage: "respect [@mention target]",
      extended: "This uses the provided tag to allow everyone to pay respect to a person using the F react. If there was no tag provided, this command will use the image of the message's author!",
      cost: 30,
      cooldown: 25,
      aliases: ["pressf", "f", "rip", "ripme"],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars 
    try {
      const target = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      const attachment = new MessageAttachment(await message.client.idiotAPI.respect(target.displayAvatarURL({ format: "png", size: 128 })), "respect.png");
      
      await replyMessage.delete();
      const respect = await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
      await respect.react("🇫");
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Respect;