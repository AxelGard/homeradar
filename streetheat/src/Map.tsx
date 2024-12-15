import { useEffect, useRef } from "react";
import L from "leaflet"; // Import as 'L' to follow standard conventions

export default function Map() {
    const mapContainerRef = useRef(null); // Ref to store the map container div

    useEffect(() => {
        // Ensure the map is initialized only once
        if (!mapContainerRef.current) return;

        const map = L.map(mapContainerRef.current).setView([51.505, -0.09], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        return () => {
            // Clean up the map instance when the component unmounts
            map.remove();
        };
    }, []);

    return <div id="map" ref={mapContainerRef} style={{ height: "100vh" }}></div>;
}
