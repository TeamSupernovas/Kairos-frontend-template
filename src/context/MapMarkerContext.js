import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MapMarkersContext = createContext();

const defaultCenter = { lat: 37.7749, lng: -122.4194 };

export const MapMarkerProvider = ({ children }) => {
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  return (
    <MapMarkersContext.Provider value={{ markerPosition, setMarkerPosition }}>
      {children}
    </MapMarkersContext.Provider>
  );
};

export const useMapMarkers = () => useContext(MapMarkersContext);
