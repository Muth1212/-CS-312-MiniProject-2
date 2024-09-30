require('dotenv').config(); 
const express = require('express');
const app = express();
const homeRoute = require('./routes/home');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
