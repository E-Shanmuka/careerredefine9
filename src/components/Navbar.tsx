import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Courses', href: '/courses' },
    { name: 'Tools', href: '/tools' },
    { name: 'Support', href: '/support' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'About', href: '/about' },
  ];

  const handleNavClick = (href: string, isMobile: boolean) => {
    if (isMobile) {
      setIsOpen(false);
    }
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const renderNavItem = (item: NavItem, isMobile = false) => {
    const isActive = location.pathname === item.href;
    const isHashLink = item.href.startsWith('#');

    const mobileClasses = `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive && !isHashLink
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-700 hover:bg-gray-50'
    }`;
    const desktopClasses = `relative text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
      isActive && !isHashLink ? 'text-blue-600' : 'text-gray-700'
    }`;

    if (isHashLink) {
      return (
        <a
          key={item.name}
          href={item.href}
          className={isMobile ? mobileClasses : desktopClasses}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick(item.href, isMobile);
          }}
        >
          {item.name}
        </a>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        className={isMobile ? mobileClasses : desktopClasses}
        onClick={() => handleNavClick(item.href, isMobile)}
      >
        {item.name}
        {isActive && !isMobile && (
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
        )}
      </Link>
    );
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CR</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Career Redefine</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => renderNavItem(item))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <ProfileDropdown />
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-96 py-4' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => renderNavItem(item, true))}
            {isAuthenticated ? (
              <div className="pt-3 border-t">
                <Link to="/profile" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </Link>
                {/* My Queries removed per requirements */}
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-3 border-t">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;