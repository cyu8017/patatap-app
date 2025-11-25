import { useEffect, useMemo, useRef, useState } from 'react';
import { Howl } from 'howler';
import paper from 'paper';

const createKeyData = () => {
  const soundPath = (file) => `${import.meta.env.BASE_URL}sounds/${file}`;
  const base = {
    q: { sound: new Howl({ src: [soundPath('bubbles.mp3')] }), color: '#1abc9c' },
    w: { sound: new Howl({ src: [soundPath('clay.mp3')] }), color: '#2ecc71' },
    e: { sound: new Howl({ src: [soundPath('confetti.mp3')] }), color: '#3498db' },
    r: { sound: new Howl({ src: [soundPath('corona.mp3')] }), color: '#9b59b6' },
    t: { sound: new Howl({ src: [soundPath('dotted-spiral.mp3')] }), color: '#34495e' },
    y: { sound: new Howl({ src: [soundPath('flash-1.mp3')] }), color: '#16a085' },
    u: { sound: new Howl({ src: [soundPath('flash-2.mp3')] }), color: '#27ae60' },
    i: { sound: new Howl({ src: [soundPath('flash-3.mp3')] }), color: '#2980b9' },
    o: { sound: new Howl({ src: [soundPath('glimmer.mp3')] }), color: '#8e44ad' },
    p: { sound: new Howl({ src: [soundPath('moon.mp3')] }), color: '#2c3e50' },
    a: { sound: new Howl({ src: [soundPath('pinwheel.mp3')] }), color: '#f1c40f' },
    s: { sound: new Howl({ src: [soundPath('piston-1.mp3')] }), color: '#e67e22' },
    d: { sound: new Howl({ src: [soundPath('piston-2.mp3')] }), color: '#e74c3c' },
    f: { sound: new Howl({ src: [soundPath('prism-1.mp3')] }), color: '#95a5a6' },
    g: { sound: new Howl({ src: [soundPath('prism-2.mp3')] }), color: '#f39c12' },
    h: { sound: new Howl({ src: [soundPath('prism-3.mp3')] }), color: '#d35400' },
    j: { sound: new Howl({ src: [soundPath('splits.mp3')] }), color: '#1abc9c' },
    k: { sound: new Howl({ src: [soundPath('squiggle.mp3')] }), color: '#2ecc71' },
    l: { sound: new Howl({ src: [soundPath('strike.mp3')] }), color: '#3498db' },
    z: { sound: new Howl({ src: [soundPath('suspension.mp3')] }), color: '#9b59b6' },
    x: { sound: new Howl({ src: [soundPath('timer.mp3')] }), color: '#34495e' },
    c: { sound: new Howl({ src: [soundPath('ufo.mp3')] }), color: '#16a085' },
    v: { sound: new Howl({ src: [soundPath('veil.mp3')] }), color: '#27ae60' },
    b: { sound: new Howl({ src: [soundPath('wipe.mp3')] }), color: '#2980b9' },
    n: { sound: new Howl({ src: [soundPath('zig-zag.mp3')] }), color: '#8e44ad' },
    m: { sound: new Howl({ src: [soundPath('moon.mp3')] }), color: '#2c3e50' },
  };

  // Guarantee every alphabet letter maps to a sound/color (even if base changes).
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const baseKeys = Object.keys(base);

  return alphabet.reduce((acc, letter, index) => {
    acc[letter] = base[letter] || base[baseKeys[index % baseKeys.length]];
    return acc;
  }, {});
};

const titleLetters = ['P', 'A', 'T', 'A', 'T', 'A', 'P'];
const titleColors = ['#1abc9c', '#e74c3c', '#f1c40f', '#9b59b6', '#3498db', '#e67e22', '#2ecc71'];
const featuredKeys = ['Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F', 'Z', 'X', 'C', 'V'];
const holidayKeys = ['q', 'w', 'e', 'r', 't', 'y', 'a', 's', 'd', 'f', 'z', 'x', 'c', 'v'];

const isHolidaySeason = () => {
  const now = new Date();
  return now.getMonth() === 11 && now.getDate() >= 1;
};

