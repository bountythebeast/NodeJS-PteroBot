const Command = require("../base/Command.js");
const SSH = require('simple-ssh');
const serverInfo = require("../data/hardware.json");

class restartwings extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "restartwings", //command name, should match class.
			description: "Restart the wings daemon.", //description
            usage: "restartwings <node1,node2,ca1> | One of them is required, only accepts 1 argument.", //usage details. Should match the name and class
            category: "Pterodactyl",
            permLevel: "Bot Admin",
			aliases: ["wings","wing","restartwing"]
		});
	}

	async run (message, args, level) 
	{ 

        /*
            [[!! WARNING !!]]
            !!!This requires SSH into the backend servers!!! 
            By default, its restricted to Bot Admins but you should be very careful with this information if you plan to use it!

            <STRONG> I HIGHLY recommend you create a MIN permission account who can ONLY run systemctl restart! </STRONG> 
        */
        if(!args[0])
        {
            message.channel.send("Error, you need to provide a system to restart wings on.")
            return;
        }
        if(args[0].toLowerCase() === "node2")
        {
            var ssh = new SSH(
            {
                host: serverInfo.node2,
                user: serverInfo.sshUser,
                pass: serverInfo.passnode2,
                port: serverInfo.sshPortNode2      
            });
        }
        else if(args[0].toLowerCase() === "node1")
        {
            var ssh = new SSH(
            {
                host: serverInfo.node1,
                user: serverInfo.sshUser,
                pass: serverInfo.passnode1,
                port: serverInfo.sshPortNode1       
            });
        }
        else if(args[0].toLowerCase() === "ca1")
        {
            var ssh = new SSH(
            {
                host: serverInfo.ca1,
                        user: serverInfo.sshUser,
                        pass: serverInfo.passca1,
                        port: serverInfo.sshPortCA1         
            });
        }
        const msg = await message.channel.send("Restarting wings!")
        let sshcommand = "systemctl restart wings"
        try
        {
            ssh.exec(sshcommand,
            {
                err: function (stderr) 
                { 
                    if(stderr.toString().includes("Job for wings.service failed."))
                    {                  
                        msg.edit("Systemctl issue, running reset-failed.")
                        
                        ssh.exec("systemctl reset-failed",
                        {
                            err: function (stderr) 
                            { 
                                console.error(stderr); Message.channel.send("There were errors running the command, Check console.")
                            },
                            exit: function (code) 
                            { 
                                ssh.exec("systemctl restart wings",
                                {
                                    err: function(stderr) 
                                    {
                                        console.log(stderr); 
                                        message.channel.send("There was an error restarting wings after pushing Systemctl reset-failed.")
                                    },
                                    exit: function (code) 
                                    {
                                        msg.edit("Wings has been restarted.");
                                    }

                                }).start();
                            }
                        }).start();
                    }
                    else
                    {
                        msg.edit("Error! Wings uncaught exception. Please restart manually.")
                    }
                },
                exit: function (code) 
                {
                    msg.edit("Wings has been restarted successfully.")
                }
            }).start();
        }
        catch
        {
            msg.edit("There was an error, Script has exited from the command to prevent causing issues.")
        }
	}
}

module.exports = restartwings; //<------------ Don't forget this one!
