import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useCountries from "../hooks/useCounties";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GeoJSON } from "react-leaflet";
import worldGeo from "../data/world.json"
import { getWeather } from "../services/weatherServices";


import { useNavigate } from "react-router-dom";

delete (L.Icon.Default.prototype as any).getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow
})

const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const countryAlias: Record<string, string> = {
    "United States of Americe": "Unites States",

    "Russian Federation": "Russia",

    "Democratic Republic of Congo": "Congo",

    "Republic of the Congo": "Congo",
}

export default function MapView() {
    const center: [number, number] = [20, 0];
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState("");
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY





    const { data: countries, loading, error } =
        useCountries<any[]>("https://restcountries.com/v3.1/all?fields=name,latlng");


    const [favorites, setFavorites] = useState<string[]>([]);
    const [visited, setVisted] = useState<string[]>([]);

    const filteredCountries = countries?.filter((country) =>
        country.name.common
            .toLowerCase()
            .includes(search.toLocaleLowerCase())
    )



    useEffect(() => {
        const stored = localStorage.getItem("favorites");
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch {
                console.error("Bad favorites data")
            }
        }
    }, [location])

    useEffect(() => {
        const storedVisited = localStorage.getItem("visited");

        if (storedVisited) {
            try {
                setVisted(JSON.parse(storedVisited));
            } catch {
                console.error("Bad visited data")
            }
        }

    }, [location])


    if (loading) return <p>Loading map... </p>
    if (error) return <p>{error?.message}</p>
    if (!countries) return null;

    return (
        <div>
            <input
                type="text"
                placeholder="Search country... "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
            />

            <MapContainer
                key="map"
                center={center}
                zoom={search ? 4 : 2}
                className="map"
            >

                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

                <GeoJSON
                    data={worldGeo as any}
                    style={(feature) => {
                        console.log(feature.properties)

                        const countryName= feature.properties?.name

                        const isFavorite = favorites.includes(countryName);

                        const isVisited = visited.includes(countryName);

                        

                        return {
                            fillColor: 
                            isFavorite
                                ? "#FFD700"
                                :isVisited
                                ? "#22c55e"
                                : "#3b82f6",

                            weight: 1,
                            color: "#0f172a",
                            fillOpacity: 0.8,
                        }

                    }}

                    onEachFeature={(feature, layer) => {
                        const countryName = feature.properties.name;

                        const normalizedName = 
                            countryAlias[countryName] || countryName;

                        const countryCode = feature.properties.iso_a3;

                        const capital = feature.properties.capital || countryName;

                        layer.on({
                            click: async () => {
                                layer.bindPopup(`
                                    <div class="popup">
                                    <h3>${countryName}</h3>
                                    <p>Loading weather...</p>
                                    </div>
                                    `).openPopup();

                                const weather = await getWeather(
                                    capital,
                                    countryName
                                );

                                layer.setPopupContent(`
                                        <div class="popup">
                                        <h3>${countryName}</h3>

                                        ${weather
                                        ? `
                                                <img 
                                                    src="https:${weather.icon}"
                                                    alt="${weather.condition}"
                                                />
                                                
                                                <p>
                                                    ${weather.temp}°F ${weather.condition}
                                                </p>
                                                `
                                        : `
                                                  <p>Weather unavailable</p>
                                                `
                                    }

                                        <button 
                                             onclick="window.location.href='/country/${encodeURIComponent(normalizedName)}'"
                                             >
                                             View Details
                                          </button>      
                                        
                                        </div>
                                        `);
                            }
                        })
                    }}
                />

                {search &&
                    filteredCountries.map((country) => (
                        <Marker
                            key={country.name.common}
                            position={[
                                country.latlng[0],
                                country.latlng[1],

                            ] as [number, number]}
                            icon={customIcon as any}
                        >
                            <Popup>
                                {country.name.common}
                            </Popup>
                        </Marker>
                    ))}

            </MapContainer>
        </div>
    )
}