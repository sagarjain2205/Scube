const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

let closingTime = 30; // seconds until the metro gate closes
let compartments = [75, 85, 50]; // Initial values for compartments A, B, and C

app.get('/metro-info', (req, res) => {
  if (closingTime > 0) {
    closingTime--;
  } else {
    closingTime = 30;
    compartments = [75, 85, 50];
  }

  compartments = compartments.map((people, index) => {
    let change = Math.floor(Math.random() * 5) - 2;

    if (index === 0 || index === 1) {
      people = Math.max(70, Math.min(people + change, 100));
    } else if (index === 2) {
      people = Math.min(people + change, 50);
    }
    
    return people;
  });

  compartments = compartments.map((people) => Math.max(0, people));

  res.json({
    closingTime,
    compartments,
  });
});

app.listen(port, () => {
  console.log("Server running on port ${port}");
});
