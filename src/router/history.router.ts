import { Router } from 'express';
import { Logs } from '../controller/history.controller'; 

const router = Router();

router.get('/', Logs); 

export default router;
