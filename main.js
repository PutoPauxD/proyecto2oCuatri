const express = require('express')
const app = express()
const port = 3000
// const getDataAndCSV = require('./index.js');

app.get('/', (req, res) => {
  // getDataAndCSV();
  res.sendFile('views/index.html', {root: __dirname})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
