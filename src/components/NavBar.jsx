"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaMoon, FaSun, FaChevronDown } from "react-icons/fa";
import useFetchCategories from "../hooks/useFetchCategories";
import styles from "../styles/navbar.module.css";

// Helper function to generate a slug from text
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Fetch categories; adapt for JSON structure with "results"
  const { data: fetchedData, isLoading } = useFetchCategories();
  const categories =
    !isLoading && fetchedData && fetchedData.results
      ? fetchedData.results
      : fetchedData || [];

  // Identify IDs of categories that appear as subcategories.
  const subcategoryIds = new Set();
  categories.forEach((cat) => {
    if (cat.subcategories && cat.subcategories.length > 0) {
      cat.subcategories.forEach((sub) => {
        subcategoryIds.add(sub.id);
      });
    }
  });

  // Filter out any category that is also a subcategory
  const parentCategories = categories.filter(
    (category) => !subcategoryIds.has(category.id)
  );

  // Detect mobile/desktop based on window width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  }, []);

  // Toggle mobile menu
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  // For mobile: toggle category dropdown on click
  const handleCategoryClick = (categoryId) => {
    if (isMobile) {
      setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
    }
  };

  // For desktop: set active category on hover
  const handleCategoryMouseEnter = (categoryId) => {
    if (!isMobile) {
      setActiveCategory(categoryId);
    }
  };
  const handleCategoryMouseLeave = () => {
    if (!isMobile) {
      setActiveCategory(null);
    }
  };

  // Redirect to SEO-friendly category page using a slug for the subcategory.
  const selectSubcategory = (subcategory) => {
    const subcategorySlug = subcategory.slug || slugify(subcategory.name);
    router.push(`/category/${subcategorySlug}`);
    if (isMobile) setActiveCategory(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      if (isMobile) {
        setMenuOpen(false);
      } else {
        setDesktopSearchOpen(false);
      }
    }
  };

  return (
    <nav className={`${styles.navbar} ${darkMode ? styles.navbarDark : styles.navbarLight}`}>
      <div className={styles.navbarBrand}>
        <Link href="/" legacyBehavior>
          <a className={styles.logo}>💰 Fynance Guide</a>
        </Link>
        <button className={styles.darkModeToggle} onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        {isMobile && (
          <button className={styles.navbarBurger} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
      </div>

      {isMobile ? (
        // Mobile layout:
        menuOpen && (
          <div className={`${styles.navbarMenu} ${menuOpen ? styles.navbarMenuActive : ""}`} ref={dropdownRef}>
            <form className={styles.navbarSearch} onSubmit={handleSearch}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className={styles.searchIcon}>
                  <FaSearch />
                </button>
              </div>
            </form>
            <Link href="/" legacyBehavior>
              <a className={styles.navbarItem} onClick={() => setMenuOpen(false)}>Home</a>
            </Link>
            {!isLoading &&
              parentCategories.map((parent) => (
                <div key={parent.id} className={styles.hasDropdown}>
                  <button className={styles.dropdownToggle} onClick={() => handleCategoryClick(parent.id)}>
                    {parent.name} <FaChevronDown />
                  </button>
                  {activeCategory === parent.id && parent.subcategories?.length > 0 && (
                    <div className={styles.dropdownMenu}>
                      {parent.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          className={styles.dropdownItem}
                          onClick={() => selectSubcategory(sub)}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            <Link href="/about" legacyBehavior>
              <a className={styles.navbarItem} onClick={() => setMenuOpen(false)}>About</a>
            </Link>
            <Link href="/contact" legacyBehavior>
              <a className={styles.navbarItem} onClick={() => setMenuOpen(false)}>Contact</a>
            </Link>
          </div>
        )
      ) : (
        // Desktop layout:
        <>
          {!desktopSearchOpen ? (
            <div className={styles.navbarMenu} ref={dropdownRef}>
              <Link href="/" legacyBehavior>
                <a className={styles.navbarItem}>Home</a>
              </Link>
              {!isLoading &&
                parentCategories.map((parent) => (
                  <div
                    key={parent.id}
                    className={styles.hasDropdown}
                    onMouseEnter={() => handleCategoryMouseEnter(parent.id)}
                    onMouseLeave={handleCategoryMouseLeave}
                  >
                    <button className={styles.dropdownToggle} onClick={() => handleCategoryClick(parent.id)}>
                      {parent.name} <FaChevronDown />
                    </button>
                    {activeCategory === parent.id && parent.subcategories?.length > 0 && (
                      <div className={`${styles.dropdownMenu} ${styles.dropdownMenuActive}`}>
                        {parent.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            className={styles.dropdownItem}
                            onClick={() => selectSubcategory(sub)}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              <Link href="/about" legacyBehavior>
                <a className={styles.navbarItem}>About</a>
              </Link>
              <Link href="/contact" legacyBehavior>
                <a className={styles.navbarItem}>Contact</a>
              </Link>
              <button className={styles.searchToggle} onClick={() => setDesktopSearchOpen(true)}>
                <FaSearch />
              </button>
            </div>
          ) : (
            <div className={styles.desktopSearchOverlay}>
              <form className={styles.desktopSearchForm} onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="button" onClick={() => setDesktopSearchOpen(false)} className={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" className={styles.searchSubmitButton}>
                  Search
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
