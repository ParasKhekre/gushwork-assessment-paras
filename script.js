document.addEventListener("DOMContentLoaded", () => {
  // Implementing Sticky Navigation

  const header = document.getElementById("mainHeader");
  const productSection = document.querySelector(".product-detail-section");

  const obs = new IntersectionObserver(
    function (entries) {
      const ent = entries[0];
      if (ent.isIntersecting === false) document.body.classList.add("sticky");
      else document.body.classList.remove("sticky");
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-80px",
    },
  );
  obs.observe(productSection);

  // Implementing Image Carousel
  const mainProductImage = document.querySelector(".main-product-image");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  let currentIndex = 0;

  if (mainProductImage && thumbnails.length > 0) {
    function updateImage(index) {
      thumbnails.forEach((t) => t.classList.remove("active"));

      thumbnails[index].classList.add("active");

      mainProductImage.src = thumbnails[index].src;

      currentIndex = index;
    }

    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        updateImage(index);
      });
    });

    if (rightArrow) {
      rightArrow.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % thumbnails.length;

        updateImage(currentIndex);
      });
    }

    if (leftArrow) {
      leftArrow.addEventListener("click", () => {
        currentIndex =
          (currentIndex - 1 + thumbnails.length) % thumbnails.length;

        updateImage(currentIndex);
      });
    }
  }

  // Implementing Image Zooming on mouse hover
  const mainImageContainer = document.querySelector(".main-image-container");
  const lens = document.querySelector(".lens");
  const zoomPreview = document.querySelector(".thumbnail-zoom-preview");

  const lensRect = lens.getBoundingClientRect();
  const mainProductImageRect = mainProductImage.getBoundingClientRect();
  const zoomPreviewRect = zoomPreview.getBoundingClientRect();

  if (mainImageContainer && zoomPreview && mainProductImage) {
    mainImageContainer.addEventListener("mousemove", (e) => {
      zoomImage(e);
    });

    lens.addEventListener("mousemove", (e) => {
      zoomImage(e);
    });

    mainImageContainer.addEventListener("mouseout", () => {
      lens.classList.remove("active");
      zoomPreview.classList.remove("active");
    });

    lens.addEventListener("mouseout", () => {
      lens.classList.remove("active");
      zoomPreview.classList.remove("active");
    });

    function zoomImage(e) {
      let { x, y } = getMousePosition(e);

      lens.style.left = x + "px";
      lens.style.top = y + "px";

      let fx = mainProductImageRect.width / lensRect.width;
      let fy = mainProductImageRect.height / lensRect.height;

      zoomPreview.style.backgroundSize = `${mainProductImageRect.width * fx}px ${mainProductImageRect.height * fy}px`;
      zoomPreview.style.backgroundPosition = `-${x * fx + 200}px -${y * fy}px`;
      zoomPreview.style.backgroundImage = `url(${mainProductImage.src})`;

      lens.classList.add("active");
      zoomPreview.classList.add("active");
    }

    function getMousePosition(e) {
      const containerRect = mainImageContainer.getBoundingClientRect();
      const lensRect = lens.getBoundingClientRect();

      let x = e.clientX - containerRect.left - lensRect.width / 2;
      let y = e.clientY - containerRect.top - lensRect.height / 2;

      let minX = 0;
      let minY = 0;
      let maxX = containerRect.width - lensRect.width;
      let maxY = containerRect.height - lensRect.height;

      if (x <= minX) x = minX;
      if (x >= maxX) x = maxX;

      if (y <= minY) y = minY;
      if (y >= maxY) y = maxY;

      return { x, y };
    }
  }
});

function handleCompanyLogos() {
  const companyLogos = document.querySelector(".company-logos");
  const logoImages = companyLogos ? companyLogos.querySelectorAll("img") : [];

  if (logoImages.length === 0) return;

  const screenWidth = window.innerWidth;

  // Hide all logos first
  logoImages.forEach((img) => {
    img.style.display = "none";
  });

  // Show appropriate number of logos based on screen width
  if (screenWidth >= 1240) {
    // Desktop: Show all 6 icons
    logoImages.forEach((img) => {
      img.style.display = "block";
    });
  } else if (screenWidth >= 1000) {
    // Tablet: Show 4-5 icons
    logoImages.forEach((img, index) => {
      img.style.display = index < 5 ? "block" : "none";
    });
  } else if (screenWidth >= 550) {
    // Mobile: Show 3 icons
    logoImages.forEach((img, index) => {
      img.style.display = index < 4 ? "block" : "none";
    });
  } else {
    // Mobile: Show 3 icons
    logoImages.forEach((img, index) => {
      img.style.display = index < 3 ? "block" : "none";
    });
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  handleCompanyLogos();
});

// Handle resize events
window.addEventListener("resize", () => {
  handleCompanyLogos();
});

