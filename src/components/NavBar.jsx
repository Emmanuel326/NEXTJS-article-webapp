"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaMoon, FaSun, FaChevronDown } from "react-icons/fa";
import useFetchCategories from "../hooks/useFetchCategories";
import styles from "../styles/navbar.module.css";

// Utility to generate a slug from text
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

const Navbar = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // New state for desktop search overlay
  const navbarRef = useRef(null);

  const { data: categories, isLoading, error } = useFetchCategories();

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  }, []);

  // Toggle mobile menu open/close
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  // Toggle dropdown for a given parent category
  const toggleDropdown = useCallback((catId) => {
    setActiveDropdown((prev) => (prev === catId ? null : catId));
  }, []);

  // Navigate to a category or subcategory page
  const handleNavigation = useCallback(
    (category) => {
      router.push(`/category/${category.slug || slugify(category.name)}`);
      setMenuOpen(false);
      setActiveDropdown(null);
    },
    [router]
  );

  // Handle search submission
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchQuery("");
        setMenuOpen(false);
        setActiveDropdown(null);
        setSearchOpen(false); // Close desktop search overlay after search
      }
    },
    [router, searchQuery]
  );

  // Desktop search handlers
  const openSearch = useCallback(() => {
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories.</div>;

  // Categories from hook (assumed to be an array)
  const parentCategories = categories;

  return (
    <nav
      ref={navbarRef}
      className={`${styles.navbar} ${darkMode ? styles.navbarDark : styles.navbarLight}`}
    >
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
        menuOpen && (
          <div className={`${styles.navbarMenu} ${styles.navbarMenuActive}`}>
            <form className={styles.navbarSearch} onSubmit={handleSearch}>
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
            </form>
            {parentCategories.map((parent) => (
              <div key={parent.id} className={styles.hasDropdown}>
                {parent.subcategories && parent.subcategories.length > 0 ? (
                  <>
                    <button
                      className={styles.dropdownToggle}
                      onClick={() => toggleDropdown(parent.id)}
                    >
                      {parent.name} <FaChevronDown />
                    </button>
                    {activeDropdown === parent.id && (
                      <div className={styles.dropdownMenu}>
                        {parent.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            className={styles.dropdownItem}
                            onClick={() => handleNavigation(sub)}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button className={styles.navbarItem} onClick={() => handleNavigation(parent)}>
                    {parent.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        // Desktop: When searchOpen is false, only the search icon is visible.
        // When searchOpen is true, the overlay with search input, search and cancel buttons is shown.
        <>
          {searchOpen ? (
            <div className={styles.desktopSearchOverlay}>
              <form className={styles.desktopSearchForm} onSubmit={handleSearch}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className={styles.searchSubmitButton}>
                  Search
                </button>
                <button type="button" className={styles.cancelButton} onClick={closeSearch}>
                  Cancel
                </button>
              </form>
            </div>
          ) : (
            <div className={styles.desktopSearch}>
              <button onClick={openSearch} className={styles.searchToggle}>
                <FaSearch />
              </button>
            </div>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
