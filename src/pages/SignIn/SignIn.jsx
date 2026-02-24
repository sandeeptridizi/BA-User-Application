import './SignIn.css';

import { LuShield } from 'react-icons/lu';
import { TbDeviceMobile } from 'react-icons/tb';
import { BiCheckCircle } from 'react-icons/bi';
import { FaArrowRight } from 'react-icons/fa6';

import companyLogo from '../../assets/company-logo.png';

const SignIn = () => {
  return (
    <div className='sign-in-container'>
      <div className='sign-in-main-container'>
        <div className='sign-in-header'>
          <img src={companyLogo} alt='company' className='company-img' />
          <div className='sign-in-heading'>
            <LuShield className='shield-icon' /> Seller Portal - Sign In
          </div>
        </div>
        <div className='sign-in-form-container'>
          <div className='sign-in-label-container'>
            <label className='label-name'>Mobile Number</label>
            <div className='sign-in-icon-container'>
              <TbDeviceMobile className='mobile-icon' />
              <p>+91</p>
              <input
                type='text'
                placeholder='Enter 10-digit mobile number'
                className='sign-in-input'
              />
            </div>
            <p className='sign-in-text'>
              We'll send you a 6-digit OTP to verify your number
            </p>
          </div>
        </div>
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
        <button className='sign-in-btn'>
          Send OTP <FaArrowRight />
        </button>
        <p className='sign-in-account'>
          Don't have an account? <span>Sign Up</span>
        </p>
        <p className='sign-in-footer'>
          © 2026 Billionaire Auction. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
