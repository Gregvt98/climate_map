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
import PersistentDrawer from "./persistentdrawer";

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

export default function BaseMap() {
  const [viewState, setViewState] = React.useState({
    longitude: 4.9,
    latitude: 52.3,
    zoom: 8,
  });
  const [currentFeature, setCurrentFeature] = useState(null);

  const pins = useMemo(
    () =>
      CITIES.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setCurrentFeature(city);
          }}
        >
          <LocationOnIcon />
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
        {pins}
        {currentFeature && (
          <Popup
            anchor="top"
            longitude={Number(currentFeature.longitude)}
            latitude={Number(currentFeature.latitude)}
            onClose={() => setCurrentFeature(null)}
          >
            <div>
              {currentFeature.city}, {currentFeature.state} |{" "}
              <a
                target="_new"
                href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${currentFeature.city}, ${currentFeature.state}`}
              >
                Wikipedia
              </a>
            </div>
            <img width="100%" src={currentFeature.image} />
          </Popup>
        )}
        <PersistentDrawer feature={currentFeature}/>
      </Map>
    </>
  );
}
