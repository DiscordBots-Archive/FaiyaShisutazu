const Social = require(`${process.cwd()}/base/Social.js`);

class Dice extends Social {
  constructor(client) {
    super(client, {
      name: "dice",
      description: "Roll a 6 sided dice",
      category: "5. Random raffles & votes",
      usage: "dice [rolls] [sides]",
      extended: "This command will roll a 6-sided dice by default if you don't provide the number of rolls and dice sides",
      cost: 2,
      aliases: [],

    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
        const rolls = (args[0] === undefined) ? 1 : args[0];
        const sides = (args[1] === undefined) ? 6 : args[1];
        if (rolls > 100000 || sides > 100000)
            await message.channel.send("Those numbers are too high I don't want to do that much Math =3=");
        else {
            let total = 0;
            for (let i = 0; i <= rolls; i++) {
                let number = Math.floor(Math.random() * sides) + 1;
                total += number;
            }
            const average = (total / rolls).toPrecision(1);
            await message.channel.send(`You rolled a ${sides}-sided dice ${rolls} times! The total is **${total}** (Average: **${average}**)`);
        }
    } catch (error) {
        this.client.logger.error(error);
    }
  }
}

module.exports = Dice;