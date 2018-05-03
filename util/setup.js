const inquirer = require("inquirer");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const fs = require("fs");

let baseConfig = fs.readFileSync("./util/setup_base.txt", "utf8");

const defaultSettings = `{
  "prefix": ".",
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
  "pointsReward": "200",
  "minPoints": "1",
  "maxPoints": "50",
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
    message: "Please enter your bot token from the application page."
  },
  {
    type: "input",
    name: "steamKey",
    message: "Please enter your Steam API key."
  },
  {
    type: "input",
    name: "googleKey",
    message: "Please enter your Google API key."
  }
];

(async function() {
  console.log("Setting up your bot's configuration...");
  await settings.defer;
  if (!settings.has("default")) {
    prompts = prompts.slice(1);
    console.log("First Start! Inserting default guild settings in the database...");
    await settings.setAsync("default", defaultSettings);
  }
  
  // Start to comment out this section and edit setup_base.txt 
  // directly if hosting on Heroku
  const answers = await inquirer.prompt(prompts);

  if (answers.resetDefaults && answers.resetDefaults === "Yes") {
    console.log("Resetting default guild settings...");
    await settings.setAsync("default", defaultSettings);
  }

  baseConfig = baseConfig.replace("{{discordKey}}", `"${answers.discordKey}"`);
  baseConfig = baseConfig.replace("{{steamKey}}", `"${answers.steamKey}"`);
  baseConfig = baseConfig.replace("{{googleKey}}", `"${answers.googleKey}"`);
  // End
  
  fs.writeFileSync("./config.js", baseConfig);
  console.log("REMEMBER TO NEVER SHARE YOUR TOKEN & API KEYS WITH ANYONE!");
  console.log("Configuration has been written, enjoy!");
  await settings.close();
}());
