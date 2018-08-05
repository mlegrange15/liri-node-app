require("dotenv").config();
var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keysINeed = require('./keys.js');

var spotify = new Spotify(keysINeed.spotify);
var client = new Twitter(keysINeed.twitter);
var commandName = process.argv[2];
var userRequest = process.argv.slice(3).join(" ");


// Function that list's of all of the possible commands Liri can accept and based on commandName & userRequest calls the right one.
function liriCommands(commandName, userRequest) {
  switch (commandName) {
    case "spotify-this-song":
      spotifyThisSong(userRequest);
      break;
    // userRequest will need to be any valid twitter handle
    // You can use mine michaeldev7
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
  // If no song is input then do this
  if (!song) {
    song = "The Sign Ace";
  };
  // Spotify call
  spotify.search({ type: 'track', query: song }, function (err, data) {
    if (err) {
      console.log(err);
    }

    var logSong = "\nNew Song:\nThe artist is: " + data.tracks.items[0].artists[0].name +
      "\nThe name of the song is: " + data.tracks.items[0].name +
      "\nHere is a preview link: " + data.tracks.items[0].preview_url +
      "\nThe name of the album is: " + data.tracks.items[0].album.name +
      "\n--------------------------------------\n";

    console.log(logSong);


    fs.appendFile('log.txt', logSong, function (err) {
      if (err) throw err;
    });
  });
};

// TWITTER MY TWEETS FUNCTION
// userRequest or handle will need to be any valid twitter handle
// You can use mine michaeldev7
function myTweets(handle) {

  client = new Twitter(keysINeed.twitter);
  // Twitter call
  var params = { screen_name: handle, count: 20 };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {

      for (i = 0; i < tweets.length; i++) {

        var myTwitter = ("\nTweet:\nDate: " + tweets[i].created_at + "\n --> " + tweets[i].text +
          "\n--------------------------------------\n");

        console.log(myTwitter);


        fs.appendFile('log.txt', myTwitter, function (err) {
          if (err) throw err;
        });
      }
    }
  });
}

// MOVIE FUNCTION
function movie(movie) {

  if (!movie) {
    movie = "Mr Nobody";
  }
  // OMDB call
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function (error, response, body) {

    if (!error && response.statusCode === 200) {

      var data = JSON.parse(body);

      var logMovie = "\nNew Movie:\nTitle: " + data.Title +
        "\nYear: " + data.Year +
        "\nIMDB Rating: " + data.imdbRating +
        // "\nRotten Tomatoes Rating: " + data.Ratings[1].Value +
        "\nCountry: " + data.Country +
        "\nLanguage: " + data.Language +
        "\nPlot: " + data.Plot +
        "\nActors: " + data.Actors +
        "\n--------------------------------------\n";

      console.log(logMovie);


      fs.appendFile('log.txt', logMovie, function (err) {
        if (err) throw err;
      });

    } else {
      console.log(error);
    }
  });
}

// DO SOMETHING RANDOM FUNCTION
function doRandom() {
  // random.txt call
  fs.readFile("random.txt", "utf8", function (error, data) {

    var randomData = data.split(',');

    if (error) {
      console.log(error);

    } else {

      liriCommands(randomData[0], randomData[1]);
    }
  });
}
// Calling function to accept user commands
liriCommands(commandName, userRequest);

