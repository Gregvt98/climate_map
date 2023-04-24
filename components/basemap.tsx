import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import Map, {
  GeolocateControl,
  NavigationControl,
  Marker,
  Popup,
} from "react-map-gl";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import GeocoderControl from "./geocoder-control";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { fetchData } from "../utils/api";

import CITIES from "../data/cities.json";
import POSTS from "../data/posts.json";
import PersistentDrawer from "./persistentdrawer";

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

export default function BaseMap() {
  const [viewState, setViewState] = React.useState({
    longitude: 4.9,
    latitude: 52.3,
    zoom: 8,
  });
  const [currentFeature, setCurrentFeature] = useState(null);

  const posts = useMemo(
    () =>
      POSTS.map((post, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={post.longitude}
          latitude={post.latitude}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setCurrentFeature(post);
          }}
        >
          <LocationOnIcon color="error" />
        </Marker>
      )),
    []
  );

  return (
    <>
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
        {posts}
        {currentFeature && (<PersistentDrawer feature={currentFeature} onClose={setCurrentFeature}/>)}
      </Map>
    </>
  );
}
