import './MobileNavbar.css';

import companyLogo from '../../assets/company-logo.png';
import { useState, useEffect, useRef } from 'react';

import { LuLayoutDashboard } from 'react-icons/lu';
import { FiShoppingBag } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { FiTarget } from 'react-icons/fi';
import { FiMessageSquare, FiHeart } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../../lib/auth';

const linksData = [
  {
    id: 1,
    icon: <LuLayoutDashboard />,
    title: 'Dashboard',
    link: '/',
  },
  {
    id: 2,
    icon: <FiShoppingBag />,
    title: 'Products',
    link: 'products',
  },
  {
    id: 3,
    icon: <FiTarget />,
    title: 'My Leads',
    link: 'myleads',
  },
  {
    id: 4,
    icon: <FiMessageSquare />,
    title: 'Enquiry',
    link: 'enquiry',
  },
  {
    id: 5,
    icon: <FiHeart />,
    title: 'Wishlist',
    link: 'wishlist',
  },
  {
    id: 6,
    icon: <IoSettingsOutline />,
    title: 'Settings',
    link: 'settings',
  },
];

const MobileNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLinks, setShowLinks] = useState(false);
  const [activeLink, setActiveLink] = useState(
    linksData[0].title.toLowerCase(),
  );
  const menuRef = useRef(null);

  // Sync active link with current route
  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'dashboard';
    const match = linksData.find(
      (item) => item.link.replace('/', '') === path || (item.link === '/' && path === 'dashboard'),
    );
    if (match) setActiveLink(match.title.toLowerCase());
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowLinks(false);
      }
    };
    if (showLinks) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLinks]);

  const handleLogout = () => {
    logout();
    setShowLinks(false);
    navigate('/sign-in');
  };

  return (
    <div className='mobile-navbar-container' ref={menuRef}>
      {/* Gold accent line at top */}
      <div className='mobile-navbar-gold-accent'></div>

      <div className='mobile-navbar-inner'>
        <Link
          to='/'
          className='mobile-navbar-home-link'
          onClick={() => {
            setActiveLink('dashboard');
            setShowLinks(false);
          }}
        >
          <span className='mobile-navbar-home-text'>Home</span>
        </Link>

        <button
          className={`mobile-hamburger-btn ${showLinks ? 'mobile-hamburger-active' : ''}`}
          onClick={() => setShowLinks(!showLinks)}
          aria-label='Toggle menu'
        >
          <span className='mobile-hamburger-line'></span>
          <span className='mobile-hamburger-line'></span>
          <span className='mobile-hamburger-line'></span>
        </button>
      </div>

      {/* Backdrop overlay */}
      <div
        className={`mobile-nav-backdrop ${showLinks ? 'mobile-nav-backdrop-visible' : ''}`}
        onClick={() => setShowLinks(false)}
      ></div>

      {/* Dropdown menu */}
      <div className={`mobile-nav-links-container ${showLinks ? 'mobile-nav-links-open' : ''}`}>
        <div className='mobile-nav-links-header'>
          <img src={companyLogo} alt='BAuction' className='mobile-nav-menu-logo' />
          <div className='mobile-nav-links-divider'></div>
        </div>

        <div className='mobile-nav-links-list'>
          {linksData.map((item) => {
            const { id, icon, title, link } = item;
            return (
              <Link
                to={link}
                key={id}
                className='mobile-nav-link-anchor'
                onClick={() => {
                  setActiveLink(title.toLowerCase());
                  setShowLinks(false);
                }}
              >
                <div
                  className={
                    activeLink === title.toLowerCase()
                      ? 'mobile-link-container mobile-active-link'
                      : 'mobile-link-container'
                  }
                >
                  <span className='mobile-link-icon'>{icon}</span>
                  <span className='mobile-link-title'>{title}</span>
                  {activeLink === title.toLowerCase() && (
                    <span className='mobile-link-active-dot'></span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className='mobile-nav-links-divider'></div>

        <div
          className='mobile-link-container mobile-logout'
          onClick={(e) => {
            e.stopPropagation();
            handleLogout();
          }}
        >
          <span className='mobile-link-icon mobile-logout-icon'>
            <MdLogout />
          </span>
          <span className='mobile-link-title'>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
