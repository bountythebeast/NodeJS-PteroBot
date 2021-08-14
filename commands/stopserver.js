const Command = require("../base/Command.js");
const nodeactyl = require('nodeactyl-v1-support');
const Client = nodeactyl.Client;
const node = require('nodeactyl');
const Application = node.Application;
const PterodactylPanel = require("../data/PterodactylPanel.json");
var stringTable = require('string-table');

class stopserver extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "stopserver", //command name, should match class.
			description: "Admin command for use with Panel commands.", //description
            usage: "stopserver <server name> | leave blank for all. Full list of Options (currently): \n survival,fivem,hub,rsp,relaxedsurvivalplus,skyblock,survivalhub,bungee,creative,factions,stafftest,limbo,login,ark,bo3,blackops,blackops3,cod4", //usage details. Should match the name and class
            category: "Bot Admin Commands"
		});
	}

	async run (message, args, level) 
	{
        if(level >= 9)
        {
            Client.login(PterodactylPanel.HOST,PterodactylPanel.ClientAPI, (logged_in, msg) =>
            {
                console.log("Log in Client (user): "+logged_in)
                Application.login(PterodactylPanel.HOST,PterodactylPanel.ApplicationAPI, (logged_in, msg) =>
                {
                    console.log("Log in Application (admin): "+logged_in)
                    panelSetup(message).then(temp => switchCase(temp)).then(result => {message.channel.send("```"+result+"```")}).catch(error => {console.log("Errors in stopserver command. \n"+error)})
                    async function panelSetup(message)
                    {
                        try
                        {
                            let messagestring = await CleanMessage(message.content.toString());
                            function CleanMessage(message)
                            {
                                message = message.substring(message.indexOf(" ")+1)
                                return message;
                            }
                            return messagestring;
                        }
                        catch(e)
                        {
                            console.log("error in trycatch: \n"+e)
                        }
                    }
                    function switchCase(processarg)
                    {
                        return new Promise( (resolve) =>
                        {
                            //same switch as other ptero commands
                            let temp
                            switch (processarg) 
                            {
                                case "fivem":
                                    stopServer("9320ca1a","FiveM").then((ret) =>
                                    {
                                        resolve(stringTable.create([ret]));
                                    })
                                    break;
                                default:
                                    resolve("Error, cannot restart null servers.");
                                    break;
                            }
                        });
                    }
                });

            });
            function stopServer(identifier,servername)
            {
                return new Promise( (resolve) =>
                {
                    Client.getServerStatus(identifier).then((status) =>
                    {
                        if((status !== "stopping") || (status !== "offline"))
                        {
                            Client.stopServer(identifier).then((resposne) =>
                            {
                                resolve({"ServerName": servername,"ServerStatus": "Stop Command issues, Stopping server."})
                            }).catch((err) =>
                            {
                                console.log(err)
                                resolve({"ServerName": servername,"ServerStatus": "Failed to stop server! Check Console."})
                            });
                        }
                        else
                        {
                            resolve({"ServerName": servername,"ServerStatus": "Server is in an off state, or is in the process of Stopping!"})
                        }
                    }).catch((error) =>
                    {
                        console.log(error)
                        resolve({"ServerName": servername,"ServerStatus": "Unknown State. Check Console."});
                    });
                });
            }
        }
        else
        {
            //check if user exists in premiumusers
        }
    }
}

module.exports = stopserver; //<------------ Don't forget this one!