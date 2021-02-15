const express = require('express');
const port = 3000;
const bodyParser = require('body-parser');
let cors = require('cors');
const bcrypt = require('bcrypt-nodejs')

const app = express();
app.use(bodyParser.json())
app.use(cors());










const database = {
    users: [
        {
            id: '123',
            name: 'Raye',
            email: 'raye@gmail.com',
            password: 'raye',
            entries: 0,
            joined: new Date()
        },

        {
            id: '124',
            name: 'Grady',
            email: 'grady@gmail.com',
            password: 'grady',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
})


app.post('/signin', (req, res) => {
    bcrypt.compare("grady", '$2a$10$YhQSLOYFECzPRepFO/5j7O.ESEQxNstE/NR2NjidVZX0sxq/UCGNm', function(err, res) {
        console.log('first guest', res)
    });
    bcrypt.compare("veggies", '$2a$10$YhQSLOYFECzPRepFO/5j7O.ESEQxNstE/NR2NjidVZX0sxq/UCGNm', function(err, res) {
        console.log('second guest', res)
    });

    if(req.body.email === database.users[0].email &&
         req.body.password === database.users[0].password) {
            res.json("succes") 
        } else {
            res.status(400).json('it didnt work')
        }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    database.users.push({
        id: '123',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()

    })
    res.json(database.users[database.users.length-1])
});


app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user);
        }  
    })
    if(!found) {
        res.status(400).json('Not found')

    }
})


app.post('/image', (req, res) => {
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }  
    })
    if(!found) {
        res.status(400).json('User Not found')

    }
})




app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// app.listen(${port}, () => {
//     console.log(`app is running on port ${port}`)
// })


/*
/--> res = this is working
/sugnin --> post = success/fail
/reguster --> post = user
profile/:userId --> Get = user
/image --> Put --> user
*/