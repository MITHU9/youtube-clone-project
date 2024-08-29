/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import "./Feed.css";
import { Link } from "react-router-dom";
import { API_KEY, valueConverter } from "../../data";
import { useEffect, useState } from "react";
import moment from "moment";

const Feed = ({ category }) => {
  const [videoList, setVideoList] = useState([]);

  const fetchData = async () => {
    const vidList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;

    const response = await fetch(vidList_url);
    const data = await response.json();
    setVideoList(data.items);
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <div className="feed">
      {videoList.map((item, index) => {
        return (
          <Link
            key={index}
            to={`video/${item.snippet.categoryId}/${item.id}`}
            className="card"
          >
            <img src={item.snippet.thumbnails.medium.url} alt="thumbnail1" />
            <h2>{item.snippet.title}</h2>
            <h3>{item.snippet.channelTitle}</h3>
            <p>
              {valueConverter(item.statistics.viewCount)} views &bull;
              {moment(item.snippet.publishedAt).fromNow()}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default Feed;
