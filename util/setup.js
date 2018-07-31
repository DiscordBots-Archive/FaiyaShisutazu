const inquirer = require("inquirer");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const fs = require("fs");

let baseConfig = fs.readFileSync("./util/setup_base.txt", "utf8");

const defaultSettings = `{
  "modRole": "Moderator",
  "adminRole": "Administrator",
  "systemNotice": "true",
  "welcomeEnabled": "true",
  "welcomeChannel": "general",
  "socialNotice": "true",
  "socialSystem": "true",
  "socialInventory": "true",
  "scoreTime": "5",
  "dailyTime": "24",
  "minRewards": "100",
  "maxRewards": "200",
  "minPoints": "1",
  "maxPoints": "20",
  "costMulti": "2"
}`;

const settings = new Enmap({provider: new EnmapLevel({name: "settings"})});

let prompts = [
  {
    type: "list", 
    name: "resetDefaults", 
    message: "Do you want to reset default settings?", 
    choices: ["Yes", "No"]
  },
  {
    type: "input",
    name: "discordKey",
    message: "[Required] Please enter your bot token from the application page!"
  },
  {
    type: "input",
    name: "prefix",
    message: "[Required] Please enter your bot prefix!"
  }
];

(async function() {
  console.log(" Setting up your bot's configuration...");
  await settings.defer;
  if (!settings.has("default")) {
    prompts = prompts.slice(1);
    console.log(" First Start! Inserting default guild settings in the database...");
    await settings.setAsync("default", defaultSettings);
  }
  
  // Start to comment out this section and edit setup_base.txt 
  // directly if hosting on Heroku
  const answers = await inquirer.prompt(prompts);

  if (answers.resetDefaults && answers.resetDefaults === "Yes") {
    console.log(" Resetting default guild settings...");
    await settings.setAsync("default", defaultSettings);
  }

  baseConfig = baseConfig.replace("{{discordKey}}", `"${answers.discordKey}"`);
  baseConfig = baseConfig.replace("{{prefix}}", `"${answers.prefix || "!"}"`);
  // End
  
  fs.writeFileSync("./config.js", baseConfig);
  console.log("*********************************************************");
  console.log("*  Never share your bot token and API keys with anyone! *");
  console.log("*  Configuration has been written, enjoy!               *");
  console.log("*                                                       *");
  console.log("*  This setup only prompt for the required bot token!   *")
  console.log("*  Please manually enter other optional keys in the     *")
  console.log("*  config.js file to enable additional features!        *")
  console.log("*********************************************************");
  await settings.close();
}());


