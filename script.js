/* Core site interactions for Gushwork Assignment */

const resizeHandlers = [];

const registerResizeHandler = (handler) => {
  if (typeof handler === "function") {
    resizeHandlers.push(handler);
  }
};

window.addEventListener("resize", () => {
  resizeHandlers.forEach((handler) => handler());
});

const initPage = () => {
  initStickyHeader();
  initProductCarousel();
  initImageZoom();
  initCompanyLogos();
  initFAQAccordion();
  initEmailCatalogue();
  initApplicationsCarousel();
  initManufacturingTabs();
  initTabContentAnimations();
  initTestimonialsCarousel();
  initLearnMoreButtons();
  initTalkToExpertButton();
  initSectionObservers();
  initModalSystem();

  window.manufacturingCarousel = new ManufacturingCarousel();
};

document.addEventListener("DOMContentLoaded", initPage);

/* Sticky header toggles when the product section leaves viewport. */
const initStickyHeader = () => {
  const productSection = document.querySelector(".product-detail-section");
  if (!productSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      document.body.classList.toggle("sticky", entry.isIntersecting === false);
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-80px",
    },
  );

  observer.observe(productSection);
};

/* Product image carousel with thumbnail navigation. */
const initProductCarousel = () => {
  const mainProductImage = document.querySelector(".main-product-image");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  if (!mainProductImage || thumbnails.length === 0) return;

  let currentIndex = 0;

  const updateImage = (index) => {
    thumbnails.forEach((thumbnail) => thumbnail.classList.remove("active"));
    const selectedThumbnail = thumbnails[index];
    selectedThumbnail.classList.add("active");
    mainProductImage.src = selectedThumbnail.src;
    currentIndex = index;
  };

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => updateImage(index));
  });

  rightArrow?.addEventListener("click", () => {
    updateImage((currentIndex + 1) % thumbnails.length);
  });

  leftArrow?.addEventListener("click", () => {
    updateImage((currentIndex - 1 + thumbnails.length) % thumbnails.length);
  });
};

/* Hover zoom preview for the main product image. */
const initImageZoom = () => {
  const mainImageContainer = document.querySelector(".main-image-container");
  const lens = document.querySelector(".lens");
  const zoomPreview = document.querySelector(".thumbnail-zoom-preview");
  const mainProductImage = document.querySelector(".main-product-image");

  if (!mainImageContainer || !lens || !zoomPreview || !mainProductImage) return;

  const setActiveState = (isActive) => {
    lens.classList.toggle("active", isActive);
    zoomPreview.classList.toggle("active", isActive);
  };

  const getBoundedCoordinates = (x, y, maxX, maxY) => ({
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  });

  const getMousePosition = (event) => {
    const containerRect = mainImageContainer.getBoundingClientRect();
    const lensRect = lens.getBoundingClientRect();
    const x = event.clientX - containerRect.left - lensRect.width / 2;
    const y = event.clientY - containerRect.top - lensRect.height / 2;
    const maxX = containerRect.width - lensRect.width;
    const maxY = containerRect.height - lensRect.height;

    return getBoundedCoordinates(x, y, maxX, maxY);
  };

  const updateZoom = (event) => {
    const { x, y } = getMousePosition(event);
    const lensRect = lens.getBoundingClientRect();
    const imageRect = mainProductImage.getBoundingClientRect();
    const scaleX = imageRect.width / lensRect.width;
    const scaleY = imageRect.height / lensRect.height;

    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;
    zoomPreview.style.backgroundImage = `url(${mainProductImage.src})`;
    zoomPreview.style.backgroundSize = `${imageRect.width * scaleX}px ${imageRect.height * scaleY}px`;
    zoomPreview.style.backgroundPosition = `-${x * scaleX + 200}px -${y * scaleY}px`;

    setActiveState(true);
  };

  const hideZoom = () => setActiveState(false);

  [mainImageContainer, lens].forEach((element) => {
    element.addEventListener("mousemove", updateZoom);
    element.addEventListener("mouseout", hideZoom);
  });
};

