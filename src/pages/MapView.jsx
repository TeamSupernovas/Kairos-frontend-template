import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useMapMarkers } from "../context/MapMarkerContext";
import { useDishSearch } from "../context/DishSearchContext";

const libraries = ["places"];
const containerStyle = { width: "100%", height: "100vh" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 };

const MapView = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const { markerPosition } = useMapMarkers();
  const { dishes } = useDishSearch();

  if (!isLoaded) return <div>Loading Map...</div>;
  console.log("dishes", dishes);
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPosition || defaultCenter}
      zoom={12}
    >
      <Marker position={markerPosition} title="Search Location" />
      {dishes &&
        dishes.data &&
        dishes.data.map((dish) => (
          <Marker
            key={dish.DishID}
            position={{
              lat: dish.location.coordinates[1],
              lng: dish.location.coordinates[0],
            }}
            label={{
              text: dish.DishName,
              fontSize: "14px",
              fontWeight: "bold",
              color: "#000",
            }}
          />
        ))}
    </GoogleMap>
  );
};

export default MapView;
