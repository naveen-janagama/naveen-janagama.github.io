
// Loading Screen
window.addEventListener('load', () => {
   setTimeout(() => {
      document.getElementById('loadingScreen').classList.add('hidden');
   }, 1000);
});

// Handle browser back button / swipe back
window.addEventListener('popstate', (event) => {
   const activeSection = document.querySelector('.content-section.active');
   if (activeSection) {
      backToMenu();
   }
});

// Menu Item Click Handler
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
const menuGrid = document.getElementById('menuGrid');
const mainHeader = document.getElementById('mainHeader');
const mainAbout = document.getElementById('mainAbout');
const mainSocial = document.getElementById('mainSocial');
const mainFooter = document.getElementById('mainFooter');
let isTransitioning = false;

menuItems.forEach(item => {
   item.addEventListener('click', () => {
      if (isTransitioning) return;

      const sectionId = item.dataset.section;
      const url = item.dataset.url;
      const openInNewTab = item.dataset.newtab === 'true';

      if (sectionId) {
         showSection(sectionId);
         return;
      }

      if (url) {
         if (openInNewTab) {
            window.open(url, '_blank', 'noopener');
         } else {
            window.location.href = url;
         }
      }
   });
});

function showSection(sectionId) {
   isTransitioning = true;

   // First, ensure all menu items are in visible state before transitioning
   menuItems.forEach((item) => {
      // Remove initial-load class
      item.classList.remove('initial-load');

      // Set to visible state explicitly
      item.style.opacity = '1';
      item.style.transform = 'translateY(0) scale(1)';
      item.style.animation = 'none';
   });

   // Force reflow to apply the visible state
   void menuGrid.offsetWidth;

   // Now apply staggered fade out transition
   menuItems.forEach((item, index) => {
      setTimeout(() => {
         item.style.transition = 'all 0.4s ease-out';
         item.style.opacity = '0';
         item.style.transform = 'translateY(40px) scale(0.9)';
      }, index * 50);
   });

   // Hide header, about teaser, social strip, and footer
   mainHeader.style.animation = 'none';
   mainHeader.style.opacity = '1';
   mainAbout.style.animation = 'none';
   mainAbout.style.opacity = '1';
   mainSocial.style.animation = 'none';
   mainSocial.style.opacity = '1';
   mainFooter.style.animation = 'none';
   mainFooter.style.opacity = '1';

   void mainHeader.offsetWidth;

   mainHeader.style.transition = 'opacity 0.4s ease';
   mainHeader.style.opacity = '0';
   mainAbout.style.transition = 'opacity 0.4s ease';
   mainAbout.style.opacity = '0';
   mainSocial.style.transition = 'opacity 0.4s ease';
   mainSocial.style.opacity = '0';
   mainFooter.style.transition = 'opacity 0.4s ease';
   mainFooter.style.opacity = '0';

   // Show content section after menu animation
   setTimeout(() => {
      menuGrid.style.display = 'none';
      mainHeader.style.display = 'none';
      mainAbout.style.display = 'none';
      mainSocial.style.display = 'none';
      mainFooter.style.display = 'none';

      // Reset menu item styles for next time
      menuItems.forEach(item => {
         item.style.transition = '';
         item.style.opacity = '';
         item.style.transform = '';
         item.classList.remove('exit-up', 'visible');
      });

      const section = document.getElementById(sectionId);
      section.classList.add('active');

      // Push a history state so back button/swipe can return to menu
      history.pushState({ section: sectionId }, '', '#' + sectionId);

      // Animate stats if introduction section
      if (sectionId === 'introduction') {
         setTimeout(animateStats, 500);
      }

      isTransitioning = false;
   }, 550);
}

