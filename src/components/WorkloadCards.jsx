import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import confetti from "canvas-confetti";
import "./Workload.css";

export default function WorkloadCards() {
  const [developers, setDevelopers] = useState([]);

  // ✅ Use environment variable for backend URL
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ✅ Fetch tasks from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/tasks`)
      .then((res) => res.json())
      .then((data) => setDevelopers(data))
      .catch(() => toast.error("❌ Failed to load tasks"));
  }, []);

  // ✅ Save tasks to backend
  const updateBackend = (updatedTasks) => {
    fetch(`${API_BASE}/api/tasks/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTasks),
    }).catch(() => toast.error("⚠️ Failed to save tasks"));
  };

  // 🎉 Confetti animation
  const triggerConfetti = () => {
    const duration = 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#00ffcc", "#33ccff", "#66ff99", "#ffff66"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#00ffcc", "#33ccff", "#66ff99", "#ffff66"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  // ✅ Toggle task done/undone
  const toggleTask = (devIndex, taskIndex) => {
    const newDevs = [...developers];
    const task = newDevs[devIndex].tasks[taskIndex];
    task.done = !task.done;
    setDevelopers(newDevs);
    updateBackend(newDevs);

    if (task.done) {
      triggerConfetti();

      // 🎯 Random motivational messages
      const messages = [
        "🎉 Task completed! Take a sip of water 💧",
        "🔥 You’re on fire! Keep going!",
        "💪 Another one bites the dust!",
        "🌟 You did it! Great job!",
        "🚀 One step closer to your goals!",
        "👏 Boom! Another task crushed!",
        "🍀 Lucky day! Task done and dusted!",
        "☕ Time for a short break — you earned it!",
        "🎯 Focus level: Pro! Keep it up!",
        "✨ Smooth move! Task complete!",
      ];

      // 🎨 Random color themes
      const toastStyles = [
        { background: "#1a1a1a", color: "#00ffcc" },
        { background: "#222", color: "#ffcc00" },
        { background: "#0a0a0a", color: "#ff66b2" },
        { background: "#141414", color: "#66ff99" },
        { background: "#000", color: "#ff4444" },
        { background: "#101010", color: "#66ccff" },
      ];

      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      const randomStyle =
        toastStyles[Math.floor(Math.random() * toastStyles.length)];

      toast.success(randomMessage, {
        duration: 3500,
        style: {
          fontSize: "1.5rem",
          fontWeight: "600",
          padding: "25px 35px",
          borderRadius: "16px",
          boxShadow: "0 0 25px rgba(255,255,255,0.15)",
          textAlign: "center",
          ...randomStyle,
        },
      });
    }
  };

  return (
    <div className="app">
      <Toaster position="top-center" richColors />
      <h1>ERP Workload Job Cards</h1>

      <div className="card-container">
        {developers.map((dev, devIndex) => (
          <div key={devIndex} className="card">
            <div className="dev-name">{dev.name}</div>
            <ul>
              {dev.tasks.map((task, taskIndex) => (
                <li
                  key={taskIndex}
                  className={task.done ? "completed glow" : ""}
                  onClick={() => toggleTask(devIndex, taskIndex)}
                >
                  {/* 📝 Edit functionality removed — now static */}
                  <span>{task.text}</span>

                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(devIndex, taskIndex)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <footer>
        <p>
          “Code is like humor. When you have to explain it, it’s bad.” — Cory
          House
        </p>
        <span>Developed by Yash © 2025</span>
      </footer>
    </div>
  );
}