/* Responsive company logo visibility based on viewport width. */
const initCompanyLogos = () => {
  handleCompanyLogos();
  registerResizeHandler(handleCompanyLogos);
};

const handleCompanyLogos = () => {
  const companyLogos = document.querySelector(".company-logos");
  const logoImages = companyLogos ? companyLogos.querySelectorAll("img") : [];
  if (logoImages.length === 0) return;

  const screenWidth = window.innerWidth;

  logoImages.forEach((img) => {
    img.style.display = "none";
  });

  if (screenWidth >= 1240) {
    logoImages.forEach((img) => {
      img.style.display = "block";
    });
  } else if (screenWidth >= 1000) {
    logoImages.forEach((img, index) => {
      img.style.display = index < 5 ? "block" : "none";
    });
  } else if (screenWidth >= 550) {
    logoImages.forEach((img, index) => {
      img.style.display = index < 4 ? "block" : "none";
    });
  } else {
    logoImages.forEach((img, index) => {
      img.style.display = index < 3 ? "block" : "none";
    });
  }
};

/* FAQ accordion behavior with accessible aria-expanded toggling. */
const initFAQAccordion = () => {
  const faqItems = document.querySelectorAll(".faq-item");
  if (faqItems.length === 0) return;

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
        faqItem.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      });

      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
};

/* Email catalogue form handling with basic validation and button feedback. */
const initEmailCatalogue = () => {
  const emailInput = document.querySelector(".email-input");
  const sendButton = document.querySelector(".send-catalogue-btn");
  if (!emailInput || !sendButton) return;

  const isValidEmailAddress = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendCatalogue = () => {
    const email = emailInput.value.trim();

    if (!email) {
      alert("Please enter your email address");
      emailInput.focus();
      return;
    }

    if (!isValidEmailAddress(email)) {
      alert("Please enter a valid email address");
      emailInput.focus();
      return;
    }

    const originalText = sendButton.textContent.trim();
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
  };

  sendButton.addEventListener("click", sendCatalogue);
  emailInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendCatalogue();
    }
  });
};

/* Horizontal applications carousel with responsive resize handling. */
const initApplicationsCarousel = () => {
  const carouselTrack = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const cards = document.querySelectorAll(".application-card");

  if (!carouselTrack || cards.length === 0) return;

  let currentIndex = 0;
  const cardGap = 12;
  const trackParent = carouselTrack.parentElement;
  if (!trackParent) return;

  const cardWidth = () => cards[0].offsetWidth + cardGap;
  const visibleCards = () => Math.max(1, Math.floor(trackParent.offsetWidth / cardWidth()));
  const maxIndex = () => Math.max(0, cards.length - visibleCards());

  const updateCarousel = () => {
    const translateX = -currentIndex * cardWidth();
    carouselTrack.style.transform = `translateX(${translateX}px)`;
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex();
  };

  const goToIndex = (index) => {
    currentIndex = Math.min(maxIndex(), Math.max(0, index));
    updateCarousel();
  };

  prevBtn?.addEventListener("click", () => goToIndex(currentIndex - 1));
  nextBtn?.addEventListener("click", () => goToIndex(currentIndex + 1));

  const handleResize = () => {
    if (currentIndex > maxIndex()) {
      currentIndex = maxIndex();
    }
    updateCarousel();
  };

  registerResizeHandler(handleResize);
  updateCarousel();
};

/* Manufacturing process tab interactions. */
const initManufacturingTabs = () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  if (tabButtons.length === 0 || tabContents.length === 0) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");
      if (!targetTab) return;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(targetTab)?.classList.add("active");
    });
  });
};

/* Animate tab content as it scrolls into view. */
const initTabContentAnimations = () => {
  const tabContents = document.querySelectorAll(".tab-content");
  if (tabContents.length === 0) return;

  const contentObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          contentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  tabContents.forEach((content) => {
    content.style.opacity = "0";
    content.style.transform = "translateY(20px)";
    content.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    contentObserver.observe(content);
  });
};

