import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./Navbar.css";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = ({ setShowLogin }) => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [menu, setMenu] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { getTotalCartAmount, token, setToken, buttonRef } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Update active menu item based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setMenu("home");
    else if (path.includes("/cart")) setMenu("cart");
    else if (path.includes("/myorders")) setMenu("orders");
  }, [location]);

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   setToken("");
  //   setProfileDropdownOpen(false);
  //   navigate("/");
  // };

  const handleClickOutside = () => {
    setProfileDropdownOpen(false);
  };

  useEffect(() => {
    if (profileDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const cartItemCount = getTotalCartAmount();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo-container">
            <img className="navbar-logo" src={assets.logo} alt="Logo" />
          </Link>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'mobile-active' : ''}`}>
          <li>
            <Link
              to="/"
              onClick={() => {setMenu("home"); setMobileMenuOpen(false);}}
              className={menu === "home" ? "active" : ""}
            >
              Home
            </Link>
          </li>
          <li>
            <a
              href="#explore-menu"
              onClick={() => {setMenu("menu"); setMobileMenuOpen(false);}}
              className={menu === "menu" ? "active" : ""}
            >
              Menu
            </a>
          </li>
          <li>
            <a
              href="#app-download"
              onClick={() => {setMenu("mobile-app"); setMobileMenuOpen(false);}}
              className={menu === "mobile-app" ? "active" : ""}
            >
              Mobile App
            </a>
          </li>
          <li>
            <a
              href="#footer"
              onClick={() => {setMenu("contact-us"); setMobileMenuOpen(false);}}
              className={menu === "contact-us" ? "active" : ""}
            >
              Contact Us
            </a>
          </li>
        </ul>
          <div>
          {isAuthenticated ? (
          <>
            <p>Welcome, {user.name}</p>
            <button onClick={() => logout({ logoutParams: { returnTo: "http://localhost:5173/" } })}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => loginWithRedirect()}>Login</button>
        )}
          </div>
        <div className="navbar-right">
          <div className="navbar-search">
            <img src={assets.search_icon} alt="Search" />
          </div>
          
          <div className="navbar-cart">
            <Link to="/cart">
              <img src={assets.basket_icon} alt="Cart" />
              {cartItemCount > 0 && <span className="cart-counter">{cartItemCount}</span>}
            </Link>
          </div>
          
          {!token ? (
            <button 
              className="signin-button" 
              ref={buttonRef} 
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
          ) : (
            <div className="navbar-profile" onClick={toggleProfileDropdown}>
              <img src={assets.profile_icon} alt="Profile" />
              
              {profileDropdownOpen && (
                <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-item" onClick={() => {
                    navigate("/myorders");
                    setProfileDropdownOpen(false);
                  }}>
                    <img src={assets.bag_icon} alt="Orders" />
                    <span>My Orders</span>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <div className="dropdown-item" >
                    <img src={assets.logout_icon} alt="Logout" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;