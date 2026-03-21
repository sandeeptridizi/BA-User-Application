import './AuthenticationModal.css';

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

const AuthenticationModal = () => {
  const navigate = useNavigate();
  const {
    setOpenAuthenticationModal,
    pendingOtpPhone,
    setPendingOtpPhone,
    pendingOtpEmail,
    setPendingOtpEmail,
    pendingOtpChannel,
    setPendingOtpChannel,
    pendingOtpPayload,
    setPendingOtpPayload,
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
  const canResend = resendSec === 0 && pendingOtpPayload;

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const next = [...otp];
      digits.forEach((d, i) => { if (index + i < 6) next[index + i] = d; });
      setOtp(next);
      return;
    }
    const d = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = d;
    setOtp(next);
    if (d && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend || !pendingOtpPayload) return;
    setError('');
    try {
      await api.post('/api/user/otp/send', {
        name: pendingOtpPayload.name,
        email: pendingOtpPayload.email,
        phone: pendingOtpPayload.phone || undefined,
        businessName: pendingOtpPayload.businessName || undefined,
        channel: pendingOtpPayload.channel,
      });
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
      setOpenAuthenticationModal(false);
      setPendingOtpPhone(null);
      setPendingOtpEmail(null);
      setPendingOtpChannel('phone');
      setPendingOtpPayload(null);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setOpenAuthenticationModal(false);
    setPendingOtpPhone(null);
    setPendingOtpEmail(null);
    setPendingOtpChannel('phone');
    setPendingOtpPayload(null);
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
            <LuShield className='auth-shield-icon' /> Start Selling Luxury
            Properties
          </div>
          <div className='auth-tags-container'>
            <div className='tag2'></div>
            <div className='tag1'></div>
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
          <p className='auth-change-num' onClick={handleBack}>
            {pendingOtpChannel === 'phone' ? 'Change number' : 'Change email'}
          </p>
          <div className='otp-numbers-container'>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                id={`otp-${i}`}
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
          <p className='auth-time'>
            {resendSec > 0 ? (
              <>Resend OTP in <span className='seconds'>{resendSec}</span>s</>
            ) : canResend ? (
              <span className='auth-resend' onClick={handleResend}>Resend OTP</span>
            ) : null}
          </p>
        </div>
        <button
          className='modal-btn'
          onClick={handleVerify}
          disabled={otpValue.length !== 6 || loading}
        >
          <FaRegCheckCircle /> {loading ? 'Verifying...' : 'Verify & Create Account'}
        </button>
        <div className='modal-footer'>
          &copy; 2026 Billionaire Auction. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthenticationModal;
