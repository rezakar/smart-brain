const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

app.use(cors());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 
const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});
db.select('*').from('users').then(data => {
  console.log(data);
});


app.use(bodyParser.json());

app.get('/', (req, res) => {res.send('it is working!')})

// signin
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

//register a user and if is douplicate send error message and hash the password
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

// it find a profile from database and if not send error
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)})

// updates the entries and it increases the count.
app.put('/image', (req, res) => {image.handleImage(req, res, db)})

// end point for clarifai
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
    console.log(`App runnig ${process.env.PORT}`);
})

