// ================================================================
// NDWA STATIC PAGES - MAIN JAVASCRIPT FILE
// All interactive functionality for all pages
// ================================================================

// ================================================================
// 1. MOBILE MENU FUNCTIONALITY
// ================================================================

document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const navMenu = document.getElementById("navMenu")

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      mobileMenuBtn.classList.toggle("active")
    })

    // Close menu when clicking on a link
    const menuItems = navMenu.querySelectorAll("a")
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        navMenu.classList.remove("active")
        mobileMenuBtn.classList.remove("active")
      })
    })
  }
})

// ================================================================
// 2. FORM HANDLING (Contact Form)
// ================================================================

const contactForm = document.getElementById("contactForm")
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(contactForm)
    const data = Object.fromEntries(formData)

    // Simple validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      alert("Please fill in all required fields.")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      alert("Please enter a valid email address.")
      return
    }

    // Log form submission (in real app, send to server)
    console.log("[v0] Form submitted:", data)

    // Show success message
    alert("Thank you for your message! We will get back to you soon.")
    contactForm.reset()
  })
}

// ================================================================
// 3. ARCHIVE PAGE FILTERING (News, Publications, Projects)
// ================================================================

// Filter functionality for archive pages
function initializeFilters() {
  const searchInput = document.getElementById("searchInput")
  const categoryFilter = document.getElementById("categoryFilter")
  const yearFilter = document.getElementById("yearFilter")
  const typeFilter = document.getElementById("typeFilter")
  const sectorFilter = document.getElementById("sectorFilter")
  const statusFilter = document.getElementById("statusFilter")
  const partnerFilter = document.getElementById("partnerFilter")

  const archiveGrid = document.getElementById("archiveGrid")
  const projectsGrid = document.getElementById("projectsGrid")
  const publicationsGrid = document.getElementById("publicationsGrid")

  const grid = archiveGrid || projectsGrid || publicationsGrid

  if (!grid) return

  function filterCards() {
    const searchValue = searchInput ? searchInput.value.toLowerCase() : ""
    const categoryValue = categoryFilter ? categoryFilter.value : ""
    const yearValue = yearFilter ? yearFilter.value : ""
    const typeValue = typeFilter ? typeFilter.value : ""
    const sectorValue = sectorFilter ? sectorFilter.value : ""
    const statusValue = statusFilter ? statusFilter.value : ""
    const partnerValue = partnerFilter ? partnerFilter.value : ""

    const cards = grid.querySelectorAll("[data-category], [data-type], [data-sector], [data-year], [data-partner], .project-card, .archive-card")

    let visibleCount = 0

    cards.forEach((card) => {
      // Get card attributes
      const cardCategory = card.getAttribute("data-category") || ""
      const cardYear = card.getAttribute("data-year") || ""
      const cardType = card.getAttribute("data-type") || ""
      const cardSector = card.getAttribute("data-sector") || ""
      const cardStatus = card.getAttribute("data-status") || ""
      const cardPartner = card.getAttribute("data-partner") || ""
      const cardText = card.textContent.toLowerCase()

      // Check if card matches filters
      const matchesSearch = cardText.includes(searchValue)
      const matchesCategory = !categoryValue || cardCategory === categoryValue
      const matchesYear = !yearValue || cardYear === yearValue
      const matchesType = !typeValue || cardType === typeValue
      const matchesSector = !sectorValue || cardSector === sectorValue
      const matchesStatus = !statusValue || cardStatus === statusValue
      const matchesPartner = !partnerValue || cardPartner === partnerValue

      if (matchesSearch && matchesCategory && matchesYear && matchesType && matchesSector && matchesStatus && matchesPartner) {
        card.style.display = ""
        card.classList.add("animate-fadeIn")
        visibleCount++
      } else {
        card.style.display = "none"
        card.classList.remove("animate-fadeIn")
      }
    })

    // Show "no results" message if needed
    console.log(`[v0] Filters applied: ${visibleCount} items visible`)
  }

  // Add event listeners
  if (searchInput) searchInput.addEventListener("input", filterCards)
  if (categoryFilter) categoryFilter.addEventListener("change", filterCards)
  if (yearFilter) yearFilter.addEventListener("change", filterCards)
  if (typeFilter) typeFilter.addEventListener("change", filterCards)
  if (sectorFilter) sectorFilter.addEventListener("change", filterCards)
  if (statusFilter) statusFilter.addEventListener("change", filterCards)
  if (partnerFilter) partnerFilter.addEventListener("change", filterCards)
}

