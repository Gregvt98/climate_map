import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Input,
  InputLabel,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
//import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CancelIcon from "@mui/icons-material/Cancel";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

//const defaultLocation = "Default location";

const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
let access_token;

async function reverse_geocoding(lon, lat) {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${mapboxToken}`
    );
    const jsonData = await response.json();
    const place = jsonData.features[0]["place_name"];
    console.log(place);
    return place;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [media, setMedia] = useState(null);
  //const [access_token, setAccessToken] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const { lon, lat } = router.query;

  //get access token on component load
  /**
   useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      alert("No access token found. Make sure you are logged in.")
    }
    console.log("access token: ", access_token);
    setAccessToken(access_token);
  }, []);
   */

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleAnonymousChange = (event) => {
    setAnonymous(event.target.checked);
  };

  const handleMediaChange = (event) => {
    setMedia(URL.createObjectURL(event.target.files[0]));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const lon_float = parseFloat(lon);
    const lat_float = parseFloat(lat);
    // submit form data to server
    const postData = {
      title: title,
      content: content,
      longitude: lon_float,
      latitude: lat_float,
    };
    if (session) {
      postData["user_id"] = session.user.id;
    } else {
      postData["user_id"] = 6; //default user
    }

    fetch("http://localhost:8000/api/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Set the submitted state to true
        setIsSubmitted(true);
        setTimeout(() => {
          history.back();
        }, 2000);
      })
      .catch((error) => console.error(error));
  };

  const handleCancel = () => {
    // reset form data
    setTitle("");
    setContent("");
    setLocation("");
    setAnonymous(false);
    setMedia(null);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        className="flex flex-col justify-center items-center mt-2 w-full max-w-4xl"
        onSubmit={handleSubmit}
      >
        <div className="w-1/2 mt-2">
          {session ? (
            <Alert severity="info">
              You are sharing this post as: {session.user.email}
            </Alert>
          ) : (
            <Alert severity="error">
              User is not logged in, post will be anonymous.
            </Alert>
          )}
        </div>
        <TextField
          className="w-1/2 mt-2"
          label="Title"
          variant="outlined"
          required
          value={title}
          onChange={handleTitleChange}
        />
        <TextField
          className="w-1/2 mt-2"
          label="Content"
          variant="outlined"
          required
          multiline
          rows={4}
          value={content}
          onChange={handleContentChange}
        />
        <input
          accept="image/*"
          className="hidden"
          id="media-input"
          type="file"
          onChange={handleMediaChange}
        />
        <div className="flex items-center justify-center mt-2 border-2 border-dashed w-1/2 bt-2">
          <label htmlFor="media-input">
            <IconButton component="span">
              <Typography>Select a file to upload</Typography>
              <FileUploadIcon />
            </IconButton>
          </label>
          {media && (
            <div className="flex items-center">
              <img
                className=""
                src={media}
                alt="Preview"
                height="64"
                width="64"
              />
              <IconButton size="small" onClick={() => setMedia(null)}>
                <CancelIcon />
              </IconButton>
            </div>
          )}
        </div>
        <TextField
          className="w-1/2 mt-2 bt-2"
          label="Coordinates"
          variant="outlined"
          value={`${lon},${lat}`}
          //onChange={handleCoordinatesChange}
        />
        <div className="flex  justify-center space-x-4 mt-2">
          <Button
            className=""
            variant="outlined"
            color="error"
            onClick={handleCancel}
          >
            Reset form data
          </Button>
          <Button className="" variant="outlined" color="primary" type="submit">
            Submit
          </Button>
        </div>
        <div className="w-1/2 mt-2">
          {isSubmitted ? (
            <Alert severity="success">Post submitted successfully!</Alert>
          ) : (
            null
          )}
        </div>
      </form>
    </div>
  );
}
