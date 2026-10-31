/* ════════════════════════════════════════════
   GALLERY — automatic. No list to edit.
   Just upload photos next to index.html named in order:
     gallery-1.png, gallery-2.png, gallery-3.png ...
   Numbers must not skip (if gallery-4.png is missing,
   gallery-5.png and later will not show).
   ════════════════════════════════════════════ */
const GALLERY_PREFIX = "gallery-";
const GALLERY_EXT = ".png";        
const GALLERY_COLUMNS = 4;         
const GALLERY_MAX = 200;           

(function () {
  const target = document.getElementById("gallery-rows");
  const section = document.getElementById("gallery");
  if (!target) return;

  // Stay hidden until at least one photo is found
  if (section) section.style.display = "none";

  const found = [];

  // Try gallery-1.png, gallery-2.png ... and stop at the first one that is missing
  function loadNext(n) {
    if (n > GALLERY_MAX) return render();

    const img = new Image();
    img.onload = function () {
      found.push(img);
      loadNext(n + 1);
    };
    img.onerror = render;
    img.alt = "Gallery photo " + n;
    img.src = GALLERY_PREFIX + n + GALLERY_EXT;
  }

  function render() {
    if (!found.length) return; // nothing uploaded yet, section stays hidden
    if (section) section.style.display = "";

    // Split the photos into rows of up to 4
    for (let i = 0; i < found.length; i += GALLERY_COLUMNS) {
      const chunk = found.slice(i, i + GALLERY_COLUMNS);

      const row = document.createElement("div");
      row.className = "gallery-row reveal";
      row.dataset.count = chunk.length;

      chunk.forEach((img) => {
        const item = document.createElement("div");
        item.className = "gallery-item";
        item.appendChild(img);
        row.appendChild(item);
      });

      target.appendChild(row);
    }

    // Reuse the page's scroll-reveal effect for the new rows
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    target.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  loadNext(1);
})();
