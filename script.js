/**
 * AquaMind - Pure Vanilla JavaScript Engine
 * Handles Navigation, Mobile Drawer, Scroll Reveal, Number Counters,
 * Interactive AI Simulation, Showcase Tabs, ROI Calculator, and Modals.
 * Zero external libraries or frameworks required.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavLink();
  initScrollReveal();
  initCounters();
  initHeroPrompts();
  initShowcaseInteractive();
  initRoiCalculator();
  initModals();
});

/* ==========================================================================
   1. Sticky Navbar & Appearance Change
   ========================================================================== */
function initStickyNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. Mobile Hamburger Menu
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-actions button');

  if (!menuToggle || !drawer || !overlay) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('is-open');
    menuToggle.classList.toggle('is-active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    drawer.classList.toggle('is-open', isOpen);
    overlay.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', () => toggleMenu());
  overlay.addEventListener('click', () => toggleMenu(false));

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   3. Smooth Scrolling with Header Offset
   ========================================================================== */
function initSmoothScroll() {
  const navHeight = 72;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   4. Active Nav Link on Scroll
   ========================================================================== */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   5. Scroll Reveal with IntersectionObserver
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

/* ==========================================================================
   6. Statistics Counter Animation
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  let hasRun = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-counter'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const isRupee = prefix.includes('₹');
      const duration = 1600;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const ease = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(ease * target);

        if (isRupee) {
          // Format Indian Currency formatting
          counter.textContent = prefix + currentVal.toLocaleString('en-IN') + suffix;
        } else {
          counter.textContent = prefix + currentVal.toLocaleString() + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          if (isRupee) {
            counter.textContent = prefix + target.toLocaleString('en-IN') + suffix;
          } else {
            counter.textContent = prefix + target.toLocaleString() + suffix;
          }
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const overviewBox = document.querySelector('.dash-box') || document.querySelector('.hero-section');
  if (!overviewBox) return;

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });
    obs.observe(overviewBox);
  } else {
    animateCounters();
  }
}

/* ==========================================================================
   7. Hero AI Interactive Prompts
   ========================================================================== */
function initHeroPrompts() {
  const chips = document.querySelectorAll('.prompt-chip');
  const toast = document.getElementById('promptToast');
  const toastText = document.getElementById('toastPromptText');
  const toastClose = document.getElementById('toastCloseBtn');

  if (!chips.length || !toast || !toastText) return;

  const promptReplies = {
    'Create an invoice': '⚡ Generating GST Invoice INV-1029 for Reddy & Co. with 18% tax breakdown and instant WhatsApp payment link. Ready in 3 seconds.',
    'Generate a business proposal': '📄 Created 4-page Business Partnership Proposal tailored for Bangalore SME client. Formatted with service scopes and pricing tables.',
    'Summarize this document': '🔍 Vendor Agreement summarized: Key milestone deadlines identified on 15th Oct, 30-day payment term, and warranty liability clause highlighted.',
    'Show my monthly performance': '📊 September Report: Total Revenue ₹1,24,500 (+12% MoM), 28 invoices processed, and 56 admin hours saved through automation.'
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const key = chip.textContent.trim().replace(/^['"]|['"]$/g, '');
      const reply = promptReplies[key] || `Processed "${key}" instantly with AquaMind AI.`;
      toastText.textContent = reply;
      toast.classList.add('is-visible');

      // Auto close after 7 seconds
      clearTimeout(window.toastTimer);
      window.toastTimer = setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 7000);
    });
  });

  if (toastClose) {
    toastClose.addEventListener('click', () => {
      toast.classList.remove('is-visible');
    });
  }
}

/* ==========================================================================
   8. Product Showcase Interactive Chat & Tabs
   ========================================================================== */