// Initialize filters when DOM is ready
document.addEventListener("DOMContentLoaded", initializeFilters)

// ================================================================
// 4. PAGINATION
// ================================================================

function initializePagination() {
  const prevBtn = document.querySelector(".pagination-btn.prev")
  const nextBtn = document.querySelector(".pagination-btn.next")
  const pageNumbers = document.querySelectorAll(".pagination-number")

  let currentPage = 1

  if (!prevBtn || !nextBtn) return

  function updatePagination() {
    // Update button states
    prevBtn.disabled = currentPage === 1
    nextBtn.disabled = currentPage === pageNumbers.length

    // Update active page number
    pageNumbers.forEach((btn) => {
      btn.classList.remove("active")
      if (Number.parseInt(btn.getAttribute("data-page")) === currentPage) {
        btn.classList.add("active")
      }
    })

    console.log(`[v0] Current page: ${currentPage}`)
  }

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      updatePagination()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  })

  nextBtn.addEventListener("click", () => {
    if (currentPage < pageNumbers.length) {
      currentPage++
      updatePagination()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  })

  pageNumbers.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPage = Number.parseInt(btn.getAttribute("data-page"))
      updatePagination()
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  })

  updatePagination()
}

document.addEventListener("DOMContentLoaded", initializePagination)

// ================================================================
// 5. SMOOTH SCROLL NAVIGATION
// ================================================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href")

    // Don't prevent default for empty anchors or non-existent elements
    if (href === "#" || !document.querySelector(href)) {
      return
    }

    e.preventDefault()

    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// ================================================================
// 6. DROPDOWN MENU FUNCTIONALITY
// ================================================================

function initializeDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown")

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle")
    const submenu = dropdown.querySelector(".submenu")

    if (!toggle || !submenu) return

    // Desktop hover
    dropdown.addEventListener("mouseenter", () => {
      submenu.style.opacity = "1"
      submenu.style.visibility = "visible"
      submenu.style.transform = "translateY(0)"
    })

    dropdown.addEventListener("mouseleave", () => {
      submenu.style.opacity = "0"
      submenu.style.visibility = "hidden"
      submenu.style.transform = "translateY(-10px)"
    })

    // Mobile click
    toggle.addEventListener("click", (e) => {
      if (window.innerWidth < 1024) {
        e.preventDefault()
        submenu.classList.toggle("active")
      }
    })
  })
}

document.addEventListener("DOMContentLoaded", initializeDropdowns)

// ================================================================
// 7. LANGUAGE SELECTOR
// ================================================================

const languageSelect = document.getElementById("languageSelect")
if (languageSelect) {
  languageSelect.addEventListener("change", function () {
    const language = this.value
    console.log(`[v0] Language changed to: ${language}`)
    // In real app, would change page language
    // For now, just log the change
  })
}

// ================================================================
// 8. NEWSLETTER FORM HANDLING
// ================================================================

document.querySelectorAll(".newsletter-form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault()

    const emailInput = this.querySelector('input[type="email"]')
    const email = emailInput.value

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.")
      return
    }

    console.log(`[v0] Newsletter signup: ${email}`)
    alert("Thank you for subscribing!")
    emailInput.value = ""
  })
})

// ================================================================
// 9. INTERSECTION OBSERVER FOR ANIMATIONS
// ================================================================

function initializeIntersectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeIn")
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  // Observe cards and elements
  document
    .querySelectorAll(
      ".news-card, .campaign-card, .stat-card, .quick-link, .publication-card, .project-card, .archive-card",
    )
    .forEach((el) => {
      observer.observe(el)
    })
}

document.addEventListener("DOMContentLoaded", initializeIntersectionObserver)

// ================================================================
// 10. SCROLL-TO-TOP BUTTON
// ================================================================

