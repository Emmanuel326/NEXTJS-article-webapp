'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://example.com/api/categories/');
        const data = await response.json();
        const categoryMap = {};
        data.forEach(category => {
          categoryMap[category.name] = category;
        });
        setCategories(Object.values(categoryMap));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Handle dark mode persistence
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem('darkMode', !prev);
      return !prev;
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const toggleCategory = categoryName => {
    setActiveCategory(prev => (prev === categoryName ? null : categoryName));
  };

  return (
    <nav className={`bg-${darkMode ? 'gray-900' : 'white'} text-${darkMode ? 'white' : 'black'} shadow-md`}>
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">MyBlog</span>
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6">
          {categories.map(category => (
            <li key={category.id} className="relative group">
              <button 
                onClick={() => toggleCategory(category.name)} 
                className="hover:text-blue-500"
              >
                {category.name}
              </button>
              {category.subcategories && activeCategory === category.name && (
                <ul className="absolute left-0 top-10 w-40 bg-white shadow-lg rounded-md p-2">
                  {category.subcategories.map(sub => (
                    <li key={sub.id}>
                      <Link href={`/category/${category.name}/${sub.name}`} className="block px-4 py-2 hover:bg-gray-200">
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white p-4">
          {categories.map(category => (
            <div key={category.id}>
              <button onClick={() => toggleCategory(category.name)} className="w-full text-left py-2">
                {category.name}
              </button>
              {category.subcategories && activeCategory === category.name && (
                <ul className="pl-4">
                  {category.subcategories.map(sub => (
                    <li key={sub.id}>
                      <Link href={`/category/${category.name}/${sub.name}`} className="block py-1">
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dark Mode Toggle */}
      <button className="absolute top-4 right-4" onClick={toggleDarkMode}>
        {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>
    </nav>
  );
};

export default Navbar;
