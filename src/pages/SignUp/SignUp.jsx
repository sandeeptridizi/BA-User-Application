import './SignUp.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuShield } from 'react-icons/lu';
import { TbDeviceMobile } from 'react-icons/tb';
import { FaArrowRight } from 'react-icons/fa6';
import { GoPerson } from 'react-icons/go';
import { MdOutlineEmail } from 'react-icons/md';
import { LuBuilding2 } from 'react-icons/lu';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

import companyLogo from '../../assets/company-logo.png';
import api from '../../../lib/api';
import useAppContext from '../../context/AppContext';

const SignUp = () => {
  const navigate = useNavigate();
  const {
    setOpenAuthenticationModal,
    setPendingOtpPhone,
    setPendingOtpEmail,
    setPendingOtpChannel,
    setPendingOtpPayload,
  } = useAppContext();

  const [tab, setTab] = useState('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (tab === 'phone') {
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
          password,
          businessName: businessName.trim() || undefined,
          channel: 'phone',
        });
        setPendingOtpPayload({
          phone,
          name: name.trim(),
          email: email.trim(),
          password,
          businessName: businessName.trim(),
          channel: 'phone',
        });
        setPendingOtpPhone(phone);
        setPendingOtpEmail(null);
        setPendingOtpChannel('phone');
        setOpenAuthenticationModal(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to send OTP');
      } finally {
        setLoading(false);
      }
    } else {
      // Email tab: phone is optional
      const digits = phoneDigits.replace(/\D/g, '');
      const phone = digits.length === 10 ? '91' + digits : undefined;
      setLoading(true);
      try {
        await api.post('/api/user/otp/send', {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          businessName: businessName.trim() || undefined,
          phone,
          channel: 'email',
        });
        setPendingOtpPayload({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          businessName: businessName.trim(),
          phone,
          channel: 'email',
        });
        setPendingOtpEmail(email.trim().toLowerCase());
        setPendingOtpPhone(null);
        setPendingOtpChannel('email');
        setOpenAuthenticationModal(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to send OTP');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='sign-up-container'>
      <div className='sign-up-main-container'>
        <div className='sign-up-header'>
          <img src={companyLogo} alt='company' className='company-logo-img' />
          <p className='sign-up-text'>
            <LuShield className='sign-up-shield-icon' /> Start Selling Luxury
            Products
          </p>
          <div className='sign-up-tags-container'>
            <div className='tag1'></div>
            <div className='tag2'></div>
          </div>
        </div>

        <div className='auth-tabs auth-tabs-purple'>
          <button
            className={`auth-tab ${tab === 'email' ? 'auth-tab-active auth-tab-active-purple' : ''}`}
            onClick={() => { setTab('email'); setError(''); }}
            type='button'
          >
            <MdOutlineEmail /> With Email
          </button>
          <button
            className={`auth-tab ${tab === 'phone' ? 'auth-tab-active auth-tab-active-purple' : ''}`}
            onClick={() => { setTab('phone'); setError(''); }}
            type='button'
          >
            <TbDeviceMobile /> With Phone
          </button>
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
            <label className='label-name'>Password *</label>
            <div className='sign-in-icon-container'>
              <FiLock className='mobile-icon' />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password (min 6 characters)'
                className='sign-in-input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type='button'
                className='password-toggle-btn'
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px' }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className='sign-in-label-container'>
            <label className='label-name'>
              Mobile Number {tab === 'phone' ? '*' : '(Optional)'}
            </label>
            <div className='sign-in-icon-container'>
              <TbDeviceMobile className='mobile-icon' />
              <p>+91</p>
              <input
                type='text'
                placeholder='Enter 10-digit mobile number'
                className='sign-in-input'
                value={phoneDigits}
                onChange={(e) =>
                  setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 10))
                }
                maxLength={10}
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

          {error && <p className='sign-up-error'>{error}</p>}

          <button type='submit' className='sign-up-btn' disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}{' '}
            {tab === 'phone' ? 'to Phone' : 'to Email'} <FaArrowRight />
          </button>
        </form>
        <p className='sign-up-account'>
          Already have an account?{' '}
          <span onClick={() => navigate('/sign-in')}>Log In</span>
        </p>
        <p className='sign-in-footer'>
          &copy; 2026 Billionaire Auction. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
