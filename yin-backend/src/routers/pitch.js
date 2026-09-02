const express = require('express');
const { VALID_AUDIO_TYPES, extractPitchFromBuffer } = require('../services/pitch');

const router = new express.Router();

router.post('/api/pitch/extract/', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            res.status(400).send('Missing file upload in form field "file".');
            return;
        }

        const incomingFile = req.files.file;
        const contentType = incomingFile.mimetype;
        if (contentType && !VALID_AUDIO_TYPES.has(contentType)) {
            res.status(415).send(`Invalid filetype ${contentType}, must be .wav`);
            return;
        }

        const csv = await extractPitchFromBuffer(incomingFile.data);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.send(csv);
    } catch (error) {
        console.error('Pitch extraction failed:', error);
        res.status(500).send('Pitch extraction failed');
    }
});

module.exports = router;
