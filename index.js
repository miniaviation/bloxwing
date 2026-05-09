/* ══════════════════════════════════════
   DATA  (mirrors SAMPLE_GAMES constant)
══════════════════════════════════════ */
const SAMPLE_GAMES = [
  { id: 1, creator: "Player123", creatorCoin: "gold",   value: "250 R$" },
  { id: 2, creator: "xBlaze",    creatorCoin: "silver", value: "500 R$" },
  { id: 3, creator: "RoKing",    creatorCoin: "gold",   value: "1,000 R$" },
];

/* ══════════════════════════════════════
   GAME CARD component
══════════════════════════════════════ */
function createGameCard(game, index) {
  const card = document.createElement("div");
  card.className = "game-card";
  card.style.animationDelay = `${0.3 + index * 0.08}s`;

  const isGold = game.creatorCoin === "gold";
  const coinEmoji = isGold ? "🥇" : "🥈";
  const badgeClass = isGold ? "badge-gold" : "badge-silver";
  const coinClass  = isGold ? "coin-gold"  : "coin-silver";
  const label      = isGold ? "Gold"        : "Silver";

  card.innerHTML = `
    <div class="card-header">
      <span class="card-creator">${escHtml(game.creator)}</span>
      <span class="card-coin-badge ${badgeClass}">${label}</span>
    </div>
    <div class="card-coin-area">
      <div class="coin-display ${coinClass}">${coinEmoji}</div>
    </div>
    <div class="card-value">${escHtml(game.value)}</div>
    <div class="card-footer">
      <button class="btn-join">Join</button>
      <button class="btn-watch">Watch</button>
    </div>
  `;

  return card;
}

/* ══════════════════════════════════════
   EMPTY SLOT component
══════════════════════════════════════ */
function createEmptySlot() {
  const slot = document.createElement("div");
  slot.className = "empty-slot";
  slot.setAttribute("role", "button");
  slot.setAttribute("tabindex", "0");
  slot.innerHTML = `
    <span class="empty-slot-icon">＋</span>
    <span class="empty-slot-text">Waiting for player…</span>
  `;
  slot.addEventListener("click", openModal);
  slot.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") openModal(); });
  return slot;
}

/* ══════════════════════════════════════
   RENDER GRID
══════════════════════════════════════ */
function renderGrid() {
  const grid = document.getElementById("games-grid");
  grid.innerHTML = "";

  SAMPLE_GAMES.forEach((game, i) => {
    grid.appendChild(createGameCard(game, i));
  });

  // Two empty slots (matches JSX)
  grid.appendChild(createEmptySlot());
  grid.appendChild(createEmptySlot());

  // Update badge count
  document.getElementById("game-count-badge").textContent = `${SAMPLE_GAMES.length} open`;
}

/* ══════════════════════════════════════
   MODAL  (mirrors CreateGameModal)
══════════════════════════════════════ */
const overlay   = document.getElementById("modal-overlay");
let selectedCoin = "gold";

function openModal() {
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  // Reset form
  document.getElementById("wager-input").value = "";
  setActiveCoin("gold");
}

function closeModal() {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setActiveCoin(coin) {
  selectedCoin = coin;
  document.getElementById("choice-gold").classList.toggle("active",   coin === "gold");
  document.getElementById("choice-silver").classList.toggle("active", coin === "silver");
}

// Open via header button
document.getElementById("btn-create-game").addEventListener("click", openModal);

// Close buttons
document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("btn-cancel").addEventListener("click", closeModal);

// Close on overlay backdrop click
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
});

// Coin choice toggle
document.getElementById("choice-gold").addEventListener("click",   () => setActiveCoin("gold"));
document.getElementById("choice-silver").addEventListener("click", () => setActiveCoin("silver"));

// Confirm — add new game and close
document.getElementById("btn-confirm").addEventListener("click", () => {
  const wager = parseInt(document.getElementById("wager-input").value, 10);
  if (!wager || wager <= 0) {
    document.getElementById("wager-input").focus();
    return;
  }
  const newGame = {
    id: Date.now(),
    creator: "You",
    creatorCoin: selectedCoin,
    value: `${wager.toLocaleString()} R$`,
  };
  SAMPLE_GAMES.unshift(newGame);
  renderGrid();
  closeModal();
});

/* ══════════════════════════════════════
   UTILS
══════════════════════════════════════ */
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
renderGrid();