// function addLogoTransitions() {
//   const logoImages = document.querySelectorAll('.company-logos img');
//   logoImages.forEach(img => {
//     img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
//   });
// }

// // Call this after DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//   addLogoTransitions();
// });

//   faq section js

document.addEventListener("DOMContentLoaded", () => {
  // --- FAQ Functionality ---
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all FAQ items
      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
        faqItem
          .querySelector(".faq-question")
          .setAttribute("aria-expanded", "false");
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  // --- Email Catalogue Functionality ---
  const emailInput = document.querySelector(".email-input");
  const sendButton = document.querySelector(".send-catalogue-btn");

  if (sendButton && emailInput) {
    sendButton.addEventListener("click", () => {
      const email = emailInput.value.trim();

      if (!email) {
        alert("Please enter your email address");
        emailInput.focus();
        return;
      }

      if (!isValidEmail(email)) {
        alert("Please enter a valid email address");
        emailInput.focus();
        return;
      }

      // Simulate sending catalogue
      const originalText = sendButton.textContent;
      sendButton.textContent = "SENDING...";
      sendButton.disabled = true;

      setTimeout(() => {
        sendButton.textContent = "SENT ✓";
        setTimeout(() => {
          sendButton.textContent = originalText;
          sendButton.disabled = false;
          emailInput.value = "";
          alert("Catalogue sent successfully! Check your email.");
        }, 2000);
      }, 1500);
    });

    // Handle Enter key in email input
    emailInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendButton.click();
      }
    });
  }

  // --- Applications Carousel Functionality ---
  const carouselTrack = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const cards = document.querySelectorAll(".application-card");

  if (carouselTrack && cards.length > 0) {
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 12; // Card width + gap
    const visibleCards = Math.floor(
      carouselTrack.parentElement.offsetWidth / cardWidth,
    );
    const maxIndex = Math.max(0, cards.length - visibleCards);

    function updateCarousel() {
      const translateX = -currentIndex * cardWidth;
      carouselTrack.style.transform = `translateX(${translateX}px)`;

      // Update button states
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
        }
      });
    }

    // Initialize carousel
    updateCarousel();

    // Handle window resize
    window.addEventListener("resize", () => {
      const newVisibleCards = Math.floor(
        carouselTrack.parentElement.offsetWidth / cardWidth,
      );
      const newMaxIndex = Math.max(0, cards.length - newVisibleCards);

      if (currentIndex > newMaxIndex) {
        currentIndex = newMaxIndex;
      }
      updateCarousel();
    });
  }

  // --- Manufacturing Process Tabs ---
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      button.classList.add("active");
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  // --- Touch Scrolling for Mobile Carousel ---
  let isDown = false;
  let startX;
  let scrollLeft;

  if (carouselTrack) {
    carouselTrack.addEventListener("mousedown", (e) => {
      isDown = true;
      carouselTrack.style.cursor = "grabbing";
      startX = e.pageX - carouselTrack.offsetLeft;
      scrollLeft = carouselTrack.scrollLeft;
    });

    carouselTrack.addEventListener("mouseleave", () => {
      isDown = false;
      carouselTrack.style.cursor = "grab";
    });

    carouselTrack.addEventListener("mouseup", () => {
      isDown = false;
      carouselTrack.style.cursor = "grab";
    });

    carouselTrack.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carouselTrack.offsetLeft;
      const walk = (x - startX) * 2;
      carouselTrack.scrollLeft = scrollLeft - walk;
    });
  }

  // --- Smooth Scroll Animation for Tab Content ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const contentObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe tab contents for animation
  tabContents.forEach((content) => {
    content.style.opacity = "0";
    content.style.transform = "translateY(20px)";
    content.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    contentObserver.observe(content);
  });

  // --- Utility Functions ---
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});

// part 3 starts here

