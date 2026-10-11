export function loadAppState() {
  try {
    const raw = localStorage.getItem('carebridge-accessible-state');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Unable to load app state', error);
    return null;
  }
}

export function saveAppState(state) {
  try {
    localStorage.setItem('carebridge-accessible-state', JSON.stringify(state));
  } catch (error) {
    console.warn('Unable to save app state', error);
  }
}
