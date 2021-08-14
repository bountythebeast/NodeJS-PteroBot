const Command = require("../base/Command.js");
const nodeactyl = require('nodeactyl-v1-support')
const PterodactylPanel = require("../data/PterodactylPanel.json");

class panelapicheck extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "panelapicheck", //command name, should match class.
			description: "Admin command to test if the Host/API pair are working properly. Returns true/false.", //description
            usage: "panelapicheck", //usage details. Should match the name and class
            category: "Pterodactyl",
            permLevel: "Bot Admin"
		});
	}

	async run (message, args, level) 
	{
        nodeactyl.Admin.login(PterodactylPanel.HOST,PterodactylPanel.AdminAPI, (logged_in, msg) => 
        {
            message.channel.send("Host/AdminKey **ADMIN KEY** pair worked: "+logged_in)
			console.log("Host/AdkimKey pair worked: "+logged_in); // return a Boolean (true/false) if logged in.
			console.error(msg)
		});
		
	}
}

module.exports = panelapicheck; //<------------ Don't forget this one!
