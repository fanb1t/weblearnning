const mainNavLinks = Array.from(document.querySelectorAll('nav > ul > li > a'));
const sections = Array.from(document.querySelectorAll('main section[id]'));
const navToggle = document.querySelector('.nav-toggle');
const planetsLink = document.querySelector('nav a[href="#planets"]');
const planetArticles = Array.from(document.querySelectorAll('.planet-list article'));

const planetNavItems = [
  { id: 'mercury', label: 'Mercury' },
  { id: 'venus', label: 'Venus' },
  { id: 'earth', label: 'Earth' },
  { id: 'mars', label: 'Mars' },
  { id: 'jupiter', label: 'Jupiter' },
  { id: 'saturn', label: 'Saturn' },
  { id: 'uranus', label: 'Uranus' },
  { id: 'neptune', label: 'Neptune' },
];

function setupMobileMenu() {
  if (!navToggle) return;

  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', () => {
      const isPlanetsToggle =
        link.getAttribute('href') === '#planets' &&
        link.closest('.has-dropdown') &&
        window.matchMedia('(max-width: 860px)').matches;

      if (isPlanetsToggle) return;

      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupPlanetDropdown() {
  if (!planetsLink || planetArticles.length === 0) return;

  const planetsItem = planetsLink.closest('li');
  const dropdown = document.createElement('ul');

  planetsItem.classList.add('has-dropdown');
  dropdown.className = 'planet-dropdown';

  planetArticles.forEach((article, index) => {
    const planet = planetNavItems[index];
    if (!planet) return;

    article.id = planet.id;
    const item = document.createElement('li');
    const link = document.createElement('a');

    link.href = `#${planet.id}`;
    link.textContent = planet.label;
    item.appendChild(link);
    dropdown.appendChild(item);
  });

  planetsItem.appendChild(dropdown);

  planetsLink.addEventListener('click', (event) => {
    if (window.matchMedia('(max-width: 860px)').matches) {
      event.preventDefault();
      planetsItem.classList.toggle('is-open');
    }
  });
}

function setupActiveNavigation() {
  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length === 0) return;

      const activeId = visibleEntries[0].target.id;
      mainNavLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`);
      });
    },
    {
      rootMargin: '-35% 0px -50% 0px',
      threshold: [0.1, 0.25, 0.5, 0.75],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupRevealAnimation() {
  const revealElements = document.querySelectorAll(
    '.hero-content, .info-section h2, .info-section p, .planet-list article, .facts-list li'
  );

  revealElements.forEach((element) => element.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupScrollTopButton() {
  const button = document.createElement('button');
  button.className = 'scroll-top';
  button.type = 'button';
  button.setAttribute('aria-label', 'Scroll to top');
  button.textContent = 'Top';
  document.body.appendChild(button);

  window.addEventListener('scroll', () => {
    button.classList.toggle('is-visible', window.scrollY > 500);
  });

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

setupPlanetDropdown();
setupMobileMenu();
setupActiveNavigation();
setupRevealAnimation();
setupScrollTopButton();
