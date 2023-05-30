import { useEffect, useState, useMemo, useCallback } from "react";
import Map, { GeolocateControl, NavigationControl, Marker, Popup } from "react-map-gl";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import type { MarkerDragEvent, LngLat } from "react-map-gl";
import { useRouter } from "next/router";

import LocationOnIcon from "@mui/icons-material/LocationOn";


import GeocoderControl from "./geocoder-control";
import PostCard from "./postcard";
import ControlPanel from "./control-panel";
import NewsFeed from "./newsfeed";
import SidePanel from "./sidepanel";
import InfoDialog from "./infodialog";

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

export default function BaseMap() {
  const [viewState, setViewState] = useState({
    longitude: 4.9,
    latitude: 52.3,
    zoom: 7,
  });
  const [posts, setPosts] = useState([]);
  const [currentFeature, setCurrentFeature] = useState(null);
  const [marker, setMarker] = useState({
    longitude: viewState.longitude,
    latitude: viewState.latitude,
  });
  const [popupInfo, setPopupInfo] = useState(true);
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

  const [showSatelliteLayer, setShowSatelliteLayer] = useState(false);
  const [toggleMessage, setToggleMessage] = useState("Show satellite layer");

  const toggleSatelliteLayer = () => {
    setShowSatelliteLayer(!showSatelliteLayer);
    if (showSatelliteLayer == true) {
      setToggleMessage("Show satellite layer");
    }
    else {
      setToggleMessage("Show streets layer");
    }
  };

  //set version
  const router = useRouter();
  const queryParam = router.query.version;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const userLocation = [position.coords.longitude, position.coords.latitude];
      setMarker({longitude: userLocation[0], latitude: userLocation[1]});
      setViewState({longitude: userLocation[0], latitude: userLocation[1], zoom: 7});
    }, function (error) {
      console.log('Error getting user location:', error);
    });
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (queryParam == "a") {
          const response = await fetch(
            `http://localhost:8000/api/v1/posts/?limit=100&q=positive`
          );
          const data = await response.json();
          setPosts(data);
          console.log(data);
        } else if (queryParam == "b") {
          const response = await fetch(
            `http://localhost:8000/api/v1/posts/?limit=100&q=negative`
          );
          const data = await response.json();
          setPosts(data);
          console.log(data);
        } else {
          const response = await fetch(
            `http://localhost:8000/api/v1/posts/?limit=100`
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
      <div className="w-full h-full">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle={showSatelliteLayer ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/streets-v12'}
          mapboxAccessToken={mapboxgl.accessToken}
        >
          <GeolocateControl position="top-right" />
          <GeocoderControl
            mapboxAccessToken={mapboxgl.accessToken}
            position="top-left"
          />
          <NavigationControl position="top-right" />
          <ControlPanel events={events} marker={marker}/>

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

          {popupInfo && (
          <Popup
            anchor="top-left"
            longitude={marker.longitude}
            latitude={marker.latitude}
            onClose={() => setPopupInfo(false)}
          >
            You are here
          </Popup>
        )}

          <InfoDialog />

          <button className="absolute bottom-10 left-0 mb-4 ml-4 bg-gray-800 text-white text-base font-bold py-2 px-4 rounded-lg border-2 border-white" onClick={toggleSatelliteLayer}>{toggleMessage}</button>

          <NewsFeed />
        </Map>
      </div>
    </>
  );
}
