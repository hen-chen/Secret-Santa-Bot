require('dotenv').config();
const Discord = require("discord.js");

const client = new Discord.Client();

let participants = [];
let hosting = false;
let host = null;
let start = false;
let givingDict = {};
let receivingDict = {};
let dueDate = null;

//Everything listener
client.on("message", msg => {
    if (msg.author.bot) return;

    //Help command
    if (msg.content === "!help") {
        msg.reply("here is a list of everything I can do:" +
        "\n `!host` Allows participants to enter and leave. There can only be one host at a time" +
        "\n `!cancel` Resets the participants list. Only available to the host" +
        "\n `!enter` Enters you into the Secret Santa" +
        "\n `!leave` Lets you leave the Secret Santa" +
        "\n `!list` Lets you see everyone in the Secret Santa" +
        "\n `!countdown` Lets you see how much time is left before Secret Santa ends" +
        "\n `!start` Give me a date, and I'll assign everyoen their Secret Santa and set a countdown before the event ends. Entering and leaving will no longer be available. Only available to the host" +
        "\n `!ask` DM me a question, and I will pass it on to your gift recipient" +
        "\n `!reply` DM me something, and I will pass it on to your Secret Santa. You can answer a question they ask, or reuqest something of your own");
        return;
    }

    // Enter command
    if (msg.content === "!enter" && hosting && !participants.includes(msg.author)) {
        participants.push(msg.author);
        msg.channel.send(`Welcome ${msg.author.username}! You are in for this Secret Santa!`);
        return;
    } else if (msg.content === "!enter" && hosting) {
        msg.reply("you're already signed up.");
        return;
    } else if (msg.content === "!enter" && !hosting && !start) {
        msg.reply("Sorry! There isn't a Secret Santa right now.");
        return;
    } else if (msg.content === "!enter" && !hosting && start) {
        msg.reply(`Sorry, Secret Santa has alreay begun. Please ask ${host.username} about restarting if you want to withdraw.`);
        return;
    }

    // Leave command
    if (msg.content === "!leave" && hosting && participants.includes(msg.author)) {
        participants.splice(participants.indexOf(msg.author), 1);
        msg.channel.send(`Goodbye ${msg.author.username}. See you next time!`);
        return;
    } else if (msg.content === "!leave" && hosting) {
        msg.reply("you're not signed up yet.");
        return;
    } else if (msg.content === "!leave" && !hosting && !start) {
        msg.reply("Sorry! There isn't a Secret Santa right now.");
        return;
    } else if (msg.content === "!enter" && !hosting && start) {
        msg.reply(`Sorry, Secret Santa has alreay begun. Please ask ${host.username} about restarting if you want to join.`);
        return;
    }

    // List all members of Secret Santa
    if (msg.content === "!list" && hosting && participants.length === 0) {
        msg.channel.send("There are no participants as of now.");
        return;
    } else if (msg.content === "!list" && hosting) {
        let message = "The current participants are:";
        participants.forEach(x => message += "\n" + x.username);
        message += "\nThe host is " + host.username;
        msg.channel.send(message);
        return;
    } else if (msg.content === "!list") {
        msg.channel.send("No host has started yet.");
        return;
    }

    // Countdown
    if (start && msg.content === "!countdown") {
        msg.channel.send(milliToDays() + " days remaining!");
    } else if (msg.content === "!countdown" && !start) {
        msg.channel.send("Secret Santa has not started yet.");
    }
})


