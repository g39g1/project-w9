import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); 
const fetchWeather = async (latitude: number, longitude: number) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('API key for OpenWeather is not defined.');
  }

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(weatherUrl);

    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind.speed,
      cityName: response.data.name,
    };
  } catch (error: any) {
    throw new Error(`Unable to retrieve weather data: ${error.message}`);
  }
};

export default fetchWeather;
