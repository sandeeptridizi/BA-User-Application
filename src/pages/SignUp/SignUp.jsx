import './SignUp.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuShield } from 'react-icons/lu';
import { TbDeviceMobile } from 'react-icons/tb';
import { FaArrowRight } from 'react-icons/fa6';
import { BiCheckCircle } from 'react-icons/bi';
import { GoPerson } from 'react-icons/go';
import { MdOutlineEmail } from 'react-icons/md';
import { LuBuilding2 } from 'react-icons/lu';

import companyLogo from '../../assets/company-logo.png';
import api from '../../../lib/api';
import useAppContext from '../../context/AppContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { setOpenAuthenticationModal, setPendingOtpPhone, setPendingOtpPayload } =
    useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    const digits = phoneDigits.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    const phone = '91' + digits;
    setLoading(true);
    try {
      await api.post('/api/user/otp/send', {
        phone,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        businessName: businessName.trim() || undefined,
      });
      setPendingOtpPayload({ phone, name: name.trim(), email: email.trim(), businessName: businessName.trim() });
      setPendingOtpPhone(phone);
      setOpenAuthenticationModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='sign-up-container'>
      <div className='sign-up-main-container'>
        <div className='sign-up-header'>
          <img src={companyLogo} alt='company' className='company-logo-img' />
          <p className='sign-up-text'>
            <LuShield className='sign-up-shield-icon' /> Start Selling Luxury
            Properties
          </p>
          <div className='sign-up-tags-container'>
            <div className='tag1'></div>
            <div className='tag2'></div>
          </div>
        </div>
        <form className='sign-in-form-container' onSubmit={handleSubmit}>
          <div className='sign-in-label-container'>
            <label className='label-name'>Full Name *</label>
            <div className='sign-in-icon-container'>
              <GoPerson className='mobile-icon' />
              <input
                type='text'
                placeholder='Enter your full name'
                className='sign-in-input'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className='sign-in-label-container'>
            <label className='label-name'>Email Address *</label>
            <div className='sign-in-icon-container'>
              <MdOutlineEmail className='mobile-icon' />
              <input
                type='email'
                placeholder='your.email@example.com'
                className='sign-in-input'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className='sign-in-label-container'>
            <label className='label-name'>Business Name (Optional)</label>
            <div className='sign-in-icon-container'>
              <LuBuilding2 className='mobile-icon' />
              <input
                type='text'
                placeholder='Your business or company name'
                className='sign-in-input'
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
          </div>
          <div className='sign-in-label-container'>
            <label className='label-name'>Mobile Number *</label>
            <div className='sign-in-icon-container'>
              <TbDeviceMobile className='mobile-icon' />
              <p>+91</p>
              <input
                type='text'
                placeholder='Enter 10-digit mobile number'
                className='sign-in-input'
                value={phoneDigits}
                onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
              />
            </div>
          </div>
          {error && <p className='sign-up-error'>{error}</p>}
          <div className='sign-up-points-container'>
            <div className='sign-up-points-header'>
              <BiCheckCircle className='sign-up-points-icon' /> Seller Benifits
            </div>
            <div className='points-container'>
              <div className='point-container'>
                <div className='sign-up-points-circle'></div> Secure &
                passwordless authentication
              </div>
              <div className='point-container'>
                <div className='sign-up-points-circle'></div> Quick access to your
                seller dashboard
              </div>
              <div className='point-container'>
                <div className='sign-up-points-circle'></div> No need to remember
                passwords
              </div>
            </div>
          </div>
          <button type='submit' className='sign-up-btn' disabled={loading}>
            {loading ? 'Sending…' : 'Send OTP'} <FaArrowRight />
          </button>
        </form>
        <p className='sign-up-account'>
          Already have an account? <span onClick={() => navigate('/sign-in')}>Sign In</span>
        </p>
        <p className='sign-in-footer'>
          © 2026 Billionaire Auction. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
