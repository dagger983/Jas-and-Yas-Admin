import { useState, useEffect } from "react";
import axios from "axios";
import "./VideoManager.css"
const API_URL = "https://jasandyas-backend.onrender.com/ad_video";

const VideoManager = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch videos from API
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new video
  const addVideo = async () => {
    if (!videoUrl.trim()) {
      alert("Please enter a valid video URL");
      return;
    }

    try {
      const response = await axios.post(API_URL, { video: videoUrl });
      setVideos([...videos, response.data]); // Update UI
      setVideoUrl(""); // Clear input field
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  // Delete a video
  const deleteVideo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setVideos(videos.filter((video) => video.id !== id)); // Update UI
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="video-manager">
      <h2>Video Manager</h2>
      <input
        type="text"
        placeholder="Enter Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <button onClick={addVideo}>Add Video</button>

      {loading ? <p>Loading videos...</p> : null}

      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <span>{video.video}</span>
            <button onClick={() => deleteVideo(video.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoManager;
