import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center map
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);
    return null;
}

const LocationSelector = ({ onLocationChange, initialData, isSeeker }) => {
    const [position, setPosition] = useState(initialData?.latitude && initialData?.longitude ? [initialData.latitude, initialData.longitude] : [12.9716, 77.5946]); // Default to Bangalore or initial data
    const [city, setCity] = useState(initialData?.location || '');
    const [surroundingCities, setSurroundingCities] = useState(initialData?.locations || []);
    const [allFoundCities, setAllFoundCities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Sync state with initial data when it arrives from the backend
    useEffect(() => {
        if (initialData?.latitude && initialData?.longitude) {
            setPosition([initialData.latitude, initialData.longitude]);
        }
        if (initialData?.location) {
            setCity(initialData.location);
        }
        if (initialData?.locations) {
            setSurroundingCities(initialData.locations);
        }
    }, [initialData?.latitude, initialData?.longitude, initialData?.location, initialData?.locations]);

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                handleLocationChange(lat, lng);
            },
        });
        return null;
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleLocationChange = async (lat, lng) => {
        setPosition([lat, lng]);
        setLoading(true);
        try {
            // 1. Get current city
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
            const cityData = res.data.address.city || res.data.address.town || res.data.address.village || res.data.address.county || '';
            setCity(cityData);

            let selectedCities = [];
            let searchableCities = [];

            if (isSeeker) {
                // 2. Get surrounding cities (within 30km)
                const overpassQuery = `[out:json];(node(around:30000,${lat},${lng})["place"~"city|town|village"];);out body;`;
                const overpassRes = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);

                const rawCities = overpassRes.data.elements
                    .filter(e => e.tags.name)
                    .map(e => ({
                        name: e.tags.name,
                        distance: calculateDistance(lat, lng, e.lat, e.lon)
                    }))
                    .filter(c => c.name !== cityData);

                // Sort by distance
                rawCities.sort((a, b) => a.distance - b.distance);

                // Unique names tracking
                const uniqueNames = new Set([cityData]);
                const sortedUnique = [];
                for (const rc of rawCities) {
                    if (!uniqueNames.has(rc.name)) {
                        uniqueNames.add(rc.name);
                        sortedUnique.push(rc.name);
                    }
                }

                selectedCities = [cityData, ...sortedUnique.slice(0, 9)]; // Current + next 9 = total 10
                searchableCities = sortedUnique.slice(9);

                setSurroundingCities(selectedCities);
                setAllFoundCities(sortedUnique); // All neighbors
            }

            onLocationChange({
                latitude: lat,
                longitude: lng,
                location: cityData, // Primary city
                locations: isSeeker ? selectedCities : [] // For seekers, all interested cities
            });
        } catch (error) {
            console.error("Geocoding failed", error);
        } finally {
            setLoading(false);
        }
    };

    const addCityFromSearch = (cityName) => {
        if (!surroundingCities.includes(cityName)) {
            const updated = [...surroundingCities, cityName];
            setSurroundingCities(updated);
            setSearchQuery('');
            onLocationChange({
                latitude: position[0],
                longitude: position[1],
                location: city,
                locations: updated
            });
        }
    };

    const removeCity = (cityToRemove) => {
        const updated = surroundingCities.filter(c => c !== cityToRemove);
        setSurroundingCities(updated);
        onLocationChange({
            latitude: position[0],
            longitude: position[1],
            location: city,
            locations: updated
        });
    };

    const handleUseMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                handleLocationChange(pos.coords.latitude, pos.coords.longitude);
            });
        }
    };

    const filteredOptions = allFoundCities.filter(c =>
        !surroundingCities.includes(c) &&
        c.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                    Location: <span className="text-indigo-600 font-bold">{city || "Select on map"}</span>
                </span>
                <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition flex items-center gap-1 shadow-sm"
                >
                    📍 Use Current Location
                </button>
            </div>

            <div className="h-64 rounded-xl overflow-hidden border border-gray-200 shadow-md z-0 transition-all duration-300">
                <MapContainer center={position} zoom={11} className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={position} />
                    <ChangeView center={position} />
                    <MapEvents />
                </MapContainer>
            </div>

            {loading && (
                <div className="flex items-center gap-2 py-2">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-indigo-600 font-medium">Scanning surrounding areas...</p>
                </div>
            )}

            {isSeeker && (city || allFoundCities.length > 0) && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                        <h4 className="text-sm font-bold text-gray-800">Selected Service Areas</h4>

                        {/* Searchable Dropdown */}
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                className="w-full text-xs p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none pr-8"
                                placeholder="🔍 Search other nearby cities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                                    {filteredOptions.length > 0 ? filteredOptions.map(c => (
                                        <div
                                            key={c}
                                            className="p-2 text-xs hover:bg-indigo-50 cursor-pointer border-b last:border-0"
                                            onClick={() => addCityFromSearch(c)}
                                        >
                                            + {c}
                                        </div>
                                    )) : (
                                        <div className="p-3 text-xs text-gray-400 italic">No other cities matches your search. Try adjusting the pin.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {surroundingCities.map(c => (
                            <span key={c} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 border transition ${c === city ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 group'}`}>
                                {c}
                                {c !== city && (
                                    <button
                                        type="button"
                                        onClick={() => removeCity(c)}
                                        className="text-gray-400 group-hover:text-red-500 transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}
                            </span>
                        ))}
                    </div>
                    <p className="text-[10px] text-gray-400 italic">Matching will include jobs from all selected areas above.</p>
                </div>
            )}
        </div>
    );
};

export default LocationSelector;
