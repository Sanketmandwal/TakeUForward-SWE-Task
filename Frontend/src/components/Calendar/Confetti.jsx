import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const COLORS = ["#0ea5e9","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899","#ffffff"];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

export default function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 120 }, () => ({
      x:    randomBetween(0, canvas.width),
      y:    randomBetween(-100, 0),
      r:    randomBetween(5, 10),
      d:    randomBetween(2, 6),    // density / fall speed
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      tilt: randomBetween(-10, 10),
      tiltAngle: 0,
      tiltSpeed: randomBetween(0.05, 0.15),
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    let raf;
    let opacity = 1;
    const startTime = Date.now();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fade out after 2.5s
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 2.5) opacity = Math.max(0, 1 - (elapsed - 2.5) / 1.5);

      ctx.globalAlpha = opacity;

      particles.forEach((p) => {
        p.tiltAngle += p.tiltSpeed;
        p.y += (Math.cos(p.d) + 3 + p.r / 8);
        p.x += Math.sin(p.d) * 2;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (p.shape === "circle") {
          ctx.arc(p.x, p.y, p.r / 2, 0, 2 * Math.PI);
        } else {
          ctx.rect(p.x + p.tilt, p.y, p.r, p.r * 0.6);
        }
        ctx.fill();

        // Reset if off-screen
        if (p.y > canvas.height) {
          p.x = randomBetween(0, canvas.width);
          p.y = -10;
        }
      });

      if (opacity > 0) raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      id="confetti-canvas"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-hidden="true"
    />
  );
}