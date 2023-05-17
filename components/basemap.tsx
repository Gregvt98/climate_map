import * as React from "react";
import { useEffect, useState, useMemo, useCallback } from "react";
import Map, { GeolocateControl, NavigationControl, Marker } from "react-map-gl";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import type { MarkerDragEvent, LngLat } from "react-map-gl";
import { useRouter } from "next/router";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Typography } from "@mui/material";
import Button from "@mui/material";

import GeocoderControl from "./geocoder-control";
import PostCard from "./postcard";
import BasicModal from "./modal";
import ControlPanel from "./control-panel";
import NewsFeed from "./newsfeed";
import SidePanel from "./sidepanel";
import InfoDialog from "./infodialog";
import KeepMountedModal from "./keepmountedmodal";
import PostForm from "./postform";

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

export default function BaseMap() {
  const [viewState, setViewState] = React.useState({
    longitude: 4.9,
    latitude: 52.3,
    zoom: 8,
  });
  const [posts, setPosts] = useState([]);
  const [currentFeature, setCurrentFeature] = useState(null);
  const [marker, setMarker] = useState({
    longitude: viewState.longitude,
    latitude: viewState.latitude,
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

  //set version
  const router = useRouter();
  const queryParam = router.query.version;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (queryParam == "a") {
          const response = await fetch(
            `http://localhost:8000/api/v1/posts/?limit=50&q=positive`
          );
          const data = await response.json();
          setPosts(data);
          console.log(data);
        } else if (queryParam == "b") {
          const response = await fetch(
            `http://localhost:8000/api/v1/posts/?limit=50&q=negative`
          );
          const data = await response.json();
          setPosts(data);
          console.log(data);
        } else {
          const response = await fetch(
            `http://localhost:8000/api/v1/posts/?limit=50`
          );
          const data = await response.json();
          setPosts(data);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [queryParam]);

  return (
    <>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ position: "absolute", width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxgl.accessToken}
      >
        <GeolocateControl position="bottom-right" />
        <GeocoderControl
          mapboxAccessToken={mapboxgl.accessToken}
          position="top-left"
        />
        <NavigationControl position="bottom-right" />
        <ControlPanel
          events={events}
          marker={marker}
        />

        {posts.map((post) => (
          <Marker
            key={post.id}
            latitude={post.latitude}
            longitude={post.longitude}
            anchor="bottom"
            onClick={(e) => {
              // If we let the click event propagates to the map, it will immediately close the popup
              // with `closeOnClick: true`
              e.originalEvent.stopPropagation();
              setCurrentFeature(post);
            }}
          >
            <LocationOnIcon color="secondary" fontSize="medium" />
          </Marker>
        ))}

        {currentFeature && (
          <SidePanel onClose={setCurrentFeature}>
            <PostCard data={currentFeature} />
          </SidePanel>
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

        <InfoDialog/>

        <NewsFeed />

        <KeepMountedModal>
        <PostForm lon={marker.longitude} lat={marker.latitude}/>
        </KeepMountedModal>
      </Map>
    </>
  );
}
