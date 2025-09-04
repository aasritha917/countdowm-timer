import React from "react";
import CountdownTimer from "./components/CountdownTimer";
import "./App.css";

export default function App() {
  return (
    <div className="app" style={{ padding: 24, fontFamily: "system-ui, Arial" }}>
      <h1>⏳ Countdown Timer</h1>
      <p style={{ marginTop: -8, color: "#555" }}>
        Set seconds, then Start. Pause/Resume and Reset are included.
      </p>
      <CountdownTimer beepSrc="/sounds/beep.mp3" />
    </div>
  );
}
