require("dotenv").config();
var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keysINeed = require('./keys.js');

var spotify = new Spotify(keysINeed.spotify);
var client = new Twitter(keysINeed.twitter);
var commandName = process.argv[2];
var userRequest = process.argv[3];


// Function that list's of all of the possible commands Liri can accept and based on commandName & userRequest calls the right one.
function liriCommands(commandName, userRequest) {
  switch (commandName) {
    case "spotify-this-song":
      spotifyThisSong(userRequest);
      break;

    case "my-tweets":
      myTweets(userRequest);
      break;

    case "movie-this":
      movie(userRequest);
      break;

    case "do-what-it-says":
      doRandom();
      break;

    default:
      console.log("Please enter valid command");
  }
}

// SPOTIFY FUNCTION
function spotifyThisSong(song) {
  spotify = new Spotify(keysINeed.spotify);

  spotify.search({ type: 'track', query: song }, function (err, data) {
    if (err) {
      console.log(err);
    }
    console.log("The artist is: " + data.tracks.items[0].artists[0].name + "\nThe name of the song is: " + data.tracks.items[0].name + "\nHere is a preview link: " + data.tracks.items[0].preview_url + "\nThe name of the album is: " + data.tracks.items[0].album.name);

    var logSong = "The artist is: " + data.tracks.items[0].artists[0].name + "\nThe name of the song is: " + data.tracks.items[0].name + "\nHere is a preview link: " + data.tracks.items[0].preview_url + "\nThe name of the album is: " + data.tracks.items[0].album.name;

    fs.appendFile('log.txt', logSong, function (err) {
      if (err) throw err;
    });

    log(data);
  });

  if (!song) {
    song = "The Sign";
  };
};


// TWITTER MY TWEETS FUNCTION
function myTweets(handle) {

  client = new Twitter(keysINeed.twitter);

  var params = { screen_name: handle, count: 20 };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {

      for (i = 0; i < tweets.length; i++) {

        console.log("Date: " + tweets[i].created_at + "\n --> " + tweets[i].text);
      }
    }
  });
}

// MOVIE FUNCTION
function movie(movie) {

  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  if (!movie) {
    movie = "Mr Nobody";
  }

  request(queryUrl, function (error, response, body) {

    if (!error && response.statusCode === 200) {

      console.log(JSON.parse(body));
      console.log("Title: " + JSON.parse(body).Title +
        "\nYear: " + JSON.parse(body).Year +
        "\nIMDB Rating: " + JSON.parse(body).imdbRating +
        "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value +
        "\nCountry: " + JSON.parse(body).Country +
        "\nLanguage: " + JSON.parse(body).Language +
        "\nPlot: " + JSON.parse(body).Plot +
        "\nActors: " + JSON.parse(body).Actors);
    } else {
      console.log(error);
    }
  });
}

// DO SOMETHING RANDOM FUNCTION
function doRandom() {

  fs.readFile("random.txt", "utf8", function (error, data) {

    var randomData = data.split(',');

    if (error) {
      console.log(error);

    } else {
      console.log(data);
      console.log(randomData);

      liriCommands(randomData[0], randomData[1]);
    }
  });
}


// Calling function to accept user commands
liriCommands(commandName, userRequest);

// Sends the data we get back from our commands to the log.txt file
function log(data) {
  fs.appendFile("log.txt", data, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("Sent");
  });
}


