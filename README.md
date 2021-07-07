# Secret Santa Bot

![Image](https://github.com/hen-chen/Secret-Santa-Bot/blob/main/Bot_pfp.png)

This discord bot allows users to host their own Secret Santa gift exchange. Just add the bot to your server, and you'll have access to all the commands below! Host an event, set a countdown, and covertly DM your Secret Santa questions so you can be sure to select the perfect gift.

## Adding the bot to your Discord server

To add the bot to your server, just follow the link below. Select the server you want from the dropdown, and enjoy!

[Invite link](https://discord.com/api/oauth2/authorize?client_id=859129156503339008&permissions=129088&scope=bot)

## Installation

If you are interested in modifing or privately hosting our bot, feel free to do so. 

### Setup on heroku

1. [Create a free heroku account](https://signup.heroku.com)
1. [Download the heroku CLI and follow the instructions to get started](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
1. Clone the Secret Santa repository from [here](https://github.com/hen-chen/Secret-Santa-Bot.git)
    + `git clone https://github.com/hen-chen/Secret-Santa-Bot.git`
    + `cd Secret-Santa-Bot`
1. Make any changes you want, commit and push them, and follow the instructions on the deploy tab of your heroku account to host a modified Secret Santa bot of your very own.

## List of commands

* `!help`: List all commands.
* `!host`: Allows participants to enter and leave. There can only be one host at a time.
* `!cancel`: Resets the participants list. Only available to the host.
* `!enter`: Enters you into the Secret Santa.
* `!leave`: Lets you leave the Secret Santa.
* `!list`: Lets you see everyone in the Secret Santa.
* `!countdown`: Lets you see how much time is left before Secret Santa ends.
* `!start`: Give the bot a date, and it will assign everyone their Secret Santa and set a countdown before the event ends. Entering and leaving will no longer be available. Only available to the host.
* `!ask`: DM the bot a question, and it will pass it on to your gift recipient.
* `!reply`: DM the bot something, and it will pass it on to your Secret Santa. You can answer a question they ask, or reuqest something of your own.

## Authors

* **Brandon Kedson** - [BKedson](https://github.com/BKedson)
* **Henry Chen** - [hen-chen](https://github.com/hen-chen)
