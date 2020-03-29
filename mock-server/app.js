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

    setTimeout(() => {
        const response = {
            scores: files.map(file => {
                return{
                    id: file.id, 
                    score: file.score
                }
            })
        }
        console.log(response);
        res.json(response);
    }, 500);
    
})

app.post('/rank_hashtags', (req, res) => {
    console.log('retrieving hashtags', '\n-----------------');

    setTimeout(() => {
        res.json({
            engagement: Math.floor(Math.random() * 1000),
            hashtags: [
                {thicc: Math.random()},
                {chunk: Math.random()},
                {yeetthethiccboy: Math.random()},
                {lolol: Math.random()},
                {thiccthethiccman: Math.random()},
                {yeetthebigboojie: Math.random()},
                {chunkytime: Math.random()},
                {bigandthiccchunk: Math.random()},
            ].sort((a, b) => b - a)
        });
    }, 500);
    
})

app.listen(5000, () => {
    console.log('We Live Baybee');
})