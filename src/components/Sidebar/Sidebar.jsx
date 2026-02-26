import './Sidebar.css';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import companyLogo from '../../assets/company-logo.png';
import { getUser, logout as doLogout } from '../../../lib/auth';

import { LuLayoutDashboard } from 'react-icons/lu';
import { FiShoppingBag } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { FiTarget } from 'react-icons/fi';
import { FiMessageSquare } from 'react-icons/fi';

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

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'UP';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(
    linksData[0].title.toLowerCase(),
  );
  const user = getUser();

  const handleLogout = () => {
    doLogout();
    navigate('/sign-in');
  };

  return (
    <div className='sidebar-container'>
      <div className='sibebar-logo-container'>
        <img
          src={companyLogo}
          alt='Billionaire Auction'
          className='company-logo'
        />
      </div>
      <div className='sidebar-links-container'>
        {linksData.map((item) => {
          const { id, icon, title, link } = item;
          return (
            <Link to={link}>
              <div
                className={
                  activeLink === title.toLowerCase()
                    ? 'link-container active-link'
                    : 'link-container'
                }
                key={id}
                onClick={() => setActiveLink(title.toLowerCase())}
              >
                {icon} {title}
              </div>
            </Link>
          );
        })}
      </div>
      <div className='sidebar-admin-logout-container'>
        <div className='admin-container'>
          <div className='admin-icon-container'>{getInitials(user?.name)}</div>
          <div className='admin-content-container'>
            <p className='admin-title'>{user?.name || 'User Profile'}</p>
            <p className='admin-mail'>{user?.email || '—'}</p>
          </div>
          <div className='admin-online-container'></div>
        </div>
      </div>
      <button type='button' className='logout-container' onClick={handleLogout}>
        <MdLogout className='logout-icon' /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
