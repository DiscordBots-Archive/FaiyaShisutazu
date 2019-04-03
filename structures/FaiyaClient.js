const { Client } = require('discord.js-commando');
const idioticAPI = require('idiotic-api');
const { createLogger, format, transports } = require('winston');

class FaiyaClient extends Client {
	constructor(options) {
		super(options);
      this.idiotAPI = new idioticAPI.Client(`${process.env.IDIOT_KEY}`, { dev: true });

      this.logger = createLogger({
        transports: [new transports.Console()],
        format: format.combine(
          format.colorize({ all: true }),
          format.simple()
        )
      });
	}
}

module.exports = FaiyaClient;