/* Optional testimonials carousel drag/swipe behavior. */
const initTestimonialsCarousel = () => {
  const testimonialsCarousel = document.querySelector(".testimonials-carousel");
  const carouselTrack = testimonialsCarousel?.querySelector(".carousel-track");
  if (!carouselTrack) return;

  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  const startDrag = (clientX) => {
    isDragging = true;
    carouselTrack.classList.add("active-drag");
    startX = clientX - carouselTrack.offsetLeft;
    scrollLeft = carouselTrack.scrollLeft;
  };

  const endDrag = () => {
    isDragging = false;
    carouselTrack.classList.remove("active-drag");
  };

  const drag = (clientX) => {
    if (!isDragging) return;
    const x = clientX - carouselTrack.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselTrack.scrollLeft = scrollLeft - walk;
  };

  carouselTrack.addEventListener("mousedown", (event) => startDrag(event.pageX));
  carouselTrack.addEventListener("mouseleave", endDrag);
  carouselTrack.addEventListener("mouseup", endDrag);
  carouselTrack.addEventListener("mousemove", (event) => drag(event.pageX));
  carouselTrack.addEventListener("touchstart", (event) => startDrag(event.touches[0].pageX), { passive: true });
  carouselTrack.addEventListener("touchend", endDrag);
  carouselTrack.addEventListener("touchmove", (event) => drag(event.touches[0].pageX), { passive: true });
};

/* Placeholder action buttons for interactive cards. */
const initLearnMoreButtons = () => {
  const learnMoreButtons = document.querySelectorAll(".learn-more-btn");
  if (learnMoreButtons.length === 0) return;

  learnMoreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const cardTitle = button.closest(".portfolio-card")?.querySelector("h3")?.textContent;
      alert(`You clicked "Learn More" for: ${cardTitle ?? "this item"}`);
      console.log(`Learn More clicked for: ${cardTitle ?? "unknown item"}`);
    });
  });
};

/* CTA button behavior with a placeholder interaction. */
const initTalkToExpertButton = () => {
  const talkToExpertBtn = document.querySelector(".talk-to-expert-btn");
  if (!talkToExpertBtn) return;

  talkToExpertBtn.addEventListener("click", () => {
    alert("Connecting you with an expert! Please wait...");
    console.log("Talk to an Expert button clicked.");
  });
};

/* Animate section elements when they enter the viewport. */
const initSectionObservers = () => {
  const sectionsToAnimate = document.querySelectorAll(
    ".testimonials-section .section-title, .testimonials-section .section-subtitle, .testimonial-card, " +
      ".portfolio-section .section-title, .portfolio-section .section-subtitle, .portfolio-card, " +
      ".cta-section .cta-box",
  );

  if (sectionsToAnimate.length === 0) return;

  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  sectionsToAnimate.forEach((element) => sectionObserver.observe(element));
};

/* Reusable modal setup for different trigger buttons and forms. */
const initModalSystem = () => {
  const setupModal = (options) => {
    const modal = document.getElementById(options.modalId);
    const openButtons = document.querySelectorAll(options.openSelector);
    const closeButton = modal?.querySelector(".modal-close");
    const overlay = modal?.querySelector(".modal-overlay");
    const form = options.formId ? document.getElementById(options.formId) : null;
    const emailInput = form ? form.querySelector(`#${options.emailInputId}`) : null;
    const submitButton = form ? form.querySelector(".modal-button") : null;

    const updateSubmitState = () => {
      if (submitButton && options.disableSubmitIfEmpty && emailInput) {
        submitButton.disabled = !emailInput.value.trim();
      }
    };

    const openModal = () => {
      modal?.classList.add("active");
      document.body.style.overflow = "hidden";
      form?.reset();
      if (options.disableSubmitIfEmpty) updateSubmitState();
      emailInput?.focus();
    };

    const closeModal = () => {
      modal?.classList.remove("active");
      document.body.style.overflow = "auto";
      form?.reset();
      if (options.disableSubmitIfEmpty) updateSubmitState();
    };

    openButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openModal();
      });
    });

    emailInput?.addEventListener("input", updateSubmitState);
    closeButton?.addEventListener("click", closeModal);
    overlay?.addEventListener("click", closeModal);

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = Array.from(form.elements)
        .filter((input) => input.tagName === "INPUT")
        .reduce((acc, input) => {
          acc[input.id] = input.value;
          return acc;
        }, {});
      console.log(`${options.modalId} submitted:`, values);
      closeModal();
    });
  };

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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal.active").forEach((activeModal) => {
        activeModal.classList.remove("active");
      });
      document.body.style.overflow = "auto";
    }
  });
};

