type AyandaV05Response = { v05View?: string };

const nativeFetch = window.fetch.bind(window);

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const response = await nativeFetch(input, init);
  try {
    const url = typeof input === 'string'
      ? input
      : input instanceof Request
        ? input.url
        : String(input);

    // Preserve the existing React Ayanda response unchanged. The cloned body is
    // inspected only to route deterministic v0.5 navigation intents into the
    // separately loaded federated-platform extension.
    if (/\/api\/ayanda(?:\?|$)/.test(url) && response.ok) {
      const data = await response.clone().json() as AyandaV05Response;
      if (data?.v05View) {
        queueMicrotask(() => {
          const value = String(data.v05View);
          const button = [...document.querySelectorAll<HTMLButtonElement>('.v05-nav button[data-v05]')]
            .find(b => b.dataset.v05 === value);
          button?.click();
        });
      }
    }
  } catch {
    // Ayanda and the original request must continue even when the optional
    // navigation bridge cannot inspect the response.
  }
  return response;
};

let lastShellPresent = false;
let roleTimer: number | undefined;

function notifySessionChange() {
  window.clearTimeout(roleTimer);
  roleTimer = window.setTimeout(() => {
    window.dispatchEvent(new Event('carepath:user-changed'));
  }, 180);
}

document.addEventListener('change', event => {
  const target = event.target;
  if (target instanceof HTMLSelectElement && target.matches('.user-type-switch select')) {
    notifySessionChange();
  }
});

// The v0.5 module loads while the login screen may still be visible. Detect the
// authenticated application shell appearing after login and initialise the
// v0.5 role-aware navigation without requiring a page refresh.
const observer = new MutationObserver(() => {
  const shellPresent = Boolean(document.querySelector('.app-shell'));
  if (shellPresent && !lastShellPresent) notifySessionChange();
  if (shellPresent && !document.querySelector('.v05-nav')) notifySessionChange();
  lastShellPresent = shellPresent;
});
observer.observe(document.documentElement, { childList: true, subtree: true });
