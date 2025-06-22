import { Request, Response } from "express";
import Weather from '../model/weather.model';
import History from '../model/History.model';
import { verifyToken } from '../utils/verifyToken';
import axios from 'axios';

export const getWeather = async (req: Request, res: Response): Promise<void> => {
    const { lon, lat } = req.query;
    console.log(lon, lat);
    console.log(req.headers.authorization);

    if (!lon || !lat) {
         res.status(400).json({
            success: false,
            error: {
                message: 'Longitude and Latitude are required'
            }
        });
        return
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
         res.status(401).json({
            success: false,
            error: {
                message: 'Unauthorized: No token provided'
            }
        });
        return
    }

    const verify = verifyToken(token);
    console.log(verify,'verify');
    
    if (!verify) {
         res.status(401).json({
            success: false,
            error: {
                message: 'Unauthorized: Invalid or expired token'
            }
        });
        return
    }

    try {
        const weatherExist = await Weather.findOne({ lon, lat });

        if (weatherExist) {
            const newHistory = new History({
              lat:lat,
              lon:lon,
                user: verify.userId,
                weather: weatherExist._id
            });
            await newHistory.save();

             res.status(200).json({
                success: true,
                source: "cache",
                data: weatherExist
            });
            return
        }

        const getFromEApi = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`);
        const weatherData = getFromEApi.data;

        if (!weatherData) {
             res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch weather data from OpenWeatherMap'
                }
            });
            return
        }

        const newWeather = new Weather({
            lat: weatherData.coord.lat,
            lon: weatherData.coord.lon,
            data: {
                coordinates: weatherData.coord,
                tempC: Number((weatherData.main.temp - 272.15).toFixed(2)),  
                humidity: weatherData.main.humidity,
                description: weatherData.weather[0].description,
            },
            fetchedAt:Date.now()
        });

        await newWeather.save();

        const newHistory = new History({
            user: verify.userId,
            weather: newWeather._id
        });
        await newHistory.save();

        res.status(200).json({
            success: true,
            source: "openweather",
            data: newWeather
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: {
                message: `Error in Get Weather: ${error.message}`
            }
        });
    }
};
