const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const recordRouter = require('./routes/record');
const nameRouter = require('./routes/name');

const app = express();
const mongoClient = new MongoClient("mongodb://localhost:27017/");

app.use(cors());
app.use(express.json());
app.use('/api/v1/record/', recordRouter);
app.use('/api/v1/name/', nameRouter);

const port = 3040;

mongoClient.connect((err, client) => {
    try {
        dbClient = client;
        app.locals.db = client.db('RatioM3');
        app.listen(port, () => {
            console.log(`Listening on http://localhost:${port}`);
        });
    } catch (error) {
        console.error(error)
    }
    if (err) return;

});

process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});