import express from 'express';
import { Unauthorized } from 'http-errors';
import JsonWebToken from 'jsonwebtoken';

export function middleware() {
    const router = express.Router();

    if (process.env.NODE_ENV === 'development') {
        router.get('/api/dev/login', (req, res) => {
            const { subject, userKey, area } = req.query || {};

            if (!subject || !userKey || !area) throw new Unauthorized();

            const token = JsonWebToken.sign({ userKey }, '...', { subject: `${subject}` });

            // res.cookie = ('TOKEN', token);
            // res.cookie = ('area', area);

            res.send({
                TOKEN: token,
                area: area,
            });
        });
    }

    return router;
}