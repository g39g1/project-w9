import { Router } from 'express';
import { getWeather } from '../controller/weather.contoller'; 

const router = Router();

router.get('/', getWeather);

export default router;
