const SITE_DATA = window.LUHAN_SITE_DATA || { site: {}, about: {}, contact: {}, artworks: [] };
const LANGUAGE_KEY = "luhan-site-language";

const TEXT = {
  en: {
    "nav.home": "Home",
    "nav.exhibitions": "Exhibitions",
    "nav.works": "Works",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.aboutContact": "About&Contact",
    "footer.legal": "LUHAN All rights reserved.",
    "home.ctaYear": "WORKS",
    "home.ctaScale": "By Scale",
    "works.titleYear": "By Year",
    "works.titleScale": "By Scale",
    "works.switchYear": "Year",
    "works.switchScale": "Scale",
    "works.openYear": "Open year",
    "archive.back": "Back",
    "archive.meta": "Archive",
    "archive.openLabel": "Open work",
    "archive.modalYear": "Year",
    "archive.modalMedium": "Medium",
    "archive.modalSize": "Size",
    "archive.modalClose": "Close",
    "about.title": "About&Contact",
    "about.lead": "Biography, statement, and contact.",
    "about.bioTitle": "Biography",
    "about.statementTitle": "Statement",
    "about.factsTitle": "Profile",
    "about.cvNote": "Selected CV available on request.",
    "contact.title": "Contact",
    "contact.lead": "For exhibitions, collaborations, and acquisitions.",
    "contact.markTitle": "Studio Mark",
    "contact.markCopy": "Profile links can be updated later without changing the page structure.",
    "contact.directTitle": "Direct Contact",
    "contact.phoneLabel": "Phone",
    "contact.emailLabel": "Email",
    "contact.open": "Open",
    "contact.placeholderNote": "Replaceable link.",
    "contact.instagramNote": "Instagram",
    "exhibitions.title": "Exhibitions",
    "exhibitions.lead": "Current, upcoming, and selected presentations.",
    "exhibitions.currentTitle": "Current & Upcoming",
    "exhibitions.currentCopy": "Current exhibitions, art fairs, and new presentations can be added here as they are confirmed.",
    "exhibitions.archiveTitle": "Selected History",
    "exhibitions.archiveCopy": "This page is prepared for solo exhibitions, group exhibitions, and fair presentations without changing the site structure later.",
    "exhibitions.note": "Exhibition details can be updated whenever dates, venues, and cities are finalized.",
  },
  zh: {
    "nav.home": "首页",
    "nav.exhibitions": "\u5c55\u89c8",
    "nav.works": "作品",
    "nav.about": "关于",
    "nav.contact": "联系",
    "nav.aboutContact": "关于&联系",
    "footer.legal": "LUHAN All rights reserved.",
    "home.ctaYear": "按年代",
    "home.ctaScale": "按尺寸",
    "works.titleYear": "按年代",
    "works.titleScale": "按尺寸",
    "works.switchYear": "年代",
    "works.switchScale": "尺寸",
    "works.openYear": "进入年份",
    "archive.back": "返回",
    "archive.meta": "归档",
    "archive.openLabel": "查看作品",
    "archive.modalYear": "年份",
    "archive.modalMedium": "媒材",
    "archive.modalSize": "尺寸",
    "archive.modalClose": "关闭",
    "about.title": "关于&联系",
    "about.lead": "艺术家简介、创作陈述与联系方式。",
    "about.bioTitle": "艺术家简介",
    "about.statementTitle": "创作陈述",
    "about.factsTitle": "信息",
    "about.cvNote": "完整履历可按需提供。",
    "contact.title": "联系",
    "contact.lead": "用于展览、合作与收藏咨询。",
    "contact.markTitle": "工作室标记",
    "contact.markCopy": "后续替换社交主页链接时，无需改动页面结构。",
    "contact.directTitle": "直接联系",
    "contact.phoneLabel": "电话",
    "contact.emailLabel": "邮箱",
    "contact.open": "打开",
    "contact.placeholderNote": "当前为可替换链接。",
    "contact.instagramNote": "Instagram",
    "exhibitions.title": "展览",
    "exhibitions.lead": "当前、即将举行与精选展览。",
    "exhibitions.currentTitle": "当前与即将举行",
    "exhibitions.currentCopy": "这里可以放你正在进行中的展览、艺博会，以及即将公布的新项目。",
    "exhibitions.archiveTitle": "精选经历",
    "exhibitions.archiveCopy": "这个页面已经预留好单个展览、群展和艺博会的结构，之后直接补内容就可以。",
    "exhibitions.note": "当展期、地点和城市确认后，可以随时补进来，不需要再改网站结构。",
  },
};

const state = {
  lang: "en",
  activeArtworkId: null,
  heroTimer: null,
  heroIndex: 0,
  modalCloseTimer: null,
  homeIntroPlayed: false,
  homeIntroTimer: null,
  homeIntroStartedAt: null,
  homeNameStartTimer: null,
  homeNameFrame: null,
  homeNameTarget: null,
  exhibitionMediaIndices: {},
  exhibitionMediaTimers: {},
};

let revealObserver = null;

const HOME_NAME_REVEAL_DELAY_MS = 1560;
const HOME_NAME_REVEAL_DURATION_MS = 1080;
const HOME_NAME_GLYPHS = {
  en: ["L", "V", "X", "I", "N", "H", "R", "A", "U", "M", "\u2020", "\u2021", "\u00a7", "|", "/", "\\", "+", "*", "=", "#", "0", "1"],
  zh: ["\u4e28", "\u4e36", "\u4e3f", "\u4e59", "\u53e3", "\u65e5", "\u5c71", "\u5ddd", "\u4e42", "\u5b80", "\u5f61", "\u535c", "\u7384", "\u203b", "\u2020", "\u00a7"],
};


