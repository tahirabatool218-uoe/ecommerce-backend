import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Brand from "./Brand";
import { CloseIcon, MenuIcon } from "../ui/Icons";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
];

const USER_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/cart", label: "Cart" },
  { to: "/orders", label: "My Orders" },
];

const ADMIN_LINKS = [
  { to: "/admin/dashboard", label: "Admin Dashboard" },
  { to: "/admin/products", label: "Manage Products" },
  { to: "/admin/orders", label: "Manage Orders" },
];

const GUEST_LINKS = [
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register", emphasis: true },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, role, logout } = useAuth();
  const isAdmin = role === "admin";
  // The menu is "open" only for the route it was opened on, so it closes
  // automatically on any navigation (links, back/forward) without an effect.
  const [openedOn, setOpenedOn] = useState(null);
  const isOpen = openedOn === pathname;
  const toggleRef = useRef(null);

  const closeMenu = () => setOpenedOn(null);
  const toggleMenu = () => setOpenedOn(isOpen ? null : pathname);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenedOn(null);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const linkClass = ({ isActive }) =>
    `nav-link${isActive ? " nav-link--active" : ""}`;

  function handleLogout() {
    closeMenu();
    logout();
    navigate("/login");
  }

  return (
    <header className="site-header">
      <div className="container navbar">
        <Brand onClick={closeMenu} />

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={toggleMenu}
        >
          <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
          {isOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>

        <nav
          id="primary-navigation"
          className="navbar__nav"
          data-open={isOpen}
          aria-label="Primary"
        >
          <ul className="navbar__list">
            {NAV_LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={linkClass} onClick={closeMenu}>
                  {label}
                </NavLink>
              </li>
            ))}
            {isAuthenticated &&
              (isAdmin ? ADMIN_LINKS : USER_LINKS).map(({ to, label }) => (
                <li key={to}>
                  <NavLink to={to} className={linkClass} onClick={closeMenu}>
                    {label}
                  </NavLink>
                </li>
              ))}
          </ul>
          <ul className="navbar__list navbar__list--auth">
            {isAuthenticated ? (
              <>
                <li className="navbar__user">{user?.name}</li>
                <li>
                  <button type="button" className="btn btn--secondary btn--sm" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              GUEST_LINKS.map(({ to, label, emphasis }) => (
                <li key={to}>
                  {emphasis ? (
                    <NavLink to={to} className="btn btn--primary btn--sm" onClick={closeMenu}>
                      {label}
                    </NavLink>
                  ) : (
                    <NavLink to={to} className={linkClass} onClick={closeMenu}>
                      {label}
                    </NavLink>
                  )}
                </li>
              ))
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
