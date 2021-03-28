const clarifai = require('clarifai');
const { handleProfileGet } = require('./profile');

const app = new clarifai.App ({
    apiKey: '8b5edfe3537c4a61acb3164a3ab24492'
  });

const handleApicall = (req, res) => {
    app.models
    .predict(clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}


const handleImage = (req, res, db) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
       res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApicall,
 }