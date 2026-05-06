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


import { useNavigate } from "react-router-dom";

delete (L.Icon.Default.prototype as any).getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow
})


console.log("MapView rendering")

export default function MapView() {
    const center: [number, number] = [20, 0];
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState("");


    const { data: countries, loading, error } =
        useCountries<any[]>("https://restcountries.com/v3.1/all?fields=name,latlng");


    const [favorites, setFavorites] = useState<string[]>([]);

    const filteredCountries = countries?.filter((country) =>
            country.name.common
            .toLowerCase()
            .includes(search.toLocaleLowerCase())
)

console.log(filteredCountries)

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
                        const countryName = feature.properties?.name;

                        const isFavorite = favorites.includes(countryName);
               

                        return {
                            fillColor: isFavorite
                            ? "#FFD700"
                            : "#3b82f6",

                            weight: 1,
                            color: "#0f172a",
                            fillOpacity: 0.8,
                        }

                    }}

                    onEachFeature={(feature, layer) => {
                        const countryName = feature.properties.name;

                        layer.on({
                            click: () => {
                                navigate(
                                    `/country/${encodeURIComponent(countryName)}`
                                )
                            }
                        })
                    }}

                />

                {filteredCountries.map((country) => (
                    <Marker
                        key={country.name.common}
                        position={[
                            country.latlng[0],
                            country.latlng[1],
                        ] as [number, number]}
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