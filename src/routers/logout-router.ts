import express from "express";
import path from "node:path";

const router = express.Router();

router.get('/', (req, res) => {
    const expired = req.query.expired === 'true';
    res.cookie('sessionId', '', { expires: new Date(0) });
    expired ? res.sendFile(path.join(__dirname, '..', 'templates', 'session-expired.html')) : res.sendFile(path.join(__dirname, '..', 'templates', 'logout.html'))
});

export default router;