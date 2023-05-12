import * as React from "react";
import { useEffect, useState, useMemo, useCallback } from "react";
import Map, {
  GeolocateControl,
  NavigationControl,
  Marker,
  Popup,
} from "react-map-gl";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import type { MarkerDragEvent, LngLat } from "react-map-gl";

import GeocoderControl from "./geocoder-control";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { fetchData } from "../utils/api";

import CITIES from "../data/cities.json";
import POSTS from "../data/posts.json";
import PersistentDrawer from "./persistentdrawer";
import SentimentCard from "./sentimentcard";
import BasicModal from "./modal";
import { Typography } from "@mui/material";
import ControlPanel from "./control-panel";

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

export default function BaseMap() {
  const [viewState, setViewState] = React.useState({
    longitude: 4.9,
    latitude: 52.3,
    zoom: 8,
  });
  const [currentFeature, setCurrentFeature] = useState(null);

  const [marker, setMarker] = useState({
    longitude: 4.9,
    latitude: 52.3,
  });
  const [events, logEvents] = useState<Record<string, LngLat>>({});

  const onMarkerDragStart = useCallback((event: MarkerDragEvent) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event: MarkerDragEvent) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));

    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  }, []);

  const onMarkerDragEnd = useCallback((event: MarkerDragEvent) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
  }, []);

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
        <ControlPanel events={events} marker={marker} />

        {posts}

        {currentFeature && (
          <PersistentDrawer onClose={setCurrentFeature}>
            <SentimentCard data={currentFeature} />
          </PersistentDrawer>
        )}

        <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="bottom"
          draggable
          onDragStart={onMarkerDragStart}
          onDrag={onMarkerDrag}
          onDragEnd={onMarkerDragEnd}
        >
          <LocationOnIcon color="primary" fontSize="large" />
        </Marker>
      </Map>
    </>
  );
}
