import { JwtPayload } from 'jsonwebtoken';
import Weather from '../model/weather.model';
import History from '../model/History.model';
import { verifyToken } from '../utils/verifyToken';
import axios from 'axios';

export const getWeatherData = async (token: string, lon: string, lat: string) => {
    try {
        const verify = verifyToken(token);
        if (!verify || !(verify as JwtPayload).userId) {
            return {
                error: 'Unauthorized: Invalid or expired token',
                statusCode: 401
            };
        }

        const userIdentifier = (verify as JwtPayload).userId;

        const weatherExist = await Weather.findOne({ lon, lat });
        if (weatherExist) {
            const newHistory = new History({
                lat,
                lon,
                user: userIdentifier,
                weather: weatherExist._id
            });
            await newHistory.save();

            return {
                source: "cache",
                data: weatherExist
            };
        }

        const getFromEApi = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`);
        const weatherData = getFromEApi.data;

        if (!weatherData) {
            return {
                error: 'Failed to fetch weather data from OpenWeatherMap',
                statusCode: 500
            };
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
            fetchedAt: Date.now()
        });

        await newWeather.save();

        const newHistory = new History({
            user: userIdentifier,
            weather: newWeather._id
        });
        await newHistory.save();

        return {
            source: "openweather",
            data: newWeather
        };
    } catch (error: any) {
        console.error(error);
        return {
            error: 'Failed to retrieve weather data',
            statusCode: 500
        };
    }
};
