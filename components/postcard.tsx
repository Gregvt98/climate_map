import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SaveIcon from "@mui/icons-material/Save";
import { DateRange } from "@mui/icons-material";

const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
let access_token;

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function CenteredTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Overview" />
        <Tab label="Comments" disabled/>
      </Tabs>
    </Box>
  );
}

const TopicChip = ({ topic }) => {
  return (
    <div className="inline-flex items-center bg-blue-500 text-white text-sm font-medium rounded-full px-3 py-1">
      {topic}
    </div>
  );
};



export default function PostCard({ data }) {
  const [expanded, setExpanded] = React.useState(false);
  const [sentiment_analysis, setSentimentAnalysis] = React.useState([]);
  const [location, setLocation] = React.useState(null);

  React.useEffect(() => {
    async function reverse_geocoding(lon, lat) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${mapboxToken}`
        );
        const jsonData = await response.json();
        const place = jsonData.features[0]["place_name"];
        console.log(place);
        setLocation(place);
      } catch (error) {
        console.error(error);
      }
    }
    reverse_geocoding(data.longitude, data.latitude);
  }, [data])

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  var date = new Date(data.created_at).toDateString();

  return (
    <Card className="w-full h-full">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="avatar">
            {data.user.email ? data.user.email[0].toUpperCase() : "A"}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title= {data.user.email? data.user.email : "User ID: " + data.user.id}
        subheader={"Shared on: " + date}
      />
      {data.image_url ? (
        <CardMedia
          component="img"
          height="194"
          image={data.image_url}
          alt="Post image"
        />
      ) : null}
      <CardContent>
        {/** <TopicChip topic={"Science"}/>*/}
        <div className="">
        <Typography variant="h6" color="text.primary">
          {data.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.content}
        </Typography>
        </div>
      </CardContent>
      <CenteredTabs />
      <CardActions disableSpacing></CardActions>
      <div className="flex flex-col justify-start">
        <List>
          <ListItemButton>
            <ListItemIcon>
              <LocationOnIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={location}
            />
          </ListItemButton>
          {/**
           <ListItemButton>
            <ListItemIcon>
              <SentimentNeutralIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={`Sentiment type: ${data.sentiment_analysis.type}`} />
          </ListItemButton>
           */}
        </List>
      </div>
    </Card>
  );
}
