/*  PitchTracker.js
    Josh Aidelman
    Last updated October 19 */

const Discord = require("discord.js");
const client = new Discord.Client();

var fs = require('fs'); //For files

var space; //Stores where the " " is in a string
var pitch; //Stores the pitch
var avg = 0; //Stores the average
var curNum = 0; //Stores where we are in the file
var pos = 0;
var newLine;
var count = 0;
var digits;
var found = false;
var num = [];
var num2 = [];
var avg2 = 0;
var wrappedTotal;
var name;
var max;
var min;
var result;
var total = 0;
var secAv = 0;
var barGraph = [10];
var barString = [10];

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {

  /* Prints your list */
  if(message.content.startsWith("!list") || message.content.startsWith("!bar")){

    /* Finds all values */
    space = message.content.search(" ");
    name = message.content.substring(space + 1);

    //Resets bar graph values
    for(var j = 0; j<10; j++){
      barGraph[j] = 0;
    }

    if (fs.existsSync('Files/' + name + '.txt')) {
      var text = fs.readFileSync('Files/' + name + '.txt').toString('utf-8');
      found = true;
    }
    else{
      message.channel.send(name + ' not found');
    }

    /* Reads string and calculates average */
    if(found){
      do{
        newLine = text.indexOf('\n', pos);
        if(Number(newLine) != -1) curNum = text.substring(pos, newLine);
        else curNum = '\0';

        if(Number(curNum)){
          if(Number(curNum)<10) digits = 1;
          else if(Number(curNum)<100) digits = 2;
          else digits = 3;

          if(Number(curNum)>500) avg += Number(curNum);
          else avg = avg + 1000 + Number(curNum);
          total += Number(curNum);
          pos = pos+digits+1;

          barGraph[Math.floor(Number(curNum)/100)] += 1;

          num[count] = Number(curNum);
          count++;
        }
      }while(Number(curNum));
      wrappedTotal = ((avg*1.00/count)-1000);
      if(wrappedTotal<0) wrappedTotal += 1000;

      if(message.content.startsWith("!list")){

        /* Sends message */
        message.channel.send('\t' + name + '\t');
        message.channel.send('-----------------------');
        message.channel.send(text);
        message.channel.send('Average (Wrapped Range): ' + wrappedTotal.toFixed(2));
        message.channel.send('Average (Normal): ' + (total*1.00/count).toFixed(2))

        for(var i = 0; i<count; i++){

          num2[i] = num[i] - (total*1.00/count);
          num2[i] = num2[i]*num2[i];

          max = Math.max(num[i], (wrappedTotal));
          min = Math.min(num[i], (wrappedTotal));
          result = Math.min(max - min, 1000 - max + min);

          num[i] = result;
          num[i] = num[i]*num[i];

        }
        for(var j = 0; j<count; j++){
          avg2 = avg2 + num[j];
          secAv = secAv + num2[j];
        }
        avg2 = Math.sqrt(avg2/count);
        secAv = Math.sqrt(secAv/count);

        message.channel.send('Standard Deviation (Wrapped): ' + (avg2*1.00).toFixed(2));
        message.channel.send('Standard Deviation (Normal): ' + (secAv*1.00).toFixed(2));
      }
      else{

        barString[0] = "       ";
        barString[1] = " ";
        barString[2] = "";
        barString[3] = "";
        barString[4] = "";
        barString[5] = "";
        barString[6] = "";
        barString[7] = "";
        barString[8] = "";
        barString[9] = "";

        for(var j = 0; j<10; j++){

          for(var k = 0; k<barGraph[j]; k++){
            barString[j] += "#";
          }

        }
        for(var i = 0; i<10; i++){
          message.channel.send( (100*i) + "-" + ((100*i)+99) + ": " + barString[i]);
        }
      }
      avg2 = 0;
      num = [];
      num2 = [];
      avg = 0;
      curNum = 0;
      pos = 0;
      newLine = 0;
      count = 0;
      total = 0;
      secAv = 0;
      found = false;

    }
  }
  else if(message.content.startsWith("!help")){
    message.channel.send("Type \"!<name> ###\" to store your pitch");
    message.channel.send("Type \"!list <name>\" to view past pitches");
    message.channel.send("Type \"!bar <name>\" to view what ranges are most common")
    message.channel.send("This bot is CASE SENSITIVE so make sure you use the same case each time");

    /*message.channel.send("To extrapolate the data:\n");

    message.channel.send("If you think they are going to pitch above 500, do Avg(Wrapped)+STD(Wrapped")
    message.channel.send("Average(Wrapped Range): Where their average pitch/pitch is\n");
    message.channel.send("Average(Normal): If this is > 500, they generally use high numbers. If it's < 500, they generally use low numbers. The further away from 500, the more often they go to that side\n");
    message.channel.send("Standard Deviation(Normal): How far they normally pitch away from their average. Take Average(Wrapped) +- STD(Normal) to find good range\n");
    message.channel.send("Standard Deviation(Wrapped): Not sure exactly how to use this. Someone lmk if you figure it out\n");

    message.channel.send("EXAMPLE:\nAvg(Wrapped) = 480\nAvg(Normal) = 482\nSTD(Normal) = 245\nSince Avg(Normal) is below 500, 480-245 to get 235\n"); */
  }
  /* Stores pitchs */
  else if(message.content.startsWith("!")){

    /* Finds all values */
    space = message.content.search(" ");
    pitch = message.content.substring(space + 1);
    name = message.content.substring(1,space);

    /* Appends to file and sends confirmation menu */
    fs.appendFile('Files/' + name + '.txt', pitch + '\n', function(err){
      if(err) throw err;
    });
    message.channel.send('Saved ' + pitch + ' for ' + name);
  }
  else if(message.content.includes("Slayers") || message.content.includes("slayers")){
    message.channel.send("FTS!");
  }
  else if(message.content.includes("Blue") || message.content.includes("Llama") || message.content.includes("blue ") || message.content.includes("llama ")){
    message.channel.send(":large_blue_circle: <:llama:519631635482935296> :arrow_right: :snake: :question:");
  }
  else if(message.content.includes("Peppers") || message.content.includes("peppers") || message.content.includes("Pep") || message.content.includes("pep ")){
    message.channel.send(":hot_pepper: is the GOAT");
  }
  else if(message.content.includes("Joe ") || message.content.includes("joe")){
    message.channel.send("<:JoeSux:504491684558798858>");
  }
});
