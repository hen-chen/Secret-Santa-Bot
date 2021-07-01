require('dotenv').config();
const fetch = require("node-fetch");
const Discord = require("discord.js");

const client = new Discord.Client();
let sadWords = ["sad", "mad", "bad"];
let encouragements = ["Cheer Up, Henry!", "Hang in there, Henry.", "Hey there, Henry!"];
let participants = [];
let hosting = false;
let host = null;
let pairings = {};

//Help command
client.on("message", msg => {
    if (msg.author.bot) return;
    if (msg.content === "!help") {
        msg.reply("here is a list of everything I can do:" + 
        "\n `!host` Allows participants to enter and leave. There can only be one host at a time" +
        "\n `!cancel` Resets the participants list. Only available to the host" + 
        "\n `!enter` Enters you into the Secret Santa" +
        "\n `!leave` Lets you leave the Secret Santa" + 
        "\n `!list` Lets you see everyone in the Secret Santa" +
        "\n `!start` Starts the Secret Santa. Entering and leaving will no longer be available. Only available to the host." + 
        "\n `!ask` DM me a question, and I will pass it on to your gift recipient");
    }
})

//Hosting command
client.on("message", msg => {
    if (msg.author.bot) return;
    if(msg.channel.type === "dm") return;
    if (msg.content === "!host" && !hosting) {
        hosting = true;
        host = msg.author;
        msg.channel.send(`Hosting has started! The host is ${host.username}.`);

    } else if (msg.content === "!host" && hosting) {
        msg.reply("Hosting has already started. The host can use `!cancel` to cancel.");
    }
})

// Cancel hosting command
client.on("message", msg => {
    if (msg.author.bot) return;
    if(msg.channel.type === "dm") return;
    if (msg.content === "!cancel" && hosting && JSON.stringify(msg.author) === JSON.stringify(host)) {
        resetSanta();
        msg.channel.send("Hosting has been cancelled.");
    } else if (msg.content === "!cancel" && !hosting) {
        msg.reply("There is no Secret Santa right now.");
    } else if (msg.content === '!cancel' && JSON.stringify(msg.author) !== JSON.stringify(host)) {
        msg.reply(`you are not the host of this Secret Santa! Please ask ${host.username} to cancel.`);
    }
})

// Enter command
client.on("message", msg => {
    if (msg.author.bot) return;

    if (msg.content === "!enter" && hosting && !participants.includes(msg.author)) {
        participants.push(msg.author);
        console.log(participants);
        msg.channel.send(`Welcome ${msg.author.username}! You are in for this Secret Santa!`);
    }
    else if (msg.content === "!enter" && hosting) {
        msg.reply("you're already signed up.");
    }
    else if (msg.content === "!enter" && !hosting) {
        msg.reply("Sorry! There isn't a Secret Santa right now.");
    }
})

// Leave command
client.on("message", msg => {
    if (msg.author.bot) return;

    if (msg.content === "!leave" && hosting && participants.includes(msg.author)) {
        participants.splice(participants.indexOf(msg.author), 1);
        console.log(participants);
        msg.channel.send(`Goodbye ${msg.author.username}. See you next time!`);
    }
    else if(msg.content === "!leave" && hosting) {
        msg.reply("you're not signed up yet.");
    }
    else if (msg.content === "!leave" && !hosting) {
        msg.reply("Sorry! There isn't a Secret Santa right now.");
    }
})

// List all members of Secret Santa
client.on("message", msg => {
    if (msg.author.bot) return;

    if (msg.content === "!list" && hosting && participants.length === 0) {
        msg.channel.send("There are no participants as of now.");
    } else if (msg.content === "!list" && hosting) {
        let message = "The current participants are:";
        participants.forEach(x => message += "\n" + x.username);
        message += "\nThe host is " +  host.username;
        msg.channel.send(message);
    } else if (msg.content === "!list") {
        msg.channel.send("No host has started yet.");
    }
})

// Start command
client.on("message", msg => {
    if (msg.author.bot) return;
    if(msg.channel.type === "dm") return;
    if (msg.content === "!start" && hosting && JSON.stringify(msg.author) !== JSON.stringify(host)) {
        msg.reply(`you are not the host of this Secret Santa! Please ask ${host.username} to start.`);
    }
    else if (msg.content === "!start" && hosting && participants.length >= 3) {
        participants = getSantas(participants);
        console.log(participants);
        for (let i = 0; i < participants.length; i++) {
            if (i === participants.length - 1) {
                pairings[participants[i]] = participants[0];
                participants[i].send(`${participants[0].username} is your secret santa`);
            } else {
                pairings[participants[i]] = participants[i + 1];
                participants[i].send(`${participants[i + 1].username} is your secret santa`);
            }
        }
        //Ends hosting
        participants = [];
        hosting = false;
        msg.channel.send("Secret Santa has begun!");
    } else if (msg.content === "!start" && !hosting) {
        msg.reply("you need to host before you can start. Try `!host`.");
    } else if (msg.content === '!start' && participants.length < 3) {
        msg.channel.send('Not enough participants. Need at least 3.');
    }
})

// Relay a message
client.on("message", msg => {
    if (msg.author.bot) return;
    if(msg.channel.type === "text") return;
    if (msg.content.includes("!ask") && pairings.hasOwnProperty(msg.author)) {
        //Parses question
        let message = "Your secret Santa has asked: " + msg.content.substr(5);

        //Find the secret santa
        let secretSanta = pairings[msg.author];
        secretSanta.send(message);
        msg.author.send("Your question has been asked!");
    } else if (msg.content.includes('!ask') && !pairings.hasOwnProperty(msg.author)) {
        msg.author.send('Either you are not in the Secret Santa or the event has not yet begun. Ask your host for more details.');
    }
})

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

const resetSanta = () => {
    participants = [];
    hosting = false;
    host = null;
    pairings = {};
}

//Previous functions
// function getQuote() {
//     return fetch("https://zenquotes.io/api/random")
//     .then(res => {
//         return res.json()
//     })
//     .then(data =>{
//         return data[0]["q"] + " -" + data[0]["a"]
//     })
// }

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

// client.on("message", msg => {
//     if (msg.author.bot) return;

//     if (msg.content ===  "$inspire"){
//         getQuote().then(quote => msg.channel.send(quote))
//     }
//     if (sadWords.some(word => msg.content.includes(word))){
//         const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
//         msg.reply(encouragement);
//     }
// })

client.login(process.env.TOKEN);