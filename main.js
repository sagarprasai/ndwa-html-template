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
  const mobileMenuClose = document.getElementById("mobileMenuClose")

  if (!mobileMenuBtn || !navMenu) return

  const closeMenu = (focusButton = false) => {
    navMenu.classList.remove("active")
    mobileMenuBtn.classList.remove("active")
    mobileMenuBtn.setAttribute("aria-expanded", "false")
    // Prevent body scroll when menu is open
    document.body.style.overflow = ""
    navMenu.querySelectorAll(".dropdown.open").forEach((dropdown) => {
      dropdown.classList.remove("open")
      const submenu = dropdown.querySelector(".submenu")
      const toggle = dropdown.querySelector(".dropdown-toggle")
      if (submenu) {
        submenu.classList.remove("active")
      }
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false")
      }
    })
    if (window.innerWidth < 1024) {
      navMenu.setAttribute("aria-hidden", "true")
    }
    if (focusButton) {
      mobileMenuBtn.focus()
    }
  }

  const openMenu = () => {
    navMenu.classList.add("active")
    mobileMenuBtn.classList.add("active")
    mobileMenuBtn.setAttribute("aria-expanded", "true")
    // Prevent body scroll when menu is open
    document.body.style.overflow = "hidden"
    if (window.innerWidth < 1024) {
      navMenu.setAttribute("aria-hidden", "false")
    }
  }

  const toggleMenu = () => {
    if (navMenu.classList.contains("active")) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  const updateMenuStateForViewport = () => {
    if (window.innerWidth >= 1024) {
      closeMenu()
      navMenu.setAttribute("aria-hidden", "false")
      document.body.style.overflow = ""
    } else {
      const isOpen = navMenu.classList.contains("active")
      navMenu.setAttribute("aria-hidden", isOpen ? "false" : "true")
      mobileMenuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false")
      document.body.style.overflow = isOpen ? "hidden" : ""
    }
  }

  mobileMenuBtn.addEventListener("click", (event) => {
    event.preventDefault()
    toggleMenu()
  })

  // Close button event listener
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", (event) => {
      event.preventDefault()
      closeMenu(true)
    })
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("active")) {
      closeMenu(true)
    }
  })

  document.addEventListener("click", (event) => {
    // Don't close if clicking inside the modal
    if (navMenu.classList.contains("active") && 
        !navMenu.contains(event.target) && 
        !mobileMenuBtn.contains(event.target) &&
        !mobileMenuClose?.contains(event.target)) {
      closeMenu()
    }
  })

  // Close menu when selecting a navigational link (skip dropdown toggles)
  const menuLinks = navMenu.querySelectorAll("a:not(.dropdown-toggle)")
  menuLinks.forEach((item) => {
    item.addEventListener("click", () => closeMenu())
  })

  window.addEventListener("resize", updateMenuStateForViewport)

  updateMenuStateForViewport()
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

  const closeAllDropdowns = (exception) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown === exception) return
      const toggle = dropdown.querySelector(".dropdown-toggle")
      const submenu = dropdown.querySelector(".submenu")
      if (!toggle || !submenu) return
      dropdown.classList.remove("open")
      submenu.classList.remove("active")
      toggle.setAttribute("aria-expanded", "false")
    })
  }

  dropdowns.forEach((dropdown, index) => {
    const toggle = dropdown.querySelector(".dropdown-toggle")
    const submenu = dropdown.querySelector(".submenu")

    if (!toggle || !submenu) return

    const submenuId = submenu.id || `nav-submenu-${index}`
    submenu.id = submenuId

    toggle.setAttribute("aria-haspopup", "true")
    toggle.setAttribute("aria-expanded", "false")
    toggle.setAttribute("aria-controls", submenuId)

    const openDropdown = () => {
      dropdown.classList.add("open")
      submenu.classList.add("active")
      toggle.setAttribute("aria-expanded", "true")
    }

    const closeDropdown = () => {
      dropdown.classList.remove("open")
      submenu.classList.remove("active")
      toggle.setAttribute("aria-expanded", "false")
    }

    dropdown.addEventListener("mouseenter", () => {
      if (window.innerWidth >= 1024) {
        closeAllDropdowns(dropdown)
        openDropdown()
      }
    })

    dropdown.addEventListener("mouseleave", () => {
      if (window.innerWidth >= 1024) {
        closeDropdown()
      }
    })

    toggle.addEventListener("focus", () => {
      closeAllDropdowns(dropdown)
      openDropdown()
    })

    dropdown.addEventListener("focusout", (event) => {
      if (!dropdown.contains(event.relatedTarget)) {
        closeDropdown()
      }
    })

    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdown()
        toggle.focus()
      }

      if (event.key === "Enter" || event.key === " ") {
        if (window.innerWidth < 1024) {
          event.preventDefault()
          const isOpen = dropdown.classList.contains("open")
          if (isOpen) {
            closeDropdown()
          } else {
            closeAllDropdowns(dropdown)
            openDropdown()
          }
        }
      }
    })

    submenu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdown()
        toggle.focus()
      }
    })

    toggle.addEventListener("click", (event) => {
      if (window.innerWidth < 1024) {
        event.preventDefault()
        const isOpen = dropdown.classList.contains("open")
        if (isOpen) {
          closeDropdown()
        } else {
          closeAllDropdowns(dropdown)
          openDropdown()
        }
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
          // Add animation class with a slight delay for staggered effect
          const delay = entry.target.dataset.delay || 0
          setTimeout(() => {
            entry.target.classList.add("animate-fadeIn")
          }, parseInt(delay))
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "50px",
    },
  )

  // Helper to check if element is in or near viewport
  function isNearViewport(element) {
    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    // Element is in viewport or within 200px of viewport
    return rect.top < windowHeight + 200 && rect.bottom > -200
  }

  // Observe cards and elements with staggered delays
  const cards = document.querySelectorAll(
    ".news-card, .campaign-card, .stat-card, .quick-link, .publication-card, .project-card, .archive-card",
  )
  
  cards.forEach((el, index) => {
    // If element is already in or near viewport, animate immediately (no delay)
    if (isNearViewport(el)) {
      setTimeout(() => {
        el.classList.add("animate-fadeIn")
      }, Math.min(index * 30, 150)) // Shorter delay for visible elements
    } else {
      // Mark for animation and add staggered delay for below-fold elements
      el.setAttribute("data-animate", "true")
      el.dataset.delay = Math.min(index * 50, 300)
      observer.observe(el)
    }
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
        opacity: 0;
        visibility: hidden;
        font-size: 1.5rem;
        z-index: 99;
        transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: scale(0.8);
        will-change: transform, opacity;
    `

  document.body.appendChild(scrollBtn)

  let ticking = false

  function updateScrollButton() {
    if (window.pageYOffset > 300) {
      scrollBtn.style.opacity = "1"
      scrollBtn.style.visibility = "visible"
      scrollBtn.style.transform = "scale(1)"
    } else {
      scrollBtn.style.opacity = "0"
      scrollBtn.style.visibility = "hidden"
      scrollBtn.style.transform = "scale(0.8)"
    }
    ticking = false
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollButton)
      ticking = true
    }
  }, { passive: true })

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
// 17. SEARCH MODAL FUNCTIONALITY
// ================================================================

document.addEventListener("DOMContentLoaded", () => {
  const searchIconBtn = document.getElementById("searchIconBtn")
  const searchModal = document.getElementById("searchModal")
  const searchModalClose = document.getElementById("searchModalClose")
  const searchModalOverlay = document.getElementById("searchModalOverlay")
  const searchInput = document.getElementById("searchInput")
  const searchForm = document.getElementById("searchForm")
  const popularSearchTags = document.querySelectorAll(".popular-search-tag")

  if (!searchIconBtn || !searchModal) return

  // Store the element that had focus before opening modal
  let previousActiveElement = null

  const openSearchModal = () => {
    previousActiveElement = document.activeElement
    searchModal.classList.add("active")
    searchModal.setAttribute("aria-hidden", "false")
    searchIconBtn.setAttribute("aria-expanded", "true")
    document.body.classList.add("search-modal-open")

    // Focus the search input after a short delay to allow animation
    setTimeout(() => {
      searchInput.focus()
    }, 100)
  }

  const closeSearchModal = (returnFocus = true) => {
    searchModal.classList.remove("active")
    searchModal.setAttribute("aria-hidden", "true")
    searchIconBtn.setAttribute("aria-expanded", "false")
    document.body.classList.remove("search-modal-open")

    // Return focus to the element that opened the modal
    if (returnFocus && previousActiveElement) {
      previousActiveElement.focus()
    }
  }

  // Open modal when search icon is clicked
  searchIconBtn.addEventListener("click", (e) => {
    e.preventDefault()
    openSearchModal()
  })

  // Close modal when close button is clicked
  if (searchModalClose) {
    searchModalClose.addEventListener("click", (e) => {
      e.preventDefault()
      closeSearchModal(true)
    })
  }

  // Close modal when overlay is clicked
  if (searchModalOverlay) {
    searchModalOverlay.addEventListener("click", () => {
      closeSearchModal(true)
    })
  }

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchModal.classList.contains("active")) {
      closeSearchModal(true)
    }
  })

  // Handle search form submission
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      const searchQuery = searchInput.value.trim()

      if (searchQuery) {
        // If form has action attribute, let it submit naturally
        // Otherwise, redirect manually
        if (!searchForm.getAttribute("action")) {
          e.preventDefault()
          window.location.href = `search.html?q=${encodeURIComponent(searchQuery)}`
        }
        // If form has action, it will submit naturally
      } else {
        e.preventDefault()
      }
    })
  }

  // Handle popular search tag clicks
  popularSearchTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const searchText = tag.querySelector("span").textContent
      searchInput.value = searchText
      
      // Submit the search automatically
      if (searchForm) {
        if (searchForm.getAttribute("action")) {
          // Form has action, submit it
          searchForm.submit()
        } else {
          // Redirect manually
          window.location.href = `search.html?q=${encodeURIComponent(searchText)}`
        }
      }
    })
  })

  // Prevent modal from closing when clicking inside the modal content
  if (searchModal) {
    const modalContent = searchModal.querySelector(".search-modal-content")
    if (modalContent) {
      modalContent.addEventListener("click", (e) => {
        e.stopPropagation()
      })
    }
  }
})

// ================================================================
// 18. SEARCH PAGE FUNCTIONALITY
// ================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Handle search query parameter on search.html
  const urlParams = new URLSearchParams(window.location.search)
  const searchQuery = urlParams.get("q")

  if (searchQuery) {
    // Update search page input
    const searchPageInput = document.getElementById("searchPageInput")
    if (searchPageInput) {
      searchPageInput.value = decodeURIComponent(searchQuery)
    }

    // Update hero text
    const archiveHero = document.querySelector(".archive-hero")
    if (archiveHero) {
      const h1 = archiveHero.querySelector("h1")
      if (h1) {
        h1.textContent = `Search results for "${decodeURIComponent(searchQuery)}"`
      }
    }
  }

  // Handle search page form submission
  const searchPageForm = document.querySelector(".search-page-form")
  if (searchPageForm) {
    searchPageForm.addEventListener("submit", (e) => {
      const input = searchPageForm.querySelector('input[name="q"]')
      if (input && !input.value.trim()) {
        e.preventDefault()
      }
      // Otherwise let it submit naturally
    })
  }
})

// ================================================================
// 19. INITIALIZATION
// ================================================================

console.log("[v0] NDWA Static Pages JavaScript initialized")
