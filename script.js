// Move the "No" button to a random position inside the button area (reverted to original behavior — no size changes)
const noBtn = document.getElementById('no');
const yesBtn = document.getElementById('yes');
const buttonArea = document.getElementById('buttonArea');

function moveNoButton() {
  const areaRect = buttonArea.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // compute available space inside buttonArea
  const maxX = Math.max(0, areaRect.width - btnRect.width);
  const maxY = Math.max(0, areaRect.height - btnRect.height);

  // choose a random position (add small padding so it doesn't stick to edges)
  const padding = 8;
  const randX = padding + Math.random() * Math.max(0, maxX - padding * 2);
  const randY = padding + Math.random() * Math.max(0, maxY - padding * 2);

  // position relative to buttonArea
  noBtn.style.left = `${randX}px`;
  noBtn.style.top = `${randY}px`;
  // reset transform so size stays normal
  noBtn.style.transform = `none`;
}

// When the mouse gets near (mouseenter) or touches the button area, move it
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
}, {passive:false});

// Prevent accidental click by moving on click as well if it's too slow
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveNoButton();
});

// When yes is clicked, go to success page
yesBtn.addEventListener('click', () => {
  window.location.href = 'success.html';
});

// initial placement to avoid overlap
window.addEventListener('load', () => {
  // place No absolutely inside its area
  noBtn.style.position = 'absolute';
  moveNoButton();
});
