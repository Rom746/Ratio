const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const record = await db.collection('Record').find({})
            .sort({ time: 1 }).limit(10).toArray();
        res.send(record);
    } catch (error) {
        console.error(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const data = req.body;

        let record = await db.collection('Record').findOne({ username: data.username });

        if (!record) {
            await db.collection('Record').insertOne(data);
        } else if (record.time > data.time) {
            db.collection('Record').updateOne({ username: data.username }, { $set: { time: data.time } })
        }

        res.send('');
    } catch (error) {
        console.error(error);
    }
});

router.get('/infinity', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const record = await db.collection('Record_infinity').find({})
            .sort({ score: 1 }).limit(10).toArray();
        res.send(record);
    } catch (error) {
        console.error(error);
    }
});

router.post('/infinity', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const data = req.body;

        let record = await db.collection('Record_infinity').findOne({ username: data.username });

        if (!record) {
            await db.collection('Record_infinity').insertOne(data);
        } else if (record.score > data.score ||
            (record.score == data.score && record.time > data.time)) {
            db.collection('Record_infinity').updateOne({ username: data.username },
                { $set: { time: data.time, score: data.score } });
        }

        res.send('');
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
