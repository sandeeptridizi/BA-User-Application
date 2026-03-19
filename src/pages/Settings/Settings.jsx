import './Settings.css';
import { IoSettingsOutline } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { FiUser } from "react-icons/fi";
import { MdStar } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { SlLocationPin } from "react-icons/sl";
import { LuCrown } from "react-icons/lu";
import { BsStars } from "react-icons/bs";
import { CiCircleCheck } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa6";
import { GoArrowUpRight } from "react-icons/go";
import { IoLockClosedOutline } from "react-icons/io5";
import { FiShield } from "react-icons/fi";
import api from '../../../lib/api';
import { setUser as saveUserToStorage } from '../../../lib/auth';
import { getFile } from '../../../lib/s3';

const getFirstLast = (name) => {
  if (!name || typeof name !== 'string') return { first: '', last: '' };
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return { first: parts[0], last: parts.slice(1).join(' ') };
  return { first: parts[0] || '', last: '' };
};

const PLAN_LABELS = { NONE: 'Basic', BASIC: 'Premium', PRO: 'Pro', ELITE: 'Enterprise' };
const PLAN_PRICES = { BASIC: 4999, PRO: 6999, ELITE: 14999 };

const Settings = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', city: '', state: '' });
    const [paymentLoading, setPaymentLoading] = useState(null); // tracks which plan is being paid for
    const [uploadingPic, setUploadingPic] = useState(null); // 'uploading' | 'removing' | null
    const picInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/api/user/me');
                const user = res.data?.data;
                setProfile(user);
                const { first, last } = getFirstLast(user?.name);
                setForm({
                    firstName: first,
                    lastName: last,
                    phone: user?.phone || '',
                    city: user?.city || '',
                    state: user?.state || '',
                });
            } catch {
                // fallback silent
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaveMsg('');
        try {
            const fullName = [form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(' ');
            const res = await api.patch('/api/user/me', {
                name: fullName,
                phone: form.phone.trim(),
                city: form.city.trim(),
                state: form.state.trim(),
            });
            const updated = res.data?.data;
            setProfile(updated);
            saveUserToStorage(updated);
            setEditing(false);
            setSaveMsg('Profile updated successfully!');
            setTimeout(() => setSaveMsg(''), 3000);
        } catch (err) {
            setSaveMsg(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleProfilePicUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !profile?.id) return;
        setUploadingPic('uploading');
        try {
            const ext = file.name.split('.').pop();
            const key = `profiles/${profile.id}_${Date.now()}.${ext}`;
            const presignedRes = await api.get(`/api/media/presigned?key=${encodeURIComponent(key)}`);
            const { url, key: s3Key } = presignedRes.data.data;
            await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
            const updateRes = await api.patch('/api/user/me/profile-picture', { key: s3Key });
            const updated = updateRes.data?.data;
            setProfile(updated);
            saveUserToStorage(updated);
        } catch {
            setSaveMsg('Failed to upload profile picture');
            setTimeout(() => setSaveMsg(''), 3000);
        } finally {
            setUploadingPic(null);
            e.target.value = '';
        }
    };

    const handleRemoveProfilePic = async () => {
        setUploadingPic('removing');
        try {
            const res = await api.delete('/api/user/me/profile-picture');
            const updated = res.data?.data;
            setProfile(updated);
            saveUserToStorage(updated);
        } catch {
            setSaveMsg('Failed to remove profile picture');
            setTimeout(() => setSaveMsg(''), 3000);
        } finally {
            setUploadingPic(null);
        }
    };

    const handleSubscribe = async (plan) => {
        if (paymentLoading) return;
        setPaymentLoading(plan);

        try {
            // 1. Create order on backend
            const orderRes = await api.post('/api/subscription/create-order', { plan });
            const { orderId, amount, currency, keyId } = orderRes.data.data;

            // 2. Open Razorpay checkout
            const options = {
                key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount,
                currency,
                name: 'Billionaire Auctions',
                description: `${PLAN_LABELS[plan]} - Annual Subscription`,
                order_id: orderId,
                prefill: {
                    name: profile?.name || '',
                    email: profile?.email || '',
                    contact: profile?.phone || '',
                },
                handler: async (response) => {
                    try {
                        // 3. Verify payment on backend
                        const verifyRes = await api.post('/api/subscription/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        const updatedUser = verifyRes.data.data;
                        setProfile(updatedUser);
                        saveUserToStorage(updatedUser);
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

    const currentPlan = profile?.subscriptionPlan || 'NONE';
    const isActive = profile?.subscriptionStatus === 'ACTIVE';

    const getPlanButtonLabel = (plan) => {
        if (paymentLoading === plan) return 'Processing...';
        if (!isActive || currentPlan === 'NONE') return `Subscribe to ${PLAN_LABELS[plan]}`;
        const planOrder = ['NONE', 'BASIC', 'PRO', 'ELITE'];
        const currentIndex = planOrder.indexOf(currentPlan);
        const targetIndex = planOrder.indexOf(plan);
        if (currentIndex === targetIndex) return null; // current plan
        if (targetIndex > currentIndex) return `Upgrade to ${PLAN_LABELS[plan]}`;
        return `Switch to ${PLAN_LABELS[plan]}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const { first: firstName, last: lastName } = getFirstLast(profile?.name);
    const memberSince = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—';

    return <div className='settingscontainer'>
        <div className='settingsheader'>
            <h1><IoSettingsOutline />Account Settings</h1>
            <p>Manage your account preferences and membership</p>
        </div>
        <ul className='activitycat1'>
            <li className={`catmenu4 ${activeTab === "profile" ? "active-profile" : ""}`}onClick={() => setActiveTab("profile")}>Profile</li>
            <li className={`catmenu4 ${activeTab === "membership" ? "active-membership" : ""}`}onClick={() => setActiveTab("membership")}>Membership</li>
            <li className={`catmenu4 ${activeTab === "security" ? "active-security" : ""}`}onClick={() => setActiveTab("security")}>Security</li>
        </ul>
        {activeTab === "profile" && (
            <div className='profileinformation'>
                <div className='profileinformationtop'>
                    <h2>Personal Information</h2>
                    <p>Update your personal details and contact information</p>
                </div>
                {loading ? (
                    <p style={{ padding: '20px' }}>Loading profile...</p>
                ) : (
                <>
                <div className='profileinfo'>
                    <div className='profile-avatar-wrap'>
                        <div className='profileinfoicon'>
                            {profile?.profilePicture ? (
                                <img src={getFile(profile.profilePicture)} alt="Profile" className='profile-pic-img' />
                            ) : (
                                <FiUser />
                            )}
                            <span
                                onClick={() => !uploadingPic && picInputRef.current?.click()}
                                style={{ cursor: uploadingPic ? 'not-allowed' : 'pointer' }}
                                title={uploadingPic === 'uploading' ? 'Uploading...' : 'Change photo'}
                            >
                                <IoSettingsOutline />
                            </span>
                            <input ref={picInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePicUpload} />
                        </div>
                        {profile?.profilePicture && (
                            <button
                                className='remove-pic-btn'
                                onClick={handleRemoveProfilePic}
                                disabled={!!uploadingPic}
                            >
                                {uploadingPic === 'removing' ? 'Removing...' : 'Remove Photo'}
                            </button>
                        )}
                    </div>
                    <div className='profileinfodetails'>
                        <h3>{profile?.name || '—'}</h3>
                        <p>Member Since {memberSince}</p>
                        <span><MdStar />{isActive ? PLAN_LABELS[currentPlan] || 'Pro Member' : 'Free Member'}</span>
                    </div>
                </div>
                {saveMsg && <p style={{ padding: '10px 20px', color: saveMsg.includes('success') ? 'green' : 'red' }}>{saveMsg}</p>}
                {editing ? (
                    <>
                    <div className='profileinfoname'>
                        <div className='profileinfonaming'>
                            <p>First Name</p>
                            <input
                                type='text'
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                className='settings-input'
                            />
                        </div>
                        <div className='profileinfonaming'>
                            <p>Last Name</p>
                            <input
                                type='text'
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                className='settings-input'
                            />
                        </div>
                    </div>
                    <div className='profileotherdetails'>
                        <p>Email Address</p>
                        <h3><MdOutlineMail />{profile?.email || '—'}</h3>
                    </div>
                    <div className='profileotherdetails'>
                        <p>Phone Number</p>
                        <input
                            type='tel'
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder='Enter phone number'
                            className='settings-input'
                        />
                    </div>
                    <div className='profileinfoname'>
                        <div className='profileinfonaming'>
                            <p>City</p>
                            <input
                                type='text'
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                placeholder='Enter city'
                                className='settings-input'
                            />
                        </div>
                        <div className='profileinfonaming'>
                            <p>State</p>
                            <input
                                type='text'
                                value={form.state}
                                onChange={(e) => setForm({ ...form, state: e.target.value })}
                                placeholder='Enter state'
                                className='settings-input'
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', padding: '0 20px 20px' }}>
                        <div className='savechanges' onClick={handleSave} style={{ opacity: saving ? 0.6 : 1 }}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </div>
                        <div className='savechanges' onClick={() => {
                            setEditing(false);
                            setForm({ firstName, lastName, phone: profile?.phone || '', city: profile?.city || '', state: profile?.state || '' });
                        }} style={{ background: '#eee', color: '#333' }}>
                            Cancel
                        </div>
                    </div>
                    </>
                ) : (
                    <>
                    <div className='profileinfoname'>
                        <div className='profileinfonaming'>
                            <p>First Name</p>
                            <h3>{firstName || '—'}</h3>
                        </div>
                        <div className='profileinfonaming'>
                            <p>Last Name</p>
                            <h3>{lastName || '—'}</h3>
                        </div>
                    </div>
                    <div className='profileotherdetails'>
                        <p>Email Address</p>
                        <h3><MdOutlineMail />{profile?.email || '—'}</h3>
                    </div>
                    <div className='profileotherdetails'>
                        <p>Phone Number</p>
                        <h3><LuPhone />{profile?.phone ? `+91 ${profile.phone.replace(/^91/, '').trim()}` : '—'}</h3>
                    </div>
                    <div className='profileotherdetails'>
                        <p>Location</p>
                        <h3><SlLocationPin />{[profile?.city, profile?.state].filter(Boolean).join(', ') || '—'}</h3>
                    </div>
                    <div className='savechanges' onClick={() => setEditing(true)}>Edit Profile</div>
                    </>
                )}
                </>
                )}
            </div>)}
        {activeTab === "membership" && (<div className='membershipinformation'>
            <div className='currentmemebership'>
                <div className='currentmemebershiptop'>
                    <div className='currentmemebershipleft'>
                        <div className='currentmembershipicon'><LuCrown /></div>
                        <div className='currentmembershipplan'>
                            <h3><BsStars />Your Active Plan</h3>
                            <h2>{isActive ? PLAN_LABELS[currentPlan] || 'Pro Seller' : 'Free Plan'}</h2>
                            <p>Unlock premium features and grow your business</p>
                        </div>
                    </div>
                    <div className='currentmembershipactive'>{profile?.subscriptionStatus || 'INACTIVE'}</div>
                </div>
                <div className='plandetails'>
                    <div className='planinfodetails'>
                        <div className='planinfodetailstop'>
                            <p>Annual Cost</p>
                            <span className='planinfoicon'><MdStar /></span>
                        </div>
                        <h2>{isActive && currentPlan !== 'NONE' ? PLAN_PRICES[currentPlan]?.toLocaleString('en-IN') : '—'}</h2>
                        <p>{isActive ? 'Billed annually' : '—'}</p>
                    </div>
                    <div className='planinfodetails1'>
                        <div className='planinfodetailstop'>
                            <p>Active Listings</p>
                            <span className='planinfoicon1'><CiCircleCheck /></span>
                        </div>
                        <h2>{currentPlan === 'BASIC' ? '3 / mo' : currentPlan === 'PRO' ? '9 / mo' : currentPlan === 'ELITE' ? 'Custom' : '—'}</h2>
                        <p>{isActive ? 'After Mar 2027' : '—'}</p>
                    </div>
                    <div className='planinfodetails2'>
                        <div className='planinfodetailstop'>
                            <p>Valid Until</p>
                            <span className='planinfoicon2'><LuCrown /></span>
                        </div>
                        <h2>{formatDate(profile?.subscriptionEndDate)}</h2>
                        <p>{isActive ? 'Auto-renew' : '—'}</p>
                    </div>
                </div>
                <div className='renewalinformation'>
                    <div className='renewalinfoleft'>
                        <p>Next Renewal Date</p>
                        <h2>{formatDate(profile?.subscriptionEndDate)}</h2>
                    </div>
                    {isActive && currentPlan !== 'NONE' && (
                        <div
                            className='renewbutton'
                            onClick={() => handleSubscribe(currentPlan)}
                            style={{ opacity: paymentLoading ? 0.6 : 1, cursor: paymentLoading ? 'not-allowed' : 'pointer' }}
                        >
                            {paymentLoading === currentPlan ? 'Processing...' : 'Renew Now'}
                        </div>
                    )}
                </div>
            </div>
            <div className='benefits'>
                <div className='benefitstop'>
                    <h2>Your {isActive ? PLAN_LABELS[currentPlan] : 'Pro'} Benefits</h2>
                    <p>Everything included in your current plan</p>
                </div>
                <div className='benefitsinfo'>
                    <div className='benefitsinforow'>
                        <div className='benefitsinfo1'>
                            <div className='benefitsinfo1icon'><CiCircleCheck /></div>
                            <div className='benefitsinfo1details'>
                                <h3>{currentPlan === 'ELITE' ? 'Custom' : currentPlan === 'PRO' ? '9 / month' : currentPlan === 'BASIC' ? '3 / month' : '1 / month'} Listings</h3>
                                <p>{currentPlan === 'ELITE' ? 'Custom listing quota' : 'After Mar 2027; unlimited till then'}</p>
                            </div>
                        </div>
                        <div className='benefitsinfo2'>
                            <div className='benefitsinfo2icon'><CiCircleCheck /></div>
                            <div className='benefitsinfo1details'>
                                <h3>{currentPlan === 'ELITE' ? 'Priority Support' : currentPlan === 'PRO' ? 'Priority Support Line' : 'Email Support'}</h3>
                                <p>{currentPlan === 'PRO' || currentPlan === 'ELITE' ? 'Dedicated priority customer service' : 'Email-based customer support'}</p>
                            </div>
                        </div>
                    </div>
                    <div className='benefitsinforow'>
                        <div className='benefitsinfo3'>
                            <div className='benefitsinfo3icon'><CiCircleCheck /></div>
                            <div className='benefitsinfo1details'>
                                <h3>{currentPlan === 'ELITE' ? '2 / month Featured' : currentPlan === 'PRO' ? '2 Featured Listings' : 'No Featured Listings'}</h3>
                                <p>{currentPlan === 'PRO' || currentPlan === 'ELITE' ? 'Get your properties highlighted' : 'Upgrade to Pro for featured slots'}</p>
                            </div>
                        </div>
                        <div className='benefitsinfo4'>
                            <div className='benefitsinfo4icon'><CiCircleCheck /></div>
                            <div className='benefitsinfo1details'>
                                <h3>{currentPlan === 'ELITE' ? '2 / month Recommended' : currentPlan === 'PRO' ? '1 Recommended Listing' : 'No Recommended Slots'}</h3>
                                <p>{currentPlan === 'PRO' || currentPlan === 'ELITE' ? 'Boosted visibility in search' : 'Upgrade to Pro for recommended slots'}</p>
                            </div>
                        </div>
                    </div>
                    <div className='benefitsinforow'>
                        <div className='benefitsinfo5'>
                            <div className='benefitsinfo5icon'><CiCircleCheck /></div>
                            <div className='benefitsinfo1details'>
                                <h3>{currentPlan === 'ELITE' ? '40 Leads / listing' : currentPlan === 'PRO' ? '30 Leads / listing' : currentPlan === 'BASIC' ? '20 Leads / listing' : '10 Leads / listing'}</h3>
                                <p>Buyer contact unlocks per listing</p>
                            </div>
                        </div>
                        <div className='benefitsinfo6'>
                            <div className='benefitsinfo6icon'><CiCircleCheck /></div>
                            <div className='benefitsinfo1details'>
                                <h3>{currentPlan === 'PRO' || currentPlan === 'ELITE' ? 'High Search Visibility' : currentPlan === 'BASIC' ? 'Medium Search Visibility' : 'Standard Search Visibility'}</h3>
                                <p>Your listings rank {currentPlan === 'PRO' || currentPlan === 'ELITE' ? 'higher' : 'as standard'} in search results</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='upgradeplans'>
                <h2>{isActive ? 'Change Plan' : 'Choose a Plan'}</h2>
                <p>Choose a plan that fits your business needs</p>
                <div className='upgradeplandetails'>
                    <div className='basicplan'>
                        <div className='basicplanicon'><FaRegStar /></div>
                        <h2>Premium</h2>
                        <p>Great for growing sellers</p>
                        <h3>₹4,999<span>/year + GST</span></h3>
                        <ul>
                            <li><CiCircleCheck className='basicplanlisticon'/>3 Listings / month (after Mar 2027)</li>
                            <li><CiCircleCheck className='basicplanlisticon'/>20 Leads / listing</li>
                            <li><CiCircleCheck className='basicplanlisticon'/>Medium Search Visibility</li>
                            <li><CiCircleCheck className='basicplanlisticon'/>Email Support</li>
                        </ul>
                        {currentPlan === 'BASIC' && isActive ? (
                            <div className='currentbutton'><CiCircleCheck />You're on this plan</div>
                        ) : (
                            <div
                                className='downgradebutton'
                                onClick={() => handleSubscribe('BASIC')}
                                style={{ opacity: paymentLoading ? 0.6 : 1, cursor: paymentLoading ? 'not-allowed' : 'pointer' }}
                            >
                                {getPlanButtonLabel('BASIC')}
                            </div>
                        )}
                    </div>
                    <div className='proplan'>
                        <div className='proplanicon'><LuCrown /></div>
                        <h2>Pro</h2>
                        <p>Most Popular Choice</p>
                        <h3>₹6,999<span>/year + GST</span></h3>
                        <ul>
                            <li><CiCircleCheck className='proplanlisticon'/>9 Listings / month (after Mar 2027)</li>
                            <li><CiCircleCheck className='proplanlisticon'/>30 Leads / listing</li>
                            <li><CiCircleCheck className='proplanlisticon'/>2 Featured + 1 Recommended</li>
                            <li><CiCircleCheck className='proplanlisticon'/>High Search Visibility</li>
                            <li><CiCircleCheck className='proplanlisticon'/>Priority Support Line</li>
                        </ul>
                        {currentPlan === 'PRO' && isActive ? (
                            <div className='currentbutton'><CiCircleCheck />You're on this plan</div>
                        ) : (
                            <div
                                className='upgradebutton'
                                onClick={() => handleSubscribe('PRO')}
                                style={{ opacity: paymentLoading ? 0.6 : 1, cursor: paymentLoading ? 'not-allowed' : 'pointer' }}
                            >
                                <GoArrowUpRight />{getPlanButtonLabel('PRO')}
                            </div>
                        )}
                    </div>
                    <div className='eliteplan'>
                        <div className='eliteplanicon'><BsStars /></div>
                        <h2>Enterprise</h2>
                        <p>For high-volume sellers</p>
                        <h3>₹14,999<span>/year + GST</span></h3>
                        <ul>
                            <li><CiCircleCheck className='eliteplanlisticon'/>Custom Listings / month</li>
                            <li><CiCircleCheck className='eliteplanlisticon'/>40+ Leads / listing</li>
                            <li><CiCircleCheck className='eliteplanlisticon'/>Featured & Recommended slots</li>
                            <li><CiCircleCheck className='eliteplanlisticon'/>Priority Support</li>
                        </ul>
                        {currentPlan === 'ELITE' && isActive ? (
                            <div className='currentbutton'><CiCircleCheck />You're on this plan</div>
                        ) : (
                            <div
                                className='upgradebutton'
                                onClick={() => handleSubscribe('ELITE')}
                                style={{ opacity: paymentLoading ? 0.6 : 1, cursor: paymentLoading ? 'not-allowed' : 'pointer' }}
                            >
                                <GoArrowUpRight />{getPlanButtonLabel('ELITE')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='needhelp'>
                <h2>Need help choosing?</h2>
                <p>Compare all plans side-by-side or contact our sales team</p>
                <div className='finalctas'>
                    <span className='comparision'>View Detailed Comparison</span>
                    <span className='contactsales'>Contact Sales Team</span>
                </div>
            </div>
        </div>)}
        {activeTab === "security" && (<div className='securityinformation'>
                <div className='profileinformationtop'>
                    <h2>Security Settings</h2>
                    <p>Manage your password and security preferences</p>
                </div>
                <div className='profileotherdetails'>
                    <p>Current Password</p>
                    <h3><IoLockClosedOutline  />Enter current password</h3>
                </div>
                <div className='profileotherdetails'>
                    <p>New Password</p>
                    <h3><IoLockClosedOutline  />Enter new password</h3>
                </div>
                <div className='profileotherdetails'>
                    <p>Confirm New Password</p>
                    <h3><IoLockClosedOutline  />Enter new password</h3>
                </div>
                <div className='savechanges'><FiShield />Update Password</div>
            </div>)}
    </div>;
};

export default Settings;
