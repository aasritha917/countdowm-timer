import React, { useEffect, useRef, useState } from "react";
import "./CountdownTimer.css";

const STATUSES = {
  IDLE: "idle",
  RUNNING: "running",
  PAUSED: "paused",
  FINISHED: "finished",
};

export default function CountdownTimer({ beepSrc = "/sounds/beep.mp3" }) {
  const [inputSeconds, setInputSeconds] = useState("");    
  const [timeLeft, setTimeLeft] = useState(0);              
  const [initialSeconds, setInitialSeconds] = useState(0); 
  const [status, setStatus] = useState(STATUSES.IDLE);      
  const [error, setError] = useState("");                 

  const intervalRef = useRef(null); 
  const audioRef = useRef(null);    

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);


  const isRunning = status === STATUSES.RUNNING;
  const isPaused = status === STATUSES.PAUSED;
  const isIdle = status === STATUSES.IDLE;
  const isFinished = status === STATUSES.FINISHED;

  const sanitizeSeconds = (value) => {
 
    const n = Math.floor(Number(value));
    if (Number.isNaN(n) || n < 0) return null;
    return n;
  };

  const startInterval = () => {
   
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setStatus(STATUSES.FINISHED);

          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
    
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStart = () => {
    if (isRunning) return; 
    setError("");

    const n = sanitizeSeconds(inputSeconds);
    if (n === null) {
      setError("Please enter a valid non-negative number.");
      return;
    }
    if (n === 0) {
      
      setInitialSeconds(0);
      setTimeLeft(0);
      setStatus(STATUSES.FINISHED);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    setInitialSeconds(n);
    setTimeLeft(n);
    setStatus(STATUSES.RUNNING);
    startInterval();
  };

  const handlePauseResume = () => {
    if (isRunning) {
    
      clearInterval(intervalRef.current);
      setStatus(STATUSES.PAUSED);
    } else if (isPaused) {
      
      setStatus(STATUSES.RUNNING);
      startInterval();
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setStatus(STATUSES.IDLE);
    setInputSeconds("");
    setTimeLeft(0);
    setInitialSeconds(0);
    setError("");
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const canStart = (() => {
    const n = sanitizeSeconds(inputSeconds);
    return n !== null && n >= 0 && !isRunning;
  })();

  const progressPercent =
    initialSeconds > 0 ? Math.max(0, Math.round((timeLeft / initialSeconds) * 100)) : 0;

  return (
    <div className="timer-card">
      
      <audio ref={audioRef} src={beepSrc} preload="auto" />

      <label className="field">
        <span>⏱️ Time (seconds):</span>
        <input
          type="number"
          min="0"
          placeholder="e.g. 60"
          value={inputSeconds}
          onChange={(e) => setInputSeconds(e.target.value)}
          disabled={isRunning} 
          onKeyDown={(e) => {
            if (e.key === "Enter") handleStart();
          }}
        />
      </label>

      {error && <div className="error">{error}</div>}

      <div className="buttons">
        <button onClick={handleStart} disabled={!canStart}>
          Start
        </button>

        <button
          onClick={handlePauseResume}
          disabled={isIdle || isFinished || timeLeft <= 0}
          title={isRunning ? "Pause" : "Resume"}
        >
          {isRunning ? "Pause" : "Resume"}
        </button>

        <button onClick={handleReset} disabled={isIdle && !inputSeconds}>
          Reset
        </button>
      </div>

      <div className="display">
        <div className="time-left">
          {timeLeft}s
        </div>

        <div className="progress">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
          />
        </div>

        {isFinished && <div className="done">Time’s up!</div>}
      </div>
    </div>
  );
}
