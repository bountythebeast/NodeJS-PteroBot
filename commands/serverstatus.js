const Command = require("../base/Command.js");
const nodeactyl = require('nodeactyl-v1-support');
const Client = nodeactyl.Client;
const node = require('nodeactyl');
const Application = node.Application;
const PterodactylPanel = require("../data/PterodactylPanel.json");
var stringTable = require('string-table');

class serverstatus extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "serverstatus", //command name, should match class.
			description: "Admin command for use with Panel commands.", //description
            usage: "serverstatus <server name> | leave blank for all.", //usage details. Should match the name and class
            category: "Pterodactyl",
            permLevel: "Bot Admin"
		});
	}

	async run (message, args, level) 
	{
        message.channel.send("Retrieving server status! This may take a second.")
        Client.login(PterodactylPanel.HOST,PterodactylPanel.ClientAPI, (logged_in, msg) =>
        {
            console.log("Log in Client (user): "+logged_in)
            Application.login(PterodactylPanel.HOST,PterodactylPanel.ApplicationAPI, (logged_in, msg) =>
            {
                console.log("Log in Application (admin): "+logged_in)
                panelSetup(message).then(temp => switchCase(temp)).then(result => {message.channel.send("```"+result+"```")}).catch(error => {console.log("Errors in serverstatus command. \n"+error)})
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
                        //this will eventually get switched to a json file, this is old code as it stands. 
                        //if you see this, you can use the SAME switch block from restartserver.js, just update the 'isOnline' from 'restartServer' or vis versa. 
                        switch (processarg) 
                        {
                            case "name1":
                                isOnline("shortid","name1").then((ret) =>
                                {
                                    resolve(stringTable.create([ret]));
                                })
                                break;
                            case "fivem": //<- LOWER CASE. V Doesn't matter.
                                isOnline("9320ca1a","FiveM").then((ret) =>
                                {
                                    resolve(stringTable.create([ret])); //leaving the above with an example of how it should look.
                                })
                                break;
                            default:
                                allservers();
                                break;
                        }
                    });
                }
                function allservers()
                {
                    Application.getAllServers().then(serverdata =>
                    {
                        var values = Object.values(serverdata);
                        const promises = [];
                        values.forEach(async(serverdata,index) =>
                        {
                            promises.push(isOnline(serverdata.attributes.identifier,serverdata.attributes.name))
                        });
                        Promise.all(promises).then(results =>
                        {
                            console.log(results)
                            message.channel.send("```\n"+stringTable.create(results)+"```")
                        });
                    }).catch(err =>
                    {
                        console.log(err); 
                    });
                }
            });

        });
        function isOnline(identifier,servername)
        {
            return new Promise( (resolve) =>
            {
                Client.getServerStatus(identifier).then((status) =>
                {
                    var ThisStatus = 
                    {
                        ServerName: servername,
                        ServerStatus: status
                    }
                    resolve(ThisStatus)
                }).catch((error) =>
                {
                    console.log(error)
                    resolve({"ServerName": servername,"ServerStatus": "Unavailable"});
                });
            });
        }
	}
}

module.exports = serverstatus; //<------------ Don't forget this one!