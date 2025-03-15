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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Fetch categories
  const { data: fetchedData, isLoading } = useFetchCategories();
  const categories = fetchedData?.results || [];

  // Compute subcategory IDs and filter parent categories
  const subcategoryIds = new Set(categories.flatMap(cat => cat.subcategories?.map(sub => sub.id) || []));
  const parentCategories = categories.filter(cat => !subcategoryIds.has(cat.id));

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
    document.body.classList.toggle("dark-mode");
  }, []);

  // Toggle menu
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(prev => (prev === categoryId ? null : categoryId));
  };

  // Redirect to subcategory page
  const selectSubcategory = (subcategory) => {
    router.push(`/category/${subcategory.slug || slugify(subcategory.name)}`);
    setActiveCategory(null);
    setMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMenuOpen(false);
      setDesktopSearchOpen(false);
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
            <span></span><span></span><span></span>
          </button>
        )}
      </div>

      {isMobile ? (
        menuOpen && (
          <div className={`${styles.navbarMenu} ${menuOpen ? styles.navbarMenuActive : ""}`} ref={dropdownRef}>
            <form className={styles.navbarSearch} onSubmit={handleSearch}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className={styles.searchIcon}><FaSearch /></button>
            </form>
            <Link href="/" legacyBehavior><a className={styles.navbarItem} onClick={() => setMenuOpen(false)}>Home</a></Link>
            {!isLoading && parentCategories.map(parent => (
              <div key={parent.id} className={styles.hasDropdown}>
                <button className={styles.dropdownToggle} onClick={() => handleCategoryClick(parent.id)}>
                  {parent.name} <FaChevronDown />
                </button>
                {activeCategory === parent.id && parent.subcategories?.length > 0 && (
                  <div className={styles.dropdownMenu}>
                    {parent.subcategories.map(sub => (
                      <button key={sub.id} className={styles.dropdownItem} onClick={() => selectSubcategory(sub)}>
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <div className={styles.navbarMenu} ref={dropdownRef}>
          <Link href="/" legacyBehavior><a className={styles.navbarItem}>Home</a></Link>
          {!isLoading && parentCategories.map(parent => (
            <div key={parent.id} className={styles.hasDropdown}>
              <button className={styles.dropdownToggle} onMouseEnter={() => setActiveCategory(parent.id)}>
                {parent.name} <FaChevronDown />
              </button>
              {activeCategory === parent.id && parent.subcategories?.length > 0 && (
                <div className={styles.dropdownMenu}>
                  {parent.subcategories.map(sub => (
                    <button key={sub.id} className={styles.dropdownItem} onClick={() => selectSubcategory(sub)}>
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
