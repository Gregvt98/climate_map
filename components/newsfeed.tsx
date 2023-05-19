import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Link from "@mui/material/Link";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';

import NEWS from "../data/news.json";

function NewsCard({ newsItem }) {
  return (
    <Link href={newsItem.url} target="_new" underline="none">
      <Card sx={{ maxWidth: 400 }} className="mt-3">
        <CardActionArea>
          {newsItem.urlToImage ? (
            <CardMedia
              component="img"
              height="140"
              image={newsItem.urlToImage}
              alt={newsItem.description}
            />
          ) : null}
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {newsItem.title}
            </Typography>
            <Typography
              gutterBottom
              variant="subtitle1"
              component="div"
              className="underline"
            >
              {newsItem.author}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {newsItem.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export default function NewsFeed() {
  const [open, setOpen] = useState(true);
  const [news, setNews] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  //add geolocation to show country specific news?

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /**
   useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=climate AND change&searchIn=title&sortBy=publishedAt&language=en&pageSize=100`,
          {
            headers: {
              "x-api-key": "599f7c40d8c8474091578fb92a5ddd23",
            },
          }
        );
        const data = await response.json();
        const news_articles = data.articles;
        setNews(news_articles.slice(0, 10)); //first 10 articles
        console.log(news_articles);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchNews();
  }, []);
   */
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

  //change to dynamic with use effect
  console.log(NEWS[0]);
  return (
    <div className="absolute bottom-10 right-12 w-[310px] max-w-[310px] max-h-[520px] bg-white shadow-md p-4 mt-2 text-sm text-gray-600 outline-none overflow-auto">
      <div className="flex items-center flex-initial bg-gray-800 text-white py-4 pl-6 mt-2">
        <h5>News Feed</h5>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon className="text-white"/>
        </ExpandMore>
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
      <div className="bg-grey">
        {NEWS.map((newsItem, index) => (
          <NewsCard key={index} newsItem={newsItem}></NewsCard>
        ))}
      </div>
      </Collapse>
    </div>
  );
}
