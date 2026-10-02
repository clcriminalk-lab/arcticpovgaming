const chips = [...document.querySelectorAll('.filter-chip')];
const cards = [...document.querySelectorAll('.game-card')];
const search = document.querySelector('#game-search');
const emptyState = document.querySelector('#empty-state');
let activeFilter = 'all';
let libraryView = false;
const savedGames = new Set(JSON.parse(localStorage.getItem('arcticpov-library') || '[]'));
const libraryLink = document.querySelector('.main-nav a[href="#library"]');
const discoverLink = document.querySelector('.main-nav a[href="#discover"]');
const libraryCount = libraryLink.querySelector('.nav-count');
for (const title of savedGames) {
  if (!cards.some((card) => card.dataset.title === title)) savedGames.delete(title);
}

function updateLibrary() {
  libraryCount.textContent = String(savedGames.size).padStart(2, '0');
  cards.forEach((card) => {
    const button = card.querySelector('.save-button');
    const saved = savedGames.has(card.dataset.title);
    button.setAttribute('aria-pressed', String(saved));
    button.setAttribute('aria-label', `${saved ? 'Remove' : 'Add'} ${card.dataset.title} ${saved ? 'from' : 'to'} my library`);
    button.textContent = saved ? '✓' : '＋';
  });
  localStorage.setItem('arcticpov-library', JSON.stringify([...savedGames]));
}

function updateGames() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const matchesLibrary = !libraryView || savedGames.has(card.dataset.title);
    const matchesGenre = libraryView || activeFilter === 'all' || card.dataset.genre.split(' ').includes(activeFilter);
    const matchesSearch = card.dataset.title.toLowerCase().includes(query) || card.querySelector('.game-blurb').textContent.toLowerCase().includes(query);
    card.hidden = !(matchesLibrary && matchesGenre && matchesSearch);
    if (!card.hidden) visible += 1;
  });
  emptyState.textContent = libraryView && savedGames.size === 0
    ? 'Your library is empty. Select + on a game to add it here.'
    : 'No games match that search. Try another genre or title.';
  emptyState.hidden = visible > 0;
}

chips.forEach((chip) => chip.addEventListener('click', () => {
  chips.forEach((item) => item.classList.toggle('selected', item === chip));
  activeFilter = chip.dataset.filter;
  updateGames();
}));

search.addEventListener('input', updateGames);

document.querySelectorAll('.save-button').forEach((button) => button.addEventListener('click', () => {
  const title = button.closest('.game-card').dataset.title;
  if (savedGames.has(title)) savedGames.delete(title);
  else savedGames.add(title);
  updateLibrary();
  updateGames();
}));

libraryLink.addEventListener('click', (event) => {
  event.preventDefault();
  libraryView = true;
  history.replaceState(null, '', '#library');
  updateGames();
  document.querySelector('#games').scrollIntoView({behavior: 'smooth'});
});
discoverLink.addEventListener('click', () => {
  libraryView = false;
  updateGames();
});

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menu.addEventListener('click', () => {
  const isOpen = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open', !isOpen);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));

updateLibrary();
if (location.hash === '#library') libraryView = true;
updateGames();

