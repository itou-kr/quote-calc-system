import { Router } from 'express';
import { calcTestApplicationExpress } from '../apis/calcApi/calcTestApplicationExpress';
import { exportTestApplicationExpress } from '../apis/exportTestApi/exportTestApplicationExpress';
import { apiTESTTestGet } from '../apis/testApi/apiTESTTestGet';


const router = Router();

// GET /TEST/ping
router.get('/ping', apiTESTTestGet);

// POST /TEST/calc
router.post('/calc', calcTestApplicationExpress);

// POST /TEST/calc
router.post('/exportTest', exportTestApplicationExpress);

export default router;
