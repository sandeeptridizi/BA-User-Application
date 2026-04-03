import './PricingPlans.css';
import { useState, useEffect, useRef } from "react";
import api from '../../../lib/api';
import { getUser, setUser as saveUserToStorage } from '../../../lib/auth';

import { LuStar } from 'react-icons/lu';
import { LuCrown } from 'react-icons/lu';
import { TiFlashOutline } from 'react-icons/ti';
import { BsCurrencyRupee } from 'react-icons/bs';
import { LuShield } from 'react-icons/lu';
import { RxCross2 } from 'react-icons/rx';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { MdCurrencyRupee } from 'react-icons/md';
import { FiAward } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa6';
import { GoPeople } from 'react-icons/go';
import { FiCamera } from 'react-icons/fi';
import { RiCoupon3Line } from 'react-icons/ri';

function parseFeatures(features) {
  const map = {};
  for (const f of features) {
    const idx = f.indexOf(':');
    if (idx !== -1) {
      map[f.slice(0, idx)] = f.slice(idx + 1);
    } else {
      map[f] = true;
    }
  }
  return map;
}

function formatPrice(num) {
  return num.toLocaleString('en-IN');
}

const PricingPlans = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [bannerAds, setBannerAds] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [leadUnlocks, setLeadUnlocks] = useState([]);
  const [digitalMedia, setDigitalMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const [profile, setProfile] = useState(null);

  const mainPlans = subscriptionPlans.filter(p => !p.title.startsWith('Enterprise'));
  const enterprisePlans = subscriptionPlans.filter(p => p.title.startsWith('Enterprise'));

  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedEnterprise, setSelectedEnterprise] = useState(null);
  const [step, setStep] = useState(0);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null); // { code, discount, finalAmount, originalAmount, discountType, discountValue }
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponTarget, setCouponTarget] = useState(null); // package to apply coupon to

  const sliderRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [subRes, bannerRes, featuredRes, leadRes, digitalRes, profileRes] = await Promise.all([
          api.get('/api/package/public?category=SUBSCRIPTION_PLAN'),
          api.get('/api/package/public?category=BANNER_AD'),
          api.get('/api/package/public?category=FEATURED_LISTING'),
          api.get('/api/package/public?category=LEAD_UNLOCK'),
          api.get('/api/package/public?category=DIGITAL_MEDIA'),
          api.get('/api/user/me').catch(() => null),
        ]);

        setSubscriptionPlans(subRes.data.data || []);
        setBannerAds(bannerRes.data.data || []);
        setFeaturedListings(featuredRes.data.data || []);
        setLeadUnlocks(leadRes.data.data || []);

        const dm = digitalRes.data.data;
        if (dm && dm.length > 0) setDigitalMedia(dm[0]);

        if (profileRes?.data?.data) {
          setProfile(profileRes.data.data);
          saveUserToStorage(profileRes.data.data);
        }

        const banners = bannerRes.data.data || [];
        if (banners.length) setSelectedAd(banners[0]);

        const featured = featuredRes.data.data || [];
        if (featured.length) setSelectedPackage(featured[0]);

        const subs = subRes.data.data || [];
        const ent = subs.filter(p => p.title.startsWith('Enterprise'));
        if (ent.length) setSelectedEnterprise(ent[0]);
      } catch (err) {
        console.error('Failed to fetch pricing data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(
      ".pricing-page-grid-item-container, .pricing-page-grid-item-two-container"
    );

    const handleScroll = () => {
      const center = container.offsetWidth / 2;
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(center - cardCenter);
        card.style.transform = distance < 120 ? "scale(1)" : "scale(0.9)";
      });
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const handleApplyCoupon = async (pkg) => {
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponLoading(true);
    try {
      const res = await api.post('/api/coupon/validate', {
        code: couponCode.trim(),
        amount: pkg.price,
      });
      setCouponApplied(res.data.data);
      setCouponTarget(pkg);
      setCouponError('');
    } catch (err) {
      setCouponApplied(null);
      setCouponTarget(null);
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponTarget(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleSubscribe = async (pkg) => {
    if (paymentLoading || pkg.price === 0) return;
    setPaymentLoading(pkg.id);

    try {
      const body = { packageId: pkg.id };
      if (couponApplied) {
        body.couponCode = couponApplied.code;
      }
      const orderRes = await api.post('/api/subscription/create-order', body);
      const { orderId, amount, currency, keyId } = orderRes.data.data;

      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'Billionaire Auction',
        description: `${pkg.title} - Monthly Subscription`,
        order_id: orderId,
        prefill: {
          name: profile?.name || '',
          email: profile?.email || '',
          contact: profile?.phone || '',
        },
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/api/subscription/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            const updatedUser = verifyRes.data.data;
            setProfile(updatedUser);
            saveUserToStorage(updatedUser);
            handleRemoveCoupon();
            alert('Subscription activated successfully!');
          } catch {
            alert('Payment was received but verification failed. Please contact support.');
          } finally {
            setPaymentLoading(null);
          }
        },
        modal: {
          ondismiss: () => setPaymentLoading(null),
        },
        theme: { color: '#939311' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        alert('Payment failed. Please try again.');
        setPaymentLoading(null);
      });
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
      setPaymentLoading(null);
    }
  };

  const selectedLead = leadUnlocks[step] || null;

  const planIcons = {
    'Basic': <LuStar className='pricing-star-icon' />,
    'Premium': <LuCrown className='pricing-star-icon' />,
    'PRO': <TiFlashOutline className='pricing-crown-icon' />,
  };

  const getButtonLabel = (pkg) => {
    if (paymentLoading === pkg.id) return 'Processing...';
    if (pkg.price === 0) return 'Current Plan';
    return 'Subscribe';
  };

  if (loading) {
    return (
      <div className='pricing-page-container'>
        <div className='pricing-page-background'>
          <h1 className='pricing-page-heading'>Flexible Pricing Plans</h1>
        </div>
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading pricing plans...</p>
      </div>
    );
  }

  return (
    <div className='pricing-page-container'>
      <div className='pricing-page-background'>
        <h1 className='pricing-page-heading'>Flexible Pricing Plans</h1>
        <p className='pricing-page-text'>
          Choose the perfect plan for your luxury marketplace needs
        </p>
        <p className='pricing-page-text'>
          * Plans applicable for Marketplace, Buy Now, and Auctions. For To-Let:
          Unlimited listings as of now
        </p>
      </div>

      <div className='coupon-section'>
        <div className='coupon-input-row'>
          <RiCoupon3Line className='coupon-icon' />
          <input
            type='text'
            className='coupon-input'
            placeholder='Enter coupon code'
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value.toUpperCase());
              if (couponApplied) handleRemoveCoupon();
              setCouponError('');
            }}
            disabled={!!couponApplied}
          />
          {couponApplied ? (
            <button className='coupon-remove-btn' onClick={handleRemoveCoupon}>Remove</button>
          ) : (
            <button
              className='coupon-apply-btn'
              onClick={() => {
                const target = mainPlans.find(p => p.price > 0) || enterprisePlans[0];
                if (target) handleApplyCoupon(target);
              }}
              disabled={!couponCode.trim() || couponLoading}
            >
              {couponLoading ? 'Checking...' : 'Apply'}
            </button>
          )}
        </div>
        {couponError && <p className='coupon-error'>{couponError}</p>}
        {couponApplied && (
          <div className='coupon-success'>
            <span className='coupon-success-badge'>
              {couponApplied.discountType === 'PERCENTAGE'
                ? `${couponApplied.discountValue}% OFF`
                : `₹${formatPrice(couponApplied.discountValue)} OFF`
              }
            </span>
            <span className='coupon-success-text'>
              Coupon <strong>{couponApplied.code}</strong> applied successfully
            </span>
          </div>
        )}
      </div>

      <div className='pricing-page-plans-container'>
        <div className='pricing-page-grid-container' ref={sliderRef}>

          {mainPlans.map((plan) => {
            const isPro = plan.title === 'PRO';
            const isFree = plan.price === 0;
            const hasDiscount = couponApplied && !isFree;
            let planDiscount = 0;
            if (hasDiscount) {
              if (couponApplied.discountType === 'PERCENTAGE') {
                planDiscount = Math.round((plan.price * couponApplied.discountValue) / 100);
                if (couponApplied.maxDiscount && planDiscount > couponApplied.maxDiscount) planDiscount = couponApplied.maxDiscount;
              } else {
                planDiscount = couponApplied.discountValue;
              }
              if (planDiscount > plan.price) planDiscount = plan.price;
            }
            const discountedPrice = hasDiscount ? plan.price - planDiscount : plan.price;
            return (
              <div
                key={plan.id}
                className={isPro ? 'pricing-page-grid-item-two-container' : 'pricing-page-grid-item-container'}
              >
                <div className='pricing-page-header'>
                  {planIcons[plan.title] || <LuStar className='pricing-star-icon' />}
                  <h3 className='pricing-heading'>{plan.title}</h3>
                  <h3 className='plan-price'>
                    <BsCurrencyRupee /> {hasDiscount ? formatPrice(discountedPrice) : formatPrice(plan.price)}
                  </h3>
                  {hasDiscount && (
                    <p className='pricing-original-price'>
                      <BsCurrencyRupee /> {formatPrice(plan.price)}
                    </p>
                  )}
                  <p className='pricing-text'>{isFree ? 'Free' : '+ GST'}</p>
                </div>
                <div className='pricing-page-list-container'>
                  {plan.features.map((f, i) => {
                    const idx = f.indexOf(':');
                    if (idx === -1) return null;
                    const label = f.slice(0, idx);
                    const value = f.slice(idx + 1);
                    return (
                      <div key={i} className='pricing-page-list-item-container'>
                        <p className='pricing-date'>{label}</p>
                        {value === 'None'
                          ? <RxCross2 className='cross-icon' />
                          : <span className='pricing-time'>{value}</span>
                        }
                      </div>
                    );
                  })}
                </div>
                <button
                  className={isPro ? 'pricing-popular-btn' : 'pricing-btn'}
                  onClick={() => !isFree && handleSubscribe(plan)}
                  disabled={paymentLoading === plan.id || isFree}
                  style={isFree ? { opacity: 0.6, cursor: 'default' } : {}}
                >
                  {getButtonLabel(plan)}
                </button>
                {isPro && <div className='most-poplular-container'>MOST POPULAR</div>}
              </div>
            );
          })}

          {enterprisePlans.length > 0 && selectedEnterprise && (
            <div className='pricing-page-grid-item-container'>
              <div className="enterprise-options">
                {enterprisePlans.map((plan) => (
                  <label key={plan.id} className="enterprise-option">
                    <input
                      type="radio"
                      name="enterprisePlan"
                      checked={selectedEnterprise.id === plan.id}
                      onChange={() => setSelectedEnterprise(plan)}
                    />
                    {plan.title}
                  </label>
                ))}
              </div>
              <div className='pricing-page-header'>
                <LuShield className='pricing-star-icon' />
                <h3 className='pricing-heading'>{selectedEnterprise.title}</h3>
                <h3 className='plan-price'>
                  <BsCurrencyRupee /> {couponApplied ? formatPrice((() => {
                    let d = 0;
                    if (couponApplied.discountType === 'PERCENTAGE') {
                      d = Math.round((selectedEnterprise.price * couponApplied.discountValue) / 100);
                      if (couponApplied.maxDiscount && d > couponApplied.maxDiscount) d = couponApplied.maxDiscount;
                    } else {
                      d = couponApplied.discountValue;
                    }
                    if (d > selectedEnterprise.price) d = selectedEnterprise.price;
                    return selectedEnterprise.price - d;
                  })()) : formatPrice(selectedEnterprise.price)}
                </h3>
                {couponApplied && (
                  <p className='pricing-original-price'>
                    <BsCurrencyRupee /> {formatPrice(selectedEnterprise.price)}
                  </p>
                )}
                <p className='pricing-text'>+ GST</p>
              </div>
              <div className='pricing-page-list-container'>
                {selectedEnterprise.features.map((f, i) => {
                  const idx = f.indexOf(':');
                  if (idx === -1) return null;
                  const label = f.slice(0, idx);
                  const value = f.slice(idx + 1);
                  return (
                    <div key={i} className='pricing-page-list-item-container'>
                      <p className='pricing-date'>{label}</p>
                      <span className='pricing-time'>{value}</span>
                    </div>
                  );
                })}
              </div>
              <button
                className='pricing-btn'
                onClick={() => handleSubscribe(selectedEnterprise)}
                disabled={!!paymentLoading}
                style={paymentLoading ? { opacity: 0.6 } : {}}
              >
                {getButtonLabel(selectedEnterprise)}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pricing-options-flex">
        <div className='website-advertising-container'>
          <div className='website-advertising-header'>
            <HiOutlineSpeakerphone className='speaker-icon' />
            <h2 className='website-advertising-heading'>
              Website Advertising & Banners
            </h2>
            <p className='website-advertising-text'>
              Maximize your brand visibility with premium advertising placements
            </p>
            <p className='website-advertising-desc'>
              * 4 Ads for each category banner, uploadable through super admin panel
            </p>
          </div>

          {selectedAd && (
            <div className="website-advertising-selector">
              <div className="ad-options">
                {bannerAds.map((item) => (
                  <label key={item.id} className="ad-option">
                    <input
                      type="radio"
                      name="advertisement"
                      checked={selectedAd.id === item.id}
                      onChange={() => setSelectedAd(item)}
                    />
                    {item.title}
                  </label>
                ))}
              </div>

              <div className="website-grid-item-container">
                <div className="website-grid-item-icon-container">
                  <HiOutlineSpeakerphone />
                </div>
                <h3 className="website-grid-item-title">{selectedAd.title}</h3>
                <h2 className="website-grid-item-cost">
                  <MdCurrencyRupee />
                  {formatPrice(selectedAd.price)}
                </h2>
                <p className="month">/ month + GST</p>
                <button className="book-now-btn">Book Now</button>
              </div>
            </div>
          )}
        </div>

        <div className='packages-container'>
          <div className='packages-header'>
            <FiAward className='packages-award-icon' />
            <h2 className='packages-heading'>Featured Listing Packages</h2>
            <p className='packages-text'>
              Get 10x visibility and more leads with priority placement across
              relevant sections
            </p>
          </div>

          {selectedPackage && (
            <div className="packages-selector">
              <div className="package-options">
                {featuredListings.map((item) => (
                  <label key={item.id} className="package-option">
                    <input
                      type="radio"
                      name="package"
                      checked={selectedPackage.id === item.id}
                      onChange={() => setSelectedPackage(item)}
                    />
                    {item.title}
                  </label>
                ))}
              </div>

              <div className="packages-grid-item-container">
                <div className="number-container">{featuredListings.indexOf(selectedPackage) + 1}</div>
                <h3 className="package-item-heading">{selectedPackage.title}</h3>
                <h2 className="package-price">
                  <MdCurrencyRupee />
                  {formatPrice(selectedPackage.price)}
                </h2>
                <p className="gst">+ GST</p>
                <div className="package-list-container">
                  <div className="package-item-container">
                    <FaCheck className="package-check-icon" /> Priority Placement
                  </div>
                  <div className="package-item-container">
                    <FaCheck className="package-check-icon" /> 10x More Visibility
                  </div>
                  <div className="package-item-container">
                    <FaCheck className="package-check-icon" /> More Leads
                  </div>
                </div>
                <button className="select-package-btn">Select Package</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {leadUnlocks.length > 0 && (
        <div className='leads-container'>
          <div className='packages-header'>
            <GoPeople className='packages-award-icon' />
            <h2 className='packages-heading'>Lead Contacts Unlock</h2>
            <p className='packages-text'>
              Need more leads? Purchase additional contact unlocks
            </p>
          </div>
          <div className="leads-selector-container">
            <div className="slider-wrapper">
              <input
                type="range"
                min="0"
                max={leadUnlocks.length - 1}
                step="1"
                value={step}
                onChange={(e) => setStep(Number(e.target.value))}
                className="leads-slider"
              />
              <div className="slider-labels">
                {leadUnlocks.map((item, index) => {
                  const feat = parseFeatures(item.features);
                  return (
                    <span
                      key={item.id}
                      className={index === step ? "slider-label active" : "slider-label"}
                    >
                      {feat.Leads || item.title}
                    </span>
                  );
                })}
              </div>
            </div>

            {selectedLead && (() => {
              const feat = parseFeatures(selectedLead.features);
              const isFree = selectedLead.price === 0;
              return (
                <div className="leads-card">
                  {isFree && <div className="free-container">FREE</div>}
                  <p className="plan">{selectedLead.title}</p>
                  <h3 className="leads-heading">{feat.Leads || '—'} Leads</h3>
                  <h2 className="leads-cost">
                    {isFree
                      ? "Free"
                      : <><MdCurrencyRupee /> {formatPrice(selectedLead.price)}</>
                    }
                    {!isFree && <p className="leads-gst">+ GST</p>}
                  </h2>
                  <button className="leads-purchase-btn">
                    {isFree ? "Included" : "Purchase"}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {digitalMedia && (
        <div className='digital-media-container'>
          <div className='digital-media-icon-content-container'>
            <div className='digital-media-icon-container'>
              <FiCamera />
            </div>
            <div className='digital-media-content-container'>
              <h1 className='digital-media-heading'>{digitalMedia.title}</h1>
              <h2 className='digital-media-price'>₹{formatPrice(digitalMedia.price)} {digitalMedia.tag}</h2>
              <div className='digital-media-justify-container'>
                <div className='package-list-container'>
                  {digitalMedia.features.slice(0, 3).map((f, i) => (
                    <div key={i} className='package-item-container'>
                      <FaCheck className='package-check-icon' /> {f}
                    </div>
                  ))}
                </div>
                <div className='package-list-container'>
                  {digitalMedia.features.slice(3).map((f, i) => (
                    <div key={i} className='package-item-container'>
                      <FaCheck className='package-check-icon' /> {f}
                    </div>
                  ))}
                </div>
              </div>
              <button className='digital-media-btn'>
                Book Digital Media Package
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='pricing-page-footer-container'>
        <h2 className='pricing-page-footer-heading'>Ready to Get Started?</h2>
        <p className='pricing-page-footer-text'>
          Choose your plan and start listing on India's premier luxury
          marketplace
        </p>
        <div className='pricing-page-footer-btn-container'>
          <button className='pricing-footer-contact-btn'>Contact Sales</button>
          <button className='pricing-footer-features-btn'>
            View All Features
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
