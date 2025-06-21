import { Router } from 'express';
import { Logs } from '../controller/history.controller'; 


const router = Router();

router.get('/history', Logs);

export default router;