function backToMenu() {
   if (isTransitioning) return;
   isTransitioning = true;

   // Clean up URL hash without triggering another popstate
   if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
   }

   const activeSection = document.querySelector('.content-section.active');
   if (activeSection) {
      // Get fixed elements that need to fade out
      const sectionHeaderSmall = activeSection.querySelector('.section-header-small');
      const backBtn = activeSection.querySelector('.back-btn');

      // Step 1: Cancel the forwards animation so we can control opacity
      activeSection.style.animation = 'none';
      activeSection.style.opacity = '1'; // Reset to visible state first

      // Force reflow to apply the animation cancel
      void activeSection.offsetWidth;

      // Step 2: Now apply fade out transition to ALL elements
      activeSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      activeSection.style.opacity = '0';
      activeSection.style.transform = 'translateY(-20px)';

      if (sectionHeaderSmall) {
         sectionHeaderSmall.style.transition = 'opacity 0.5s ease';
         sectionHeaderSmall.style.opacity = '0';
      }
      if (backBtn) {
         backBtn.style.transition = 'opacity 0.5s ease';
         backBtn.style.opacity = '0';
      }

      // Step 3: Wait for complete fade out
      setTimeout(() => {
         // Hide section completely
         activeSection.classList.remove('active');
         activeSection.style.animation = '';
         activeSection.style.opacity = '';
         activeSection.style.transform = '';
         activeSection.style.transition = '';

         if (sectionHeaderSmall) {
            sectionHeaderSmall.style.opacity = '';
            sectionHeaderSmall.style.transition = '';
         }
         if (backBtn) {
            backBtn.style.opacity = '';
            backBtn.style.transition = '';
         }

         // Step 4: Prepare menu elements (hidden initially)
         menuGrid.style.display = 'grid';
         mainHeader.style.display = 'block';
         mainAbout.style.display = 'block';
         mainSocial.style.display = 'flex';
         mainFooter.style.display = 'block';

         // Cancel CSS animations to prevent re-triggering
         mainHeader.style.animation = 'none';
         mainAbout.style.animation = 'none';
         mainSocial.style.animation = 'none';
         mainFooter.style.animation = 'none';

         mainHeader.style.opacity = '0';
         mainHeader.style.transform = 'translateY(20px)';
         mainAbout.style.opacity = '0';
         mainSocial.style.opacity = '0';
         mainFooter.style.opacity = '0';

         menuItems.forEach(item => {
            item.classList.remove('exit-up', 'initial-load', 'return', 'visible');
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px) scale(0.9)';
         });

         // Step 5: Brief pause then fade in menu
         setTimeout(() => {
            // Fade in header
            mainHeader.style.transition = 'all 0.5s ease';
            mainHeader.style.opacity = '1';
            mainHeader.style.transform = 'translateY(0)';

            // Fade in footer
            mainAbout.style.transition = 'all 0.5s ease';
            mainAbout.style.opacity = '1';
            mainSocial.style.transition = 'all 0.5s ease';
            mainSocial.style.opacity = '1';
            mainFooter.style.transition = 'all 0.5s ease';
            mainFooter.style.opacity = '1';

            // Staggered fade in for menu items
            menuItems.forEach((item, index) => {
               setTimeout(() => {
                  item.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                  item.style.opacity = '1';
                  item.style.transform = 'translateY(0) scale(1)';
               }, index * 80);
            });

            // Step 6: Clean up after all animations complete
            setTimeout(() => {
               mainHeader.style.transition = '';
               mainHeader.style.transform = '';
               mainAbout.style.transition = '';
               mainSocial.style.transition = '';
               mainFooter.style.transition = '';

               menuItems.forEach(item => {
                  item.style.transition = '';
                  item.style.opacity = '';
                  item.style.transform = '';
                  item.classList.add('visible');
               });

               isTransitioning = false;
            }, 600);
         }, 150);
      }, 550);
   }
}

// Animate Stats
function animateStats() {
   const metricValues = document.querySelectorAll('.metric-value[data-target]');
   metricValues.forEach((el, index) => {
      setTimeout(() => {
         const target = parseInt(el.dataset.target);
         let current = 0;
         const increment = target / 40;
         const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
               current = target;
               clearInterval(timer);
            }
            el.textContent = Math.floor(current);
         }, 30);
      }, index * 200);
   });
}

// Tab Switching
function switchTab(btn, tabId) {
   document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
   btn.classList.add('active');

   document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
   document.getElementById(tabId).classList.add('active');
}

// Gallery Filter
function filterGallery(category, btn) {
   document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
   btn.classList.add('active');

   const items = document.querySelectorAll('.gallery-item');
   items.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
         item.style.display = 'block';
         item.style.animation = 'tabFade 0.4s ease-out';
      } else {
         item.style.display = 'none';
      }
   });
}

// Contact Form Handler
function handleContactSubmit(event) {
   event.preventDefault();
   const form = event.target;
   const submitBtn = form.querySelector('.submit-btn');
   const originalText = submitBtn.innerHTML;
   
   // Get form data
   const formData = new FormData(form);
   const message = {
      name: formData.get('name') || form.querySelector('input[type="text"]').value,
      email: formData.get('email') || form.querySelector('input[type="email"]').value,
      subject: form.querySelector('input[placeholder*="Subject"]').value,
      message: form.querySelector('textarea').value
   };
   
   // Show success message
   submitBtn.innerHTML = '<span>✓ Message Sent!</span>';
   submitBtn.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(100, 200, 100, 0.2))';
   submitBtn.style.borderColor = '#4CAF50';
   submitBtn.style.color = '#4CAF50';
   
   // Log the message (in production, send to backend)
   console.log('Contact Form Submitted:', message);
   
   // Reset form
   form.reset();
   
   // Restore button after 3 seconds
   setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.style.borderColor = '';
      submitBtn.style.color = '';
   }, 3000);
}