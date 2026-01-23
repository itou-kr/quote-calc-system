import { Router } from 'express';
import { calcTestApplicationExpress } from '../apis/calcApi/calcTestApplicationExpress';
import { exportApplicationExpress } from '../apis/exportApi/exportApplicationExpress';
import { importApplicationExpress } from '../apis/importApi/importApplicationExpress';
import { apiTESTTestGet } from '../apis/testApi/apiTESTTestGet';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
});


const router = Router();

// GET /TEST/ping
router.get('/ping', apiTESTTestGet);

// POST /TEST/calc
router.post('/calc', calcTestApplicationExpress);

// POST /TEST/calc
router.post('/export', exportApplicationExpress);

//POST /TEST/import
router.post(
  '/import',
  upload.single('file'),   // ← これが無いと req.file は undefined
  importApplicationExpress
);
export default router;
