import * as React from "react";
import type { LngLat } from "react-map-gl";
import { Button, Modal } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";

const eventNames = ["onDragStart", "onDrag", "onDragEnd"];

function round5(value) {
  return (Math.round(value * 1e5) / 1e5).toFixed(5);
}

export default function ControlPanel(props: {events: Record<string, LngLat>; marker: any}) {
  const router = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    router.push({
        pathname: '/create-post',
        query: { lon: props.marker.longitude, lat: props.marker.latitude },
    }
    );
  };

  return (
    <div className="absolute top-0 right-12 max-w-[320px] bg-white shadow-md p-4 mt-2 text-sm text-gray-600 outline-none">
      <h3 className="uppercase">Draggable Marker</h3>
      <p>Drag marker to a location to log a sentiment.</p>
      <div>
        {eventNames.map((eventName) => {
          const { events = {} } = props;
          const lngLat = events[eventName];
          return (
            <div key={eventName}>
              <strong>{eventName}:</strong>{" "}
              {lngLat ? (
                `${round5(lngLat.lng)}, ${round5(lngLat.lat)}`
              ) : (
                <em>null</em>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2">
        <Button variant="outlined" onClick={handleClick}>
          Create a new post
        </Button>
      </div>
    </div>
  );
}