function App() {
  const canvasRef = useRef(null);
  const keyData = useMemo(() => createKeyData(), []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);
  const [legendVisible, setLegendVisible] = useState(true);
  const playKeyRef = useRef(null);
  const autoIntervalRef = useRef(null);
  const legendTimeoutRef = useRef(null);
  const paletteColors = useMemo(() => Array.from(new Set(Object.values(keyData).map((entry) => entry.color))), [keyData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    paper.setup(canvas);
    const circles = [];

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      paper.view.viewSize = new paper.Size(canvas.clientWidth, canvas.clientHeight);
    };

    const registerInteraction = () => {
      setLegendVisible(true);
      if (legendTimeoutRef.current) clearTimeout(legendTimeoutRef.current);
      legendTimeoutRef.current = setTimeout(() => setLegendVisible(false), 5200);
    };

    const playKey = (letter) => {
      const data = keyData[letter.toLowerCase()];
      if (!data) return;

      const maxPoint = new paper.Point(paper.view.size.width, paper.view.size.height);
      const point = maxPoint.multiply(paper.Point.random());
      const baseRadius = Math.max(paper.view.size.width, paper.view.size.height) * 0.25;
      const radius = baseRadius * (0.25 + Math.random() * 1.1);
      const circle = new paper.Path.Circle(point, radius);
      const fill = new paper.Color(data.color);
      fill.alpha = 0.9;
      const stroke = fill.clone();
      stroke.alpha = 0.25;
      circle.fillColor = fill;
      circle.strokeColor = stroke;
      circle.strokeWidth = 2 + Math.random() * 5;
      circle.data = {
        fade: 0.016 + Math.random() * 0.012,
        strokeGrow: 0.35 + Math.random() * 0.45,
      };
      circle.blendMode = 'screen';
      data.sound.play();
      circles.push(circle);
      setCurrentKey(letter.toUpperCase());
      registerInteraction();
    };

    playKeyRef.current = playKey;

    const handleKeyDown = (event) => {
      playKey(event.key);
    };

    const onFrame = () => {
      for (let i = circles.length - 1; i >= 0; i -= 1) {
        const circle = circles[i];
        if (!circle) continue;
        circle.fillColor.hue += 1;
        circle.strokeColor.hue += 1;
        circle.scale(0.93);
        circle.strokeWidth += circle.data.strokeGrow;
        circle.fillColor.alpha = Math.max(0, circle.fillColor.alpha - circle.data.fade);
        circle.strokeColor.alpha = Math.max(0, circle.strokeColor.alpha - circle.data.fade * 0.6);

        if (circle.area < 1 || (circle.fillColor.alpha <= 0.01 && circle.strokeColor.alpha <= 0.01)) {
          circle.remove();
          circles.splice(i, 1);
        }
      }
    };

    resizeCanvas();
    paper.view.onFrame = onFrame;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', resizeCanvas);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', resizeCanvas);
        paper.view.onFrame = null;
        circles.forEach((circle) => circle.remove());
        playKeyRef.current = null;
        paper.project.clear();
        if (legendTimeoutRef.current) clearTimeout(legendTimeoutRef.current);
      };
  }, [keyData]);

  const holidayActive = isHolidaySeason();

  useEffect(() => {
    if (!holidayActive && autoPlaying) {
      setAutoPlaying(false);
    }
  }, [holidayActive, autoPlaying]);

  useEffect(() => {
    if (!autoPlaying) return undefined;
    if (!playKeyRef.current) return undefined;

    const playRandom = () => {
      const letter = holidayKeys[Math.floor(Math.random() * holidayKeys.length)];
      playKeyRef.current?.(letter);
    };

    playRandom();
    autoIntervalRef.current = setInterval(playRandom, 420);

    return () => {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    };
  }, [autoPlaying]);

  return (
    <div className="app">
      <canvas ref={canvasRef} id="myCanvas" />
      <div className="top-bar">
        <button
          type="button"
          className={`hamburger ripple ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <aside className={`drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="drawer-header">
          <span className="drawer-title">Menu</span>
          <button type="button" className="close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            ✕
          </button>
        </div>
        <nav className="drawer-nav">
          <button type="button" className="drawer-link" onClick={() => setMenuOpen(false)}>
            Instructions
          </button>
          <button type="button" className="drawer-link" onClick={() => setMenuOpen(false)}>
            Sounds
          </button>
          <button type="button" className="drawer-link" onClick={() => setMenuOpen(false)}>
            About
          </button>
        </nav>
      </aside>
      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      <div className="overlay">
        <h1 className="title">
          {titleLetters.map((letter, index) => (
            <span key={`${letter}-${index}`} style={{ color: titleColors[index % titleColors.length] }}>
              {letter}
            </span>
          ))}
        </h1>
        <p className="hero-sub">
          Press any letter key to create sound and color
          <span className="caret" />
        </p>

        <div className="hud">
          <div className="chip glassy">
            <span className="chip-label">Auto play</span>
            <span className={`pill ${autoPlaying ? 'on' : 'off'}`}>{autoPlaying ? 'On' : 'Off'}</span>
          </div>
          {currentKey && (
            <div className="chip glassy">
              <span className="chip-label">Now playing</span>
              <span className="pill loud">{currentKey}</span>
            </div>
          )}
          <div className="chip glassy">
            <span className="chip-label">Volume</span>
            <span className="pill">100%</span>
          </div>
        </div>

        <div className="helper">
          <div className="helper-header">Try these</div>
          <div className="key-grid">
            {featuredKeys.map((letter) => {
              const data = keyData[letter.toLowerCase()];
              return (
                <div key={letter} className="key-pill">
                  <span className="dot" style={{ backgroundColor: data?.color }} />
                  <span className="label">{letter}</span>
                </div>
              );
            })}
          </div>
          <div className="hint">Hold a key to layer sounds and visuals.</div>
        </div>

        {holidayActive && (
          <div className="auto-card">
            <div className="auto-card__header">
              <span className="auto-card__title">Auto Patatap · Christmas</span>
              <span className={`auto-card__status ${autoPlaying ? 'on' : 'off'}`}>
                {autoPlaying ? 'Playing' : 'Idle'}
              </span>
            </div>
            <p className="auto-card__copy">Let it snow! Auto-play a festive sequence of sounds and circles.</p>
            <button
              type="button"
              className={`auto-btn ripple ${autoPlaying ? 'stop' : 'start'}`}
              onClick={() => setAutoPlaying((prev) => !prev)}
            >
              {autoPlaying ? 'Stop Auto Play' : 'Start Auto Play'}
            </button>
          </div>
        )}

        {legendVisible && (
          <div className="palette-ribbon">
            {paletteColors.map((color, idx) => (
              <span key={color + idx} className="swatch" style={{ backgroundColor: color }} />
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <div className={`progress ${autoPlaying ? 'animate' : ''}`} />
      </footer>
    </div>
  );
}

export default App;
