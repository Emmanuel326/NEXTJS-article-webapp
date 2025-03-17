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
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // activeDropdown stores the ID of the parent category whose dropdown is visible.
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const navbarRef = useRef(null);

  // Fetch parent categories (each including their subcategories)
  const { data: categories, isLoading, error } = useFetchCategories();

  // Detect mobile viewport size
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

  // Toggle dropdown for a given parent category (by its ID)
  const toggleDropdown = (catId) => {
    setActiveDropdown((prev) => (prev === catId ? null : catId));
  };

  // Navigate to subcategory page using its slug (or generated slug)
  const handleNavigation = (category) => {
    router.push(`/category/${category.slug || slugify(category.name)}`);
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMenuOpen(false);
      setActiveDropdown(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories.</div>;

  // Assuming the API returns only top-level (parent) categories with a nested `subcategories` array.
  const parentCategories = categories;

  return (
    <nav
      ref={navbarRef}
      className={`${styles.navbar} ${
        darkMode ? styles.navbarDark : styles.navbarLight
      }`}
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
            {/* Static links */}
            <Link href="/" legacyBehavior>
              <a
                className={styles.navbarItem}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </a>
            </Link>
            <Link href="/about" legacyBehavior>
              <a
                className={styles.navbarItem}
                onClick={() => setMenuOpen(false)}
              >
                About
              </a>
            </Link>
            <Link href="/contact" legacyBehavior>
              <a
                className={styles.navbarItem}
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>
            </Link>
            {/* Dynamic categories */}
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
                  <button
                    className={styles.navbarItem}
                    onClick={() => handleNavigation(parent)}
                  >
                    {parent.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <div className={styles.navbarMenu}>
          {/* Static links */}
          <Link href="/" legacyBehavior>
            <a className={styles.navbarItem}>Home</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className={styles.navbarItem}>About</a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className={styles.navbarItem}>Contact</a>
          </Link>
          {/* Dynamic categories */}
          {parentCategories.map((parent) => (
            <div
              key={parent.id}
              className={styles.hasDropdown}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {parent.subcategories && parent.subcategories.length > 0 ? (
                <>
                  <button
                    className={styles.dropdownToggle}
                    onMouseEnter={() => setActiveDropdown(parent.id)}
                  >
                    {parent.name} <FaChevronDown />
                  </button>
                  {activeDropdown === parent.id && (
                    <div
                      className={`${styles.dropdownMenu} ${styles.dropdownMenuActive}`}
                      onMouseEnter={() => setActiveDropdown(parent.id)}
                    >
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
                <button
                  className={styles.navbarItem}
                  onClick={() => handleNavigation(parent)}
                >
                  {parent.name}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
