require('dotenv').config();
const fetch = require("node-fetch");
const Discord = require("discord.js");

const client = new Discord.Client();
let sadWords = ["sad", "mad", "bad"];
let encouragements = ["Cheer Up, Henry!", "Hang in there, Henry.", "Hey there, Henry!"];

function getQuote() {
    return fetch("https://zenquotes.io/api/random")
    .then(res => {
        return res.json()
    })
    .then(data =>{
        return data[0]["q"] + " -" + data[0]["a"]
    })
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.on("message", msg => {
    if (msg.author.bot) return;

    if (msg.content ===  "$inspire"){
        getQuote().then(quote => msg.channel.send(quote))
    }
    if (sadWords.some(word => msg.content.includes(word))){
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        msg.reply(encouragement);
    }
})

//console.log(process.env.TOKEN);
client.login(process.env.TOKEN);