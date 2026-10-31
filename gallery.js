/* ════════════════════════════════════════════
   GALLERY-gallery-1.png, gallery-2.png, gallery-3.png ...
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
    if (!found.length) return;
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

    initLightbox();
  }

  // Pop-up viewer
  function initLightbox() {
    const items = Array.from(target.querySelectorAll(".gallery-item"));
    if (!items.length) return;

    const box = document.createElement("div");
    box.className = "lightbox" + (items.length === 1 ? " single" : "");
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML =
      '<button type="button" class="lb-nav lb-prev" aria-label="Previous photo">&#10094;</button>' +
      '<div class="lb-frame">' +
        '<img class="lb-img" alt="">' +
        '<button type="button" class="lb-close" aria-label="Close photo">&times;</button>' +
        '<div class="lb-count"></div>' +
      "</div>" +
      '<button type="button" class="lb-nav lb-next" aria-label="Next photo">&#10095;</button>';
    document.body.appendChild(box);

    const bigImg = box.querySelector(".lb-img");
    const count = box.querySelector(".lb-count");
    const closeBtn = box.querySelector(".lb-close");
    let index = 0;
    let lastFocus = null;

    function show(i) {
      index = (i + found.length) % found.length;
      bigImg.src = found[index].src;
      bigImg.alt = found[index].alt;
      count.textContent = index + 1 + " / " + found.length;
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add("open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      box.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    items.forEach((item, i) => {
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", "Open photo " + (i + 1));
      item.addEventListener("click", () => open(i));
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(i);
        }
      });
    });

    box.addEventListener("click", (e) => {
      if (!e.target.closest(".lb-frame, .lb-nav")) close();
    });
    closeBtn.addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
    box.querySelector(".lb-next").addEventListener("click", () => show(index + 1));

    // Keyboard
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
    });

    // Phone
    let startX = 0;
    let startY = 0;
    box.addEventListener(
      "touchstart",
      (e) => {
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
      },
      { passive: true }
    );
    box.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          show(dx < 0 ? index + 1 : index - 1);
        }
      },
      { passive: true }
    );
  }

  loadNext(1);
})();
