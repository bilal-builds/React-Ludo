const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #1a1a2e;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Segoe UI', Arial, sans-serif;
    padding: 24px;
  }

  .ludo-title {
    color: #fff;
    font-size: 36px;
    letter-spacing: 8px;
    margin-bottom: 28px;
    text-align: center;
    font-weight: 700;
  }
  .ludo-title span { color: #e53935; }

  .board {
    display: grid;
    grid-template-columns: repeat(15, 1fr);
    width: min(560px, 92vw);
    aspect-ratio: 1;
    border: 4px solid #111;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6);
  }

  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    border: 0.5px solid rgba(0,0,0,0.12);
    position: relative;
  }

  .red-home    { background: #e53935; }
  .green-home  { background: #43a047; }
  .yellow-home { background: #fdd835; }
  .blue-home   { background: #1e88e5; }

  .home-yard {
    width: 75%; height: 75%;
    border-radius: 8px;
    background: rgba(255,255,255,0.22);
    display: flex; align-items: center; justify-content: center;
  }

  .white-path  { background: #ffffff; }
  .red-path    { background: #ffcdd2; }
  .green-path  { background: #c8e6c9; }
  .yellow-path { background: #fff9c4; }
  .blue-path   { background: #bbdefb; }

  .center-red    { background: #e53935; }
  .center-green  { background: #43a047; }
  .center-yellow { background: #fdd835; }
  .center-blue   { background: #1e88e5; }
  .center-white  { background: #f0f0f0; }

  .star-cell { background: #fff; }
  .star-icon { font-size: 11px; color: rgba(0,0,0,0.35); }
  .arrow     { font-size: 11px; color: rgba(0,0,0,0.35); font-weight: 700; }

  .piece {
    width: 62%; height: 62%;
    border-radius: 50%;
    border: 2px solid rgba(0,0,0,0.3);
  }
  .p-red    { background: #c62828; }
  .p-green  { background: #2e7d32; }
  .p-yellow { background: #f9a825; }
  .p-blue   { background: #1565c0; }

  .legend {
    display: flex; gap: 16px;
    margin-top: 24px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .player-tag {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px;
    padding: 8px 18px;
    color: #fff;
    font-size: 14px; font-weight: 500;
  }

  .dot {
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(0,0,0,0.25);
    flex-shrink: 0;
  }
  .dot-red    { background: #e53935; }
  .dot-green  { background: #43a047; }
  .dot-yellow { background: #fdd835; border-color: rgba(0,0,0,0.15); }
  .dot-blue   { background: #1e88e5; }
`;

const STAR_CELLS = new Set([
  '2,6','6,2','8,12','12,8',
  '6,12','12,6','2,8','8,2'
]);

const ARROW_CELLS = {
  '7,1':'→','7,2':'→','7,3':'→','7,4':'→','7,5':'→',
  '1,7':'↓','2,7':'↓','3,7':'↓','4,7':'↓','5,7':'↓',
  '7,9':'→','7,10':'→','7,11':'→','7,12':'→','7,13':'→',
  '9,7':'↓','10,7':'↓','11,7':'↓','12,7':'↓','13,7':'↓',
};

const PIECES = {
  '1,1':'red','1,4':'red','4,1':'red','4,4':'red',
  '1,10':'green','1,13':'green','4,10':'green','4,13':'green',
  '10,1':'yellow','10,4':'yellow','13,1':'yellow','13,4':'yellow',
  '10,10':'blue','10,13':'blue','13,10':'blue','13,13':'blue',
};

const PIECE_CLASS = { red:'p-red', green:'p-green', yellow:'p-yellow', blue:'p-blue' };

function isHomeZone(r, c) {
  return (r < 6 && c < 6) || (r < 6 && c > 8) ||
         (r > 8 && c < 6) || (r > 8 && c > 8);
}

function getCellClass(r, c) {
  if (r < 6 && c < 6)   return 'red-home';
  if (r < 6 && c > 8)   return 'green-home';
  if (r > 8 && c < 6)   return 'yellow-home';
  if (r > 8 && c > 8)   return 'blue-home';

  if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
    if (r === 6) return 'center-green';
    if (r === 8) return 'center-yellow';
    if (c === 6) return 'center-red';
    if (c === 8) return 'center-blue';
    return 'center-white';
  }

  const key = `${r},${c}`;
  if (STAR_CELLS.has(key)) return 'star-cell';

  if (r === 7 && c >= 1 && c <= 5)  return 'red-path';
  if (c === 7 && r >= 1 && r <= 5)  return 'red-path';
  if (r === 7 && c >= 9 && c <= 13) return 'green-path';
  if (c === 7 && r >= 9 && r <= 13) return 'blue-path';

  return 'white-path';
}

function Cell({ row, col }) {
  const key = `${row},${col}`;
  const cellClass = getCellClass(row, col);
  const home = isHomeZone(row, col);
  const piece = PIECES[key];
  const arrow = ARROW_CELLS[key];
  const isStar = STAR_CELLS.has(key);

  return (
    <div className={`cell ${cellClass}`}>
      {home ? (
        <div className="home-yard">
          {piece && <div className={`piece ${PIECE_CLASS[piece]}`} />}
        </div>
      ) : piece ? (
        <div className={`piece ${PIECE_CLASS[piece]}`} />
      ) : isStar ? (
        <span className="star-icon">★</span>
      ) : arrow ? (
        <span className="arrow">{arrow}</span>
      ) : null}
    </div>
  );
}

export default function LudoGame() {
  const cells = [];
  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      cells.push(<Cell key={`${r},${c}`} row={r} col={c} />);
    }
  }

  return (
    <div style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <style>{styles}</style>

      <h1 className="ludo-title">LU<span>D</span>O</h1>

      <div className="board">{cells}</div>

      
    </div>
  );
}