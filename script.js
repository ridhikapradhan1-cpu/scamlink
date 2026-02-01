// Smarter evasive "No" button: moves whenever the cursor gets too close
const noBtn = document.getElementById('no');
const yesBtn = document.getElementById('yes');
const buttonArea = document.getElementById('buttonArea');

let areaRect = null;
let btnRect = null;
let lastMove = 0;

const MOVE_COOLDOWN = 80;   // ms between forced moves to avoid thrash
const MIN_DISTANCE = 140;  // px - minimum distance the button should keep from cursor

function updateRects() {
  areaRect = buttonArea.getBoundingClientRect();
  btnRect = noBtn.getBoundingClientRect();
}

// pick a random position inside buttonArea (top-left coords)
// ensuring it's at least MIN_DISTANCE away from cursor if provided
function chooseSafePosition(cx = null, cy = null, minDist = MIN_DISTANCE) {
  updateRects();
  const padding = 8;
  const maxX = Math.max(0, areaRect.width - btnRect.width - padding * 2);
  const maxY = Math.max(0, areaRect.height - btnRect.height - padding * 2);

  // If no cursor provided, just pick random
  if (cx === null || cy === null) {
    return {
      x: padding + Math.random() * maxX,
      y: padding + Math.random() * maxY
    };
  }

  // cursor coordinates relative to area
  const cursorX = cx - areaRect.left;
  const cursorY = cy - areaRect.top;

  // attempt to find a position far enough away
  for (let i = 0; i < 60; i++) {
    const rx = padding + Math.random() * maxX;
    const ry = padding + Math.random() * maxY;

    const centerX = rx + btnRect.width / 2;
    const centerY = ry + btnRect.height / 2;

    const dx = centerX - cursorX;
    const dy = centerY - cursorY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist >= minDist) {
      return { x: rx, y: ry };
    }
  }

  // fallback: jump to an edge away from cursor
  return {
    x: cursorX < areaRect.width / 2 ? maxX : padding,
    y: cursorY < areaRect.height / 2 ? maxY : padding
  };
}

function moveNoButtonTo(x, y) {
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = 'none';
}

// Move away from given cursor position
function moveNoAwayFrom(clientX, clientY) {
  const now = Date.now();
  if (now - lastMove < MOVE_COOLDOWN) return;
  lastMove = now;

  const pos = chooseSafePosition(clientX, clientY);
  moveNoButtonTo(pos.x, pos.y);
}

// Initial random placement
function placeNoRandom() {
  updateRects();
  const padding = 8;
  const maxX = Math.max(0, areaRect.width - btnRect.width - padding * 2);
  const maxY = Math.max(0, areaRect.height - btnRect.height - padding * 2);

  moveNoButtonTo(
    padding + Math.random() * maxX,
    padding + Math.random() * maxY
  );
}

// Mouse movement inside the button area
buttonArea.addEventListener('mousemove', (e) => {
  updateRects();

  const btnCenterX = btnRect.left + btnRect.width / 2;
  const btnCenterY = btnRect.top + btnRect.height / 2;

  const dx = btnCenterX - e.clientX;
  const dy = btnCenterY - e.clientY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < MIN_DISTANCE) {
    moveNoAwayFrom(e.clientX, e.clientY);
  }
});

// Move immediately if mouse tries to enter No
noBtn.addEventListener('mouseenter', (e) => {
  moveNoAwayFrom(e.clientX, e.clientY);
});

// Touch support (mobile)
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  moveNoAwayFrom(t.clientX, t.clientY);
}, { passive: false });

// Prevent clicking No
noBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (e.clientX && e.clientY) {
    moveNoAwayFrom(e.clientX, e.clientY);
  } else {
    const p = chooseSafePosition();
    moveNoButtonTo(p.x, p.y);
  }
});

// When Yes is clicked, go to success page
yesBtn.addEventListener('click', () => {
  window.location.href = 'success.html';
});

// Initial setup
window.addEventListener('load', () => {
  noBtn.style.position = 'absolute';
  noBtn.style.transformOrigin = 'center center';

  updateRects();
  btnRect = noBtn.getBoundingClientRect();

  placeNoRandom();
  btnRect = noBtn.getBoundingClientRect();
});
