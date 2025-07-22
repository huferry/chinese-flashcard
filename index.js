const express = require('express');
const fs = require('fs').promises
const {join} = require('path')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

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

app.use(async (req, res, next) => {
  const filePath = getFilePath(req)
  try {
    await fs.access(filePath);
    if (filePath.endsWith('.html')) {
      const content = await fs.readFile(filePath, 'utf-8');
      res.setHeader('Content-Type', 'text/html');
      res.send(processHtmlContent(content));
    } else {
      res.sendFile(filePath);
    }
  } catch (err) {
    next();
  }
});

function getFilePath(req) {
  return req.path === '/' ? path.join(__dirname, 'public', 'index.html') : path.join(__dirname, 'public', req.path);
}

function processHtmlContent(html) {
  const match = html.match(/\{{2}ENV:([A-Z|_]+)\}{2}/)
  if (match) {
    const value = process.env[match[1]]
    return html.replace(match[0], value)
  } 
  return html
}

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