const HOME_NAME_COLOR_PALETTE = [
  "#c9b5a8",
  "#e2ddd1",
  "#7d89a5",
  "#875f69",
  "#9c9488",
  "#8b7968",
];

const EXHIBITION_RECORDS = [
  {
    id: "beijing-dangdai-2026",
    preserveImageRatio: true,
    title: {
      en: "2026 Beijing Dangdai",
      zh: "2026 \u5317\u4eac\u5f53\u4ee3"
    },
    lead: {
      en: "Three paintings at 2026 Beijing Dangdai Art Fair.",
      zh: "3 \u5f20\u4f5c\u54c1\u53c2\u52a0 2026 \u5317\u4eac\u5f53\u4ee3\u827a\u535a\u4f1a\u3002"
    },
    details: [
      {
        label: { en: "Theme", zh: "\u4e3b\u9898" },
        value: { en: "LAND TRACE", zh: "\u9646\u8ff9" }
      },
      {
        label: { en: "Venue", zh: "\u5730\u70b9" },
        value: { en: "Hall 11, National Agricultural Exhibition Center, Beijing", zh: "\u5317\u4eac\u5168\u56fd\u519c\u4e1a\u5c55\u89c8\u9986 11 \u53f7\u9986" }
      }
    ],
    schedule: [
      {
        label: { en: "VIP Preview", zh: "\u8d35\u5bbe\u9884\u89c8" },
        date: { en: "May 21-22, 2026", zh: "2026 \u5e74 5 \u6708 21 \u65e5\u81f3 22 \u65e5" },
        time: "13:00 - 19:00 / 11:00 - 18:00"
      },
      {
        label: { en: "Public Days", zh: "\u516c\u4f17\u5f00\u653e" },
        date: { en: "May 23-24, 2026", zh: "2026 \u5e74 5 \u6708 23 \u65e5\u81f3 24 \u65e5" },
        time: "11:00 - 18:00"
      }
    ],
    images: [
      {
        src: "assets/generated/exhibitions/beijing-dangdai-2026/land-trace-key-visual.png",
        alt: { en: "Official key visual for Beijing Dangdai Art Fair 2026", zh: "2026 \u5317\u4eac\u5f53\u4ee3\u827a\u535a\u4f1a\u201c\u9646\u8ff9\u201d\u5b98\u65b9\u4e3b\u89c6\u89c9" },
        ratio: "1024 / 723"
      },
      {
        src: "assets/generated/exhibitions/beijing-dangdai-2026/2.jpg",
        alt: { en: "Beijing Dangdai Art Fair 2026 supporting visual 2", zh: "2026 \u5317\u4eac\u5f53\u4ee3\u827a\u535a\u4f1a\u8865\u5145\u89c6\u89c9 2" },
        ratio: "2574 / 3264"
      },
      {
        src: "assets/generated/exhibitions/beijing-dangdai-2026/3.jpg",
        alt: { en: "Beijing Dangdai Art Fair 2026 supporting visual 3", zh: "2026 \u5317\u4eac\u5f53\u4ee3\u827a\u535a\u4f1a\u8865\u5145\u89c6\u89c9 3" },
        ratio: "4614 / 6463"
      }
    ]
  },
  {
    id: "chengdu-art021-spin-2026",
    title: {
      en: "2026 Chengdu ART021 SPIN",
      zh: "2026 \u6210\u90fd ART021 \u9f99\u95e8\u9635"
    },
    lead: {
      en: "Five new paintings at 2026 Chengdu ART021 SPIN.",
      zh: "5 \u5f20\u65b0\u4f5c\u53c2\u52a0 2026 \u6210\u90fd ART021 \u9f99\u95e8\u9635\u3002"
    },
    details: [
      {
        label: { en: "Booth", zh: "\u5c55\u4f4d" },
        value: { en: "GF-08", zh: "GF-08" }
      },
      {
        label: { en: "Partner Gallery", zh: "\u5408\u4f5c\u753b\u5eca" },
        value: { en: "Line Gallery", zh: "\u7389\u5170\u5802 Line Gallery" }
      },
      {
        label: { en: "Venue", zh: "\u5730\u70b9" },
        value: { en: "Luxetown Mountaintop Plaza, Chengdu", zh: "\u6210\u90fd\u9e93\u9547\u5c71\u9876\u5e7f\u573a" }
      }
    ],
    schedule: [
      {
        label: { en: "VIP Preview", zh: "\u8d35\u5bbe\u9884\u89c8" },
        date: { en: "April 9-10, 2026", zh: "2026 \u5e74 4 \u6708 9 \u65e5\u81f3 10 \u65e5" },
        time: "13:00 - 19:00 / 11:00 - 19:00"
      },
      {
        label: { en: "Public Days", zh: "\u516c\u4f17\u5f00\u653e" },
        date: { en: "April 11-12, 2026", zh: "2026 \u5e74 4 \u6708 11 \u65e5\u81f3 12 \u65e5" },
        time: "11:00 - 18:00"
      },
      {
        label: { en: "Venue Address", zh: "\u5c55\u4f1a\u5730\u5740" },
        date: { en: "Building 21, Luxetown Mountaintop Plaza", zh: "\u6210\u90fd\u9e93\u9547\u5c71\u9876\u5e7f\u573a 21 \u680b" },
        time: ""
      }
    ],
    images: [
      {
        src: "assets/generated/exhibitions/chengdu-art021-spin-2026/booth-poster.jpg",
        alt: { en: "Booth poster for Lu Han at ART021 SPIN Chengdu 2026", zh: "\u7490\u6c57\u53c2\u52a0 2026 \u6210\u90fd ART021 \u9f99\u95e8\u9635\u7684\u5c55\u4f4d\u6d77\u62a5" }
      },
      {
        src: "assets/generated/exhibitions/chengdu-art021-spin-2026/gallery-list.jpg",
        alt: { en: "Gallery list poster for ART021 SPIN Chengdu 2026", zh: "2026 \u6210\u90fd ART021 \u9f99\u95e8\u9635\u53c2\u5c55\u753b\u5eca\u540d\u5355\u6d77\u62a5" }
      },
      {
        src: "assets/generated/exhibitions/chengdu-art021-spin-2026/schedule-poster.jpg",
        alt: { en: "Schedule poster for ART021 SPIN Chengdu 2026", zh: "2026 \u6210\u90fd ART021 \u9f99\u95e8\u9635\u65f6\u95f4\u6d77\u62a5" }
      }
    ]
  }
];

function readStoredLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY) || "en";
  } catch (error) {
    return "en";
  }
}

function persistLanguage(lang) {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch (error) {
    // Ignore storage failures in file previews.
  }
}

function t(key, lang = state.lang) {
  return TEXT[lang]?.[key] || TEXT.en[key] || key;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function basePath(path) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  const base = document.body.dataset.base || ".";
  return base === "." ? `./${path}` : `${base}/${path}`;
}

function getArtistName(lang = state.lang) {
  return SITE_DATA.site?.artist?.[lang] || SITE_DATA.site?.artist?.en || "Lu Han";
}

function getHomeHeroName(lang = state.lang) {
  return lang === "zh" ? "\u7490\u6c57" : "LUHAN";
}

function getPublicArtworks() {
  return (SITE_DATA.artworks || []).filter((artwork) => artwork.public !== false);
}

function getArtworkById(artworkId) {
  return getPublicArtworks().find((artwork) => artwork.id === artworkId);
}

function getArtworksByYear(year) {
  return getPublicArtworks()
    .filter((artwork) => Number(artwork.year) === Number(year))
    .sort((left, right) => left.sort_order - right.sort_order);
}

function getArtworksBySize(size) {
  return getPublicArtworks()
    .filter((artwork) => artwork.size_bucket === size)
    .sort((left, right) => {
      if (right.year !== left.year) return right.year - left.year;
      if (left.sort_order !== right.sort_order) return left.sort_order - right.sort_order;
      return left.title_en.localeCompare(right.title_en);
    });
}

function getLocalizedArtwork(artwork, lang = state.lang) {
  return {
    title: artwork[`title_${lang}`] || artwork.title_en,
    medium: artwork[`medium_${lang}`] || artwork.medium_en,
  };
}

function getYearText(year, lang = state.lang) {
  return SITE_DATA.meta?.yearText?.[year]?.[lang] || "";
}

function formatWorkCount(count) {
  return state.lang === "zh" ? `${count} 件作品` : `${count} works`;
}

function updateLanguageButtons() {
  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    const isActive = button.dataset.langButton === state.lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderAboutContactNavLabel(node, lang = state.lang) {
  const copy = lang === "zh"
    ? { left: t("nav.about", lang), right: t("nav.contact", lang), aria: t("nav.aboutContact", lang) }
    : { left: "About", right: "Contact", aria: "About and Contact" };

  node.classList.add("nav-about-contact-link");
  node.setAttribute("aria-label", copy.aria);
  node.innerHTML = `
    <span class="nav-about-contact" aria-hidden="true">
      <span class="nav-about-contact__word">${escapeHtml(copy.left)}</span>
      <span class="nav-about-contact__amps">
        <span class="nav-about-contact__amp nav-about-contact__amp--orbit">&amp;</span>
      </span>
      <span class="nav-about-contact__word">${escapeHtml(copy.right)}</span>
    </span>
  `;
}

function translateStaticText() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    if (node.dataset.i18n === "nav.aboutContact") {
      renderAboutContactNavLabel(node);
      return;
    }
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  });
  document.querySelectorAll("[data-artist-name]").forEach((node) => {
    node.textContent = getArtistName();
  });
}

function renderFooter() {
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
  document.querySelectorAll(".site-footer__links").forEach((node) => {
    node.innerHTML = `<span>${escapeHtml(t("footer.legal"))}</span>`;
  });
}

function renderBrandAssets() {
  const signature = SITE_DATA.site?.brand?.signature;
  if (!signature) return;

  document.querySelectorAll(".brand").forEach((brand) => {
    brand.innerHTML = `<img class="brand__signature" src="${basePath(signature)}" alt="${escapeHtml(getArtistName())} logotype">`;
  });
}

function clearHeroTimer() {
  if (state.heroTimer) {
    window.clearInterval(state.heroTimer);
    state.heroTimer = null;
  }
}

function clearExhibitionMediaTimers() {
  Object.values(state.exhibitionMediaTimers || {}).forEach((timer) => {
    if (timer) {
      window.clearInterval(timer);
    }
  });
  state.exhibitionMediaTimers = {};
}

function pickRandomGlyph(lang = state.lang) {
  const glyphs = HOME_NAME_GLYPHS[lang] || HOME_NAME_GLYPHS.en;
  return glyphs[Math.floor(Math.random() * glyphs.length)] || "";
}

function pickSettleGlyph(character, lang) {
  if (lang === "zh") {
    const zhVariants = ["\u4e28", "\u5ddd", "\u65e5", "\u4e36", "\u5f61", "\u203b", "\u2020"];
    return zhVariants[Math.floor(Math.random() * zhVariants.length)] || character;
  }

  const variants = {
    L: ["|", "/", "I", "\u2020"],
    U: ["V", "\u222a", "\u039b", "|"],
    H: ["#", "|", "I", "\u2021"],
    A: ["\u039b", "\u2206", "V", "/"],
    N: ["\u0418", "V", "/", "|"],
    default: ["|", "/", "\u2020", "\u00a7", "#"],
  };

  const pool = variants[character] || variants.default;
  return pool[Math.floor(Math.random() * pool.length)] || character;
}

