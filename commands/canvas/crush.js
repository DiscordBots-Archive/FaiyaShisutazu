const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Crush extends Social {

  constructor(...args) {
    super(...args, {
      name: "crush",
      description: "Shows everyone who you missed",
      category: "3. Canvas",
      usage: "crush [@mention crusher] [@mention target]",
      extended: "This uses the provided tag to tell everyone who you missed the most. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      aliases: ["miss"],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    const response = await message.channel.send(`${message.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);

    try {
      const crusher = await this.verifyUser(message, message.mentions.users.size === 1  ? message.mentions.users.first().id : message.author );
      const target = await this.verifyUser(message, message.mentions.users.size === 2 ? message.mentions.users.last().id : message.mentions.users.first().id);
      const attachment = new MessageAttachment(await message.client.idiotAPI.crush(target.displayAvatarURL({format:"png", size:512}), crusher.displayAvatarURL({format:"png", size:128})), "crush.png");
      
      await response.delete();
      await message.channel.send(`Requested by **${message.author.tag}** ❯ \`${message.content}\``, {files: [attachment]});
    } catch (error) {
      await response.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.author.tag)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Crush; //