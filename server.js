const express = require('express');
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const app = express();
app.use(bodyParser.json())
app.use(cors());
const Knex = require('Knex');
const nodemon = require('nodemon');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/handleProfileGet')


const db = Knex({
    client: 'pg',
    connection: {
    host : '127.0.0.1',
    user : 'issoufzabre',
    password : '',
    database : 'first-sql'
    }
  });

app.get('/', (req, res) => {
    res.send(database.users)
})


app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) =>{register.handleRegister(req, res, db, bcrypt)});


app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db, bcrypt)})


app.put('/image', (req, res) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
       res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
})



app.listen(3000, () => {
    console.log(`app is running on port ${port}`)
})


/*
/--> res = this is working
/sugnin --> post = success/fail
/reguster --> post = user
profile/:userId --> Get = user
/image --> Put --> user
*/