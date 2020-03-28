const express = require('express');
const cors = require('cors');

const app = express();

let files = [];

app.use(express.json());
app.use(cors());

app.post('/add_image', (req, res) => {
    files.push({
        ...req.body,
        score: Math.random()
    });
    console.log('numImages: ' + files.length, '\n-----------------');
    // console.log(files);
    res.json('Ok');
})

app.post('/delete_image', (req, res) => {
    files = files.filter(file => file.id !== req.body.id);
    console.log('numImages: ' + files.length, '\n-----------------');
    res.json('Ok');
})

app.get('/rank_images', (req, res) => {
    console.log('ranking images', '\n-----------------');
    res.json({
        scores: files.map(file => {
            return{
                id: file.id, 
                score: file.score
            }
        })
    });
})

app.listen(5000, () => {
    console.log('We Live Baybee');
})