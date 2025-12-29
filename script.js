const root = document.documentElement;
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const yearSlot = document.getElementById('year');
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleIcon = document.querySelector('.theme-toggle__icon');
const prefersDark = typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : { matches: false };
const THEME_STORAGE_KEY = 'gaviota-theme';
let storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
let userSetTheme = Boolean(storedTheme);

const applyTheme = (theme) => {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  root.dataset.theme = nextTheme;
  if (themeToggleIcon) {
    themeToggleIcon.textContent = nextTheme === 'dark' ? '🌙' : '☀️';
  }
};

applyTheme(storedTheme || (prefersDark.matches ? 'dark' : 'light'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = root.dataset.theme !== 'light';
    const nextTheme = isDark ? 'light' : 'dark';
    userSetTheme = true;
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}

const handlePrefersChange = (event) => {
  if (userSetTheme) return;
  applyTheme(event.matches ? 'dark' : 'light');
};

if (prefersDark.addEventListener) {
  prefersDark.addEventListener('change', handlePrefersChange);
} else if (prefersDark.addListener) {
  prefersDark.addListener(handlePrefersChange);
}

if (yearSlot) {
  yearSlot.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    const name = formData.get('name')?.trim() || 'Contact landing Gaviota';
    const email = formData.get('email')?.trim() || 'non-renseigné';
    const message = formData.get('message')?.trim() || '';

    const payload = {
      to: 'jerome.le.champion@gmail.com',
      subject: 'New Email from landing page Gaviota ✔',
      body: `Nom: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';
    if (formStatus) {
      formStatus.textContent = '';
    }

    try {
      const response = await fetch('https://api.gaviota.fr/mail', {
        method: 'POST',
        headers: {
          Authorization: 'API_KEY_JEROME',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erreur API (${response.status})`);
      }

      contactForm.reset();
      if (formStatus) {
        formStatus.textContent = 'Merci ! Votre message a bien été envoyé.';
        formStatus.classList.remove('form-status--error');
        formStatus.classList.add('form-status--success');
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent =
          "Une erreur est survenue lors de l'envoi. Merci de réessayer ou d'écrire à contact@gaviota.fr.";
        formStatus.classList.remove('form-status--success');
        formStatus.classList.add('form-status--error');
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer';
    }
  });
}
