require('dotenv').config();
const fetch = require("node-fetch");
const Discord = require("discord.js");

const client = new Discord.Client();
let sadWords = ["sad", "mad", "bad"];
let encouragements = ["Cheer Up, Henry!", "Hang in there, Henry.", "Hey there, Henry!"];
let participants = [];
let hosting = false;

//Hosting command
client.on("message", msg => {
    if (msg.author.bot) return;

    if (msg.content === "!host" && !hosting) {
        hosting = true;
        msg.channel.send("Hosting has started!");

    } else if (msg.content === "!host" && hosting) {
        msg.reply("Hosting has already started. Use `!cancel` to cancel.");
    }
})

// Cancel hosting command
client.on("message", msg => {
    if (msg.author.bot) return;

    if (msg.content === "!cancel" && hosting) {
        hosting = false;
        participants = [];
        msg.channel.send("Hosting has been cancelled.");
    } else if (msg.content === "!cancel" && !hosting) {
        msg.reply("There is no Secret Santa right now.");
    }
})

// Enter command
client.on("message", msg => {
    if (msg.author.bot) return;

    if (msg.content === "!enter" && hosting && !participants.includes(msg.author.username)) {
        participants.push(msg.author.username);
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

    if (msg.content === "!leave" && hosting && participants.includes(msg.author.username)) {
        participants.splice(participants.indexOf(msg.author.username), 1);
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

    if (msg.content === "!list" && hosting) {
        let message = "The current participants are:";
        participants.forEach(x => message += "\n" + x);
        msg.channel.send(message);
    } else if (msg.content === "!list") {
        msg.channel.send("No host has started yet.");
    }
})

// Start command
client.on("message", msg => {
    if (msg.author.bot) return;

    if (msg.content === "!start" && hosting) {
        //Add function to dm people their secret santa
        hosting = false;
        participants = [];
        msg.channel.send("Secret Santa has begun!");
    } else if (msg.content === "!start" && !hosting) {
        msg.reply("you need to host before you can start. Try `!host`.");
    }
})

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