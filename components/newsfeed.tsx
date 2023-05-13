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
import { useState } from "react";

import NEWS from "../data/news.json";

function NewsCard({ newsItem }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        {newsItem.urlToImage ? (
          <Link href={newsItem.url} target="_new">
            <CardMedia
              component="img"
              height="140"
              image={newsItem.urlToImage}
              alt="green iguana"
            />
          </Link>
        ) : null}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {newsItem.title}
          </Typography>
          <Typography gutterBottom variant="subtitle1" component="div">
            {newsItem.author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {newsItem.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  //add geolocation to show country specific news?

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

  //change to dynamic with use effect
  console.log(NEWS[0]);
  return (
    <div>
      <Dialog
        open={true}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">News Feed</DialogTitle>
        <DialogContent>
          {NEWS.map((newsItem, index) => (
            <NewsCard key={index} newsItem={newsItem}></NewsCard>
          ))}
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
}