function initShowcaseInteractive() {
  const tabs = document.querySelectorAll('.showcase-tab-btn');
  const menuItems = document.querySelectorAll('.showcase-menu-item');
  const chatInput = document.getElementById('showcaseChatInput');
  const sendBtn = document.getElementById('showcaseSendBtn');
  const chatMessages = document.getElementById('showcaseChatMessages');

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(m => m.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Chat message submission
  if (chatInput && sendBtn && chatMessages) {
    const handleSend = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      // Add user message
      const userRow = document.createElement('div');
      userRow.className = 'chat-message-row user';
      userRow.innerHTML = `
        <div class="chat-avatar user-avatar">DJ</div>
        <div class="chat-bubble user-bubble">${escapeHtml(text)}</div>
      `;
      chatMessages.appendChild(userRow);
      chatInput.value = '';

      // AI Typing response
      const aiRow = document.createElement('div');
      aiRow.className = 'chat-message-row';
      aiRow.innerHTML = `
        <div class="chat-avatar ai-avatar">AI</div>
        <div class="chat-bubble ai-bubble">
          <span style="color: #64748B;">AquaMind is processing...</span>
        </div>
      `;
      chatMessages.appendChild(aiRow);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      setTimeout(() => {
        const aiBubble = aiRow.querySelector('.ai-bubble');
        let answer = `I've analyzed your request for "${text}". I have drafted the document and synced it with your customer records.`;
        if (text.toLowerCase().includes('invoice')) {
          answer = `Created GST Invoice draft with auto-calculated 18% IGST. PDF preview and shareable WhatsApp payment link ready for dispatch.`;
        } else if (text.toLowerCase().includes('schedule') || text.toLowerCase().includes('meeting')) {
          answer = `Meeting scheduled and added to your calendar. WhatsApp reminder notification prepared for attendees.`;
        }
        aiBubble.innerHTML = `<strong>AquaMind:</strong> ${answer}`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 900);
    };

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}

/* ==========================================================================
   9. Interactive ROI Calculator & Pricing Billing Switch
   ========================================================================== */
function initRoiCalculator() {
  const teamSlider = document.getElementById('teamSizeSlider');
  const hoursSlider = document.getElementById('hoursSavedSlider');
  const teamVal = document.getElementById('teamSizeVal');
  const hoursVal = document.getElementById('hoursSavedVal');
  const rupeesResult = document.getElementById('calculatedRupees');
  const hoursResult = document.getElementById('calculatedHours');

  if (!teamSlider || !hoursSlider || !rupeesResult) return;

  const updateCalculations = () => {
    const team = parseInt(teamSlider.value, 10);
    const hoursPerWeek = parseInt(hoursSlider.value, 10);

    if (teamVal) teamVal.textContent = team === 1 ? '1 Person' : `${team} Members`;
    if (hoursVal) hoursVal.textContent = `${hoursPerWeek} hrs/week`;

    // Average hourly cost for administrative tasks in Indian SME context ~ ₹250/hr
    // 4 weeks per month
    const totalHoursSavedMonth = team * hoursPerWeek * 4;
    const estimatedSavingsRupees = totalHoursSavedMonth * 250;

    rupeesResult.textContent = `₹${estimatedSavingsRupees.toLocaleString('en-IN')}`;
    if (hoursResult) {
      hoursResult.textContent = `+${totalHoursSavedMonth} administrative hours saved / month`;
    }
  };

  teamSlider.addEventListener('input', updateCalculations);
  hoursSlider.addEventListener('input', updateCalculations);
  updateCalculations();
}

/* ==========================================================================
   10. Modals Management (Start Free & Book Demo)
   ========================================================================== */
function initModals() {
  const startModal = document.getElementById('startFreeModal');
  const demoModal = document.getElementById('bookDemoModal');

  // Trigger buttons
  const startButtons = document.querySelectorAll('.btn-start-free');
  const demoButtons = document.querySelectorAll('.btn-book-demo');
  const closeButtons = document.querySelectorAll('.modal-close-btn, .modal-cancel-btn');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  startButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(startModal);
    });
  });

  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(demoModal);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(startModal);
      closeModal(demoModal);
    });
  });

  // Close on backdrop click
  [startModal, demoModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(startModal);
      closeModal(demoModal);
    }
  });

  // Handle Start Free Form Submission
  const startForm = document.getElementById('startFreeForm');
  if (startForm) {
    startForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('startName')?.value.trim();
      const phone = document.getElementById('startPhone')?.value.trim();

      if (!name || !phone) {
        alert('Please fill in your name and phone number to begin.');
        return;
      }

      const body = startModal.querySelector('.modal-body');
      const footer = startModal.querySelector('.modal-footer');
      if (body && footer) {
        footer.style.display = 'none';
        body.innerHTML = `
          <div class="modal-success-box">
            <div class="modal-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h4 style="font-size: 1.25rem; font-weight: 800; color: #0B1F3A;">Welcome to AquaMind, ${escapeHtml(name)}!</h4>
            <p style="font-size: 0.9375rem; color: #475467; max-width: 360px;">Your 14-day free trial has been activated. We sent your workspace login link to your WhatsApp/SMS (${escapeHtml(phone)}).</p>
            <button class="btn btn-primary" onclick="window.location.reload()" style="margin-top: 12px; width: 100%;">Open Workspace</button>
          </div>
        `;
      }
    });
  }

  // Handle Demo Form Submission
  const demoForm = document.getElementById('bookDemoForm');
  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('demoName')?.value.trim();
      const business = document.getElementById('demoBusiness')?.value.trim();

      if (!name || !business) {
        alert('Please fill in your name and business name.');
        return;
      }

      const body = demoModal.querySelector('.modal-body');
      const footer = demoModal.querySelector('.modal-footer');
      if (body && footer) {
        footer.style.display = 'none';
        body.innerHTML = `
          <div class="modal-success-box">
            <div class="modal-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 14 14"></polyline>
              </svg>
            </div>
            <h4 style="font-size: 1.25rem; font-weight: 800; color: #0B1F3A;">Demo Scheduled!</h4>
            <p style="font-size: 0.9375rem; color: #475467; max-width: 360px;">Thank you, ${escapeHtml(name)}. An AquaMind product specialist will connect with ${escapeHtml(business)} for a live 15-minute walkthrough.</p>
            <button class="btn btn-secondary modal-cancel-btn" onclick="document.getElementById('bookDemoModal').classList.remove('is-active')" style="margin-top: 12px; width: 100%;">Done</button>
          </div>
        `;
      }
    });
  }
}
