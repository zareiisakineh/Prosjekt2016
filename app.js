console.log("app.js loaded");

// ─── Hent lagret språk fra localStorage ───
const savedLanguage = localStorage.getItem('preferredLanguage') || 'no';

// ─── i18next Initialisering ───
const translationsCacheBuster = '20260417';
i18next
  .use(i18nextHttpBackend)
  .init({
    lng: savedLanguage,
    fallbackLng: 'no',
    backend: {
      loadPath: `./{{lng}}/translation.json?v=${translationsCacheBuster}`,
    },
    returnObjects: true,
  })
  .then(() => {
    updateContent();
  });

// Oppdater innholdet basert på valgt språk
function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key.startsWith('[placeholder]')) {
      const placeholderKey = key.replace('[placeholder]', '');
      element.setAttribute('placeholder', i18next.t(placeholderKey));
    } else {
      element.textContent = i18next.t(key);
    }
  });
}

// Bytt språk
function changeLanguage(lng) {
  localStorage.setItem('preferredLanguage', lng);
  i18next.changeLanguage(lng, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    updateContent();
  });
}

// ─── 1. Slide-in mobilmeny ───
document.addEventListener("DOMContentLoaded", () => {

  const toggle   = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");
  const overlay  = document.getElementById("navOverlay");
  const closeBtn = document.getElementById("menuClose");

  function openMenu() {
    sideMenu?.classList.add("open");
    overlay?.classList.add("active");
    toggle?.classList.add("open");
    sideMenu?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    sideMenu?.classList.remove("open");
    overlay?.classList.remove("active");
    toggle?.classList.remove("open");
    sideMenu?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  toggle?.addEventListener("click", () => {
    sideMenu?.classList.contains("open") ? closeMenu() : openMenu();
  });

  closeBtn?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);

  // Lukk med Escape-tasten
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Lukk når en menylenke klikkes
  document.querySelectorAll(".side-menu a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // ─── 2. Rollevelger ───
  const roleButtons = document.querySelectorAll(".role-btn");
  if (roleButtons.length > 0) {
    roleButtons.forEach(button => {
      button.addEventListener("click", function () {
        roleButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        filterContentByRole(this.getAttribute("data-role"));
      });
    });
  }

  function filterContentByRole(role) {
    document.querySelectorAll(".card[data-role]").forEach(card => {
      const cardRoles = card.getAttribute("data-role").split(" ");
      card.style.display = cardRoles.includes(role) ? "block" : "none";
    });
  }

});

// ─── SITE_PAGES og søkefunksjon ───
const SITE_PAGES = [
  {
    url: "index.html",
    titleKey: "search_title_home",
    descriptionKey: "search_desc_home",
    keywords: {
      no: ["hjem", "veiviser", "student", "fagpersonale", "ansvarlig bruk", "AI", "KI", "intro", "eksamen", "plagiat", "prompt"],
      en: ["home", "guidebook", "student", "faculty", "responsible use", "AI", "artificial intelligence", "intro", "exam", "plagiarism", "prompt"]
    }
  },
  {
    url: "faq.html",
    titleKey: "search_title_faq",
    descriptionKey: "search_desc_faq",
    keywords: {
      no: ["FAQ", "vanlige spørsmål", "hallusinasjoner", "prompt engineering", "kildekritikk", "akademisk integritet", "svar"],
      en: ["FAQ", "frequently asked questions", "hallucinations", "prompt engineering", "source criticism", "academic integrity", "answers"]
    }
  },
  {
    url: "tips.html",
    titleKey: "search_title_tips",
    descriptionKey: "search_desc_tips",
    keywords: {
      no: ["tips", "oppgaveskriving", "kilder", "personvern", "plagiat", "prompt", "etik", "etikk", "språk"],
      en: ["tips", "assignment writing", "sources", "privacy", "plagiarism", "prompt", "ethics", "language"]
    }
  },
  {
    url: "quiz.html",
    titleKey: "search_title_quiz",
    descriptionKey: "search_desc_quiz",
    keywords: {
      no: ["quiz", "test deg selv", "etikk", "personvern", "hallusinasjoner", "regler", "fusk"],
      en: ["quiz", "test yourself", "ethics", "privacy", "hallucinations", "rules", "cheating"]
    }
  },
  {
    url: "links.html",
    titleKey: "search_title_links",
    descriptionKey: "search_desc_links",
    keywords: {
      no: ["lenker", "ressurser", "OpenAI", "Søk & Skriv", "plagiarism", "USN", "regjeringen", "bibliotek"],
      en: ["links", "resources", "OpenAI", "Sok og Skriv", "plagiarism", "USN", "regjeringen", "library"]
    }
  },
  {
    url: "contact.html",
    titleKey: "search_title_contact",
    descriptionKey: "search_desc_contact",
    keywords: {
      no: ["kontakt", "e-post", "telefon", "kontaktskjema", "campus", "USN"],
      en: ["contact", "email", "phone", "contact form", "campus", "USN"]
    }
  },
  {
    url: "teaching-tips.html",
    titleKey: "search_title_teaching_tips",
    descriptionKey: "search_desc_teaching_tips",
    keywords: {
      no: ["undervisning", "fagpersonale", "lærere", "emner", "oppgaver", "gruppearbeid"],
      en: ["teaching", "staff", "teachers", "courses", "assignments", "group work"]
    }
  },
  {
    url: "vurderingsretningslinjer.html",
    titleKey: "search_title_assessment",
    descriptionKey: "search_desc_assessment",
    keywords: {
      no: ["vurdering", "eksamen", "retningslinjer", "fusk", "AI-deteksjon", "policy"],
      en: ["assessment", "exam", "guidelines", "cheating", "AI detection", "policy"]
    }
  },
  {
    url: "PolicyMaler.html",
    titleKey: "search_title_policy_templates",
    descriptionKey: "search_desc_policy_templates",
    keywords: {
      no: ["policy", "maler", "institusjon", "eksamen", "oppgaver", "etikk", "dokumentasjon"],
      en: ["policy", "templates", "institution", "exam", "assignments", "ethics", "documentation"]
    }
  }
];

// GLOBAL SØKEFUNKSJON – søker i SITE_PAGES og viser treff som lenker
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('globalSearch');
  const resultsList = document.getElementById('searchResults');

  if (!searchInput || !resultsList || typeof SITE_PAGES === 'undefined') {
    return;
  }

  let lastMatches = [];

  function runSearch() {
    const query = searchInput.value.trim().toLowerCase();
    resultsList.innerHTML = '';
    lastMatches = [];

    if (query.length === 0) {
      return;
    }

    // Finn treff i indeksen
    const matches = SITE_PAGES.filter(page => {
      const lang = i18next.language || 'no';
      const title = i18next.t(page.titleKey);
      const description = i18next.t(page.descriptionKey);
      const keywords = page.keywords[lang] || page.keywords.no || [];
      const inTitle = title.toLowerCase().includes(query);
      const inDesc = description.toLowerCase().includes(query);
      const inKeywords = keywords.some(keyword =>
        keyword.toLowerCase().includes(query)
      );
      page._localizedTitle = title;
      page._localizedDescription = description;
      return inTitle || inDesc || inKeywords;
    });

    lastMatches = matches;

    if (matches.length === 0) {
      const li = document.createElement('li');
      li.textContent = i18next.t('no_search_results', { query: query });
      resultsList.appendChild(li);
      return;
    }

    // Vis treff som klikkbare lenker
    matches.forEach(page => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = page.url;

      const titleSpan = document.createElement('span');
      titleSpan.className = 'result-title';
      titleSpan.textContent = page._localizedTitle || i18next.t(page.titleKey);

      const descP = document.createElement('p');
      descP.className = 'result-description';
      descP.textContent = page._localizedDescription || i18next.t(page.descriptionKey);

      a.appendChild(titleSpan);
      a.appendChild(descP);
      li.appendChild(a);
      resultsList.appendChild(li);
    });
  }

  // Søk mens du skriver
  searchInput.addEventListener('input', runSearch);

  // Hopp til første treff med Enter
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (lastMatches.length === 0 && searchInput.value.trim() !== '') {
        runSearch();
      }

      if (lastMatches.length > 0) {
        window.location.href = lastMatches[0].url;
      }
    }
  });
});
