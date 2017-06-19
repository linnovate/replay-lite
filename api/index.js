const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongooseConnect = require('../utils/mongoose-connect');
const api = require('./api');
mongooseConnect();

const port = 80;


app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/search', api.search);
app.get('/api/vtt', api.vtt);
app.post('/api/upload', api.upload);

app.listen(port, () => {
  console.log('listening on *:' + port);
});
