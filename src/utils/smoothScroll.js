/**
 * Smooth scroll to a section by ID
 * @param {string} sectionId - The ID of the section to scroll to
 * @param {number} offset - Optional offset from the top (default: 80px for header)
 */
export const smoothScrollToSection = (sectionId, offset = 80) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    // Ensure we don't scroll past the document
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = Math.min(Math.max(0, offsetPosition), maxScroll);

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  } else {
    console.warn(`Element with ID "${sectionId}" not found for smooth scrolling`);
  }
};

/**
 * Check if we're currently on the landing page
 * @returns {boolean}
 */
export const isOnLandingPage = () => {
  return window.location.pathname === '/' || window.location.pathname === '/public-landing-page';
};

/**
 * Scroll to top of the page smoothly
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};