function buildHomeNameFrame(target, lang, progress) {
  const characters = Array.from(target);
  const revealProgress = progress < 0.68
    ? (progress / 0.68) * 0.88
    : 0.88 + ((progress - 0.68) / 0.32) * 0.12;
  const easedProgress = Math.max(0, Math.min(1, revealProgress));
  const tailWindow = progress > 0.64 ? Math.min(1, (progress - 0.64) / 0.36) : 0;
  const tailErrorChanceBase = tailWindow > 0 ? Math.max(0, 0.28 * (1 - Math.pow(tailWindow, 0.82))) : 0;

  return characters
    .map((character, index) => {
      const offset = (index / Math.max(characters.length, 1)) * 0.12;
      const normalized = Math.max(0, Math.min(1, (easedProgress - offset) / 0.8));

      if (normalized >= 0.997 && progress >= 0.995) {
        return character;
      }

      if (normalized <= 0.12) {
        return pickRandomGlyph(lang);
      }

      const tailErrorChance = normalized > 0.78
        ? tailErrorChanceBase * (1 - Math.min(1, (normalized - 0.78) / 0.22) * 0.35)
        : 0;

      if (tailErrorChance > 0 && Math.random() < tailErrorChance && progress < 0.995) {
        return pickSettleGlyph(character, lang);
      }

      const revealChance = Math.min(0.97, 0.15 + normalized * 0.85);
      if (Math.random() < revealChance) {
        return character;
      }

      return normalized > 0.58 ? pickSettleGlyph(character, lang) : pickRandomGlyph(lang);
    })
    .join("");
}

function getHomeNameCharacterColor(character, index, progress) {
  const phase = Math.floor(progress * 18);
  const code = character.codePointAt(0) || 0;
  const paletteIndex = Math.abs(code + index * 3 + phase) % HOME_NAME_COLOR_PALETTE.length;
  return HOME_NAME_COLOR_PALETTE[paletteIndex];
}

function renderHomeNameColoredMarkup(frame, progress) {
  return Array.from(frame)
    .map((character, index) => {
      const color = getHomeNameCharacterColor(character, index, progress);
      return `<span class="hero__artist-char" style="--hero-char-color:${color}">${escapeHtml(character)}</span>`;
    })
    .join("");
}

function clearHomeNameReveal() {
  if (state.homeNameStartTimer) {
    window.clearTimeout(state.homeNameStartTimer);
    state.homeNameStartTimer = null;
  }
  if (state.homeNameFrame) {
    window.cancelAnimationFrame(state.homeNameFrame);
    state.homeNameFrame = null;
  }
}

function syncHomeHeroTitle(forceFinal = false) {
  if (document.body.dataset.page !== "home") return;

  const heroArtist = document.querySelector(".hero__artist");
  if (!heroArtist) return;

  const target = getHomeHeroName();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  heroArtist.dataset.finalName = target;
  heroArtist.setAttribute("aria-label", target);

  if (forceFinal || prefersReducedMotion || state.homeIntroPlayed || !document.body.classList.contains("home-intro-active")) {
    clearHomeNameReveal();
    state.homeNameTarget = target;
    heroArtist.textContent = target;
    heroArtist.dataset.ghost = target;
    heroArtist.classList.remove("is-queued", "is-decoding", "is-settling");
    heroArtist.classList.add("is-locked");
    return;
  }

  if (state.homeNameTarget === target && (state.homeNameStartTimer || state.homeNameFrame)) {
    return;
  }

  clearHomeNameReveal();
  state.homeNameTarget = target;
  heroArtist.textContent = target;
  heroArtist.dataset.ghost = target;
  heroArtist.classList.remove("is-locked", "is-decoding", "is-settling");
  heroArtist.classList.add("is-queued");

  const elapsed = state.homeIntroStartedAt ? performance.now() - state.homeIntroStartedAt : 0;
  const startDelay = Math.max(0, HOME_NAME_REVEAL_DELAY_MS - elapsed);

  state.homeNameStartTimer = window.setTimeout(() => {
    state.homeNameStartTimer = null;
    const decodeStartedAt = performance.now();
    heroArtist.classList.remove("is-queued", "is-locked", "is-settling");
    heroArtist.classList.add("is-decoding");
    const initialFrame = buildHomeNameFrame(target, state.lang, 0.012);
    heroArtist.innerHTML = renderHomeNameColoredMarkup(initialFrame, 0.012);
    heroArtist.dataset.ghost = initialFrame;

    const step = (now) => {
      const progress = Math.min((now - decodeStartedAt) / HOME_NAME_REVEAL_DURATION_MS, 1);
      const currentFrame = buildHomeNameFrame(target, state.lang, progress);
      heroArtist.innerHTML = renderHomeNameColoredMarkup(currentFrame, progress);
      heroArtist.dataset.ghost = buildHomeNameFrame(target, state.lang, Math.max(0, progress - 0.14));

      if (progress < 1) {
        state.homeNameFrame = window.requestAnimationFrame(step);
        return;
      }

      heroArtist.textContent = target;
      heroArtist.dataset.ghost = target;
      heroArtist.classList.remove("is-queued", "is-decoding", "is-settling");
      heroArtist.classList.add("is-locked");
      state.homeNameFrame = null;
    };

    state.homeNameFrame = window.requestAnimationFrame(step);
  }, startDelay);
}

