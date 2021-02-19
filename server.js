

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


app.post('/signin', (req, res) => {
    
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
       const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
       if(isValid) {
           return db.select('*').from('users')
           .where('email', '=', req.body.email)
           .then(user => {
               res.json(user[0])
           })
           .catch(err => res.status(400).json('unable to get user'))
       } else {
           res.status(400).json('wrong credentials')
       }
    })
    .catch(err => res.status(400).json('Wrong credentials'))
})


app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })    
        .catch(err => res.status(400).json('unable to register'));
});


app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if(user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('Not found')
        }
    })
    .catch(err => res.status(400).json('error getting user'))
})


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


app.listen(
    process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`)
})


// app.listen(3000, () => {
//     console.log(`app is running on port ${port}`)
// })


/*
/--> res = this is working
/sugnin --> post = success/fail
/reguster --> post = user
profile/:userId --> Get = user
/image --> Put --> user
*/