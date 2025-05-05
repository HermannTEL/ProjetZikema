const axios = require("axios");
const jwt = require("jsonwebtoken");

const API_KEY = process.env.ZOOM_API_KEY;
const API_SECRET = process.env.ZOOM_API_SECRET;

const generateJWT = () => {
  return jwt.sign(
    { iss: API_KEY, exp: Date.now() + 5000 },
    API_SECRET
  );
};

const createZoomMeeting = async (topic, startTime) => {
  const token = generateJWT();

  const response = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic,
      type: 2, // scheduled meeting
      start_time: startTime,
      duration: 60,
      timezone: "Europe/Paris",
      settings: {
        join_before_host: true,
        approval_type: 0,
        auto_recording: "cloud",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data; // contient join_url, start_url, etc.
};

module.exports = { createZoomMeeting };
