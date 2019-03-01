const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");

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

  constructor(...args) {
    super(...args, {
      name: "slots",
      description: "Plays the slot machine",
      category: "4. Fun",
      usage: "slots",
      extended: "This simulates a slot machine. Your winning is equal to the cost of message command multiplied by the machine points.",
      cost: 10,
      cooldown: 5,
      aliases: ["slot"],
      botPerms: ["EMBED_LINKS"]
    });
  }
  
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const results = machine.play();
      const winnings = 10 * results.totalPoints;
      const embed = new MessageEmbed();
      embed
        .setColor(message.client.config.colors.random())
        .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
        .setDescription(`${results.visualize(false)}\n\n${results.winCount === 0 ? `${message.member.displayName} has lost!\nBetter luck next time!` : `Whoa... ${message.member.displayName} won!`}\n\n${results.winCount === 0 ? "" : `You have won 🍩 ${winnings.toLocaleString()}`}`)
        .setTimestamp();

      await message.channel.send(`Requested by **${message.author.tag}**`, embed);
      if (results.winCount > 0) return message.member.givePoints(winnings);
    } catch (error) {
      await message.channel.send(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Slots;
