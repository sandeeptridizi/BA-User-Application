import './SignIn.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuShield } from 'react-icons/lu';
import { TbDeviceMobile } from 'react-icons/tb';
import { BiCheckCircle } from 'react-icons/bi';
import { FaArrowRight } from 'react-icons/fa6';

import companyLogo from '../../assets/company-logo.png';
import api from '../../../lib/api';
import useAppContext from '../../context/AppContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { setOpenVerificationModal, setPendingOtpPhone } = useAppContext();
  const [phoneDigits, setPhoneDigits] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const digits = phoneDigits.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    const phone = '91' + digits;
    setLoading(true);
    try {
      await api.post('/api/user/otp/send-login', { phone });
      setPendingOtpPhone(phone);
      setOpenVerificationModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='sign-in-container'>
      <div className='sign-in-main-container'>
        <div className='sign-in-header'>
          <img src={companyLogo} alt='company' className='company-img' />
          <div className='sign-in-heading'>
            <LuShield className='shield-icon' /> Seller Portal - Sign In
          </div>
        </div>
        <form className='sign-in-form-container' onSubmit={handleSubmit}>
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
            <p className='sign-in-text'>
              We'll send you a 6-digit OTP to verify your number
            </p>
          </div>
          {error && <p className='sign-in-error'>{error}</p>}
          <div className='sign-in-points-container'>
            <div className='points-header'>
              <BiCheckCircle className='points-icon' /> Why OTP Login?
            </div>
            <div className='points-container'>
              <div className='point-container'>
                <div className='points-circle'></div> Secure & passwordless
                authentication
              </div>
              <div className='point-container'>
                <div className='points-circle'></div> Quick access to your seller
                dashboard
              </div>
              <div className='point-container'>
                <div className='points-circle'></div> No need to remember
                passwords
              </div>
            </div>
          </div>
          <button type='submit' className='sign-in-btn' disabled={loading}>
            {loading ? 'Sending…' : 'Send OTP'} <FaArrowRight />
          </button>
        </form>
        <p className='sign-in-account'>
          Don't have an account?{' '}
          <span onClick={() => navigate('/sign-up')}>Sign Up</span>
        </p>
        <p className='sign-in-footer'>
          © 2026 Billionaire Auction. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
