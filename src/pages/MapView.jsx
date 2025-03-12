import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const libraries = ["places"];
const containerStyle = { width: "100%", height: "100vh" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 };

const MapView = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={12}
    >
      <Marker position={defaultCenter} title="Default Location" />
    </GoogleMap>
  );
};

export default MapView;
