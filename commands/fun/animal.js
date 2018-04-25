const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");

class Animal extends Social {
  constructor(client) {
    super(client, {
      name: "animal",
      description: "Returns a random picture of an animal",
      category: "4. Fun",
      usage: "animal [options]",
      extended: "animal: returns a random picture of supported animals\nanimal [bird/bunny/cat/dog/owl/shibe]: returns a random picture of the animal you specified",
      cost: 2,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: ["animals"],
      permLevel: "User"
    });
  }

  async run(message, args, level) {
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const animalArray = ["dog", "cat", "bird", "bunny", "owl", "shibe"];
      let suffix;
      if (animalArray.includes(args[0])) {
        suffix = args[0];
      } else {
        suffix = animalArray[Math.floor(Math.random() * animalArray.length)];
      }

      const msg2 = await message.channel.send(`<a:typing:397490442469376001> Getting an animal pic for**${message.member.displayName}-san**`);

      if (suffix == "dog") {
        const { body } = await snek.get("https://dog.ceo/api/breeds/image/random");
        await msg2.edit({
          embed: {
            "url": body.message,
            "color": 0x9575cd,
            "image": {
              "url": body.message
            }
          }
        });

      } else if (suffix == "cat") {
        const { body } = await snek.get("http://random.cat/meow");
        await msg2.edit({
          embed: {
            "url": body.file,
            "color": 0x9575cd,
            "image": {
              "url": body.file
            }
          }
        });

      } else if (suffix == "bird") {
        const { body } = await snek.get("http://random.birb.pw/tweet/");
        await msg2.edit({
          embed: {
            "url": `https://random.birb.pw/img/${body}`,
            "color": 0x9575CD,
            "image": {
              "url": `https://random.birb.pw/img/${body}`
            }
          }
        });

      } else if (suffix == "bunny") {
        const { body } = await snek.get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
        await msg2.edit({
          embed: {
            "url": body.media.gif,
            "color": 0x9575CD,
            "image": {
              "url": body.media.gif
            }
          }
        });

      } else if (suffix == "owl") {
        const owl = await snek.get("http://pics.floofybot.moe/owl")
          .then(r => r.body.image);
        await msg2.edit({
          embed: {
            "url": owl,
            "color": 0x9575cd,
            "image": {
              "url": owl
            }
          }
        });

      } else { 
        const { body } = await snek.get("http://shibe.online/api/shibes");
        await msg2.edit({
          embed: {
            "url": body[0],
            "color": 0x9575cd,
            "image": {
              "url": body[0]
            }
          }
        });
      }

    } catch (e) {
      await message.channel.send(`**${message.author.tag}**, an error occured with your request, please try again!`)
      console.log(e);
    }
  }

}

module.exports = Animal;
