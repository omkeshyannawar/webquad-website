import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";
import logo from "../../assets/images/brand/webquad-logo.png";

const navLinks = [
  { label: "Services", path: "/services" },
  { label: "Products", path: "/products" },
  { label: "About", path: "/about" },
  { label: "Careers", path: "/careers" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrolledState = () => {
      setIsScrolled(window.scrollY > 32);
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrolledState);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((previous) => !previous);
  };

  return (
    <header
      className={`navbar ${
        isScrolled ? "navbar--scrolled" : ""
      } ${menuOpen ? "navbar--menu-open" : ""}`}
    >
      <div className="navbar__shell">

        {/* Logo */}
        <Link
          to="/"
          className="navbar__logo"
          aria-label="WebQuad home"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="WebQuad"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="navbar__links"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Contact */}
        <Link
          to="/contact"
          className="navbar__contact"
          onClick={closeMenu}
        >
          Contact Us
        </Link>

        {/* Mobile / Tablet Menu Button */}
        <button
          type="button"
          className={`navbar__menu-button ${
            menuOpen ? "is-open" : ""
          }`}
          onClick={toggleMenu}
          aria-label={
            menuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav
        id="mobile-navigation"
        className={`navbar__mobile ${
          menuOpen ? "is-open" : ""
        }`}
        aria-label="Mobile navigation"
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}

        <Link
          to="/contact"
          onClick={closeMenu}
        >
          Contact Us
        </Link>
      </nav>
    </header>
  );
}