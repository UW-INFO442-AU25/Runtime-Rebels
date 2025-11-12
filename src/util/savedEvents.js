const KEY = 'azurehaven:savedEvents';

export function getSavedEvents() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isSaved(id) {
  return getSavedEvents().some(e => String(e.id) === String(id));
}

export function saveEvent(ev) {
  const list = getSavedEvents();
  if (!list.some(e => String(e.id) === String(ev.id))) {
    localStorage.setItem(KEY, JSON.stringify([...list, ev]));
    broadcast();
  }
}

export function removeEvent(id) {
  const list = getSavedEvents().filter(e => String(e.id) !== String(id));
  localStorage.setItem(KEY, JSON.stringify(list));
  broadcast();
}

function broadcast() {
  try {
    localStorage.setItem(KEY + ':ping', String(Date.now()));
  } catch {}
}
