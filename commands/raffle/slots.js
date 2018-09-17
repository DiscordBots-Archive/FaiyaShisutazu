const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");

const { SlotMachine, SlotSymbol } = require("slot-machine");

const lemon = new SlotSymbol("lemon", { display: "🍋", points: 1, weight: 100 });
const watermelon = new SlotSymbol("watermelon", { display: "🍉", points: 1, weight: 100 });
const apple = new SlotSymbol("apple", { display: "🍎", points: 1, weight: 100 });
const grape = new SlotSymbol("grape", { display: "🍇", points: 1, weight: 100 });
const orange = new SlotSymbol("orange", { display: "🍊", points: 1, weight: 100 });
const cherry = new SlotSymbol("cherry", { display: "🍒", points: 1, weight: 100 });
const wild = new SlotSymbol("wild", { display: "❔", points: 1, weight: 40, wildcard: true });
const bell = new SlotSymbol("bell", { display: "🔔", points: 2, weight: 40 });
const clover = new SlotSymbol("clover", { display: "🍀", points: 3, weight: 35 });
const heart = new SlotSymbol("heart", { display: "❤", points: 4, weight: 30 });
const money = new SlotSymbol("money", { display: "💰", points: 5, weight: 25 });
const diamond = new SlotSymbol("diamond", { display: "💎", points: 10, weight: 3 });
const jackpot = new SlotSymbol("jackpot", { display: "🔅", points: 50, weight: 5});

const machine = new SlotMachine(3, [cherry, lemon, watermelon, apple, grape, orange, wild, bell, clover, heart, money, diamond, jackpot]);

class Slots extends Social {

  constructor(client) {
    super(client, {
      name: "slots",
      description: "Plays the slot machine",
      category: "05. Random generators, raffles & votes",
      usage: "slots",
      extended: "This simulates a slot machine. Your winning is equal to the cost of this command multiplied by the machine points.",
      cost: 15,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: [],
      permLevel: "User"
    });
  }
  
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const response = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);

    try {
      const results = machine.play();
      const winnings = this.help.cost * results.totalPoints;
      const embed = new Discord.MessageEmbed();
      embed
        .setColor(this.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setDescription(`${results.visualize(false)}\n\n${results.winCount === 0 ? `${message.member.displayName} has lost!\nBetter luck next time!` : `Whoa... ${message.member.displayName} won!`}\n\n${results.winCount === 0 ? "" : `You have won 💎${winnings.toLocaleString()}`}`)
        .setTimestamp();

      response.edit(`🌺 **${message.author.tag}** ❯ ${message.content}`, {embed});
      if (results.winCount > 0) return message.member.givePoints(winnings);
    } catch (error) {
      response.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}

module.exports = Slots;
