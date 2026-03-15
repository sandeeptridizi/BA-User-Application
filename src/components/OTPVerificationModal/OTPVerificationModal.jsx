import './OTPVerificationModal.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import companyLogo from '../../assets/company-logo.png';
import { LuShield } from 'react-icons/lu';
import { CiMobile2 } from 'react-icons/ci';
import { MdOutlineEmail } from 'react-icons/md';
import { FaRegCheckCircle } from 'react-icons/fa';
import useAppContext from '../../context/AppContext';
import api from '../../../lib/api';
import { setToken, setUser } from '../../../lib/auth';

const RESEND_COOLDOWN_SEC = 60;

const formatPhone = (phone) => {
  if (!phone) return '';
  const d = phone.replace(/\D/g, '').slice(-10);
  return d.length === 10 ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : phone;
};

const OTPVerificationModal = () => {
  const navigate = useNavigate();
  const {
    setOpenVerificationModal,
    pendingOtpPhone,
    setPendingOtpPhone,
    pendingOtpEmail,
    setPendingOtpEmail,
    pendingOtpChannel,
    setPendingOtpChannel,
  } = useAppContext();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendSec, setResendSec] = useState(RESEND_COOLDOWN_SEC);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isOpen = pendingOtpPhone || pendingOtpEmail;

  useEffect(() => {
    if (!isOpen) return;
    const t = setInterval(() => {
      setResendSec((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [isOpen]);

  const otpValue = otp.join('');
  const canResend = resendSec === 0;

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const next = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) next[index + i] = d;
      });
      setOtp(next);
      return;
    }
    const d = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = d;
    setOtp(next);
    if (d && index < 5) document.getElementById(`otp-signin-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-signin-${index - 1}`)?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError('');
    try {
      if (pendingOtpChannel === 'phone') {
        await api.post('/api/user/otp/send-login', { phone: pendingOtpPhone, channel: 'phone' });
      } else {
        await api.post('/api/user/otp/send-login', { email: pendingOtpEmail, channel: 'email' });
      }
      setResendSec(RESEND_COOLDOWN_SEC);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const handleVerify = async () => {
    if (otpValue.length !== 6) return;
    setError('');
    setLoading(true);
    try {
      const payload =
        pendingOtpChannel === 'phone'
          ? { phone: pendingOtpPhone, otp: otpValue, channel: 'phone' }
          : { email: pendingOtpEmail, otp: otpValue, channel: 'email' };
      const { data } = await api.post('/api/user/otp/verify', payload);
      setToken(data.token);
      setUser(data.user);
      setOpenVerificationModal(false);
      setPendingOtpPhone(null);
      setPendingOtpEmail(null);
      setPendingOtpChannel('phone');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setOpenVerificationModal(false);
    setPendingOtpPhone(null);
    setPendingOtpEmail(null);
    setPendingOtpChannel('phone');
  };

  if (!isOpen) return null;

  const sentTo =
    pendingOtpChannel === 'phone'
      ? formatPhone(pendingOtpPhone)
      : pendingOtpEmail;

  return (
    <div className='modal'>
      <div className='overlay'></div>
      <div className='modal-content'>
        <div className='modal-header'>
          <img src={companyLogo} alt='company' className='modal-logo' />
          <div className='modal-text'>
            <LuShield className='modal-shield-icon' /> Seller Portal - Sign In
          </div>
        </div>
        <div className='modal-otp-container'>
          <div className='modal-mobile-icon-container'>
            {pendingOtpChannel === 'phone' ? <CiMobile2 /> : <MdOutlineEmail />}
          </div>
          <h3 className='otp-heading'>Verify OTP</h3>
          <div>
            <p className='code'>Enter the 6-digit code sent to</p>
            <p className='mobile-num'>{sentTo}</p>
          </div>
          <p className='change-num' onClick={handleBack}>
            {pendingOtpChannel === 'phone' ? 'Change number' : 'Change email'}
          </p>
          <div className='otp-numbers-container'>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                id={`otp-signin-${i}`}
                type='text'
                inputMode='numeric'
                maxLength={6}
                className='otp-num otp-input'
                value={otp[i]}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>
          {error && <p className='modal-error'>{error}</p>}
          <p className='time'>
            {resendSec > 0 ? (
              <>
                Resend OTP in <span>{resendSec}</span>s
              </>
            ) : (
              <span className='resend-link' onClick={handleResend}>
                Resend OTP
              </span>
            )}
          </p>
        </div>
        <button
          className='modal-btn'
          onClick={handleVerify}
          disabled={otpValue.length !== 6 || loading}
        >
          <FaRegCheckCircle /> {loading ? 'Verifying...' : 'Verify & Login'}
        </button>
        <div className='modal-footer'>
          &copy; 2026 Billionaire Auction. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;
