import { useParams, useNavigate } from "react-router-dom";
import useCountries from "../hooks/useCounties";
import { useState, useEffect } from "react";
import useWeather from "../hooks/useWeather";



interface WeatherData {
    
    current: {
        temp_f: number;
        condition: {
            text: string;
        };
        humidity: number;
        wind_mph: number;
    };
}

export default function CountryDetailPage() {
    const { name } = useParams();
    const decodedName = decodeURIComponent(name || "");
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("favorites");

        try {

            if (stored) {
                setFavorites(JSON.parse(stored))
            }
        } catch (err) {
            console.error("Invalid favorites data, resetting... ")
            localStorage.removeItem("favorites")
        }

    }, [])

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites))
    }, [favorites])

    const toggleFavorite = () => {
        if (!country) return;

        const name = country.name.common;

        if (favorites.includes(name)) {
            setFavorites(favorites.filter((f) => f !== name))
        } else {
            setFavorites([...favorites, name])
        }
    }


    const { data: countryData, loading, error } =
        useCountries<any[]>(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(decodedName)}`
        );

    const { data: allCountries } =
        useCountries<any[]>(
            "https://restcountries.com/v3.1/all?fields=name,cca3"
        )
    const country = countryData?.[0];

    const capital = country?.capital?.[0] || country?.name?.common || "";

    const lat = country?.latlng?.[0];
    const lng = country?.latlng?.[1];

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;


    const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${capital}`

        console.log(weatherUrl)

    const {
        data: weather,
        loading: weatherLoading,
        error: weatherError,

    } = useWeather<WeatherData>(weatherUrl)

    if (loading) return <p>Loading country... </p>
    if (error) return <p>{error.message}</p>
    if (!allCountries || !countryData) return null;




    if (!country) return <p>Country not found</p>

    console.log("Decoded", decodedName)

    return (
        <div style={{ padding: "20px" }}>
            <button onClick={() => navigate(-1)}>⬅ Back</button>

            <h1>{country.name.common}</h1>

            <button onClick={toggleFavorite}>
                {favorites.includes(country.name.common)
                    ? "Remove Favorite"
                    : "⭐️ Add to Favorites"}
            </button>

            <img
                src={country.flags.png}
                alt={country.name.common}
                style={{ width: "200px", marginTop: "10px" }}
            />

            <p><strong>Capital:</strong> {country?.capital?.[0]} </p>
            <p><strong>Region:</strong> {country.region} </p>
            <p><strong>Population</strong> {country.population.toLocaleString()} </p>

            <br />

            <h2>Current Weather</h2>

            {weatherLoading && <p>Loading weather...</p>}

            {weatherError && <p>Error loading weather</p>}

            {weather && (
                <div>
                    <p>
                        🌡️ Temperature: {weather.current.temp_f}F
                    </p>
                    <p>
                        ☁️ Condition: {weather.current.condition.text}
                    </p>
                    <p>
                        💧 Humidity: {weather.current.humidity}%
                    </p>
                    <p>
                        💨 Wind: {weather.current.wind_mph}mph
                    </p>
                </div>
            )}

            {lat && lng && (
                <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}  
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: "inline-block",
                    marginTop: "15px",
                    textDecoration: "none"

                }}
                >
                    📍 View on Google Maps
                </a>

                
                )}

            {country.borders && (
                <div style={{ marginTop: "10px" }}>
                    <h3>Border Countries</h3>

                    {country.borders.map((code: string) => {
                        const borderCountry = allCountries.find(
                            (c) => c.cca3 === code
                        );

                        if (!borderCountry) return null;

                        return (
                            <button
                                key={code}
                                onClick={() =>
                                    navigate(
                                        `/country/${encodeURIComponent(borderCountry.name.common)}`
                                    )
                                }
                                style={{ marginRight: "10px" }}
                            >
                                {borderCountry.name.common}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}