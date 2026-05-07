import type { WeatherData } from "../types/weather";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const getWeather = async (
    capital: string,
    countryName: string
): Promise<WeatherData | null> => {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(`${capital}, ${countryName}`)}`
        )

        const data = await response.json();

        return {
            temp: Math.round(data.current.temp_f),
            condition: data.current.condition.text,
            icon: data.current.condition.icon
        };
    } catch (error) {
        console.error("Weather fetch failed:", error);
        return null;
      }
    
}

    
    