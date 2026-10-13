// ---- demo: lock the main thread vs run the same work in a worker ----
const out = document.getElementById("heavyOut");
const LOOP_MS = 5000; // how long the work runs
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

document.getElementById("colorBtn").onclick = (e) => {
  ci = (ci + 1) % colors.length;
  document.documentElement.style.background = colors[ci];
  document.body.style.background = colors[ci];
  log("Color changed" + waited(e));
};

document.getElementById("unlockBtn").onclick = (e) => {
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

// Same 5 s of work, but in a worker: the page stays free.
const heavyUrl = URL.createObjectURL(
  new Blob([
    `onmessage=()=>{const t=Date.now();while(Date.now()-t<${LOOP_MS});postMessage("done")}`,
  ]),
);

document.getElementById("heavyWorker").onclick = () => {
  lines.length = 0;
  log("5 s of work in a WORKER: spinner keeps spinning, buttons still work.");
  const w = new Worker(heavyUrl);
  w.onmessage = () => {
    log("Worker finished.");
    w.terminate();
  };
  w.postMessage("go");
};