function setupHomeIntro() {
  if (document.body.dataset.page !== "home" || state.homeIntroPlayed || state.homeIntroTimer) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.add("home-intro-complete");
    state.homeIntroPlayed = true;
    syncHomeHeroTitle(true);
    return;
  }

  document.body.classList.remove("home-intro-pending");
  document.body.classList.add("home-intro-active");
  state.homeIntroStartedAt = performance.now();
  syncHomeHeroTitle();
  state.homeIntroTimer = window.setTimeout(() => {
    document.body.classList.add("home-intro-complete");
    document.body.classList.remove("home-intro-active");
    document.body.classList.remove("home-intro-pending");
    state.homeIntroPlayed = true;
    state.homeIntroTimer = null;
    state.homeIntroStartedAt = null;
    syncHomeHeroTitle(true);
  }, 3600);
}

function setActiveHeroSlide(index) {
  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });
}

function renderHome() {
  clearHeroTimer();
  if (document.body.dataset.page !== "home") return;

  const hero = document.querySelector(".hero");
  const stage = document.getElementById("hero-stage");
  const slides = SITE_DATA.site?.heroSlides || [];
  if (!hero || !stage || !slides.length) return;

  state.heroIndex = Number.isFinite(state.heroIndex) ? state.heroIndex % slides.length : 0;

  stage.innerHTML = slides
    .map((slide, index) => {
      const title = state.lang === "zh" ? slide.title_zh : slide.title_en;
      const loading = index === 0 ? "eager" : "lazy";
      const fetchPriority = index === 0 ? "high" : "auto";
      return `
        <figure class="hero-slide${index === state.heroIndex ? " is-active" : ""}" data-hero-slide>
          <img src="${basePath(slide.image)}" alt="${escapeHtml(title)}" loading="${loading}" fetchpriority="${fetchPriority}">
        </figure>
      `;
    })
    .join("");

  const advanceSlide = () => {
    state.heroIndex = (state.heroIndex + 1) % slides.length;
    setActiveHeroSlide(state.heroIndex);
  };

  const startHeroTimer = () => {
    clearHeroTimer();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || slides.length < 2) {
      return;
    }
    state.heroTimer = window.setInterval(() => {
      advanceSlide();
    }, 5200);
  };

  hero.onpointerup = (event) => {
    if (slides.length < 2) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target.closest("a, button")) return;
    advanceSlide();
    startHeroTimer();
  };

  startHeroTimer();
  syncHomeHeroTitle();
}

function createYearCard(year) {
  const artworks = getArtworksByYear(year);
  if (!artworks.length) return "";
  const coverArtwork = artworks[0];
  const previewCover = SITE_DATA.site?.yearPreviewCovers?.[String(year)] || null;
  const localized = getLocalizedArtwork(coverArtwork);
  const previewTitle = previewCover
    ? (state.lang === "zh" ? previewCover.title_zh : previewCover.title_en)
    : localized.title;
  const countText = formatWorkCount(artworks.length);
  const yearText = getYearText(year);

  return `
    <a class="year-card reveal" href="./${year}.html">
      <span class="year-card__media">
        <img src="${basePath(previewCover?.image || coverArtwork.image_thumb)}" alt="${escapeHtml(previewTitle)} (${year})" loading="lazy">
      </span>
      <span class="year-card__overlay"></span>
      <span class="year-card__content">
        <span class="year-card__topline">${countText}</span>
        <span class="year-card__year">${year}</span>
        <p class="year-card__copy">${escapeHtml(yearText)}</p>
        <span class="year-card__cta">${t("works.openYear")}</span>
      </span>
    </a>
  `;
}

function renderWorksLanding() {
  if (document.body.dataset.page !== "works-year") return;
  const container = document.getElementById("year-card-grid");
  if (!container) return;
  container.innerHTML = (SITE_DATA.site?.years || []).map((year) => createYearCard(year)).join("");
}

function createArtworkCard(artwork) {
  const localized = getLocalizedArtwork(artwork);
  return `
    <button class="art-card reveal" type="button" data-artwork-id="${artwork.id}" aria-label="${t("archive.openLabel")}: ${escapeHtml(localized.title)}">
      <span class="art-card__image">
        <img src="${basePath(artwork.image_thumb)}" alt="${escapeHtml(localized.title)} (${artwork.year})" loading="lazy">
      </span>
      <span class="art-card__body">
        <span class="art-card__year">${artwork.year}</span>
        <h3 class="art-card__title">${escapeHtml(localized.title)}</h3>
        <p class="art-card__detail">${escapeHtml(localized.medium)}</p>
        <p class="art-card__detail art-card__detail--dim">${escapeHtml(artwork.size)}</p>
      </span>
    </button>
  `;
}

function bindArtworkCards() {
  document.querySelectorAll("[data-artwork-id]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.artworkId));
  });
}

function renderArchivePage() {
  if (document.body.dataset.page !== "archive-year") return;
  const year = Number(document.body.dataset.year);
  const artworks = getArtworksByYear(year);
  const grid = document.getElementById("archive-grid");
  const count = document.getElementById("archive-count");
  const copy = document.getElementById("archive-copy");

  if (grid) {
    grid.innerHTML = artworks.map((artwork) => createArtworkCard(artwork)).join("");
  }
  if (count) {
    count.textContent = formatWorkCount(artworks.length);
  }
  if (copy) {
    copy.textContent = getYearText(year);
  }

  bindArtworkCards();
}

