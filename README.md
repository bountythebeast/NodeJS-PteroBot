# NodeJS-PteroBot
 
 I do not recommend using this bot unless you know what your doing because i'm not good at this and probably won't be much better at troubleshooting the issue than you are.
 
This is a basic Pterodactyl control bot to help manage servers, containers, and what not from inside your discord server. 

A huge thanks to https://github.com/AnIdiotsGuide, as this is entirely based off of their bot guide and is the how I got started.

The bot is currently in **BETA** and should only be used by people who can code themselves to troubleshoot errors, and understand what's happening.

ToDos:
- Expand examples
- Convert switch cases to JSON parse
- Add a HowTo Document to help jumpstart use of bot
- Document it at all?

<br>
Best regards, <br>
    No1's Perfect | Server Host#6666
<br><br>
	
Getting Started:<br><br>
Create a PterodactylPanel.json from the Data.examples file<br>
	> AdminAPI should be an Admin Key. You can generate one by going into the admin panel > ApplicationAPI > create new > read & right all. <br>
	> The Client API should be an admin user API key. You can generate one by going into the user area (clicking the head icon at the top right), then API Credentials, and create a new one. 
	<br>
Create a paneusers.json file under the Data folder. Leave this blank, as the bot will handle the rest.
<br>
Create a hardware.json file under the Data folder. You can choose not to use this if you prefer, as this is primarily for SSH commands.
<br>
To check if the above are working properly, You can start the bot and run the command ptero/panelapicheck (if the default prefix is left)
<br>
Note: The above, will be accessible to anyone with the BOT ADMIN role, so it is not recommended to give anyone that role in the bot unless they are allowed to run the commands.
<br>
For Non-Admin users, the panelsync command can be used to add their USERapi key, and discordID (unique per account and doesn't change) to the panelusers.json file. After more work is done, this will allow them to control their own servers by checking the rights/using the api key to run the appropriate commands. (DM ONLY.)
<br>
UPNPCfix<br>
	> This command was created to handle updates to UPNPC which is a router port forward control program we used* in our environment. This can be safely deleted along with the Hardware.json** Unless using restartWings** if not needed.
	<br>
restartWings<br>
	> Command is very bare bones right now, pulls from hardware.json for the ssh information and runs a systemctl restart wings.service command and returns reply from ssh.
	<br>
The Start, Stop, Restart, and status require further work and are not designed for production use in their current state.
