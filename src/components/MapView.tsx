import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
    return (



        <MapContainer
            key="map"
            center={center}
            zoom={2}
            className="map"
           >

            <TileLayer
                
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

        <Marker position={[51.505, -0.09]}>
            <Popup>Test Marker</Popup>
        </Marker>

           </MapContainer> 
    )
}