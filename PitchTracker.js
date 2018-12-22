/*  PitchTracker.js
    Josh Aidelman
    Last updated December 22 */


//For using the discord client
const Discord = require("discord.js");
const client = new Discord.Client();

var fs = require('fs'); //For files

var space = 0; //Stores where the " " is in a string
var pitch = 0; //Stores the current pitch
var wrappedTotal = 0 ; //This stores the total to calculate average in a wrapped context
var wrappedAvg = 0; //This stores the wrapped average
var total = 0; //Stores the total of the pitches to help calculate average
var curNum = 0; //Stores the pitch on the line we are reading
var pos = 0; //To hold current position in the file
var newLine; //To store where the '\n' occurs in a line
var count = 0; //Stores # of pitches in file
var digits; //Stores the number of digits in a pitch
var found = false; //Stores if the file has been found or not
var listOfPitches = []; //This array holds the pitches in the file
var listOfPitches2 = []; //This array holds the pithces in a wrapped context
var standardDeviation = 0; //This stores the standard deviation
var standardDeviationWrapped = 0; //This stores the standard deviation wrapped (1 is next to 1000)
var name; //Stores the name of the player in the requested file
var max; //To store the max in a comparison
var min; //To store the min in a comparison
var result; //Stores the correct pitch for calcluation purposes
var barGraph = [10]; //To store the count of pitches in the range of 0-99, 100-199...
var barString = [10]; //To print a * for each pitch in each range

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {

  // Prints your list
  if(message.content.startsWith("!list") || message.content.startsWith("!bar")){

    // Finds all values
    space = message.content.search(" ");
    name = message.content.substring(space + 1);

    //Resets bar graph values
    for(var j = 0; j<10; j++){
      barGraph[j] = 0;
    }

    //Looks for file
    if (fs.existsSync('Files/' + name + '.txt')) {
      var text = fs.readFileSync('Files/' + name + '.txt').toString('utf-8');
      found = true;
    }
    //If file is not found
    else{
      message.channel.send(name + ' not found');
    }

    //Reads string and calculates average
    if(found){
      do{
        newLine = text.indexOf('\n', pos); //Get newline position
        if(Number(newLine) != -1) curNum = text.substring(pos, newLine); //Get current number
        else curNum = '\0'; //If end of file, no number

        //If curNum is a number
        if(Number(curNum)){

          //Depending on how many digits in the number, set accordingly
          if(Number(curNum)<10) digits = 1;
          else if(Number(curNum)<100) digits = 2;
          else if(Number(curNum)<1000) digits = 3;
          else digits = 4;

          if(Number(curNum)>500) wrappedTotal += Number(curNum); //If over 500, add to average
          else wrappedTotal = wrappedTotal + 1000 + Number(curNum); //Else add 1000 for wrapped purposes
          total += Number(curNum); //Increase total
          pos = pos+digits+1; //Move file position # of digits plus the new line

          //If number isn't 1000
          if(digits<4){
            barGraph[Math.floor(Number(curNum)/100)] += 1; //Increment barGraph
          }
          else barGraph[9] += 1; //Else increment barGraph[9]

          listOfPitches[count] = Number(curNum); //Store pitch
          count++; //Increase count
        }
      }while(Number(curNum)); //Do until end of file

      //Calculates wrapped total
      wrappedAvg = ((wrappedTotal*1.00/count)-1000);
      if(wrappedAvg<0) wrappedAvg += 1000; //If negative, add 1000 to get correct avg

      //If the user wants a list
      if(message.content.startsWith("!list")){

        //To calculate standard deviation
        for(var i = 0; i<count; i++){

          //Uses second list to store info
          listOfPitches2[i] = listOfPitches[i] - (total*1.00/count);
          listOfPitches2[i] = listOfPitches2[i]*listOfPitches2[i];

          max = Math.max(listOfPitches[i], (wrappedAvg)); //Calculate max of pitch and wrappedAvg
          min = Math.min(listOfPitches[i], (wrappedAvg)); //Calculate min of pitch and wrappedAvg
          result = Math.min(max - min, 1000 - max + min); //Calculates difference between avg and pitch

          listOfPitches[i] = result; //Stores distance in list
          listOfPitches[i] = listOfPitches[i]*listOfPitches[i];

        }

        //Gets standard deviation and standard deviation wrapped
        for(var j = 0; j<count; j++){
          standardDeviationWrapped += listOfPitches[j];
          standardDeviation = standardDeviation + listOfPitches2[j];
        }
        standardDeviationWrapped = Math.sqrt(standardDeviationWrapped/count);
        standardDeviation = Math.sqrt(standardDeviation/count);

        //Sends message with averages and standard deviations
        message.channel.send('\t' + name + '\t');
        message.channel.send('-----------------------');
        message.channel.send(text);
        message.channel.send('Average (Wrapped Range): ' + wrappedAvg.toFixed(2));
        message.channel.send('Average (Normal): ' + (total*1.00/count).toFixed(2));
        message.channel.send('Standard Deviation (Wrapped): ' + (standardDeviationWrapped*1.00).toFixed(2));
        message.channel.send('Standard Deviation (Normal): ' + (standardDeviation*1.00).toFixed(2));
      }

      //Otherwise they must be asking for the bar
      else{

        //To line up the histograph
        barString[0] = "       "; //Extra spaces to make graph even
        barString[1] = " ";
        barString[2] = "";
        barString[3] = "";
        barString[4] = "";
        barString[5] = "";
        barString[6] = "";
        barString[7] = "";
        barString[8] = "";
        barString[9] = "";

        //For every pitch in a range, add a # to the barString for the histograph
        for(var j = 0; j<10; j++){

          for(var k = 0; k<barGraph[j]; k++){
            barString[j] += "#";
          }

        }

        //Send the graph
        for(var i = 0; i<9; i++){
          message.channel.send( (100*i) + "-" + ((100*i)+99) + ": " + barString[i]);
        }
        message.channel.send("900-1000 : " + barString[9]); //For case 900-1000
      }

      //Reset variables
      standardDeviationWrapped = 0;
      listOfPitches = [];
      listOfPitches2 = [];
      wrappedTotal = 0;
      curNum = 0;
      pos = 0;
      newLine = 0;
      count = 0;
      total = 0;
      standardDeviation = 0;
      found = false;

    }
  }
  //If the user asks for help
  else if(message.content.startsWith("!help")){
    message.channel.send("Type \"!<name> ###\" to store your pitch");
    message.channel.send("Type \"!list <name>\" to view past pitches");
    message.channel.send("Type \"!bar <name>\" to view what ranges are most common")
    message.channel.send("This bot is CASE SENSITIVE so make sure you use the same case each time");
  }

  //Otherwise the want to add a pitch
  else if(message.content.startsWith("!")){

    //Finds info from message
    space = message.content.search(" ");
    pitch = message.content.substring(space + 1);
    name = message.content.substring(1,space);

    //Appends to file and sends confirmation message
    fs.appendFile('Files/' + name + '.txt', pitch + '\n', function(err){
      if(err) throw err;
    });
    message.channel.send('Saved ' + pitch + ' for ' + name);
  }

  //Easter eggs that scan every message for the bot to respond
  else if(message.content.includes("Slayers") || message.content.includes("slayers")){
    message.channel.send("FTS!");
  }
  else if(message.content.includes("Peppers") || message.content.includes("peppers") || message.content.includes("Pep") || message.content.includes("pep ")){
    message.channel.send(":hot_pepper: is the GOAT");
  }
  else if(message.content.includes("Joe ") || message.content.includes("joe")){
    message.channel.send("<:JoeSux:504491684558798858>");
  }
});
