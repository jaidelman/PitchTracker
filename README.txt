  This is a program that runs a discord bot to track pitches/swings in an online fake
baseball game. A pitcher submits a number between 1-1000, and the batter must guess as
close as possible. The 1-1000 range is wrapped, meaning 1 is one number away from 1000
and 950 is 100 away from 50. Most pitchers will fall into a pattern with their
pitches, so this program allows batter to look at the pitches to analyze the patterns to
predict the next pitch.

  The program calculates the average pitch on a 1-1000 range and also on the wrapped range.
It also calculates the standard deviation for both. The program will also count where the
pitch falls (between 0-99, 100-199, etc...) to print out a histogram to see if a
pitcher avoids/prefers certain areas. The user can choose to add a pitch to a list,
print the list of pitches, or to print a histogram on the discord server.

  The program works when a user inputs a number and a pitcher name, which will create a file
with that pitchers name to store all of their pitches. After more than one pitch has been entered,
the bot can be prompted to read all the pitches from the file and print it's findings.
