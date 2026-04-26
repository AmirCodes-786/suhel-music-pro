import React, { useRef, useEffect, useCallback } from 'react';
import { getAnalyser } from '../../hooks/useAudioPlayer';
import './Visualizer.css';

const Visualizer = ({ isActive }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    let analyser;
    try {
      analyser = getAnalyser();
    } catch {
      analyser = null;
    }

    // If analyser is not available (CORS restriction), draw placeholder
    if (!analyser) {
      drawPlaceholder(ctx, width, height);
      if (isActive) animationRef.current = requestAnimationFrame(draw);
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const barCount = 48;
    const barWidth = (width / barCount) * 0.6;
    const barGap = (width / barCount) * 0.4;

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * bufferLength);
      const value = dataArray[dataIndex] / 255;
      const barHeight = Math.max(2, value * height * 0.9);

      const x = i * (barWidth + barGap);
      const y = height - barHeight;

      // Gradient color based on bar position
      const hue = 240 + (i / barCount) * 60; // indigo to purple range
      const lightness = 50 + value * 20;
      const alpha = 0.6 + value * 0.4;

      ctx.fillStyle = `hsla(${hue}, 80%, ${lightness}%, ${alpha})`;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [isActive]);

  const drawPlaceholder = (ctx, width, height) => {
    const barCount = 48;
    const barWidth = (width / barCount) * 0.6;
    const barGap = (width / barCount) * 0.4;
    const time = Date.now() / 1000;

    for (let i = 0; i < barCount; i++) {
      const value = isActive
        ? 0.2 + Math.sin(time * 2 + i * 0.3) * 0.15
        : 0.05;
      const barHeight = Math.max(2, value * height);
      const x = i * (barWidth + barGap);
      const y = height - barHeight;

      const hue = 240 + (i / barCount) * 60;
      ctx.fillStyle = `hsla(${hue}, 70%, 55%, 0.4)`;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
      ctx.fill();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      const ctx = canvas.getContext('2d');
      ctx.scale(devicePixelRatio, devicePixelRatio);
    });

    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (isActive) {
      animationRef.current = requestAnimationFrame(draw);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, draw]);

  return <canvas ref={canvasRef} className="visualizer-canvas" />;
};

export default React.memo(Visualizer);