function renderScalePage() {
  if (document.body.dataset.page !== "works-scale") return;
  const container = document.getElementById("scale-groups");
  if (!container) return;

  const groups = (SITE_DATA.site?.sizeBuckets || [])
    .map((entry) => {
      const artworks = getArtworksBySize(entry.size);
      if (!artworks.length) return "";
      return `
        <section class="scale-group reveal">
          <div class="scale-group__head">
            <h2 class="scale-group__title">${escapeHtml(entry.size)}</h2>
            <span class="scale-group__count">${formatWorkCount(artworks.length)}</span>
          </div>
          <div class="archive-grid archive-grid--scale">
            ${artworks.map((artwork) => createArtworkCard(artwork)).join("")}
          </div>
        </section>
      `;
    })
    .join("");

  container.innerHTML = groups;
  bindArtworkCards();
}

function renderAboutContactSection() {
  if (document.body.dataset.page !== "about") return;

  document.querySelectorAll("[data-social-link]").forEach((link) => {
    const social = SITE_DATA.site?.socials?.[link.dataset.socialLink];
    if (!social) return;

    link.textContent = social.handle;
    link.setAttribute("aria-label", `${social.label}: ${social.handle}`);

    if (link.dataset.socialLink === "xiaohongshu" && social.app_url) {
      link.href = social.app_url;
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.onclick = (event) => {
        event.preventDefault();
        const appUrl = social.app_url;
        const webUrl = social.url;
        let appOpened = false;

        const markOpened = () => {
          appOpened = true;
        };

        const handleVisibility = () => {
          if (document.hidden) markOpened();
        };

        document.addEventListener("visibilitychange", handleVisibility, { once: true });
        window.addEventListener("pagehide", markOpened, { once: true });

        window.location.href = appUrl;
        window.setTimeout(() => {
          if (!appOpened && document.visibilityState === "visible") {
            window.location.href = webUrl;
          }
        }, 900);
      };
      return;
    }

    link.href = social.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.onclick = null;
  });

  const phoneLink = document.getElementById("about-contact-phone");
  if (phoneLink && SITE_DATA.contact?.phone) {
    phoneLink.textContent = SITE_DATA.contact.phone;
    phoneLink.href = `tel:${SITE_DATA.contact.phone.replace(/\s+/g, "")}`;
    phoneLink.setAttribute("aria-label", `WeChat / Phone: ${SITE_DATA.contact.phone}`);
  }

  const pdfCard = document.getElementById("about-contact-pdf-card");
  const pdfLink = document.getElementById("about-contact-pdf");
  const aboutPdf = SITE_DATA.about?.pdf;
  if (pdfCard && pdfLink && aboutPdf) {
    const pdfFileName = aboutPdf.split("/").pop() || "PDF";
    const pdfHref = encodeURI(basePath(aboutPdf));
    const isTouchLike = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    pdfCard.hidden = false;
    pdfCard.setAttribute("role", "link");
    pdfCard.tabIndex = 0;
    pdfCard.style.cursor = "pointer";
    pdfLink.href = pdfHref;
    pdfLink.setAttribute("aria-label", `PDF Download: ${pdfFileName}`);

    if (isTouchLike) {
      pdfLink.removeAttribute("download");
      pdfLink.target = "_blank";
      pdfLink.rel = "noreferrer";
      pdfCard.onclick = () => {
        window.location.href = pdfHref;
      };
      pdfCard.onkeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.location.href = pdfHref;
        }
      };
    } else {
      pdfLink.setAttribute("download", pdfFileName);
      pdfLink.removeAttribute("target");
      pdfLink.removeAttribute("rel");
      pdfCard.onclick = () => {
        pdfLink.click();
      };
      pdfCard.onkeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          pdfLink.click();
        }
      };
    }
  } else if (pdfCard) {
    pdfCard.hidden = true;
    pdfCard.onclick = null;
    pdfCard.onkeydown = null;
  }
}

function renderAboutPage() {
  if (document.body.dataset.page !== "about") return;

  const portrait = document.getElementById("about-portrait-image");
  const bio = document.getElementById("about-bio-paragraphs");
  const statement = document.getElementById("about-statement-paragraphs");
  const facts = document.getElementById("about-profile-list");

  if (portrait && SITE_DATA.about?.portrait) {
    portrait.src = basePath(SITE_DATA.about.portrait);
    portrait.alt = `${getArtistName()} portrait`;
  }

  if (bio) {
    bio.innerHTML = (SITE_DATA.about?.bio?.[state.lang] || [])
      .map((paragraph) => `<p class="about-copy">${escapeHtml(paragraph)}</p>`)
      .join("");
  }

  if (statement) {
    statement.innerHTML = (SITE_DATA.about?.statement?.[state.lang] || [])
      .map((paragraph) => `<p class="about-copy">${escapeHtml(paragraph)}</p>`)
      .join("");
  }

  if (facts) {
    facts.innerHTML = (SITE_DATA.about?.facts?.[state.lang] || [])
      .map(
        (item) => `
          <div class="info-list__item">
            <span class="info-list__label">${escapeHtml(item.label)}</span>
            <p class="info-list__value">${escapeHtml(item.value)}</p>
          </div>
        `,
      )
      .join("");
  }

  renderAboutContactSection();
}



function getExhibitionValue(value) {
  if (typeof value === "string") return value;
  return value?.[state.lang] || value?.en || "";
}

