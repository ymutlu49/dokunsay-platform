import { useState, useRef, useEffect } from 'react';
import { THEME } from './constants/theme';
import { useCanvasItems } from './hooks/useCanvasItems';
import { useNumberLine } from './hooks/useNumberLine';
import { useTray } from './hooks/useTray';
import { useFactory } from './hooks/useFactory';
import { useDrawing } from './hooks/useDrawing';
import { usePages } from './hooks/usePages';
import { usePanelDrag } from './hooks/usePanelDrag';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import BottomBar from './components/layout/BottomBar';
import Toolbar from './components/canvas/Toolbar';
import NumberLine from './components/canvas/NumberLine';
import VerticalNumberLine from './components/canvas/VerticalNumberLine';
import OperationTray from './components/canvas/OperationTray';
import Factory from './components/canvas/Factory';
import Thermometer from './components/canvas/Thermometer';
import BridgePanel from './components/canvas/BridgePanel';
import Chip from './components/common/Chip';
import ActivityModal from './components/modals/ActivityModal';
import HelpModal from './components/modals/HelpModal';
import AboutModal from './components/modals/AboutModal';
import TeacherPanel from './components/modals/TeacherPanel';

const App = () => {
  const cvRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  // UI state - declared early for hook dependencies
  const [showNumberLine, setShowNumberLine] = useState(true);

  // Canvas items
  const canvasItems = useCanvasItems();
  const { items, setItems, poofs, addItem, moveItem, removeItem, checkZeroPair, addChips, addZeroPair, clearAll, posCount, negCount, zeroPairs, netValue, GRID } = canvasItems;

  // Number line
  const numberLine = useNumberLine();
  const { jumps, setJumps, position: nlPos, setPosition: setNlPos, walkDirection, animateNumberLine, walkStep, resetNumberLine } = numberLine;

  // Tray
  const tray = useTray(animateNumberLine);
  const { showTray, setShowTray } = tray;

  // Factory
  const factory = useFactory(addItem, animateNumberLine, showNumberLine, GRID);
  const { showFactory, setShowFactory } = factory;

  // Drawing
  const drawing = useDrawing(cvRef, zoom);
  const { strokes, setStrokes, tool, drawRef, cursorRef, drawStart, drawMove, drawEnd, hideCursor } = drawing;

  // Pages
  const pages = usePages(items, setItems, strokes, setStrokes);

  // Panel drag
  const panelDrag = usePanelDrag(cvRef, zoom);
  const { positions: panelPositions, startPanelDrag, resetPosition } = panelDrag;

  // UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('mat');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [instructionScreen, setInstructionScreen] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);
  const [completed, setCompleted] = useState({});
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [teacherNotes, setTeacherNotes] = useState('');
  const [bgType, setBgType] = useState('plain');
  const [bgColor, setBgColor] = useState(THEME.bg);
  const [game, setGame] = useState(null);
  const [showVertical, setShowVertical] = useState(false);
  const [showThermometer, setShowThermometer] = useState(false);
  const [temp, setTemp] = useState(0);
  const [elevator, setElevator] = useState(0);

  // Sidebar drag state
  const [sidebarDrag, setSidebarDrag] = useState(null);
  const [sidebarDragPos, setSidebarDragPos] = useState({ x: 0, y: 0 });
  const [itemDrag, setItemDrag] = useState(null);
  const [dropHighlight, setDropHighlight] = useState(false);
  const [overTrash, setOverTrash] = useState(false);

  useEffect(() => { if (window.innerWidth < 768) setSidebarCollapsed(true); }, []);

  // Symbolic expression
  let symExpr = '';
  if (posCount > 0 || negCount > 0) {
    const parts = [];
    if (posCount > 0) parts.push('(+' + posCount + ')');
    if (negCount > 0) parts.push('(\−' + negCount + ')');
    symExpr = parts.join(' + ') + ' = ' + (netValue >= 0 ? '+' : '') + netValue;
  }

  // Sidebar drag handlers
  const startSidebarDrag = (t, v, e) => {
    e.preventDefault();
    setSidebarDrag({ t, v });
    setSidebarDragPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!sidebarDrag) return;
    const checkInCanvas = (ex, ey) => {
      if (!cvRef.current) return false;
      const r = cvRef.current.getBoundingClientRect();
      return ex > r.left - 40 && ex < r.right + 40 && ey > r.top - 40 && ey < r.bottom + 40;
    };
    const onMove = (e) => {
      if (e.buttons === 0) { setSidebarDrag(null); setDropHighlight(false); return; }
      setSidebarDragPos({ x: e.clientX, y: e.clientY });
      setDropHighlight(checkInCanvas(e.clientX, e.clientY));
    };
    const onUp = (e) => {
      setDropHighlight(false);
      if (cvRef.current && checkInCanvas(e.clientX, e.clientY)) {
        const r = cvRef.current.getBoundingClientRect();
        const dx = (e.clientX - r.left) / zoom;
        const dy = (e.clientY - r.top) / zoom;
        if (sidebarDrag.t === 'tool') {
          if (sidebarDrag.v === 'tray') { setShowTray(true); panelDrag.setPosition('tray', { x: dx - 200, y: dy - 40 }); }
          else if (sidebarDrag.v === 'fab') { setShowFactory(true); panelDrag.setPosition('fab', { x: dx - 130, y: dy - 40 }); }
          else if (sidebarDrag.v === 'tm') { setShowThermometer(true); panelDrag.setPosition('tm', { x: dx - 60, y: dy - 80 }); }
          else if (sidebarDrag.v === 'nl') { setShowNumberLine(true); panelDrag.setPosition('nl', { x: dx - 200, y: dy - 40 }); }
        } else {
          addItem(sidebarDrag.t, sidebarDrag.v, dx, dy);
        }
      }
      setSidebarDrag(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  });

  // Item drag handlers
  const startItemDrag = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    setItemDrag({ id, offX: (e.clientX - r.left) / zoom, offY: (e.clientY - r.top) / zoom });
  };

  useEffect(() => {
    if (!itemDrag) return;
    const onMove = (e) => {
      if (e.buttons === 0) { setItemDrag(null); return; }
      if (!cvRef.current) return;
      const r = cvRef.current.getBoundingClientRect();
      moveItem(itemDrag.id, (e.clientX - r.left) / zoom - itemDrag.offX, (e.clientY - r.top) / zoom - itemDrag.offY);
      setOverTrash(e.clientY > r.bottom - 50);
    };
    const onUp = (e) => {
      const id = itemDrag.id;
      if (cvRef.current && e.clientY > cvRef.current.getBoundingClientRect().bottom - 50) {
        removeItem(id);
      } else {
        checkZeroPair(id);
      }
      setItemDrag(null);
      setOverTrash(false);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  });

  // Elevator
  const moveElevator = (delta) => {
    const target = Math.max(-5, Math.min(5, elevator + delta));
    setElevator(target);
  };
  const changeTemp = (delta) => setTemp((t) => Math.max(-10, Math.min(10, t + delta)));

  // Canvas background
  const cvBg = { background: bgColor };
  if (bgType === 'grid') {
    cvBg.backgroundImage = 'linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px)';
    cvBg.backgroundSize = '24px 24px';
  }
  if (bgType === 'dot') {
    cvBg.backgroundImage = 'radial-gradient(rgba(0,0,0,.08) 1px,transparent 1px)';
    cvBg.backgroundSize = '20px 20px';
  }

  // Render item
  const renderItem = (it) => {
    const chipR = 16;
    if (it.t === 'pos' || it.t === 'neg') {
      return (
        <div key={'it' + it.id} style={{ position: 'absolute', left: it.x - chipR, top: it.y - chipR, width: chipR * 2, height: chipR * 2, zIndex: 2, cursor: 'grab', touchAction: 'none' }}
          onPointerDown={(e) => startItemDrag(it.id, e)}>
          <Chip type={it.t} size={chipR} />
        </div>
      );
    }
    if (it.t === 'op') {
      return (
        <div key={'it' + it.id} style={{ position: 'absolute', left: it.x - 18, top: it.y - 18, width: 36, height: 36, zIndex: 2, cursor: 'grab', touchAction: 'none' }}
          onPointerDown={(e) => startItemDrag(it.id, e)}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: '2.5px solid ' + THEME.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: THEME.accent, boxShadow: '0 2px 8px rgba(245,158,11,.15)' }}>{it.v}</div>
        </div>
      );
    }
    if (it.t === 'num') {
      return (
        <div key={'it' + it.id} style={{ position: 'absolute', left: it.x - 20, top: it.y - 16, zIndex: 2, cursor: 'grab', touchAction: 'none' }}
          onPointerDown={(e) => startItemDrag(it.id, e)}>
          <div style={{
            padding: '6px 14px', borderRadius: 10,
            background: it.v >= 0 ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)',
            border: '2px solid ' + (it.v >= 0 ? THEME.pos : THEME.neg),
            fontSize: 20, fontWeight: 900, color: it.v >= 0 ? THEME.posB : THEME.negB,
            textAlign: 'center', minWidth: 40,
          }}>{it.v >= 0 ? '+' + it.v : it.v}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: "'Nunito','Segoe UI',system-ui,sans-serif" }}>
      <Header posCount={posCount} negCount={negCount} netValue={netValue} zoom={zoom} setZoom={setZoom} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}
          activeTab={activeTab} setActiveTab={setActiveTab}
          materialsProps={{
            addChips, addZeroPair, clearAll, startSidebarDrag,
            showTray, setShowTray, resetTray: tray.reset,
            showFactory, setShowFactory, factoryReset: factory.reset,
            showThermometer, setShowThermometer, setTemp,
            showNumberLine, setShowNumberLine, resetNlPosition: () => panelDrag.resetPosition('nl'),
            walkStep, animateNumberLine, resetNumberLine,
          }}
          activitiesProps={{ activeTemplate, setActiveTemplate, setInstructionScreen }}
          gamesProps={{
            game, setGame, posCount, negCount, netValue,
            animateNumberLine, setNlJumps: setJumps, setNlPos,
          }}
          featuresProps={{
            showVertical, setShowVertical,
            elevator, setElevator, moveElevator,
            temp, changeTemp, setTemp,
          }}
        />

        {/* Canvas */}
        <div ref={cvRef} style={{ ...cvBg, flex: 1, position: 'relative', overflow: 'auto' }}>
          <Toolbar {...drawing} strokes={drawing.strokes} undone={drawing.undone} />

          {/* Cursor indicator */}
          <div ref={cursorRef} style={{ position: 'absolute', display: 'none', borderRadius: '50%', border: '2px solid #000', pointerEvents: 'none', zIndex: 26, transition: 'width .1s,height .1s' }} />

          {/* Drawing canvas */}
          <canvas ref={drawRef} style={{
            position: 'absolute', inset: 0, zIndex: tool !== 'select' ? 25 : 0,
            pointerEvents: tool !== 'select' ? 'auto' : 'none',
            cursor: tool !== 'select' ? 'none' : 'default',
          }} onPointerDown={drawStart} onPointerMove={drawMove} onPointerUp={drawEnd} onPointerCancel={drawEnd} onPointerLeave={hideCursor} />

          {/* Zoom wrapper */}
          <div style={{ position: 'absolute', inset: 0, transform: 'scale(' + zoom + ')', transformOrigin: '0 0', width: (100 / zoom) + '%', height: (100 / zoom) + '%' }}>
            {/* Operation Tray */}
            {showTray && (
              <OperationTray
                trayA={tray.trayA} setTrayA={tray.setTrayA}
                trayB={tray.trayB} setTrayB={tray.setTrayB}
                operator={tray.operator} setOperator={tray.setOperator}
                result={tray.result} calculate={tray.calculate} reset={() => { tray.reset(); resetNumberLine(); }}
                valueA={tray.valueA} valueB={tray.valueB}
                panelPos={panelPositions.tray} startPanelDrag={startPanelDrag}
              />
            )}

            {/* Factory */}
            {showFactory && (
              <Factory
                posCount={factory.posCount} setPosCount={factory.setPosCount}
                negCount={factory.negCount} setNegCount={factory.setNegCount}
                step={factory.step} pairs={factory.pairs} result={factory.result}
                mix={factory.mix} solve={factory.solve} reset={factory.reset}
                setShowFactory={setShowFactory}
                panelPos={panelPositions.fab} startPanelDrag={startPanelDrag}
              />
            )}

            {/* Vertical number line */}
            {showVertical && <VerticalNumberLine />}

            {/* Number line */}
            {showNumberLine && (
              <NumberLine
                position={nlPos} jumps={jumps} walkDirection={walkDirection}
                animateNumberLine={animateNumberLine}
                panelPos={panelPositions.nl} startPanelDrag={startPanelDrag} resetPosition={resetPosition}
              />
            )}

            {/* Thermometer on canvas */}
            {showThermometer && (
              <Thermometer
                temp={temp} changeTemp={changeTemp} setTemp={setTemp}
                panelPos={panelPositions.tm} startPanelDrag={startPanelDrag} resetPosition={resetPosition}
              />
            )}

            {/* Bridge panel */}
            {items.length > 0 && (
              <BridgePanel
                posCount={posCount} negCount={negCount} zeroPairs={zeroPairs}
                netValue={netValue} symExpr={symExpr} animateNumberLine={animateNumberLine}
                panelPos={panelPositions.bridge} startPanelDrag={startPanelDrag}
                showFactory={showFactory}
              />
            )}

            {/* Game indicator */}
            {game && (
              <div style={{ position: 'absolute', top: 56, left: 16, zIndex: 4, padding: '6px 14px', borderRadius: 10, background: 'rgba(245,158,11,.1)', border: '1.5px solid rgba(245,158,11,.2)' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: THEME.accentD }}>{'\ud83c\udfc6 ' + game.score}</span>
                {game.feedback === 'correct' && <span style={{ marginLeft: 8, fontSize: 18, animation: 'popIn .3s' }}>{'🎉'}</span>}
              </div>
            )}

            {/* Drop highlight */}
            {sidebarDrag && dropHighlight && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 0, border: '3px dashed rgba(245,158,11,.4)', borderRadius: 4, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: THEME.accentL, padding: '8px 20px', borderRadius: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(245,158,11,.6)' }}>{'📥 Buraya bırak'}</span>
                </div>
              </div>
            )}

            {/* Empty state */}
            {items.length === 0 && !showTray && !showFactory && !showNumberLine && !showThermometer && strokes.length === 0 && (
              <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none', animation: 'fadeIn .6s' }}>
                <div style={{ fontSize: 44, marginBottom: 8, animation: 'float 4s ease-in-out infinite' }}>{'\⊕ \⊖'}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'rgba(60,50,30,.12)' }}>Pulları sürükleyerek tam sayıları keşfet!</div>
              </div>
            )}

            {/* Canvas items */}
            {items.map(renderItem)}

            {/* Zero pair poof animations */}
            {poofs.map((pf) => (
              <div key={'pf' + pf.id} style={{ position: 'absolute', left: pf.x - 30, top: pf.y - 30, width: 60, height: 60, zIndex: 10, pointerEvents: 'none', animation: 'zeroPoof .8s forwards' }}>
                <svg width={60} height={60}>
                  <circle cx={30} cy={30} r={24} fill="rgba(139,92,246,.3)" stroke="#8b5cf6" strokeWidth={2} />
                  <text x={30} y={35} textAnchor="middle" fontSize={20} fontWeight={900} fill="#6d28d9">0</text>
                </svg>
              </div>
            ))}
          </div>

          {/* Trash area */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: overTrash ? 'rgba(239,68,68,.15)' : itemDrag ? 'rgba(0,0,0,.04)' : 'rgba(0,0,0,.02)',
            borderTop: overTrash ? '2px solid ' + THEME.red : '1px solid rgba(0,0,0,.05)',
            zIndex: 20, transition: 'background .2s',
          }}>
            <span style={{ fontSize: overTrash ? 20 : 14, transition: 'font-size .2s' }}>{overTrash ? '🗑️' : '🗑'}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: overTrash ? THEME.red : itemDrag ? '#aaa' : '#ccc' }}>
              {overTrash ? 'Bırak \→ Sil' : itemDrag ? 'Buraya sürükle \→ Sil' : 'Silme Alanı'}
            </span>
          </div>

          {/* Credits */}
          <div style={{ position: 'absolute', bottom: 10, right: 12, fontSize: 10, fontWeight: 700, color: 'rgba(60,50,30,.06)', pointerEvents: 'none' }}>
            Prof. Dr. Yılmaz Mutlu \• Rumeysa Durgun
          </div>
        </div>
      </div>

      <BottomBar
        bgType={bgType} setBgType={setBgType} bgColor={bgColor} setBgColor={setBgColor}
        pages={pages.pages} currentPage={pages.currentPage}
        switchPage={pages.switchPage} addPage={pages.addPage} deletePage={pages.deletePage}
        setShowHelp={setShowHelp} setShowAbout={setShowAbout} setShowTeacher={setShowTeacher}
      />

      {/* Ghost drag */}
      {sidebarDrag && (
        <div style={{ position: 'fixed', left: sidebarDragPos.x - 14, top: sidebarDragPos.y - 14, zIndex: 9999, pointerEvents: 'none', opacity: .85 }}>
          {sidebarDrag.t === 'pos' && <Chip type="pos" size={14} />}
          {sidebarDrag.t === 'neg' && <Chip type="neg" size={14} />}
          {sidebarDrag.t === 'op' && (
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#fff', border: '2px solid ' + THEME.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: THEME.accent }}>{sidebarDrag.v}</div>
          )}
          {sidebarDrag.t === 'num' && (
            <div style={{ padding: '2px 8px', borderRadius: 6, background: '#fff', border: '2px solid ' + (sidebarDrag.v >= 0 ? THEME.pos : THEME.neg), fontSize: 13, fontWeight: 900, color: sidebarDrag.v >= 0 ? THEME.posB : THEME.negB }}>{sidebarDrag.v >= 0 ? '+' + sidebarDrag.v : sidebarDrag.v}</div>
          )}
          {sidebarDrag.t === 'tool' && (
            <div style={{ padding: '6px 14px', borderRadius: 10, background: '#fff', border: '2px solid ' + THEME.accent, boxShadow: '0 4px 16px rgba(0,0,0,.15)', fontSize: 12, fontWeight: 800, color: THEME.text }}>
              {sidebarDrag.v === 'tray' ? '🧮 İşlem Tepsisi' : sidebarDrag.v === 'fab' ? '🏭 Fabrika' : sidebarDrag.v === 'tm' ? '🌡️ Termometre' : '📏 Sayı Doğrusu'}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {instructionScreen && <ActivityModal activity={instructionScreen} onClose={() => setInstructionScreen(null)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showTeacher && (
        <TeacherPanel
          onClose={() => setShowTeacher(false)}
          studentName={studentName} setStudentName={setStudentName}
          studentClass={studentClass} setStudentClass={setStudentClass}
          notes={teacherNotes} setNotes={setTeacherNotes}
          completed={completed} setCompleted={setCompleted}
          game={game}
        />
      )}
    </div>
  );
};

export default App;
