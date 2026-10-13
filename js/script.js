// ---- slide navigation ----
const slides = [...document.querySelectorAll(".slide")];
let i = 0;
function show(n) {
  i = Math.max(0, Math.min(slides.length - 1, n));
  slides.forEach((s, k) => s.classList.toggle("active", k === i));
  document.getElementById("pos").textContent =
    i + 1 + " / " + slides.length;
  location.hash = i + 1;
}
document.addEventListener("keydown", (e) => {
  if (e.target.closest("button")) return;
  if (e.key === "ArrowRight" || e.key === "PageDown") show(i + 1);
  if (e.key === "ArrowLeft" || e.key === "PageUp") show(i - 1);
});
show((parseInt(location.hash.slice(1)) || 1) - 1);
