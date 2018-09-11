const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const fsn = require("fs-nextra");

const alternateCase = (string) => {
  const chars = string.toUpperCase().split("");
  for (let i = 0; i < chars.length; i += 2) {
    chars[i] = chars[i].toLowerCase();
  }
  return chars.join("");
};

class Mock extends Social {

  constructor(client) {
    super(client, {
      name: "mock",
      description: "Mocks a nominated message",
      category: "04. Fun",
      usage: "mock [message id]",
      extended: "This returns an alternated case text based on the popular Spongebob Squarepants mocking meme.",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      
      const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      const grabMock = args.length === 0 ? await message.channel.messages.fetch({
        limit: 1,
        before: message.id
      }) : await message.channel.messages.fetch(await this.verifyMessage(message, args[0]));
      const mockBob = await fsn.readFile("./assets/images/spongebob.png");
      const mock = grabMock.size === 1 ? grabMock.first() : grabMock;
      if (mock.author.bot) return message.response(undefined, "You cannot mock bots.");
      const attachment = new Discord.MessageAttachment(mockBob, "mock.png");
      
      loadingMessage.delete();
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content} | ${alternateCase(mock.cleanContent)}`, {files: [attachment]});
    } catch (error) {
      loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}

module.exports = Mock;