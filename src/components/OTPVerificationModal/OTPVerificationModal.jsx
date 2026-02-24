import './OTPVerificationModal.css';

import companyLogo from '../../assets/company-logo.png';

import { LuShield } from 'react-icons/lu';
import { CiMobile2 } from 'react-icons/ci';
import { FaRegCheckCircle } from 'react-icons/fa';

const OTPVerificationModal = () => {
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
            <CiMobile2 />
          </div>
          <h3 className='otp-heading'>Verify OTP</h3>
          <div>
            <p className='code'>Enter the 6-digit code sent to</p>
            <p className='mobile-num'>+91 8985622510</p>
          </div>
          <p className='change-num'>Change number</p>
          <div className='otp-numbers-container'>
            <div className='otp-num'></div>
            <div className='otp-num'></div>
            <div className='otp-num'></div>
            <div className='otp-num'></div>
            <div className='otp-num'></div>
            <div className='otp-num'></div>
          </div>
          <p className='time'>
            Resend OTP in <span>29</span>s
          </p>
        </div>
        <button className='modal-btn'>
          <FaRegCheckCircle /> Verify & Login
        </button>
        <div className='modal-tag-container'>
          <span>Demo Mode: </span>Enter any 6-digit OTP to login
        </div>
        <div className='modal-footer'>
          © 2026 Billionaire Auction. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;
