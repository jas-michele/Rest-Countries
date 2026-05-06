import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useCountries from "../hooks/useCounties";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";


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
                zoom={2}
                className="map"
            >

                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

               {countries
               .filter((country) => 
                    country.name.common 
                    .toLowerCase()
                    .includes(search.toLowerCase())
                     )
                     .map((country, index) => {
                        if (!country.latlng) return null;

                        const isFavorite = favorites.includes(
                            country.name.common
                        );
                     

                    return (
                        <Marker
                            key={index}
                            position={[country.latlng[0], country.latlng[1]]}
                        >

                            <Popup>
                                <div
                                    onClick={() => {
                                        navigate(`/country/${encodeURIComponent(country.name.common)}`)
                                    }}
                                    style={{ cursor: "pointer" }}
                                >

                                    <strong>
                                        {country.name.common}
                                        {isFavorite ? "⭐️" : ""}

                                    </strong>

                                    <p>Click to view details</p>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
)}