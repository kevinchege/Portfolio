/* ════════════════════════════════════════════
   GALLERY — the only file you edit to add photos
   1. Put your photos in the same folder as index.html
   2. Add each file name to the list below
   ════════════════════════════════════════════ */
const GALLERY_IMAGES = [
  // { src: "gallery-1.jpg", alt: "Describe photo 1" },
  // { src: "gallery-2.jpg", alt: "Describe photo 2" },
];

const GALLERY_COLUMNS = 4; // maximum images per row

(function () {
  const target = document.getElementById("gallery-rows");
  if (!target) return;

  // Hide the whole section until at least one photo is listed
  const section = document.getElementById("gallery");
  if (!GALLERY_IMAGES.length) {
    if (section) section.style.display = "none";
    return;
  }

  // Split the list into rows of up to 4
  for (let i = 0; i < GALLERY_IMAGES.length; i += GALLERY_COLUMNS) {
    const chunk = GALLERY_IMAGES.slice(i, i + GALLERY_COLUMNS);

    const row = document.createElement("div");
    row.className = "gallery-row reveal";
    row.dataset.count = chunk.length;

    chunk.forEach((img) => {
      const item = document.createElement("div");
      item.className = "gallery-item";

      const el = document.createElement("img");
      el.src = img.src;
      el.alt = img.alt || "Gallery photo";
      el.loading = "lazy";

      item.appendChild(el);
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
})();
