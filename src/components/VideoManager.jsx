import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./VideoManager.css";

const API_URL = "https://jasandyas-backend.onrender.com/ad_video";

const VideoManager = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState(""); // New state for duration
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Fetch videos from API
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("https://appsail-50024000807.development.catalystappsail.in/ad_video");
      setVideos(response.data);
    } catch (error) {
      setError("Failed to fetch videos. Please try again.");
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Add a new video
  const addVideo = async () => {
    if (!videoUrl.trim() || !videoDuration.trim()) {
      alert("Please enter a valid video URL and duration");
      return;
    }

    setAdding(true);
    setError("");
    try {
      const response = await axios.post(API_URL, { 
        video: videoUrl, 
        duration: videoDuration // Send duration to DB
      });
      setVideos([...videos, response.data]); // Update UI
      setVideoUrl(""); // Clear input field
      setVideoDuration(""); // Clear duration field
    } catch (error) {
      setError("Failed to add video. Please try again.");
      console.error("Error adding video:", error);
    } finally {
      setAdding(false);
    }
  };

  // Delete a video
  const deleteVideo = async (id) => {
    setDeleting(id);
    setError("");

    // Optimistic UI update
    const updatedVideos = videos.filter((video) => video.id !== id);
    setVideos(updatedVideos);

    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      setError("Failed to delete video. Please try again.");
      console.error("Error deleting video:", error);
      setVideos([...updatedVideos, videos.find((video) => video.id === id)]); // Rollback
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="video-manager">
      <h2>Video Manager</h2>
      {error && <p className="error">{error}</p>}
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Video Duration (e.g., 2:30)"
          value={videoDuration}
          onChange={(e) => setVideoDuration(e.target.value)}
        />
        <button onClick={addVideo} disabled={adding}>
          {adding ? "Adding..." : "Add Video"}
        </button>
      </div>

      {loading ? <p>Loading videos...</p> : null}

      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <span>{video.video} - {video.duration}</span> {/* Display duration */}
            <button onClick={() => deleteVideo(video.id)} disabled={deleting === video.id}>
              {deleting === video.id ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoManager;
