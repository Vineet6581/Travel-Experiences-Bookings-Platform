const header = document.querySelector("header");
const homeSection = document.querySelector(".home");

if (header && homeSection) {
  window.addEventListener("scroll", () => {
    const homeHeight = homeSection.offsetHeight;
    if (window.scrollY > homeHeight - 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

document.querySelectorAll(".navbar a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        const navbar = document.querySelector(".navbar");
        if (navbar && navbar.classList.contains("active")) {
          navbar.classList.remove("active");
        }
      }
    }
  });
});

const menuIcon = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");

if (menuIcon && navbar) {
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
    const icon = menuIcon.querySelector("i");
    if (navbar.classList.contains("active")) {
      icon.classList.remove("bx-menu");
      icon.classList.add("bx-x");
    } else {
      icon.classList.remove("bx-x");
      icon.classList.add("bx-menu");
    }
  });

  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
      navbar.classList.remove("active");
      const icon = menuIcon.querySelector("i");
      icon.classList.remove("bx-x");
      icon.classList.add("bx-menu");
    }
  });
}

const bookingForm = document.querySelector(".booking-form");
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const persons = document.getElementById("persons");
    const arrival = document.getElementById("arrival");
    const departure = document.getElementById("departure");
    const packageSelect = document.getElementById("package");

    let isValid = true;

    if (!name || name.value.trim() === "") {
      showError(name, "Please enter your full name");
      isValid = false;
    } else {
      clearError(name);
    }

    if (!email || !validateEmail(email.value)) {
      showError(email, "Please enter a valid email address");
      isValid = false;
    } else {
      clearError(email);
    }

    if (!phone || !validatePhone(phone.value)) {
      showError(phone, "Please enter a valid phone number");
      isValid = false;
    } else {
      clearError(phone);
    }

    if (!persons || persons.value < 1 || persons.value > 20) {
      showError(persons, "Please enter number of guests (1-20)");
      isValid = false;
    } else {
      clearError(persons);
    }

    if (!arrival || !arrival.value) {
      showError(arrival, "Please select arrival date");
      isValid = false;
    } else {
      clearError(arrival);
    }

    if (!departure || !departure.value) {
      showError(departure, "Please select departure date");
      isValid = false;
    } else {
      clearError(departure);
    }

    if (arrival && departure && arrival.value && departure.value) {
      const arrivalDate = new Date(arrival.value);
      const departureDate = new Date(departure.value);
      if (departureDate <= arrivalDate) {
        showError(departure, "Departure date must be after arrival date");
        isValid = false;
      }
    }

    if (!packageSelect || !packageSelect.value) {
      showError(packageSelect, "Please select a package");
      isValid = false;
    } else {
      clearError(packageSelect);
    }

    if (isValid) {
      showSuccessMessage();
    }
  });

  const inputs = bookingForm.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      validateField(input);
    });
    input.addEventListener("input", () => {
      clearError(input);
    });
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

function validateField(field) {
  const value = field.value.trim();
  switch (field.type) {
    case "email":
      if (value && !validateEmail(value)) {
        showError(field, "Please enter a valid email address");
        return false;
      }
      break;
    case "tel":
      if (value && !validatePhone(value)) {
        showError(field, "Please enter a valid phone number");
        return false;
      }
      break;
    case "number":
      if (field.id === "persons") {
        if (value < 1 || value > 20) {
          showError(field, "Please enter number of guests (1-20)");
          return false;
        }
      }
      break;
  }
  return true;
}

function showError(field, message) {
  if (!field) return;
  clearError(field);
  field.style.borderColor = "#e74c3c";
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  errorDiv.style.color = "#e74c3c";
  errorDiv.style.fontSize = "0.85rem";
  errorDiv.style.marginTop = "5px";
  errorDiv.style.animation = "fadeIn 0.3s ease";
  field.parentElement.appendChild(errorDiv);
}

function clearError(field) {
  if (!field) return;
  field.style.borderColor = "";
  const errorDiv = field.parentElement.querySelector(".error-message");
  if (errorDiv) {
    errorDiv.remove();
  }
}

function showSuccessMessage() {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;
  const successBox = document.createElement("div");
  successBox.style.cssText = `
    background: white;
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    max-width: 400px;
    margin: 20px;
    animation: slideIn 0.3s ease;
  `;
  successBox.innerHTML = `
    <div style="font-size: 60px; color: #27ae60; margin-bottom: 20px;">
      <i class='bx bx-check-circle'></i>
    </div>
    <h2 style="color: var(--text-color); margin-bottom: 15px; font-size: 1.8rem;">
      Booking Successful!
    </h2>
    <p style="color: var(--second-color); margin-bottom: 25px;">
      Your booking has been confirmed. We'll send you a confirmation email shortly.
    </p>
    <button onclick="this.closest('div[style*=\\'fixed\\']').remove()" 
            style="background: var(--main-color); color: white; border: none; 
                   padding: 12px 30px; border-radius: 8px; cursor: pointer; 
                   font-size: 1rem; font-weight: 600; transition: all 0.3s;">
      Continue
    </button>
  `;
  overlay.appendChild(successBox);
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".container-box, .box, .col-content, .thum"
  );
  animateElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  const loader = document.querySelector(".page-loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 300);
  }
});

let lastScroll = 0;
const scrollThreshold = 200;

if (header) {
  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.pageYOffset;
      if (window.innerWidth > 768) {
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
          header.style.transform = "translateY(-100%)";
        } else if (currentScroll < lastScroll) {
          header.style.transform = "translateY(0)";
        }
      }
      lastScroll = currentScroll;
    },
    { passive: true }
  );
}

const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { 
      transform: translateY(-50px);
      opacity: 0;
    }
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .error-message {
    animation: fadeIn 0.3s ease;
  }
`;
document.head.appendChild(style);
