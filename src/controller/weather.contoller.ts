import { Request, Response } from "express";
import { getWeatherData } from "../services/weather.service";  

export const getWeather = async (req: Request, res: Response): Promise<void> => {
    let { lon, lat } = req.query;

    if (typeof lon !== "string" || typeof lat !== "string") {
          res.status(400).json({
            success: false,
            error: { message: 'Longitude and Latitude must be valid strings' }
        });
        return
    }

   
    if ((lon) || (lat)) {
          res.status(400).json({
            success: false,
            error: { message: 'Longitude and Latitude must be valid numbers' }
        });
        return
    }

    if (!lon || !lat) {
          res.status(400).json({
            success: false,
            error: { message: 'Longitude and Latitude are required' }
        });
        return
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
         res.status(401).json({
            success: false,
            error: { message: 'Unauthorized: No token provided' }
        });
        return
    }

    try {
        const weatherData = await getWeatherData(token, lon, lat);

        if (weatherData.error) {
              res.status(weatherData.statusCode).json({
                success: false,
                error: { message: weatherData.error }
            });
            return
        }

          res.status(200).json({
            success: true,
            source: weatherData.source,
            data: weatherData.data
        });
        return
    } catch (error: any) {
         res.status(500).json({
            success: false,
            error: { message: `Error in Get Weather: ${error.message}` }
        });
        return
    }
};
