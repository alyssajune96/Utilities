const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Set up readline for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Utility to parse timestamps and compare
function calcDateRange(timestamp, start, end) {
  const time = new Date(timestamp);
  return time > new Date(start) && time < new Date(end);
}

// Paths and criteria
const filePath = '<insert filepath to JSON file here>'; // You can request a download of your data from Spotify via Privacy settings
const startDate = '2024-01-01T00:00:00Z'; // Default values, change at your leisure
const endDate = '2024-11-15T23:59:59Z';    

// Prompt user for artist name
rl.question('Enter the artist name to search for: ', (artistName) => {
    if (!artistName) {
        console.log('Artist name cannot be empty!');
        rl.close();
        return;
    }

    // Read and process the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            rl.close();
            return;
        }

        try {
          const spotifyData = JSON.parse(data);
          
          // Calculate total milliseconds played for matching artist
          const totalMsPlayed = spotifyData
              .filter(entry => calcDateRange(entry.ts, startDate, endDate) && entry.master_metadata_album_artist_name === artistName)
              .reduce((total, entry) => total + (entry.ms_played || 0), 0);

          // Convert milliseconds to minutes
          const totalMinutes = (totalMsPlayed / 60000).toFixed(2);
          
          console.log(`Total minutes played for ${artistName}: ${totalMinutes} minutes`);
      } catch (parseErr) {
          console.error('Error parsing JSON:', parseErr);
      } finally {
          rl.close();
      }
    });
});
