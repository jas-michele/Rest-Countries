import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useCountries from "../hooks/useCounties";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any).getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow
})


        console.log("MapView rendering")

export default function MapView() {
    const center: [number, number] = [20, 0];

    const  { data: countries, loading, error} =
        useCountries<any[]>("https://restcountries.com/v3.1/all?fields=name,latlng");

        if (loading) return <p>Loading map... </p>
        if (error) return <p>{error?.message}</p>
        if (!countries) return null;

    return (

        <MapContainer
            key="map"
            center={center}
            zoom={2}
            className="map"
           >

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
        {countries.map((country, index) => {
            if (!country.latlng) return null;

            return (
                <Marker 
                 key={index}
                 position={[country.latlng[0], country.latlng[1]]}
                 >
                    <Popup>
                        <strong>{country.name.common}</strong>
                    </Popup>
                 </Marker>
            )
        })}


       </MapContainer>
    )
}