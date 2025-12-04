import { Router } from 'express';
import { calcTestApplication } from '../apis/calcApi/calcTestApplication';
import { apiTESTTestGet } from '../apis/testApi/apiTESTTestGet';

const router = Router();

// GET /TEST/ping
router.get('/ping', apiTESTTestGet);

// POST /TEST/calc
router.post('/ping', calcTestApplication);

export default router;
