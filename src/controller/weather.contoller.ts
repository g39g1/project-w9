import { Request, Response } from 'express';
import Weather from '../model/weather.model';  
import History from '../model/History.model';
import fetchWeather from '../utils/weather'; 

export const getWeather = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId; 
    const { lat, lon } = req.query;

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    const roundedLat = Math.round(latitude);
    const roundedLon = Math.round(longitude) ;

    let weather = await Weather.findOne({ lat: roundedLat, lon: roundedLon });

    if (!weather) {
      const weatherData = await fetchWeather(latitude, longitude);

      weather = await Weather.create({
        lat: roundedLat,
        lon: roundedLon,
        data: weatherData,  
      });
    }

    if (!weather || !weather.data) {
       res.status(500).json({ error: 'Weather data not found' });
       return
    }

    await History.create({
      user: userId,
      weather: weather._id,
      lat: latitude,
      lon: longitude,
    });

    res.status(200).json({ source: weather ? 'cache' : 'openweather', weather: weather.data });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to get weather data', details: err.message });
  }
};
