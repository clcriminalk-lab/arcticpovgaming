const chips = [...document.querySelectorAll('.filter-chip')];
const cards = [...document.querySelectorAll('.game-card')];
const search = document.querySelector('#game-search');
const emptyState = document.querySelector('#empty-state');
let activeFilter = 'all';

function updateGames() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const matchesGenre = activeFilter === 'all' || card.dataset.genre.split(' ').includes(activeFilter);
    const matchesSearch = card.dataset.title.toLowerCase().includes(query) || card.querySelector('.game-blurb').textContent.toLowerCase().includes(query);
    card.hidden = !(matchesGenre && matchesSearch);
    if (!card.hidden) visible += 1;
  });
  emptyState.hidden = visible > 0;
}

chips.forEach((chip) => chip.addEventListener('click', () => {
  chips.forEach((item) => item.classList.toggle('selected', item === chip));
  activeFilter = chip.dataset.filter;
  updateGames();
}));

search.addEventListener('input', updateGames);

document.querySelectorAll('.save-button').forEach((button) => button.addEventListener('click', () => {
  const saved = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', String(!saved));
  button.textContent = saved ? '+' : '✓';
}));

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

