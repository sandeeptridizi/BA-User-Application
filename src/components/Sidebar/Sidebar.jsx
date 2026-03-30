import './Sidebar.css';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import companyLogo from '../../assets/company-logo.png';
import { getUser, logout as doLogout } from '../../../lib/auth';
import { getFile } from '../../../lib/s3';

import { LuLayoutDashboard } from 'react-icons/lu';
import { FiShoppingBag } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { FiTarget } from 'react-icons/fi';
import { FiMessageSquare, FiHeart } from 'react-icons/fi';
import { BiHome } from 'react-icons/bi';

const linksData = [
  {
    id: 1,
    icon: <BiHome />,
    title: 'Home',
    link: 'https://billionaireauction.com/',
  },
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
      <Link to='https://billionaireauction.com' className='sidebar-logo-container' onClick={() => setActiveLink('dashboard')}>
        <img
          src={companyLogo}
          alt='Billionaire Auction'
          className='company-logo'
        />
      </Link>
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
          <div className={`admin-icon-container ${user?.profilePicture ? 'admin-icon-has-pic' : ''}`}>
            {user?.profilePicture ? (
              <img src={getFile(user.profilePicture)} alt='Profile' className='admin-icon-img' />
            ) : (
              getInitials(user?.name)
            )}
          </div>
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