function initializeScrollToTop() {
  // Create scroll to top button
  const scrollBtn = document.createElement("button")
  scrollBtn.id = "scrollToTopBtn"
  scrollBtn.innerHTML = "↑"
  scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background-color: #E11F26;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        font-size: 1.5rem;
        z-index: 99;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `

  document.body.appendChild(scrollBtn)

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.display = "block"
    } else {
      scrollBtn.style.display = "none"
    }
  })

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  scrollBtn.addEventListener("mouseenter", () => {
    scrollBtn.style.transform = "scale(1.1)"
  })

  scrollBtn.addEventListener("mouseleave", () => {
    scrollBtn.style.transform = "scale(1)"
  })
}

document.addEventListener("DOMContentLoaded", initializeScrollToTop)

// ================================================================
// 11. ACTIVE MENU ITEM HIGHLIGHTING
// ================================================================

function initializeActiveMenu() {
  const currentLocation = location.pathname
  const menuItems = document.querySelectorAll("nav a")

  menuItems.forEach((item) => {
    if (item.getAttribute("href") === currentLocation) {
      item.classList.add("active")
    }
  })
}

document.addEventListener("DOMContentLoaded", initializeActiveMenu)

// ================================================================
// 12. RESPONSIVE SIDEBAR (for mobile)
// ================================================================

function initializeResponsiveSidebar() {
  if (window.innerWidth < 1024) {
    const sidebars = document.querySelectorAll(".page-sidebar, .article-sidebar, .archive-sidebar, .contact-sidebar")

    sidebars.forEach((sidebar) => {
      // Wrap sidebar in collapsible section for mobile
      const title = sidebar.querySelector(".widget-title")
      if (title) {
        title.style.cursor = "pointer"
        title.addEventListener("click", () => {
          sidebar.classList.toggle("collapsed")
        })
      }
    })
  }
}

document.addEventListener("DOMContentLoaded", initializeResponsiveSidebar)

// ================================================================
// 13. SHARE FUNCTIONALITY
// ================================================================

document.querySelectorAll(".share-btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault()

    const platform = this.classList[this.classList.length - 1]
    const url = window.location.href
    const title = document.querySelector("h1")?.textContent || "NDWA"

    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
        break
    }

    if (shareUrl) {
      if (platform === "email") {
        window.location.href = shareUrl
      } else {
        window.open(shareUrl, "_blank", "width=600,height=400")
      }
    }
  })
})

// ================================================================
// 14. PRINT FUNCTIONALITY
// ================================================================

window.printPage = () => {
  window.print()
}

// ================================================================
// 15. COPY TO CLIPBOARD FUNCTIONALITY
// ================================================================

window.copyToClipboard = function(event) {
  const url = window.location.href
  const copyBtn = event?.target.closest('.copy-link') || document.querySelector('.copy-link')
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      // Show feedback
      if (copyBtn) {
        const originalText = copyBtn.querySelector('span').textContent
        copyBtn.querySelector('span').textContent = 'Copied!'
        copyBtn.style.background = '#28a745'
        copyBtn.style.borderColor = '#28a745'
        copyBtn.style.color = 'white'
        
        setTimeout(() => {
          copyBtn.querySelector('span').textContent = originalText
          copyBtn.style.background = ''
          copyBtn.style.borderColor = ''
          copyBtn.style.color = ''
        }, 2000)
      }
    }).catch(err => {
      console.error('Failed to copy:', err)
      alert('Failed to copy link. Please try again.')
    })
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = url
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
      if (copyBtn) {
        const originalText = copyBtn.querySelector('span').textContent
        copyBtn.querySelector('span').textContent = 'Copied!'
        setTimeout(() => {
          copyBtn.querySelector('span').textContent = originalText
        }, 2000)
      }
    } catch (err) {
      console.error('Fallback copy failed:', err)
      alert('Failed to copy link. Please try again.')
    }
    
    document.body.removeChild(textArea)
  }
}

// ================================================================
// 16. GENERAL UTILITIES
// ================================================================

// Debounce function for resize events
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Handle window resize
window.addEventListener(
  "resize",
  debounce(() => {
    console.log("[v0] Window resized")
  }, 250),
)

// ================================================================
// 17. INITIALIZATION
// ================================================================

console.log("[v0] NDWA Static Pages JavaScript initialized")
