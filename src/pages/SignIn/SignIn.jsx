import './SignIn.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuShield } from 'react-icons/lu';
import { TbDeviceMobile } from 'react-icons/tb';
import { MdOutlineEmail } from 'react-icons/md';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaArrowRight } from 'react-icons/fa6';
import api from '../../../lib/api';
import { setToken, setUser } from '../../../lib/auth';

const SignIn = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState('phone');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    let payload;
    if (tab === 'phone') {
      const digits = phoneDigits.replace(/\D/g, '');
      if (digits.length !== 10) {
        setError('Enter a valid 10-digit mobile number');
        return;
      }
      payload = { phone: '91' + digits, password };
    } else {
      if (!email.trim()) {
        setError('Enter a valid email address');
        return;
      }
      payload = { email: email.trim().toLowerCase(), password };
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/user/login', payload);
      setToken(data.token);
      setUser(data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='sign-in-container'>
      <div className='sign-in-main-container'>
        <div className='sign-in-header'>
          <div className='sign-in-heading'>
            <LuShield className='shield-icon' /> Log In
          </div>
        </div>

        <div className='auth-tabs'>
          <button
            className={`auth-tab ${tab === 'phone' ? 'auth-tab-active' : ''}`}
            onClick={() => { setTab('phone'); setError(''); }}
            type='button'
          >
            <TbDeviceMobile /> With Phone
          </button>
          <button
            className={`auth-tab ${tab === 'email' ? 'auth-tab-active' : ''}`}
            onClick={() => { setTab('email'); setError(''); }}
            type='button'
          >
            <MdOutlineEmail /> With Email
          </button>
        </div>

        <form className='sign-in-form-container' onSubmit={handleSubmit}>
          {tab === 'phone' ? (
            <div className='sign-in-label-container'>
              <label className='label-name'>Mobile Number</label>
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
          ) : (
            <div className='sign-in-label-container'>
              <label className='label-name'>Email Address</label>
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
          )}

          <div className='sign-in-label-container'>
            <label className='label-name'>Password</label>
            <div className='sign-in-icon-container'>
              <FiLock className='mobile-icon' />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
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

          {error && <p className='sign-in-error'>{error}</p>}
          <button type='submit' className='sign-in-btn' disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'} <FaArrowRight />
          </button>
        </form>
        <p className='sign-in-account'>
          Don't have an account?{' '}
          <span onClick={() => navigate('/sign-up')}>Sign Up</span>
        </p>
        <p className='sign-in-footer'>
          &copy; 2026 Billionaire Auction. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