document.addEventListener("DOMContentLoaded", () => {
  // --- Testimonials Carousel Functionality ---
  const testimonialsCarousel = document.querySelector(".testimonials-carousel");
  const carouselTrack = testimonialsCarousel
    ? testimonialsCarousel.querySelector(".carousel-track")
    : null;
  const testimonialCards = testimonialsCarousel
    ? testimonialsCarousel.querySelectorAll(".testimonial-card")
    : [];

  if (carouselTrack && testimonialCards.length > 0) {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse events for desktop drag
    carouselTrack.addEventListener("mousedown", (e) => {
      isDown = true;
      carouselTrack.classList.add("active-drag");
      startX = e.pageX - carouselTrack.offsetLeft;
      scrollLeft = carouselTrack.scrollLeft;
    });

    carouselTrack.addEventListener("mouseleave", () => {
      isDown = false;
      carouselTrack.classList.remove("active-drag");
    });

    carouselTrack.addEventListener("mouseup", () => {
      isDown = false;
      carouselTrack.classList.remove("active-drag");
    });

    carouselTrack.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carouselTrack.offsetLeft;
      const walk = (x - startX) * 1.5; // Adjust scroll speed
      carouselTrack.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile swipe
    carouselTrack.addEventListener("touchstart", (e) => {
      isDown = true;
      startX = e.touches[0].pageX - carouselTrack.offsetLeft;
      scrollLeft = carouselTrack.scrollLeft;
    });

    carouselTrack.addEventListener("touchend", () => {
      isDown = false;
    });

    carouselTrack.addEventListener("touchmove", (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - carouselTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      carouselTrack.scrollLeft = scrollLeft - walk;
    });
  }

  // --- Learn More Button Functionality (Portfolio Cards) ---
  const learnMoreButtons = document.querySelectorAll(".learn-more-btn");

  learnMoreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // In a real application, this would navigate to a product detail page
      // or open a modal with more information.
      const cardTitle = button
        .closest(".portfolio-card")
        .querySelector("h3").textContent;
      alert(`You clicked "Learn More" for: ${cardTitle}`);
      console.log(`Learn More clicked for: ${cardTitle}`);
    });
  });

  // --- Talk to an Expert Button Functionality (CTA Section) ---
  const talkToExpertBtn = document.querySelector(".talk-to-expert-btn");

  if (talkToExpertBtn) {
    talkToExpertBtn.addEventListener("click", () => {
      // In a real application, this would open a contact form modal,
      // redirect to a contact page, or initiate a chat.
      alert("Connecting you with an expert! Please wait...");
      console.log("Talk to an Expert button clicked.");
    });
  }

  // --- Intersection Observer for Section Animations ---
  const sectionsToAnimate = document.querySelectorAll(
    ".testimonials-section .section-title, .testimonials-section .section-subtitle, .testimonial-card, " +
      ".portfolio-section .section-title, .portfolio-section .section-subtitle, .portfolio-card, " +
      ".cta-section .cta-box",
  );

  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: "0px 0px -50px 0px", // Adjust when element enters viewport
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up"); // Add a class for animation
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);
});

class ManufacturingCarousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 8;
    this.isAnimating = false;

    this.slides = [
      { title: "Raw Material", step: 1 },
      { title: "Extrusion", step: 2 },
      { title: "Cooling", step: 3 },
      { title: "Sizing", step: 4 },
      { title: "Quality Control", step: 5 },
      { title: "Marking", step: 6 },
      { title: "Cutting", step: 7 },
      { title: "Packaging", step: 8 },
    ];

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUI();
    this.setupSwipeGestures();
    this.setupKeyboardNavigation();
  }

  bindEvents() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    prevBtn.addEventListener("click", () => this.previousSlide());
    nextBtn.addEventListener("click", () => this.nextSlide());
  }

  setupSwipeGestures() {
    const container = document.querySelector(".carousel-content");
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    container.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
      },
      { passive: true },
    );

    container.addEventListener(
      "touchend",
      (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();

        this.handleSwipe(startX, startY, endX, endY, endTime - startTime);
      },
      { passive: true },
    );
  }

  handleSwipe(startX, startY, endX, endY, duration) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;

    // Only handle horizontal swipes that are fast enough
    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > minSwipeDistance &&
      duration < maxSwipeTime
    ) {
      if (deltaX > 0) {
        this.previousSlide();
      } else {
        this.nextSlide();
      }
    }
  }

  setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.previousSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.nextSlide();
      }
    });
  }

  nextSlide() {
    if (this.isAnimating || this.currentSlide >= this.totalSlides - 1) return;

    this.goToSlide(this.currentSlide + 1, "next");
  }

  previousSlide() {
    if (this.isAnimating || this.currentSlide <= 0) return;

    this.goToSlide(this.currentSlide - 1, "prev");
  }

  goToSlide(index, direction = "next") {
    if (
      this.isAnimating ||
      index === this.currentSlide ||
      index < 0 ||
      index >= this.totalSlides
    )
      return;

    this.isAnimating = true;
    this.animateSlide(this.currentSlide, index, direction);
    this.currentSlide = index;
    this.updateUI();

    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false;
    }, 400);
  }

  animateSlide(fromIndex, toIndex, direction) {
    const slides = document.querySelectorAll(".slide");
    const currentSlide = slides[fromIndex];
    const nextSlide = slides[toIndex];

    // Prepare next slide
    nextSlide.style.transform =
      direction === "next" ? "translateX(100%)" : "translateX(-100%)";
    nextSlide.style.opacity = "0";
    nextSlide.style.position = "absolute";
    nextSlide.style.top = "0";
    nextSlide.style.left = "0";
    nextSlide.style.width = "100%";

    // Force reflow
    nextSlide.offsetHeight;

    // Start animation
    requestAnimationFrame(() => {
      // Animate current slide out
      currentSlide.style.transform =
        direction === "next" ? "translateX(-100%)" : "translateX(100%)";
      currentSlide.style.opacity = "0";

      // Animate next slide in
      nextSlide.style.transform = "translateX(0)";
      nextSlide.style.opacity = "1";

      // Clean up after animation
      setTimeout(() => {
        // Reset all slides
        slides.forEach((slide, index) => {
          slide.classList.remove("active");
          if (index === toIndex) {
            slide.classList.add("active");
            slide.style.position = "relative";
            slide.style.transform = "";
            slide.style.opacity = "";
            slide.classList.add("fade-in");

            // Remove fade-in class after animation
            setTimeout(() => {
              slide.classList.remove("fade-in");
            }, 400);
          } else {
            slide.style.position = "absolute";
            slide.style.transform = "translateX(100%)";
            slide.style.opacity = "0";
          }
        });
      }, 400);
    });
  }

  updateUI() {
    // Update step badge
    const stepBadge = document.getElementById("stepBadge");
    const currentSlideData = this.slides[this.currentSlide];
    stepBadge.textContent = `Step ${currentSlideData.step}/8: ${currentSlideData.title}`;

    // Update navigation buttons
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    prevBtn.disabled = this.currentSlide === 0;
    nextBtn.disabled = this.currentSlide === this.totalSlides - 1;

    // Add visual feedback for disabled state
    if (prevBtn.disabled) {
      prevBtn.style.opacity = "0.5";
    } else {
      prevBtn.style.opacity = "1";
    }

    if (nextBtn.disabled) {
      nextBtn.style.opacity = "0.5";
    } else {
      nextBtn.style.opacity = "1";
    }
  }

  // Public method to go to specific slide (for external control)
  goToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= this.totalSlides) {
      const direction = stepNumber > this.currentSlide + 1 ? "next" : "prev";
      this.goToSlide(stepNumber - 1, direction);
    }
  }

  // Get current step info
  getCurrentStep() {
    return {
      step: this.currentSlide + 1,
      title: this.slides[this.currentSlide].title,
      total: this.totalSlides,
    };
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.manufacturingCarousel = new ManufacturingCarousel();
});

