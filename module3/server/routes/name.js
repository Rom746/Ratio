const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const data = req.body;

        const user = await db.collection('Record').findOne({ username: data.username });
        const result = user ? true : false;

        res.send(result);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
