const Command = require("../base/Command.js");
const nodeactyl = require('nodeactyl-v1-support');
const Client = nodeactyl.Client;
const node = require('nodeactyl');
const Application = node.Application;
const PterodactylPanel = require("../data/PterodactylPanel.json");
var stringTable = require('string-table'); //this is for beautifying!!

class restartserver extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "restartserver", //command name, should match class.
			description: "Admin command for use with Panel commands.", //description
            usage: "restartserver <server name> | leave blank for all. Full list of Options (currently): \n <your list here>", //usage details. Should match the name and class
            category: "Bot Admin Commands",
            permLevel: "Bot Admin"
		});
	}

	async run (message, args, level) 
	{
        Client.login(PterodactylPanel.HOST,PterodactylPanel.ClientAPI, (logged_in, msg) =>
        {
            console.log("Log in Client (user): "+logged_in)
            Application.login(PterodactylPanel.HOST,PterodactylPanel.ApplicationAPI, (logged_in, msg) =>
            {
                console.log("Log in Application (admin): "+logged_in)
                panelSetup(message).then(temp => switchCase(temp)).then(result => {message.channel.send("```"+result+"```")}).catch(error => {console.log("Errors in restartserver command. \n"+error)})
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
                        let temp
                        switch (processarg) 
                        {
                            case "name1":
                                restartServer("shortid","name1").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "fivem": //<- LOWER CASE. V Doesn't matter.
                                restartServer("9320ca1a","FiveM").then((ret) =>
                                {
                                    resolve(stringTable.create([ret])); //leaving the above with an example of how it should look.
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
        function restartServer(identifier,servername)
        {
            return new Promise( (resolve) =>
            {
                Client.getServerStatus(identifier).then((status) =>
                {
                    if((status !== "stopping") || (status !== "starting") || (status !== "offline"))
                    {
                        Client.restartServer(identifier).then((resposne) =>
                        {
                            resolve({"ServerName": servername,"ServerStatus": "Restart Command issued, Server Restarting."})
                        }).catch((err) =>
                        {
                            console.log(err)
                            resolve({"ServerName": servername,"ServerStatus": "Failed to start! Check Console."})
                        });
                    }
                    else
                    {
                        resolve({"ServerName": servername,"ServerStatus": "Server is in an off state, or is in the process of Stopping/Starting!"})
                    }
                }).catch((error) =>
                {
                    console.log(error)
                    resolve({"ServerName": servername,"ServerStatus": "Unknown State. Check Console."});
                });
            });
        }
	}
}

module.exports = restartserver; //<------------ Don't forget this one!