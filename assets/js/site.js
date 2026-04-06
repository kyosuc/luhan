const SITE_DATA = window.LUHAN_SITE_DATA || { site: {}, about: {}, contact: {}, artworks: [] };
const LANGUAGE_KEY = "luhan-site-language";

const TEXT = {
  en: {
    "nav.home": "Home",
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
  },
  zh: {
    "nav.home": "首页",
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

