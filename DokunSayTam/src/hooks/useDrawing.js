import { useState, useRef, useEffect } from 'react';

/**
 * Kalem / vurgulayıcı / silgi çizim mantığını yöneten hook.
 */
export const useDrawing = (cvRef, zoom) => {
  const [strokes, setStrokes] = useState([]);
  const [undone, setUndone] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState('select');
  const [penColor, setPenColor] = useState('#1a1a1a');
  const [penWidth, setPenWidth] = useState(3);
  const [eraserSize, setEraserSize] = useState(20);
  const [penAlpha, setPenAlpha] = useState(1);

  const drawRef = useRef(null);
  const cursorRef = useRef(null);
  const currentStroke = useRef([]);
  const canvasSized = useRef(false);

  const sizeCanvas = () => {
    const cv = drawRef.current;
    if (!cv || !cvRef.current) return;
    const w = cvRef.current.clientWidth;
    const h = cvRef.current.clientHeight;
    if (cv.width === w * 2 && cv.height === h * 2) return;
    cv.width = w * 2;
    cv.height = h * 2;
    cv.style.width = w + 'px';
    cv.style.height = h + 'px';
    canvasSized.current = true;
  };

  const renderStrokes = () => {
    const cv = drawRef.current;
    if (!cv) return;
    sizeCanvas();
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.save();
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokes.forEach((s) => {
      if (!s.points || s.points.length < 2) return;
      ctx.beginPath();
      ctx.globalCompositeOperation = s.type === 'eraser' ? 'destination-out' : 'source-over';
      ctx.globalAlpha = s.type === 'eraser' ? 1 : (s.alpha || 1);
      ctx.strokeStyle = s.type === 'eraser' ? 'rgba(0,0,0,1)' : s.color;
      ctx.lineWidth = s.width;
      ctx.moveTo(s.points[0].x, s.points[0].y);

      for (let i = 1; i < s.points.length - 1; i++) {
        const mx = (s.points[i].x + s.points[i + 1].x) / 2;
        const my = (s.points[i].y + s.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(s.points[i].x, s.points[i].y, mx, my);
      }

      ctx.lineTo(s.points[s.points.length - 1].x, s.points[s.points.length - 1].y);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    });

    ctx.restore();
  };

  useEffect(() => { renderStrokes(); }, [strokes]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      canvasSized.current = false;
      renderStrokes();
    });
    if (cvRef.current) observer.observe(cvRef.current);
    return () => observer.disconnect();
  }, []);

  const drawStart = (e) => {
    if (tool === 'select') return;
    sizeCanvas();
    const r = cvRef.current.getBoundingClientRect();
    currentStroke.current = [{ x: (e.clientX - r.left) / zoom, y: (e.clientY - r.top) / zoom }];
    setDrawing(true);
  };

  const drawMove = (e) => {
    if (cursorRef.current) {
      const cr = cvRef.current ? cvRef.current.getBoundingClientRect() : null;
      if (cr && tool !== 'select') {
        const sz = tool === 'eraser' ? eraserSize : Math.max(penWidth, 6);
        cursorRef.current.style.display = 'block';
        cursorRef.current.style.left = (e.clientX - cr.left - sz / 2) + 'px';
        cursorRef.current.style.top = (e.clientY - cr.top - sz / 2) + 'px';
        cursorRef.current.style.width = sz + 'px';
        cursorRef.current.style.height = sz + 'px';
        cursorRef.current.style.borderColor = tool === 'eraser' ? 'rgba(0,0,0,.3)' : penColor;
        cursorRef.current.style.background = tool === 'eraser' ? 'rgba(255,255,255,.3)' : penAlpha < 1 ? (penColor + '59') : 'transparent';
      } else {
        cursorRef.current.style.display = 'none';
      }
    }

    if (!drawing) return;
    const r = cvRef.current.getBoundingClientRect();
    const p = { x: (e.clientX - r.left) / zoom, y: (e.clientY - r.top) / zoom };
    currentStroke.current.push(p);

    const cv = drawRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    ctx.save();
    ctx.scale(2, 2);
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.globalAlpha = tool === 'eraser' ? 1 : penAlpha;
    ctx.beginPath();
    ctx.strokeStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : penColor;
    ctx.lineWidth = tool === 'eraser' ? eraserSize : penWidth;
    ctx.lineCap = 'round';

    const pts = currentStroke.current;
    if (pts.length >= 2) {
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawEnd = () => {
    if (!drawing) return;
    setDrawing(false);
    if (currentStroke.current.length > 1) {
      setStrokes((prev) => [
        ...prev,
        {
          points: currentStroke.current.slice(),
          color: penColor,
          width: tool === 'eraser' ? eraserSize : penWidth,
          type: tool,
          alpha: penAlpha,
        },
      ]);
      setUndone([]);
    }
    currentStroke.current = [];
  };

  const undo = () => {
    if (!strokes.length) return;
    const last = strokes[strokes.length - 1];
    setUndone((u) => [...u, last]);
    setStrokes((prev) => prev.slice(0, -1));
  };

  const redo = () => {
    if (!undone.length) return;
    const last = undone[undone.length - 1];
    setStrokes((prev) => [...prev, last]);
    setUndone((u) => u.slice(0, -1));
  };

  const clearDrawings = () => setStrokes([]);

  const hideCursor = () => {
    if (cursorRef.current) cursorRef.current.style.display = 'none';
  };

  return {
    strokes, setStrokes,
    undone, drawing,
    tool, setTool,
    penColor, setPenColor,
    penWidth, setPenWidth,
    eraserSize, setEraserSize,
    penAlpha, setPenAlpha,
    drawRef, cursorRef,
    drawStart, drawMove, drawEnd,
    undo, redo, clearDrawings, hideCursor,
  };
};
