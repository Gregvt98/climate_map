import * as React from "react";
import { useEffect } from "react";
import Map, { GeolocateControl, NavigationControl, Marker } from "react-map-gl";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import GeocoderControl from "./geocoder-control";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { fetchData } from '../utils/api';

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

export default function BaseMap() {
  const [viewState, setViewState] = React.useState({
    longitude: 4.9,
    latitude: 52.3,
    zoom: 8,
  });

  useEffect(() => {
    const dataPromise = fetchData('http://localhost:3000/api/cities');
    dataPromise.then(data => {
      console.log(data);
    });
  }, []);

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ position: "absolute", width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={mapboxgl.accessToken}
    >
      <GeolocateControl />
      <GeocoderControl
        mapboxAccessToken={mapboxgl.accessToken}
        position="top-left"
      />
      <NavigationControl />
      <Marker longitude={4.9} latitude={52.4} anchor="bottom">
        <LocationOnIcon />
      </Marker>
    </Map>
  );
}
