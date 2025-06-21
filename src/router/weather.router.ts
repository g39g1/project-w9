
import { Router } from 'express';
import { getWeather } from '../controller/weather.contoller'; 

const router = Router();

router.get('/weather', getWeather);

export default router;