// Handle page visibility change to pause animations
document.addEventListener("visibilitychange", () => {
  if (document.hidden && window.manufacturingCarousel) {
    window.manufacturingCarousel.isAnimating = false;
  }
});

// Prevent context menu on long press (mobile)
document.addEventListener("contextmenu", (e) => {
  if (e.target.closest(".carousel-card")) {
    e.preventDefault();
  }
});

// Modal Functionality
document.addEventListener("DOMContentLoaded", () => {
  function setupModal(options) {
    const modal = document.getElementById(options.modalId);
    const openButtons = document.querySelectorAll(options.openSelector);
    const closeButton = modal?.querySelector(".modal-close");
    const overlay = modal?.querySelector(".modal-overlay");
    const form = options.formId
      ? document.getElementById(options.formId)
      : null;
    const emailInput = form
      ? form.querySelector(`#${options.emailInputId}`)
      : null;
    const submitButton = form ? form.querySelector(".modal-button") : null;

    function updateSubmitState() {
      if (submitButton && options.disableSubmitIfEmpty && emailInput) {
        submitButton.disabled = !emailInput.value.trim();
      }
    }

    function openModal() {
      modal?.classList.add("active");
      document.body.style.overflow = "hidden";
      form?.reset();
      if (options.disableSubmitIfEmpty) updateSubmitState();
      if (emailInput) emailInput.focus();
    }

    function closeModal() {
      modal?.classList.remove("active");
      document.body.style.overflow = "auto";
      form?.reset();
      if (options.disableSubmitIfEmpty) updateSubmitState();
    }

    openButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    });

    if (emailInput && options.disableSubmitIfEmpty) {
      emailInput.addEventListener("input", updateSubmitState);
    }

    if (closeButton) {
      closeButton.addEventListener("click", closeModal);
    }

    if (overlay) {
      overlay.addEventListener("click", closeModal);
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const values = Array.from(form.elements)
          .filter((el) => el.tagName === "INPUT")
          .reduce((acc, input) => {
            acc[input.id] = input.value;
            return acc;
          }, {});
        console.log(`${options.modalId} submitted:`, values);
        closeModal();
      });
    }
  }

  setupModal({
    modalId: "downloadModal",
    openSelector: ".download-button",
    formId: "downloadForm",
    emailInputId: "emailInput",
    disableSubmitIfEmpty: true,
  });

  setupModal({
    modalId: "quoteModal",
    openSelector: ".quote-button",
    formId: "quoteForm",
    disableSubmitIfEmpty: false,
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.active").forEach((activeModal) => {
        activeModal.classList.remove("active");
      });
      document.body.style.overflow = "auto";
    }
  });
});
