var Twitter = require("Twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var keys = require("./keys.js");

var twitterKeys = keys.twitterKeys;
var twitter = new Twitter({
	consumer_key: twitterKeys.consumer_key,
	consumer_secret: twitterKeys.consumer_secret,
	access_token_key: twitterKeys.access_token_key,
	access_token_secret: twitterKeys.access_token_secret
});

var spotifyKeys = keys.spotifyKeys;
var spotify = new Spotify({
	id: spotifyKeys.id,
	secret: spotifyKeys.secret
});

var action = process.argv[2];
var value = process.argv.slice(3);

function myTweets(user) {
	if (typeof user === "object") {
		var screenName = user.join("");
	} else {
		var screenName = user;
	};
	// If user does not type in a screen name, default to "chrissyteigen"
	if (!screenName) {
		screenName = "chrissyteigen";
	};
	// console.log(screenName);
	twitter.get("statuses/user_timeline", {screen_name: screenName, count: 20}, function(error, tweets, response) {
		if (!error) {
			outputData("-------------------------------");
			outputData("Twitter Screen Name Search: " + screenName);
			// If screen name exists, but user has no tweet
			if (tweets.length === 0) {
				outputData("-------------------------------");
				outputData("@" + screenName + " hasn't tweeted.");
			} else {
				tweets.forEach(function(tweet) {
					outputData("-------------------------------");
					outputData("Created At: " + tweet.created_at);
					outputData("Tweet: " + tweet.text);
				});
			};
		} else {
			return console.log(error);
		};
	});
};

function spotifyThisSong(song) {
	if (typeof song === "object") {
		var songName = song.join(" ");
	} else {
		var songName = song;
	}
	// If user does not type in a song name, default to "The Sign"
	if (!songName) {
		songName = "The Sign Ace of Base";
	};
	// console.log(songName);
	spotify.search({type: "track", query: songName}, function(error, data) {
		if (!error) {
			outputData("-------------------------------");
			outputData("Spotify Song Search: " + songName);
			var songs = data.tracks.items;
			// If there are no search results for the song
			if (songs.length === 0) {
				outputData("-------------------------------");
				outputData("No results found for " + songName + ".");
			} else {
				songs.forEach(function(song) {
					// For the case where there may be more than one artist
					var artists = [];
					song.artists.forEach(function(artist) {
						artists.push(artist.name);
					});
					outputData("-------------------------------");
					outputData("Artist(s): " + artists.join(", "));
					outputData("Song: " + song.name);
					outputData("Album: " + song.album.name);
					// If there is no preview available for the song
					if (!song.preview_url) {
						outputData("Preview: N/A");
					} else {
						outputData("Preview: " + song.preview_url);
					};
				});
			};
		} else {
			return console.log(error);
		};
	});
};   

function movieThis(movie) {
	var movieName = movie;
	var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece"; 
	if (typeof movie === "object") {
		movieName = movie.join(" ");
		queryURL = "http://www.omdbapi.com/?t=" + movie.join("+") + "&y=&plot=short&apikey=40e9cece"; 
	};
	// If user does not type in a movie name, default to "Mr. Nobody"
	if (!movieName) {
		movieName = "Mr. Nobody";
		queryURL = "http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=40e9cece";
	};
	// console.log(queryURL);
	request(queryURL, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var data = JSON.parse(body);
			outputData("-------------------------------");
			outputData("Movie Title Search: " + movieName);
			// If there are no search results for the movie
			if (data.Response === "False") {
				outputData("-------------------------------");
				outputData(data.Error);
			} else {
				outputData("-------------------------------");
				outputData("Title: " + data.Title);
				outputData("Year: " + data.Year);
				outputData("IMDB Rating: " + data.imdbRating);
				// If Rotten Tomates rating does not exist (i.e. Spiderman)
				if (!data.Ratings[1]) {
					outputData("Rotten Tomatoes Rating: N/A");
				} else {
					outputData("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
				};
				outputData("Country: " + data.Country);
				outputData("Language: " + data.Language);
				outputData("Plot: " + data.Plot);
				outputData("Actors: " + data.Actors);
			};
		} else {
			return console.log(error);
		};
	});
};

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (!error) {
			// In case there are multiple commands in random.txt file. If so, split each line by the line break
			var splitLines = data.split("\n");
			// For each line in random.txt file, split the line into two parts containing the action and the value
			splitLines.forEach(function(line) {
				// If there is something on the line
				if (line) {
					var splitData = line.split(", ");
					var action = splitData[0];
					// To get rid of the extra quotations (i.e. "'taylorswift13'")
					var value = splitData[1].substring(1, splitData[1].length - 1);
					switch (action) {
						case "my-tweets":
							myTweets(value);
							break;
						case "spotify-this-song":
							spotifyThisSong(value);
							break;
						case "movie-this":
							movieThis(value);
							break;
						default: 
							console.log("Sorry, " + action + " is not a valid command.");
					};
				};
			});
		} else {
			return console.log(error);
		};
	});
};

function outputData(content) {
	// Console log to user
	console.log(content);
	// Append each data as a new line in log.txt
	fs.appendFile("log.txt", content + "\n", function(error) {
		if (error) {
			return console.log(error);
		};
	});
};

switch (action) {
	case "my-tweets":
		myTweets(value);
		break;
	case "spotify-this-song":
		spotifyThisSong(value);
		break;
	case "movie-this":
		movieThis(value);
		break;
	case "do-what-it-says":
		doWhatItSays();
		break;
	default:
		console.log("Sorry, " + action + " is not a valid command.");
};

