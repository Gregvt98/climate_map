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
} from "@mui/material";
//import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CancelIcon from "@mui/icons-material/Cancel";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import FileUploadIcon from '@mui/icons-material/FileUpload';

const defaultLocation = "Default location";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState(defaultLocation);
  const [anonymous, setAnonymous] = useState(false);
  const [media, setMedia] = useState(null);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleAnonymousChange = (event) => {
    setAnonymous(event.target.checked);
  };

  const handleMediaChange = (event) => {
    setMedia(URL.createObjectURL(event.target.files[0]));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // submit form data to server
  };

  const handleCancel = () => {
    // reset form data
    setTitle("");
    setContent("");
    setLocation(defaultLocation);
    setAnonymous(false);
    setMedia(null);
  };

  return (
    <div className="container mx-auto px-4">
    <form className="flex flex-col items-center mt-2" onSubmit={handleSubmit}>
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
      <div className="flex items-center justify-center mt-2 border-2 border-dashed w-1/2">
        <label htmlFor="media-input">
          <IconButton component="span">
            <Typography>Select a file to upload</Typography>
            <FileUploadIcon/>
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
        className="w-1/2 mt-2"
        label="Location"
        variant="outlined"
        value={location}
        onChange={handleLocationChange}
      />
      <FormControl className="" component="fieldset">
        <div className="flex items-center space-x-2">
        <FormLabel component="legend">Share anonymously?</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={anonymous} onChange={handleAnonymousChange} />
            }
            label="Yes"
          />
        </FormGroup>
        </div>
      </FormControl>
      <div className="flex justify-center space-x-4">
        <Button
          className=""
          variant="outlined"
          color="error"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          className=""
          variant="outlined"
          color="primary"
          type="submit"
        >
          Submit
        </Button>
      </div>
    </form>
    </div>
  );
}
