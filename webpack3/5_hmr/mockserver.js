const express = require('express');
const app = express();

app.get('/a', function (req, res) {
  res.send('aaaaaaaaaa');
});
app.get('/b', function (req, res) {
  res.send('bbbbbbbbbb');
});
app.get('*', function (req, res) {
  res.send('ok');
});
app.listen(5001, function () {
  console.log(`mock server listening on port 5001`);
});