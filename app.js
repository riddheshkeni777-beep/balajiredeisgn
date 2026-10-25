/**
 * Balaji Earthmovers — Core Application Logic
 * Featuring:
 * - Dynamic Animated Number Counters on Scroll
 * - IntersectionObserver Scroll Reveal Animations (Up, Left, Right, Scale)
 * - Header Scroll Compact Transition
 * - Operations Video Modal
 * - Interactive 3D Card Hover Tilt
 * - Live Mumbai Time Clock (IST UTC+5:30)
 * - The Craft 3-Phase Interactive Slider
 * - Fleet Machinery Technical Specification Modals
 * - Landmark Projects Filter (Completed vs Ongoing)
 * - Estimate Form Validation & Toast Notification
 */

document.addEventListener('DOMContentLoaded', () => {
    initLiveClock();
    initHeaderScroll();
    initScrollReveal();
    initAnimatedCounters();
    initNavigation();
    initCraftSlider();
    initFleetModals();
    initVideoModal();
    initProjectTabs();
    initEstimateForm();
    initMobileMenu();
    initCardTilt();
});

/* ==========================================================================
   1. Live Mumbai Time Clock (IST UTC+5:30)
   ========================================================================== */
function initLiveClock() {
    const clockEl = document.getElementById('clockDisplay');
    if (!clockEl) return;

    function updateClock() {
        try {
            const now = new Date();
            const timeFormatter = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            clockEl.textContent = `${timeFormatter.format(now)} IST`;
        } catch (e) {
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const istDate = new Date(utc + (3600000 * 5.5));
            const pad = (n) => String(n).padStart(2, '0');
            clockEl.textContent = `${pad(istDate.getHours())}:${pad(istDate.getMinutes())}:${pad(istDate.getSeconds())} IST`;
        }
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* ==========================================================================
   2. Header Scroll Reactive State
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    let lastScrollY = window.scrollY;

    function onScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScrollY = window.scrollY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ==========================================================================
   3. Scroll-Driven Entrance Reveals (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    if (!revealElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Apply slight stagger if multiple elements appear together
                setTimeout(() => {
                    entry.target.classList.add('is-revealed');
                }, 60);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   4. Dynamic Animated Number Counters on Scroll
   ========================================================================== */
function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('.count-up');
    if (!counterElements.length) return;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCountUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    counterElements.forEach(el => counterObserver.observe(el));

    function formatNumber(val, format) {
        if (format === 'indian') {
            // e.g. 2,00,000 / 4,00,000 / 1,50,000
            return Math.floor(val).toLocaleString('en-IN');
        }
        return val;
    }

    function startCountUp(el) {
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const format = el.getAttribute('data-format') || '';
        const duration = 1800; // 1.8 seconds
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentVal = (target * easedProgress);

            let displayVal;
            if (decimals > 0) {
                displayVal = currentVal.toFixed(decimals);
            } else if (format === 'indian') {
                displayVal = formatNumber(currentVal, 'indian');
            } else {
                displayVal = Math.floor(currentVal);
            }

            el.textContent = `${displayVal}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                // Ensure exact final number
                let finalVal = decimals > 0 ? target.toFixed(decimals) : (format === 'indian' ? formatNumber(target, 'indian') : target);
                el.textContent = `${finalVal}${suffix}`;
            }
        }

        requestAnimationFrame(updateCount);
    }
}

/* ==========================================================================
   5. Navigation & Scroll Spy
   ========================================================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
                const drawer = document.getElementById('mobileNavDrawer');
                if (drawer && drawer.classList.contains('open')) {
                    drawer.classList.remove('open');
                }
            }
        });
    });
}

/* ==========================================================================
   6. The Craft: 3-Phase Interactive Slider
   ========================================================================== */
function initCraftSlider() {
    const craftSec = document.getElementById('craft');
    const panels = document.querySelectorAll('.craft-panel');
    const phaseBtns = document.querySelectorAll('.phase-btn');
    const prevBtn = document.getElementById('craftPrevBtn');
    const nextBtn = document.getElementById('craftNextBtn');
    const progressFill = document.getElementById('craftProgressFill');
    if (!craftSec || panels.length === 0) return;

    let currentPhase = 0;
    const totalPhases = panels.length;
    let isClickScrolling = false;
    let clickScrollTimer = null;

    function setActivePhase(index) {
        if (index < 0) index = 0;
        if (index >= totalPhases) index = totalPhases - 1;
        currentPhase = index;

        panels.forEach((p, idx) => {
            if (idx === currentPhase) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });

        phaseBtns.forEach((btn, idx) => {
            if (idx === currentPhase) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (prevBtn) prevBtn.style.opacity = currentPhase === 0 ? '0.35' : '1';
        if (nextBtn) nextBtn.style.opacity = currentPhase === totalPhases - 1 ? '0.35' : '1';
    }

    function scrollToPhase(index) {
        if (index < 0) index = 0;
        if (index >= totalPhases) index = totalPhases - 1;

        const rect = craftSec.getBoundingClientRect();
        const runway = craftSec.offsetHeight - window.innerHeight;
        const craftTop = rect.top + window.pageYOffset;

        // Position offsets: 0%, 50%, 100% of runway
        const fraction = totalPhases > 1 ? index / (totalPhases - 1) : 0;
        const targetScrollY = craftTop + fraction * runway;

        isClickScrolling = true;
        clearTimeout(clickScrollTimer);
        setActivePhase(index);

        if (progressFill) {
            const pct = Math.max(10, Math.min(100, fraction * 100));
            progressFill.style.width = `${pct}%`;
        }

        window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
        });

        clickScrollTimer = setTimeout(() => {
            isClickScrolling = false;
        }, 800);
    }

    // Scroll listener for sticky pinning progression
    function handleScroll() {
        if (isClickScrolling) return;

        const rect = craftSec.getBoundingClientRect();
        const runway = craftSec.offsetHeight - window.innerHeight;
        if (runway <= 0) return;

        const scrolled = -rect.top;

        if (scrolled >= 0 && scrolled <= runway) {
            // Inside the pinned scroll-lock runway
            const progress = scrolled / runway; // 0 to 1
            let targetPhase = 0;

            if (progress < 0.33) {
                targetPhase = 0;
            } else if (progress < 0.67) {
                targetPhase = 1;
            } else {
                targetPhase = 2;
            }

            if (targetPhase !== currentPhase) {
                setActivePhase(targetPhase);
            }

            if (progressFill) {
                const pct = Math.max(10, Math.min(100, progress * 100));
                progressFill.style.width = `${pct}%`;
            }
        } else if (scrolled < 0) {
            if (currentPhase !== 0) setActivePhase(0);
            if (progressFill) progressFill.style.width = '10%';
        } else if (scrolled > runway) {
            if (currentPhase !== totalPhases - 1) setActivePhase(totalPhases - 1);
            if (progressFill) progressFill.style.width = '100%';
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    phaseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const phaseIdx = parseInt(btn.getAttribute('data-phase'), 10);
            scrollToPhase(phaseIdx);
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToPhase(currentPhase - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToPhase(currentPhase + 1);
        });
    }

    window.addEventListener('keydown', (e) => {
        const rect = craftSec.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                if (currentPhase < totalPhases - 1) {
                    e.preventDefault();
                    scrollToPhase(currentPhase + 1);
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                if (currentPhase > 0) {
                    e.preventDefault();
                    scrollToPhase(currentPhase - 1);
                }
            }
        }
    });

    // Initial sync
    setActivePhase(0);
    handleScroll();
}

/* ==========================================================================
   7. Fleet Machinery Specifications Modal
   ========================================================================== */
const FLEET_DATA = {
    volvo: {
        title: 'Volvo EC 210 & EC 290',
        category: 'HEAVY CRAWLER EXCAVATOR',
        count: '3 Active Units in Mumbai Fleet',
        image: 'images/fleet-volvo.jpg',
        specs: [
            { label: 'Operating Weight', val: '21,200 &ndash; 29,800 kg' },
            { label: 'Engine Power', val: '123 kW (165 hp) &ndash; 153 kW (205 hp)' },
            { label: 'Standard Bucket', val: '1.2 &ndash; 1.6 cu.m Heavy Rock' },
            { label: 'Max Digging Depth', val: '7,330 mm' },
            { label: 'Primary Use', val: 'Basement core excavation, hard strata removal, and bulk rock handling.' }
        ]
    },
    hitachi: {
        title: 'Tata Hitachi EX 200 Super Series',
        category: 'SUPER SERIES EXCAVATOR',
        count: '7 Active Units in Mumbai Fleet',
        image: 'images/fleet-hitachi.jpg',
        specs: [
            { label: 'Operating Weight', val: '20,500 kg' },
            { label: 'Engine Power', val: '133 hp @ 2000 RPM (Cummins 6BT 5.9)' },
            { label: 'Standard Bucket', val: '0.91 &ndash; 1.1 cu.m' },
            { label: 'Max Digging Depth', val: '6,610 mm' },
            { label: 'Primary Use', val: 'High-speed urban trenching, foundation pit preparation, 24/7 continuous operation.' }
        ]
    },
    zaxis: {
        title: 'Hitachi Zaxis 120 / 210 / 370',
        category: 'HYDRAULIC EXCAVATOR SERIES',
        count: '5 Active Units in Mumbai Fleet',
        image: 'images/craft-1.jpg',
        specs: [
            { label: 'Operating Weight', val: '12,500 &ndash; 37,200 kg' },
            { label: 'Hydraulic System', val: 'HIOS III Multi-circuit sensing' },
            { label: 'Standard Bucket', val: '0.55 &ndash; 2.1 cu.m' },
            { label: 'Rock Breaker Compatibility', val: 'Fully plumbed for heavy chisels' },
            { label: 'Primary Use', val: 'Tight space basement digging up to high-capacity rock quarry extraction.' }
        ]
    },
    komatsu: {
        title: 'L&T Komatsu PC-210',
        category: 'HYDRAULIC EXCAVATOR',
        count: '3 Active Units in Mumbai Fleet',
        image: 'images/fleet-komatsu.jpg',
        specs: [
            { label: 'Operating Weight', val: '21,000 kg' },
            { label: 'Engine Power', val: '143 hp Komatsu SAA6D102E' },
            { label: 'Boom & Arm', val: 'Heavy-duty cast steel reinforced joints' },
            { label: 'Max Breakout Force', val: '15,200 kgf' },
            { label: 'Primary Use', val: 'Basalt formation tearing, retaining wall trenches, severe rock condition jobs.' }
        ]
    },
    breakers: {
        title: 'Heavy Hydraulic Rock Breakers',
        category: 'HARD ROCK DEMOLITION ARSENAL',
        count: '24 Active Units across Mumbai',
        image: 'images/fleet-breaker.jpg',
        specs: [
            { label: 'Operating Weight', val: '1,800 &ndash; 3,500 kg per unit' },
            { label: 'Impact Energy', val: 'Up to 8,500 Joules per blow' },
            { label: 'Operating Pressure', val: '160 &ndash; 180 bar' },
            { label: 'Tool Diameter', val: '135 &ndash; 175 mm Chisel & Moil point' },
            { label: 'Primary Use', val: 'Silent, non-blasting fracturing of Mumbai basalt bedrock under strict urban regulations.' }
        ]
    }
};

function initFleetModals() {
    const fleetCards = document.querySelectorAll('.fleet-card');
    const modal = document.getElementById('fleetModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.getElementById('modalCloseBtn');

    if (!modal || !modalBody) return;

    fleetCards.forEach(card => {
        card.addEventListener('click', () => {
            const fleetId = card.getAttribute('data-fleet-id');
            const data = FLEET_DATA[fleetId];
            if (!data) return;

            let specsHtml = data.specs.map(s => `
                <div style="display:flex; justify-content:space-between; padding: 12px 0; border-bottom: 1px solid #E2E8F0; font-size:13.5px;">
                    <span style="font-family: var(--font-mono); font-size: 11px; font-weight:700; letter-spacing:0.15em; color: var(--c-copper);">${s.label}</span>
                    <span style="color: #0F172A; font-weight: 500; text-align:right; max-width:60%;">${s.val}</span>
                </div>
            `).join('');

            modalBody.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.22em; color: var(--c-copper); background: rgba(255, 94, 20, 0.12); padding: 4px 10px; display:inline-block; margin-bottom: 6px;">${data.category}</span>
                    <h3 style="font-family: var(--font-serif); font-size: 32px; color: #0F172A; margin: 6px 0;">${data.title}</h3>
                    <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 600; color: #64748B;">${data.count}</div>
                </div>
                <div style="width:100%; height: 260px; overflow:hidden; margin-bottom: 24px; border: 1.5px solid #FED7AA;">
                    <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div style="margin-bottom: 24px;">
                    ${specsHtml}
                </div>
                <div style="display:flex; justify-content:flex-end;">
                    <a href="#estimate" class="btn-estimate-header chamfer-sm" onclick="document.getElementById('fleetModal').classList.remove('open')" style="display:inline-flex; width:auto; text-decoration:none;">
                        <span>INQUIRE AVAILABILITY</span>
                        <span class="arrow">&rarr;</span>
                    </a>
                </div>
            `;

            modal.classList.add('open');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
        }
    });
}

/* ==========================================================================
   8. Operations Video Showcase Modal
   ========================================================================== */
function initVideoModal() {
    const trigger = document.getElementById('heroVideoTrigger');
    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('videoModalCloseBtn');

    if (!trigger || !modal) return;

    trigger.addEventListener('click', () => {
        modal.classList.add('open');
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
        }
    });
}

