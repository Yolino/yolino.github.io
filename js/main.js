/* ==========================================================
   PORTFOLIO — Tiago Carmo Silveirinha
   Script principal (JavaScript natif, aucune dépendance)
   ========================================================== */

/**
 * Point d'entrée : on attend le chargement complet du DOM
 * avant d'initialiser les comportements dynamiques.
 */
document.addEventListener('DOMContentLoaded', () => {
    initBurgerMenu();
    initAccordion();
    calculateActivityTotals();
    initContactForm();
    initFooterYear();
    initNavbarScroll();
    initLightbox();
});


/* ----------------------------------------------------------
   1. MENU BURGER (Mobile)
   ---------------------------------------------------------- */
/**
 * Gère l'ouverture / fermeture du menu mobile en
 * basculant la classe "active" sur le bouton et la nav.
 */
function initBurgerMenu() {
    const burger = document.getElementById('burger-btn');
    const nav = document.getElementById('nav-links');

    if (!burger || !nav) return;

    // Ouverture / fermeture au clic sur le burger
    burger.addEventListener('click', () => {
        const isActive = burger.classList.toggle('active');
        nav.classList.toggle('active', isActive);
        burger.setAttribute('aria-expanded', String(isActive));
    });

    // Fermeture automatique quand on clique sur un lien (mobile)
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
}


/* ----------------------------------------------------------
   2. ACCORDION — Lignes du tableau d'activités
   ---------------------------------------------------------- */
/**
 * Transforme chaque ligne du tableau d'activités en accordéon.
 * Une seule ligne peut être ouverte à la fois (comportement standard).
 */
function initAccordion() {
    const rows = document.querySelectorAll('.activity-row');

    rows.forEach(row => {
        const header = row.querySelector('.activity-row__header');
        if (!header) return;

        header.addEventListener('click', () => {
            const isOpen = row.classList.contains('open');

            // Ferme toutes les autres lignes (un seul accordéon ouvert à la fois)
            rows.forEach(r => {
                r.classList.remove('open');
                const h = r.querySelector('.activity-row__header');
                if (h) h.setAttribute('aria-expanded', 'false');
            });

            // Bascule l'état de la ligne cliquée
            if (!isOpen) {
                row.classList.add('open');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });
}


/* ----------------------------------------------------------
   3. CALCULATEUR — Total des heures
   ---------------------------------------------------------- */
/**
 * Parcourt toutes les lignes d'activités, somme les heures
 * réalisées et validées (lues depuis les attributs data-*),
 * et affiche le total dans la ligne "TOTAL" du tableau.
 *
 * Avantages :
 *   - les valeurs sont stockées sur la ligne (data-realisees, data-validees)
 *   - n'importe quelle modification se reflète automatiquement
 *   - aucune duplication entre l'affichage HTML et la logique JS
 */
function calculateActivityTotals() {
    const rows = document.querySelectorAll('.activity-row');
    const totalRealiseesEl = document.getElementById('total-realisees');
    const totalValideesEl = document.getElementById('total-validees');

    if (!totalRealiseesEl || !totalValideesEl) return;

    let totalRealisees = 0;
    let totalValidees = 0;

    rows.forEach(row => {
        // Conversion en nombre, 0 par défaut si non défini ou invalide
        const realisees = parseFloat(row.dataset.realisees) || 0;
        const validees = parseFloat(row.dataset.validees) || 0;
        totalRealisees += realisees;
        totalValidees += validees;
    });

    // Affichage formaté en notation française (ex: 15.5 → "15h30")
    totalRealiseesEl.textContent = formatHours(totalRealisees);
    totalValideesEl.textContent = formatHours(totalValidees);
}

/**
 * Formate un nombre d'heures décimales en notation française.
 * Exemples : 10 → "10h"   ·   7.5 → "7h30"   ·   2.25 → "2h15"
 */
function formatHours(value) {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    if (minutes === 0) {
        return hours + 'h';
    }
    return hours + 'h' + String(minutes).padStart(2, '0');
}


/* ----------------------------------------------------------
   4. FORMULAIRE DE CONTACT
   ---------------------------------------------------------- */
/**
 * Gère l'envoi du formulaire côté client.
 * Note : étant donné que GitHub Pages est un hébergement statique,
 * le formulaire ne peut pas envoyer d'e-mail directement.
 * Cette fonction simule l'envoi et fournit un retour visuel.
 *
 * Pour un envoi réel, on peut intégrer Formspree, EmailJS,
 * ou rediriger vers mailto:.
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (!form || !feedback) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Récupération et validation simple des champs
        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const message = form.elements['message'].value.trim();

        feedback.className = 'form__feedback';

        if (!name || !email || !message) {
            feedback.textContent = '⚠ Merci de remplir tous les champs requis.';
            feedback.classList.add('error');
            return;
        }

        // Validation email basique
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            feedback.textContent = '⚠ Adresse email invalide.';
            feedback.classList.add('error');
            return;
        }

        // Simulation d'envoi : ouverture du client mail par défaut
        const subject = encodeURIComponent(form.elements['subject'].value || 'Contact via portfolio');
        const body = encodeURIComponent(`Nom : ${name}\nEmail : ${email}\n\n${message}`);
        window.location.href = `mailto:yolinoyt@gmail.com?subject=${subject}&body=${body}`;

        feedback.textContent = '✓ Votre client mail va s\'ouvrir...';
        feedback.classList.add('success');
        form.reset();
    });
}


/* ----------------------------------------------------------
   5. ANNÉE DYNAMIQUE DANS LE FOOTER
   ---------------------------------------------------------- */
/**
 * Injecte automatiquement l'année courante dans le footer
 * pour éviter d'avoir à mettre à jour manuellement chaque année.
 */
function initFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}


/* ----------------------------------------------------------
   6. LIGHTBOX — Agrandissement des images au clic
   ---------------------------------------------------------- */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');

    if (!lightbox || !lightboxImg || !closeBtn) return;

    function openLightbox(img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.proofs img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img));
    });

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
}


/* ----------------------------------------------------------
   7. EFFET DE SCROLL SUR LA NAVBAR
   ---------------------------------------------------------- */
/**
 * Ajoute une classe CSS lorsque l'utilisateur a scrollé,
 * permettant à la navbar de changer légèrement d'apparence
 * (ombre plus marquée, fond plus opaque...).
 */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // appel initial pour gérer le rechargement à mi-page
}
