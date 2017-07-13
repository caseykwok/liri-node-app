# liri-node-app

### Overview

LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data. LIRI can take in one of the following commands:

   * `my-tweets`

   * `spotify-this-song`

   * `movie-this`

   * `do-what-it-says`

### What Each Command Does

1. `node liri.js my-tweets '<user name here>'`

   * This will show the last 20 tweets of the user in your terminal/bash window.

   * If no song is provided, then the program will default to the user "chrissyteigen".

2. `node liri.js spotify-this-song '<song name here>'`

   * This will show the following information about the song in your terminal/bash window:

     ```
        * Artist(s)
        * The song's name
        * A preview link of the song from Spotify
        * The album that the song is from
     ```
   * If no song is provided, then the program will default to the song "The Sign" by Ace of Base.
   
3. `node liri.js movie-this '<movie name here>'`

   * This will show the following information about the movie in your terminal/bash window:

     ```
       * Title of the movie.
       * Year the movie came out.
       * IMDB Rating of the movie.
       * Rotten Tomatoes Rating of the movie.
       * Country where the movie was produced.
       * Language of the movie.
       * Plot of the movie.
       * Actors in the movie.
     ```

   * If no movie is provided, then the program will default to the movie "Mr. Nobody".

4. `node liri.js do-what-it-says`
   
   * LIRI will take each line of text inside of random.txt and then use it to call one of LIRI's commands.



