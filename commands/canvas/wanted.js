const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Wanted extends Social {

  constructor(...args) {
    super(...args, {
      name: "wanted",
      description: "Puts someone on a wanted poster",
      category: "3. Canvas",
      usage: "wanted [@mention|userid]",
      extended: "This uses the provided tag to let you put someone on a wanted poster. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      aliases: [],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const target = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      const attachment = new MessageAttachment(await message.client.idiotAPI.wanted(target.displayAvatarURL({ format:"png", size:512 })), "wanted.png");
      
      await message.channel.send(`Requested by **${message.author.tag}**`, {files: [attachment]});
    } catch (error) {
      await message.channel.send(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Wanted; //