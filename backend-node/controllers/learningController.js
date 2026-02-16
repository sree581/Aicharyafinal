const express = require('express');
const router = express.Router();

router.get('/progress', (req, res) => {
    res.send("Learning progress endpoint working fine!");
});

module.exports = router;