function setActiveExhibitionMedia(recordId, index) {
  const panel = document.querySelector(`[data-exhibition-record="${recordId}"]`);
  if (!panel) return;

  panel.querySelectorAll("[data-exhibition-media-slide]").forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
    slide.setAttribute("aria-hidden", String(slideIndex !== index));
  });

  panel.querySelectorAll("[data-exhibition-media-index]").forEach((button) => {
    const isActive = Number(button.dataset.exhibitionMediaIndex) === index;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  state.exhibitionMediaIndices[recordId] = index;
}

function renderExhibitionsPage() {
  clearExhibitionMediaTimers();
  if (document.body.dataset.page !== "exhibitions") return;

  const container = document.getElementById("exhibitions-list");
  if (!container) return;

  container.innerHTML = EXHIBITION_RECORDS.map((record) => {
    const detailsMarkup = (record.details || []).map((item) => `
      <div class="exhibition-info-row">
        <span class="exhibition-info-row__label">${escapeHtml(getExhibitionValue(item.label))}</span>
        <p class="exhibition-info-row__value">${escapeHtml(getExhibitionValue(item.value))}</p>
      </div>
    `).join("");

    const scheduleMarkup = (record.schedule || []).map((item) => `
      <div class="exhibition-schedule-row">
        <span class="exhibition-schedule-row__label">${escapeHtml(getExhibitionValue(item.label))}</span>
        <div class="exhibition-schedule-row__body">
          <span class="exhibition-schedule-row__date">${escapeHtml(getExhibitionValue(item.date))}</span>
          ${item.time ? `<span class="exhibition-schedule-row__time">${escapeHtml(item.time)}</span>` : ""}
        </div>
      </div>
    `).join("");

    return `
      <section class="content-panel reveal exhibition-panel${record.preserveImageRatio ? " exhibition-panel--preserve-ratio" : ""}" data-exhibition-record="${record.id}">
        <div class="exhibition-panel__media-block">
          <div class="exhibition-media-stage" data-exhibition-media-stage aria-live="polite"></div>
          <div class="exhibition-media-controls exhibition-media-controls--dots" data-exhibition-media-controls></div>
        </div>

        <div class="exhibition-copy-panel">
          <h1 class="exhibition-title">${escapeHtml(getExhibitionValue(record.title))}</h1>
          <p class="about-copy exhibition-lead">${escapeHtml(getExhibitionValue(record.lead))}</p>
          <div class="exhibition-info-list">${detailsMarkup}</div>
          ${scheduleMarkup ? `<div class="exhibition-schedule-list">${scheduleMarkup}</div>` : ""}
        </div>
      </section>
    `;
  }).join("");

  EXHIBITION_RECORDS.forEach((record) => {
    const panel = container.querySelector(`[data-exhibition-record="${record.id}"]`);
    if (!panel) return;

    const mediaStage = panel.querySelector("[data-exhibition-media-stage]");
    const mediaControls = panel.querySelector("[data-exhibition-media-controls]");
    const images = record.images || [];
    const currentIndex = Number.isFinite(state.exhibitionMediaIndices[record.id])
      ? state.exhibitionMediaIndices[record.id] % Math.max(images.length, 1)
      : 0;

    state.exhibitionMediaIndices[record.id] = currentIndex;

    if (mediaStage) {
      mediaStage.innerHTML = images.map((image, index) => {
        const loading = index === 0 ? "eager" : "lazy";
        const fetchPriority = index === 0 ? "high" : "auto";
        return `
          <figure class="exhibition-media-frame${index === currentIndex ? " is-active" : ""}" data-exhibition-media-slide data-exhibition-media-ratio="${image.ratio || ""}" aria-hidden="${index === currentIndex ? "false" : "true"}">
            <img src="${encodeURI(basePath(image.src))}" alt="${escapeHtml(getExhibitionValue(image.alt))}" loading="${loading}" fetchpriority="${fetchPriority}">
          </figure>
        `;
      }).join("");
    }

    if (mediaControls) {
      const hasMultipleImages = images.length > 1;
      mediaControls.hidden = !hasMultipleImages;
      mediaControls.innerHTML = hasMultipleImages
        ? images.map((image, index) => `
            <button class="exhibition-media-toggle${index === currentIndex ? " is-active" : ""}" type="button" data-exhibition-media-index="${index}" aria-pressed="${index === currentIndex ? "true" : "false"}" aria-label="${escapeHtml(getExhibitionValue(image.alt))}">
              <span class="exhibition-media-toggle__dot" aria-hidden="true"></span>
            </button>
          `).join("")
        : "";
    }

    const advanceMedia = () => {
      if (images.length < 2) return;
      const nextIndex = (state.exhibitionMediaIndices[record.id] + 1) % images.length;
      setActiveExhibitionMedia(record.id, nextIndex);
    };

    const startMediaTimer = () => {
      if (state.exhibitionMediaTimers[record.id]) {
        window.clearInterval(state.exhibitionMediaTimers[record.id]);
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || images.length < 2) {
        return;
      }
      state.exhibitionMediaTimers[record.id] = window.setInterval(() => {
        advanceMedia();
      }, 5200);
    };

    if (mediaStage) {
      mediaStage.onclick = () => {
        advanceMedia();
        startMediaTimer();
      };
    }

    panel.querySelectorAll("[data-exhibition-media-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextIndex = Number(button.dataset.exhibitionMediaIndex);
        setActiveExhibitionMedia(record.id, nextIndex);
        startMediaTimer();
      });
    });

    setActiveExhibitionMedia(record.id, currentIndex);
    startMediaTimer();
  });
}

