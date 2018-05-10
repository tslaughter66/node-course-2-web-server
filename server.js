// Require
const express = require('express');
const hbs     = require('hbs');
const fs      = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');

// Middleware to create a log file with the timestamp, request method, and request url.
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log');
    }
  })
  next();
});

// Middleware for "Maintenance Mode".
// Since we do not call "next()", the app just waits.
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// Middleware to load the folder of static resources.
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase()
});

app.get('/', (req,res) => {
  res.render('home.hbs',{
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to the page.'
  });
});

app.get('/about',(req,res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad',(req,res) => {
  res.send({
    errorMessage: 'Error processing the request.'
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
