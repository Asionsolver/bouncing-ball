import React, { useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const ballRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const directionRef = useRef({ x: 0, y: 0 });
  const speedRef = useRef(30);
  const animationRef = useRef(null);
  const prevTimeRef = useRef(performance.now());

  const BORDER_WIDTH = 20; // Width of the border
  const BALL_SIZE = 44; // Diameter of the ball
  const friction = 5;

  useEffect(() => {
    const ball = ballRef.current;

    // Initialize ball position at the center
    positionRef.current.x = window.innerWidth / 2 - 40;
    positionRef.current.y = window.innerHeight / 2 - 40;
    ball.style.left = `${positionRef.current.x}px`;
    ball.style.top = `${positionRef.current.y}px`;

    const handleClick = (event) => {
      // hide the instructions
      document.getElementById("instructions").style.display = "none";
      const ballX = positionRef.current.x;
      const ballY = positionRef.current.y;
      const targetX = event.clientX;
      const targetY = event.clientY;
      const angle = Math.atan2(targetY - ballY, targetX - ballX);

      directionRef.current.x = Math.cos(angle);
      directionRef.current.y = Math.sin(angle);
      speedRef.current = 30;

      prevTimeRef.current = performance.now();

      if (!animationRef.current) {
        moveBall();
      }
    };

    const moveBall = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - prevTimeRef.current) / 1000; // Time in seconds
      prevTimeRef.current = currentTime;

      // Reduce speed by 0.005 every second
      speedRef.current -= friction * deltaTime;
      if (speedRef.current < 0.5) {
        speedRef.current = 0;
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        // show the instructions
        document.getElementById("instructions").style.display = "block";
        return;
      }

      positionRef.current.x += directionRef.current.x * speedRef.current;
      positionRef.current.y += directionRef.current.y * speedRef.current;

      // Check for collision with walls
      if (positionRef.current.x <= 0) {
        directionRef.current.x *= -1;
        positionRef.current.x = 0;
      }
      if (
        positionRef.current.x >=
        window.innerWidth - 2 * BORDER_WIDTH - BALL_SIZE
      ) {
        directionRef.current.x *= -1;
        positionRef.current.x =
          window.innerWidth - 2 * BORDER_WIDTH - BALL_SIZE;
      }
      if (positionRef.current.y <= 0) {
        directionRef.current.y *= -1;
        positionRef.current.y = 0;
      }
      if (
        positionRef.current.y >=
        window.innerHeight - 2 * BORDER_WIDTH - BALL_SIZE
      ) {
        directionRef.current.y *= -1;
        positionRef.current.y =
          window.innerHeight - 2 * BORDER_WIDTH - BALL_SIZE;
      }

      ball.style.left = `${positionRef.current.x}px`;
      ball.style.top = `${positionRef.current.y}px`;

      animationRef.current = requestAnimationFrame(moveBall);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div id="canvas">
      {/* click to launch the ball text */}
      <p id="instructions">Click to launch the ball</p>
      {/* ball */}
      <div id="ball" ref={ballRef}></div>
    </div>
  );
};

export default App;