/* Manufacturing carousel controller with swipe and keyboard support. */
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

    this.bindEvents();
    this.updateUI();
    this.setupSwipeGestures();
    this.setupKeyboardNavigation();
  }

  bindEvents() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    prevBtn?.addEventListener("click", () => this.previousSlide());
    nextBtn?.addEventListener("click", () => this.nextSlide());
  }

  setupSwipeGestures() {
    const container = document.querySelector(".carousel-content");
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    container.addEventListener(
      "touchstart",
      (event) => {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        startTime = Date.now();
      },
      { passive: true },
    );

    container.addEventListener(
      "touchend",
      (event) => {
        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;
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
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        this.previousSlide();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
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
    ) {
      return;
    }

    this.isAnimating = true;
    this.animateSlide(this.currentSlide, index, direction);
    this.currentSlide = index;
    this.updateUI();

    setTimeout(() => {
      this.isAnimating = false;
    }, 400);
  }

  animateSlide(fromIndex, toIndex, direction) {
    const slides = document.querySelectorAll(".slide");
    const currentSlide = slides[fromIndex];
    const nextSlide = slides[toIndex];
    if (!currentSlide || !nextSlide) return;

    nextSlide.style.transform = direction === "next" ? "translateX(100%)" : "translateX(-100%)";
    nextSlide.style.opacity = "0";
    nextSlide.style.position = "absolute";
    nextSlide.style.top = "0";
    nextSlide.style.left = "0";
    nextSlide.style.width = "100%";
    nextSlide.offsetHeight;

    requestAnimationFrame(() => {
      currentSlide.style.transform = direction === "next" ? "translateX(-100%)" : "translateX(100%)";
      currentSlide.style.opacity = "0";
      nextSlide.style.transform = "translateX(0)";
      nextSlide.style.opacity = "1";

      setTimeout(() => {
        slides.forEach((slide, index) => {
          slide.classList.remove("active");
          if (index === toIndex) {
            slide.classList.add("active");
            slide.style.position = "relative";
            slide.style.transform = "";
            slide.style.opacity = "";
            slide.classList.add("fade-in");
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
    const stepBadge = document.getElementById("stepBadge");
    const currentSlideData = this.slides[this.currentSlide];
    if (stepBadge) {
      stepBadge.textContent = `Step ${currentSlideData.step}/8: ${currentSlideData.title}`;
    }

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    if (prevBtn) prevBtn.disabled = this.currentSlide === 0;
    if (nextBtn) nextBtn.disabled = this.currentSlide === this.totalSlides - 1;

    if (prevBtn) {
      prevBtn.style.opacity = prevBtn.disabled ? "0.65" : "1";
    }
    if (nextBtn) {
      nextBtn.style.opacity = nextBtn.disabled ? "0.65" : "1";
    }
  }

  goToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= this.totalSlides) {
      const direction = stepNumber > this.currentSlide + 1 ? "next" : "prev";
      this.goToSlide(stepNumber - 1, direction);
    }
  }

  getCurrentStep() {
    return {
      step: this.currentSlide + 1,
      title: this.slides[this.currentSlide].title,
      total: this.totalSlides,
    };
  }
}

/* Helper listeners for global page events. */
document.addEventListener("visibilitychange", () => {
  if (document.hidden && window.manufacturingCarousel) {
    window.manufacturingCarousel.isAnimating = false;
  }
});

document.addEventListener("contextmenu", (event) => {
  if (event.target.closest(".carousel-card")) {
    event.preventDefault();
  }
});
