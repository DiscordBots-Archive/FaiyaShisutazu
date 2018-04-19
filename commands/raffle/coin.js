const Social = require(`${process.cwd()}/base/Social.js`);
const fsn = require("fs-nextra");

class Coin extends Social {
  constructor(client) {
    super(client, {
      name: "coin",
      description: "Flip a coin",
      category: "5. Random raffles & votes",
      usage: "coin",
      extended: "This command will flip a coin for you.",
      cost: 2,
      aliases: ["flip"],

    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const heads = await fsn.readFile("./assets/images/heads.png");
      const tails = await fsn.readFile("./assets/images/tails.png");
      const number = Math.floor(Math.random() * 2) + 1;
      if (number === 1) 
        await message.channel.send({
          files: [{
            attachment: heads,
            name: "heads.png"
          }]
        });
      else
        await message.channel.send({
          files: [{
            attachment: tails,
            name: "tails.png"
          }]
        });
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Coin;