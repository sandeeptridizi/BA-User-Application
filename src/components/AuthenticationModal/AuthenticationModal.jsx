import './AuthenticationModal.css';

import companyLogo from '../../assets/company-logo.png';

import { LuShield } from 'react-icons/lu';
import { CiMobile2 } from 'react-icons/ci';
import { FaRegCheckCircle } from 'react-icons/fa';

const AuthenticationModal = () => {
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
            <FaRegCheckCircle />
          </div>
          <h3 className='otp-heading'>Enter OTP</h3>
          <div>
            <p className='code'>Enter the 6-digit code sent to</p>
            <p className='mobile-num'>+91 8989899898</p>
          </div>
          <p className='auth-change-num'>Change number</p>
          <div className='otp-numbers-container'>
            <div className='otp-num'></div>
            <div className='otp-num'></div>
            <div className='otp-num'></div>
            <div className='otp-num'></div>
            <div className='otp-num'></div>
            <div className='otp-num'></div>
          </div>
          <p className='auth-time'>
            Resend OTP in <span className='seconds'>27</span>s
          </p>
        </div>
        <button className='modal-btn'>
          <FaRegCheckCircle /> Verify & Create Account
        </button>
        <div className='modal-tag-container'>
          <span>Demo Mode: </span>Enter any 6-digit OTP to create account
        </div>
        <div className='modal-footer'>
          © 2026 Billionaire Auction. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthenticationModal;