/* ==========================================================================
   9. Project Filter Tabs (Completed vs Ongoing)
   ========================================================================== */
function initProjectTabs() {
    const tabCompleted = document.getElementById('tabCompleted');
    const tabOngoing = document.getElementById('tabOngoing');
    const projectRows = document.querySelectorAll('.project-row');
    const featuredCard = document.getElementById('featuredProjectCard');

    if (!tabCompleted || !tabOngoing) return;

    function setFilter(status) {
        if (status === 'completed') {
            tabCompleted.classList.add('active');
            tabOngoing.classList.remove('active');
            if (featuredCard) {
                featuredCard.style.display = 'flex';
                featuredCard.style.animation = 'heroItemFadeUp 0.5s ease forwards';
            }
        } else {
            tabOngoing.classList.add('active');
            tabCompleted.classList.remove('active');
            if (featuredCard) featuredCard.style.display = 'none';
        }

        projectRows.forEach((row, idx) => {
            const rowStatus = row.getAttribute('data-status');
            if (rowStatus === status) {
                row.style.display = 'grid';
                row.style.animation = `heroItemFadeUp 0.4s ease ${idx * 0.05}s forwards`;
            } else {
                row.style.display = 'none';
            }
        });
    }

    tabCompleted.addEventListener('click', () => setFilter('completed'));
    tabOngoing.addEventListener('click', () => setFilter('ongoing'));
}

/* ==========================================================================
   10. Estimate Form Submission & Toast
   ========================================================================== */
function initEstimateForm() {
    const form = document.getElementById('estimateForm');
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('fullName').value.trim();
        const service = document.getElementById('projectType').value;

        if (toast && toastMsg) {
            toastMsg.textContent = `Thank you, ${name || 'Sir/Ma\'am'}! Your request for "${service}" has been logged. Our engineering desk will contact you within 24 hours.`;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 6000);
        }

        form.reset();
    });
}

/* ==========================================================================
   11. Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileNavDrawer');

    if (!menuBtn || !drawer) return;

    menuBtn.addEventListener('click', () => {
        drawer.classList.toggle('open');
    });
}

/* ==========================================================================
   12. Interactive Card 3D Tilt Effect
   ========================================================================== */
function initCardTilt() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    // Only apply on non-touch desktop screens
    if (window.matchMedia('(hover: hover)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}
