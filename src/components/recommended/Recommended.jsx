/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import "./Recommended.css";
import { useEffect, useState } from "react";
import { API_KEY, valueConverter } from "../../data";
import { Link } from "react-router-dom";

const Recommended = ({ categoryId }) => {
  const [recommendVid, setRecommendVid] = useState([]);

  const fetchRecommendedData = async () => {
    const recommendVid_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;

    fetch(recommendVid_url)
      .then((response) => response.json())
      .then((data) => setRecommendVid(data.items))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    fetchRecommendedData();
  }, []);

  return (
    <div className="recommended">
      {recommendVid.map((item, index) => {
        return (
          <Link
            to={`/video/${item.snippet.categoryId}/${item.id}`}
            key={index}
            className="side-video-list"
          >
            <img src={item.snippet.thumbnails.medium.url} alt="thumbnail" />
            <div className="vid-info">
              <h4>{item.snippet.title}</h4>
              <p>{item.snippet.channelTitle}</p>
              <p>{valueConverter(item.statistics.viewCount)} Views</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Recommended;
