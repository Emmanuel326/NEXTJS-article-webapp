"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaMoon, FaSun, FaChevronDown } from "react-icons/fa";
import useFetchCategories from "../hooks/useFetchCategories";
import styles from "../styles/navbar.module.css";

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
  const navbarRef = useRef(null);

  const { data: categories, isLoading, error } = useFetchCategories();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  }, []);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  const toggleDropdown = (catId) => {
    setActiveDropdown((prev) => (prev === catId ? null : catId));
  };

  const handleNavigation = (category) => {
    router.push(`/category/${category.slug || slugify(category.name)}`);
    setMenuOpen(false);
    setActiveDropdown(null);
  };

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