function renderContactPage() {
  if (document.body.dataset.page !== "contact") return;

  const background = document.getElementById("contact-background-image");
  const watermark = document.getElementById("contact-watermark");
  const seal = document.getElementById("contact-seal");
  const phoneLink = document.getElementById("contact-phone");
  const emailLink = document.getElementById("contact-email");

  if (background && SITE_DATA.contact?.background) {
    background.src = basePath(SITE_DATA.contact.background);
    background.alt = "";
  }
  if (watermark && SITE_DATA.site?.brand?.watermark) {
    watermark.src = basePath(SITE_DATA.site.brand.watermark);
    watermark.alt = "";
  }
  if (seal && SITE_DATA.site?.brand?.seal) {
    seal.src = basePath(SITE_DATA.site.brand.seal);
    seal.alt = `${getArtistName()} studio mark`;
  }
  if (phoneLink && SITE_DATA.contact?.phone) {
    phoneLink.textContent = SITE_DATA.contact.phone;
    phoneLink.href = `tel:${SITE_DATA.contact.phone.replace(/\s+/g, "")}`;
  }
  if (emailLink && SITE_DATA.contact?.email) {
    emailLink.textContent = SITE_DATA.contact.email;
    emailLink.href = `mailto:${SITE_DATA.contact.email}`;
  }

  document.querySelectorAll("[data-social-card]").forEach((card) => {
    const social = SITE_DATA.site?.socials?.[card.dataset.socialCard];
    if (!social) return;
    card.href = social.url;
    const handleNode = card.querySelector("[data-social-handle]");
    const noteNode = card.querySelector("[data-social-note]");
    if (handleNode) handleNode.textContent = social.handle;
    if (noteNode) {
      noteNode.textContent = card.dataset.socialCard === "xiaohongshu"
        ? t("contact.placeholderNote")
        : t("contact.instagramNote");
    }
  });
}

function renderModal() {
  const modal = document.getElementById("artwork-modal");
  if (!modal || !state.activeArtworkId) return;

  const artwork = getArtworkById(state.activeArtworkId);
  if (!artwork) return;

  const localized = getLocalizedArtwork(artwork);
  const modalImage = document.getElementById("modal-image");
  const modalEyebrow = document.getElementById("modal-eyebrow");
  const modalTitle = document.getElementById("modal-title");
  const modalYear = document.getElementById("modal-year");
  const modalMedium = document.getElementById("modal-medium");
  const modalSize = document.getElementById("modal-size");

  if (modalImage) {
    modalImage.src = basePath(artwork.image_web);
    modalImage.alt = `${localized.title} (${artwork.year})`;
  }
  if (modalEyebrow) modalEyebrow.textContent = String(artwork.year);
  if (modalTitle) modalTitle.textContent = localized.title;
  if (modalYear) modalYear.textContent = String(artwork.year);
  if (modalMedium) modalMedium.textContent = localized.medium;
  if (modalSize) modalSize.textContent = artwork.size;
}

function openModal(artworkId) {
  const modal = document.getElementById("artwork-modal");
  if (!modal) return;
  const dialog = modal.querySelector(".modal__dialog");
  if (dialog) dialog.scrollTop = 0;
  if (state.modalCloseTimer) {
    window.clearTimeout(state.modalCloseTimer);
    state.modalCloseTimer = null;
  }
  state.activeArtworkId = artworkId;
  renderModal();
  modal.hidden = false;
  modal.classList.remove("is-closing");
  document.body.style.overflow = "hidden";
  window.requestAnimationFrame(() => {
    modal.classList.add("is-active");
  });
}

function closeModal() {
  const modal = document.getElementById("artwork-modal");
  if (!modal) return;
  if (state.modalCloseTimer) {
    window.clearTimeout(state.modalCloseTimer);
    state.modalCloseTimer = null;
  }
  modal.classList.add("is-closing");
  modal.classList.remove("is-active");
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 20 : 420;
  state.modalCloseTimer = window.setTimeout(() => {
    modal.hidden = true;
    modal.classList.remove("is-closing");
    document.body.style.overflow = "";
    state.activeArtworkId = null;
    state.modalCloseTimer = null;
  }, delay);
}

function setupModal() {
  const modal = document.getElementById("artwork-modal");
  if (!modal) return;
  const dialog = modal.querySelector(".modal__dialog");
  const modalImage = modal.querySelector(".modal__figure img");

  modal.querySelectorAll("[data-modal-close]").forEach((node) => {
    node.addEventListener("click", closeModal);
  });

  if (modalImage) {
    modalImage.addEventListener("click", (event) => {
      event.stopPropagation();
      closeModal();
    });
  }

  if (dialog) {
    dialog.addEventListener("click", (event) => {
      if (event.target.closest(".modal__figure img")) return;
      closeModal();
    });
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}

function setupRevealObserver() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -32px 0px" },
    );
  }

  document.querySelectorAll(".reveal:not(.is-visible)").forEach((node) => {
    revealObserver.observe(node);
  });
}

function renderPage() {
  renderBrandAssets();
  renderHome();
  renderWorksLanding();
  renderExhibitionsPage();
  renderArchivePage();
  renderScalePage();
  renderAboutPage();
  renderContactPage();
  if (state.activeArtworkId) renderModal();
  setupRevealObserver();
  setupHomeIntro();
}

function applyLanguage(lang) {
  state.lang = ["en", "zh"].includes(lang) ? lang : "en";
  persistLanguage(state.lang);
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  document.body.dataset.lang = state.lang;
  updateLanguageButtons();
  translateStaticText();
  renderPage();
}

function setupLanguageToggle() {
  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.langButton !== state.lang) {
        applyLanguage(button.dataset.langButton);
      }
    });
  });
}

function init() {
  state.lang = readStoredLanguage();
  if (document.body.dataset.page === "home") {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.classList.add("home-intro-complete");
      state.homeIntroPlayed = true;
    } else {
      document.body.classList.add("home-intro-pending");
    }
  }
  setupLanguageToggle();
  setupModal();
  renderFooter();
  applyLanguage(state.lang);
}

document.addEventListener("DOMContentLoaded", init);

