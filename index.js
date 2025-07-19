const express = require('express');
const fs = require('fs').promises
const {join} = require('path')

const app = express();
const port = process.env.PORT || 3000; // Use PORT from environment or default to 3000

async function getDictionaries() {
  // read all files in ./dictionary
  const files = (await fs.readdir('./dictionary'))
    .map(f => join('./dictionary', f))
    .map(f => fs.readFile(f));
  
  return (await Promise.all(files)).map(d => JSON.parse(d.toString()))
}

const dictionaries = []
  
app.use('/', express.static('public'));

app.get('/api/dict/index', (req, res) => {
  res.json(dictionaries.map(d => {
    return {
      name: d.name,
      label: d.label,
    }
  }))
})

app.get('/api/dict/:name', (req, res) => {
  const {name} = req.params
  const dictionary = dictionaries.find(d => d.name === name); // Find the dictionary by name
  if (dictionary) {
    res.json(dictionary.list); // Return the dictionary if found
  } else {
    res.status(404).json({ error: 'Dictionary not found' }); // Return 404 if not found
  }
})

app.listen(port, function () {
  getDictionaries().then(arr => arr.forEach(d => dictionaries.push(d)))
  return console.log(`Listening on port ${port}...`);
});