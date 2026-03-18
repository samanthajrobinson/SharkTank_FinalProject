import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8f5f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = ['#07624e', '#c97b63', '#6f4e37', '#d9c6b0'];
    colors.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(80 + index * 95, 88, 42, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#2f241f';
    ctx.font = 'bold 26px Arial';
    ctx.fillText('FitMatch Mood Board', 24, 170);
    ctx.font = '16px Arial';
    ctx.fillText('Warm neutrals + curated wardrobe energy', 24, 198);
  }, []);

  return <canvas ref={canvasRef} width="420" height="230" className="hero-canvas" aria-label="Style mood board canvas" />;
}
