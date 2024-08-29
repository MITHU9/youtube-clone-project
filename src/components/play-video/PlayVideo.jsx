/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import { useEffect, useState } from "react";
import { API_KEY, valueConverter } from "../../data";
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const { videoId } = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const fetchVidData = async () => {
    // Fetch data from an API using the videoId
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;

    await fetch(videoDetails_url)
      .then((response) => response.json())
      .then((data) => setApiData(data.items[0]))
      .catch((error) => console.error("Error:", error));
  };

  const fetchChannelData = async () => {
    const channelDetails_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData?.snippet.channelId}&key=${API_KEY}`;
    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;

    try {
      const response = await fetch(channelDetails_url);
      const data = await response.json();

      if (!response.ok || !data.items) {
        console.error(
          "Error fetching channel data:",
          data.error || "Unknown error"
        );
        return; // Stop further execution if the channel data fetch fails
      }

      setChannelData(data.items[0]);

      // Fetch comment data
      const response_comment = await fetch(comment_url);
      const data_comment = await response_comment.json();

      if (!response_comment.ok || !data_comment.items) {
        console.error(
          "Error fetching comment data:",
          data_comment.error || "Unknown error"
        );
        return;
      }

      setCommentData(data_comment.items);
    } catch (error) {
      console.error("Error fetching channel or comment data:", error);
    }
  };

  useEffect(() => {
    fetchVidData();
  }, [videoId]);

  useEffect(() => {
    fetchChannelData();
  }, [apiData]);

  console.log("Comment Response:", commentData);

  return (
    <div className="play-video">
      {/* <video src={video1} controls autoPlay muted></video> */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? valueConverter(apiData.statistics.viewCount) : "16k"} views
          &bull;{" "}
          {apiData
            ? moment(apiData.snippet.publishedAt).fromNow()
            : "2 days ago"}
        </p>
        <div>
          <span>
            <img src={like} alt="like" />
            {valueConverter(apiData ? apiData.statistics.likeCount : "225")}
          </span>
          <span>
            <img src={dislike} alt="like" />
          </span>
          <span>
            <img src={share} alt="like" />
            Share
          </span>
          <span>
            <img src={save} alt="like" />
            Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData?.snippet.thumbnails.default.url} alt="jack" />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : "Title"}</p>
          <span>
            {valueConverter(
              channelData ? channelData.statistics.subscriberCount : "1M"
            )}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>

      <div className="vid-description">
        <p>
          {apiData ? apiData.snippet.description.slice(0, 250) : "description"}
        </p>
        <hr />
        <h4>{apiData ? apiData.statistics.commentCount : "255"} Comments</h4>

        {commentData.map((item, index) => {
          return (
            <div key={index} className="comments">
              <img
                src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
                alt="user_profile"
              />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}
                  <span>1 day ago</span>
                </h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="like" />
                  <span>
                    {valueConverter(
                      item.snippet.topLevelComment.snippet.likeCount
                    )}
                  </span>
                  <img src={dislike} alt="dislike" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayVideo;
