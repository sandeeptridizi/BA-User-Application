import './SignUp.css';

import { LuShield } from 'react-icons/lu';
import { TbDeviceMobile } from 'react-icons/tb';
import { FaArrowRight } from 'react-icons/fa6';
import { BiCheckCircle } from 'react-icons/bi';
import { GoPerson } from 'react-icons/go';
import { MdOutlineEmail } from 'react-icons/md';
import { LuBuilding2 } from 'react-icons/lu';

import companyLogo from '../../assets/company-logo.png';

const SignUp = () => {
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
        <div className='sign-in-form-container'>
          <div className='sign-in-label-container'>
            <label className='label-name'>Full Name *</label>
            <div className='sign-in-icon-container'>
              <GoPerson className='mobile-icon' />
              <input
                type='text'
                placeholder='Enter your full name'
                className='sign-in-input'
              />
            </div>
          </div>
          <div className='sign-in-label-container'>
            <label className='label-name'>Email Address *</label>
            <div className='sign-in-icon-container'>
              <MdOutlineEmail className='mobile-icon' />
              <input
                type='text'
                placeholder='your.email@example.com'
                className='sign-in-input'
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
              />
            </div>
          </div>
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
          </div>
        </div>
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
        <button className='sign-up-btn'>
          Send OTP <FaArrowRight />
        </button>
        <p className='sign-up-account'>
          Already have an account? <span>Sign In</span>
        </p>
        <p className='sign-in-footer'>
          © 2026 Billionaire Auction. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