//Channel listener
client.on("message", msg => {

    if (msg.author.bot || msg.channel.type === "dm") return;

    //Hosting command
    if (msg.content === "!host" && !hosting && !start) {
        hosting = true;
        host = msg.author;
        msg.channel.send(`Hosting has started! The host is ${host.username}.`);
        return;
    } else if (msg.content === "!host" && hosting) {
        msg.reply("Hosting has already started. The host can use `!cancel` to cancel.");
        return;
    }

    // Cancel hosting command
    if (msg.content === "!cancel" && hosting && JSON.stringify(msg.author) === JSON.stringify(host)) {
        resetSanta();
        msg.channel.send("Hosting has been cancelled.");
        return;
    } else if (msg.content === "!cancel" && !hosting) {
        msg.reply("There is no Secret Santa right now.");
        return;
    } else if (msg.content === '!cancel' && JSON.stringify(msg.author) !== JSON.stringify(host)) {
        msg.reply(`you are not the host of this Secret Santa! Please ask ${host.username} to cancel.`);
        return;
    }

    // Reset command
    if (msg.content === "!reset" && start && JSON.stringify(msg.author) === JSON.stringify(host)) {
        resetSanta();
        msg.channel.send("Hosting has been cancelled.");
        return;
    } else if (msg.content === "!reset" && !start) {
        msg.reply("Secret Santa hasn't started yet.");
        return;
    } else if (msg.content === '!reset' && JSON.stringify(msg.author) !== JSON.stringify(host)) {
        msg.reply(`you are not the host of this Secret Santa! Please ask ${host.username} to reset.`);
        return;
    }

    // Start command
    if (msg.content === "!start" && hosting && JSON.stringify(msg.author) !== JSON.stringify(host)) {
        msg.reply(`you are not the host of this Secret Santa! Please ask ${host.username} to start.`);
    } else if (msg.content.includes("!start") && hosting && participants.length >= 3) {
        dueDate = new Date(msg.content.substr(6));
        if (isNaN(dueDate.getTime())) {
            msg.channel.send("This end date is invalid!");
            dueDate = null;
            return;
        }
        let tempDate = new Date();
        let currYear = dueDate.getFullYear();
        if (currYear < tempDate.getFullYear()) {
            msg.channel.send("You must specify the current year or a year in the future!");
            dueDate = null;
            return;
        }
        if (dueDate < tempDate) {
            msg.channel.send("Specify a date in the future!");
            dueDate = null;
            return;
        }
        // let diff = milliToDays(); // testing to calc diff
        // console.log(diff);

        participants = getSantas(participants);
        for (let i = 0; i < participants.length; i++) {
            if (i === participants.length - 1) {
                givingDict[participants[i]] = participants[0];
                receivingDict[participants[0]] = participants[i];
                participants[i].send(`${participants[0].username} is your secret santa`);
            } else {
                givingDict[participants[i]] = participants[i + 1];
                receivingDict[participants[i + 1]] = participants[i];
                participants[i].send(`${participants[i + 1].username} is your secret santa`);
            }
        }
        start = true;
        hosting = false;
        msg.channel.send("Secret Santa has begun!");
    } else if (msg.content === "!start" && !hosting) {
        msg.reply("you need to host before you can start. Try `!host`.");
    } else if (msg.content === '!start' && participants.length < 3) {
        msg.channel.send('Not enough participants. Need at least 3.');
    }
})

//DM listener
client.on("message", msg => {
    if (msg.author.bot || msg.channel.type === "text") return;

    // Relay a message
    if (msg.content.includes("!ask") && givingDict.hasOwnProperty(msg.author)) {
        //Parses question
        let message = "Your secret Santa has asked: " + msg.content.substr(5); // !ask is index 5

        //Find the secret santa
        let secretSanta = givingDict[msg.author];
        secretSanta.send(message);
        msg.author.send("Your question has been asked!");
    } else if (msg.content.includes('!ask') && !givingDict.hasOwnProperty(msg.author)) {
        msg.author.send('Either you are not in the Secret Santa or the event has not yet begun. Ask your host for more details.');
    }

    // Respond to a question
    if (msg.content.includes("!reply") && givingDict.hasOwnProperty(msg.author)) {
        //Parses question
        let message = `${msg.author.username} says: ` + msg.content.substr(7);

        //Find the secret santa
        let secretSantaGiver = receivingDict[msg.author];
        if (secretSantaGiver === null) {
            console.log('Null value in dictionary');
            return;
        }
        secretSantaGiver.send(message);
        msg.author.send("Your message has been sent!");
    } else if (msg.content.includes('!reply') && !givingDict.hasOwnProperty(msg.author)) {
        msg.author.send('Either you are not in the Secret Santa or the event has not yet begun. Ask your host for more details.');
    }

    // Find a gift
    if (msg.content.includes("!gift") && givingDict.hasOwnProperty(msg.author)) {
        let message = findGift();
        msg.author.send(message);
    } else if (msg.content.includes('!gift') && !givingDict.hasOwnProperty(msg.author)) {
        msg.author.send('Either you are not in the Secret Santa or the event has not yet begun. Ask your host for more details.');
    }
})


// Helper funcs
const getSantas = people => {
    let currentIndex = people.length;
    let randomIndex = null;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [people[currentIndex], people[randomIndex]] = [
            people[randomIndex], people[currentIndex]];
    }
    return people;
}
setInterval(checkTime, 86400000);

const checkTime = () => {
    if (start && dueDate - currDate <= 0) {
        resetSanta();
    }
}

const resetSanta = () => {
    participants = [];
    hosting = false;
    host = null;
    givingDict = {};
    receivingDict = {};
    dueDate = null;
    start = false;
}

const milliToDays = () => {
    let currDate = new Date();
    return Math.ceil((dueDate - currDate) / 86400000);
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.login(process.env.TOKEN);