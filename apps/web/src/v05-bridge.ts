export {};

type AyandaV05Response = { v05View?: string };
type SessionUser = { role: string };

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
            .find(b => b.dataset.v05 === value && !b.hidden);
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
let visibilityTimer: number | undefined;

async function applyRoleVisibility() {
  window.clearTimeout(visibilityTimer);
  visibilityTimer = window.setTimeout(async () => {
    try {
      const response = await nativeFetch('/api/auth/me', { credentials: 'include' });
      if (!response.ok) return;
      const data = await response.json() as { user?: SessionUser };
      const role = data.user?.role;
      if (!role) return;

      document.querySelectorAll<HTMLButtonElement>('.v05-nav button[data-v05]').forEach(button => {
        const view = button.dataset.v05;
        if ((role === 'MANAGER' || role === 'AUDITOR') && view === 'identity') button.hidden = true;
        else if (role === 'AUDITOR' && view === 'watch') button.hidden = true;
        else if (role === 'PATIENT' && (view === 'watch' || view === 'exchange')) button.hidden = true;
        else button.hidden = false;
      });
    } catch {
      // Leave the server as the ultimate permission boundary.
    }
  }, 40);
}

function notifySessionChange() {
  window.clearTimeout(roleTimer);
  roleTimer = window.setTimeout(() => {
    window.dispatchEvent(new Event('carepath:user-changed'));
    void applyRoleVisibility();
  }, 180);
}

document.addEventListener('change', event => {
  const target = event.target;
  if (target instanceof HTMLSelectElement && target.matches('.user-type-switch select')) {
    notifySessionChange();
  }
});

const observer = new MutationObserver(() => {
  const shellPresent = Boolean(document.querySelector('.app-shell'));
  if (shellPresent && !lastShellPresent) notifySessionChange();
  if (shellPresent && !document.querySelector('.v05-nav')) notifySessionChange();
  if (shellPresent && document.querySelector('.v05-nav')) void applyRoleVisibility();
  lastShellPresent = shellPresent;
});
observer.observe(document.documentElement, { childList: true, subtree: true });
