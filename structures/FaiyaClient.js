const { Client } = require('discord.js-commando');
const { createLogger, format, transports } = require('winston');
const idioticAPI = require('idiotic-api');

class FaiyaClient extends Client {
	constructor(options) {
    super(options);
      this.responses = require('../assets/responses.js');
      this.colors = [16747146, 16746211, 16746178, 16681968, 15371774, 14518525, 11373566];
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