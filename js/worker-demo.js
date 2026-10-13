// ---- demo: lock the main thread ----
const LOOP_MS = 5000; // how long the work runs

const out = document.getElementById("lockOut");
const lines = [];
function log(msg) {
  lines.push(msg);
  out.textContent = lines.join("\n");
}

const colors = ["#000", "#7b1fa2", "#1565c0", "#2e7d32", "#c62828"];
let ci = 0;
let locked = false;

// Report how long a click waited before the page could handle it.
function waited(e) {
  const ms = Math.round(performance.now() - e.timeStamp);
  return ms > 100 ? " (clicked " + (ms / 1000).toFixed(1) + " s ago, was queued)" : " (handled instantly)";
}

// Pulse the button so it is visible that the click was handled.
function flash(btn) {
  btn.classList.remove("clicked");
  void btn.offsetWidth; // restart the animation
  btn.classList.add("clicked");
}

document.getElementById("colorBtn1").onclick = (e) => {
  flash(e.currentTarget);
  ci = (ci + 1) % colors.length;
  document.documentElement.style.background = colors[ci];
  document.body.style.background = colors[ci];
  log("Color changed" + waited(e));
};

document.getElementById("unlockBtn").onclick = (e) => {
  flash(e.currentTarget);
  log("Unlock clicked" + waited(e) + (locked ? "" : " - nothing is locked now"));
};

document.getElementById("lockBtn").onclick = () => {
  lines.length = 0;
  log("MAIN thread LOCKED for 5 s: spinner stops, buttons do not respond. Try Unlock and Change page color now.");
  setTimeout(() => {
    locked = true;
    const t = Date.now();
    while (Date.now() - t < LOOP_MS); // block the main thread
    locked = false;
    log("Lock released by itself after 5 s. Queued clicks are handled next:");
  }, 50);
};
