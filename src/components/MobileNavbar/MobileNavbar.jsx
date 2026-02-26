import './MobileNavbar.css';

import { HiMenu } from 'react-icons/hi';

import companyLogo from '../../assets/company-logo.png';
import { useState } from 'react';

import { LuLayoutDashboard } from 'react-icons/lu';
import { FiShoppingBag } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { FiTarget } from 'react-icons/fi';
import { FiMessageSquare } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
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
    icon: <IoSettingsOutline />,
    title: 'Settings',
    link: 'settings',
  },
];

const MobileNavbar = () => {
  const navigate = useNavigate();
  const [showLinks, setShowLinks] = useState(false);
  const [activeLink, setActiveLink] = useState(
    linksData[0].title.toLowerCase(),
  );

  const handleLogout = () => {
    logout();
    setShowLinks(false);
    navigate('/sign-in');
  };

  return (
    <div className='mobile-navbar-container'>
      <img src={companyLogo} alt='company' className='mobile-logo' />
      <HiMenu
        className='mobile-menu-icon'
        onClick={() => setShowLinks(!showLinks)}
      />
      {showLinks && (
        <div
          className='mobile-nav-links-container'
          onClick={() => setShowLinks(!showLinks)}
        >
          {linksData.map((item) => {
            const { id, icon, title, link } = item;
            return (
              <Link to={link}>
                <div
                  className={
                    activeLink === title.toLowerCase()
                      ? 'mobile-link-container mobile-active-link'
                      : 'mobile-link-container'
                  }
                  key={id}
                  onClick={() => setActiveLink(title.toLowerCase())}
                >
                  {icon} {title}
                </div>
              </Link>
            );
          })}
          <div
            className='mobile-link-container mobile-logout'
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
          >
            <MdLogout /> Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
