import './Settings.css';
import { IoSettingsOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
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

const getFirstLast = (name) => {
  if (!name || typeof name !== 'string') return { first: '', last: '' };
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return { first: parts[0], last: parts.slice(1).join(' ') };
  return { first: parts[0] || '', last: '' };
};

const Settings = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', city: '', state: '' });

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

    const { first: firstName, last: lastName } = getFirstLast(profile?.name);
    const memberSince = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
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
                    <div className='profileinfoicon'><FiUser /><span><IoSettingsOutline /></span></div>
                    <div className='profileinfodetails'>
                        <h3>{profile?.name || '—'}</h3>
                        <p>Member Since {memberSince}</p>
                        <span><MdStar />{profile?.subscriptionStatus === 'ACTIVE' ? 'Pro Member' : 'Free Member'}</span>
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
                            <h2>{profile?.subscriptionStatus === 'ACTIVE' ? 'Pro Seller' : 'Free Plan'}</h2>
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
                        <h2>9,999</h2>
                        <p>Billed annually</p>
                    </div>
                    <div className='planinfodetails1'>
                        <div className='planinfodetailstop'>
                            <p>Active Listings</p>
                            <span className='planinfoicon1'><CiCircleCheck /></span>
                        </div>
                        <h2>—</h2>
                        <p>—</p>
                    </div>
                    <div className='planinfodetails2'>
                        <div className='planinfodetailstop'>
                            <p>Valid Until</p>
                            <span className='planinfoicon2'><LuCrown /></span>
                        </div>
                        <h2>—</h2>
                        <p>—</p>
                    </div>
                </div>
                <div className='renewalinformation'>
                    <div className='renewalinfoleft'>
                        <p>Next Renewal Date</p>
                        <h2>—</h2>
                    </div>
                    <div className='renewbutton'>Renew Now</div>
                </div>
            </div>
            <div className='benefits'>
                <div className='benefitstop'>
                    <h2>Your Pro Benefits</h2>
                    <p>Everything included in your current plan</p>
                </div>
                <div className='benefitsinfo'>
                    <div className='benefitsinforow'>
                        <div className='benefitsinfo1'>
                            <div className='benefitsinfo1icon'><CiCircleCheck /></div>
                            <div className='benefitsinfo1details'>
                                <h3>50 Active Listings</h3>
                                <p>List up to 50 properties simultaneously</p>
                            </div>
                        </div>
                        <div className='benefitsinfo2'>
                            <div className='benefitsinfo2icon'><CiCircleCheck /></div>
                            <div className='benefitsinfo1details'>
                                <h3>Priority Support</h3>
                                <p>24/7 dedicated customer service</p>
                            </div>
                        </div>
                    </div>
                    <div className='benefitsinforow'>
                        <div className='benefitsinfo3'>
                            <div className='benefitsinfo3icon'><CiCircleCheck /></div>
                            <div className='benefitsinfo1details'>
                                <h3>Featured Listings</h3>
                                <p>Get your properties highlighted</p>
                            </div>
                        </div>
                        <div className='benefitsinfo4'>
                            <div className='benefitsinfo4icon'><CiCircleCheck /></div>
                            <div className='benefitsinfo1details'>
                                <h3>Verified Badge</h3>
                                <p>Build trust with buyers instantly</p>
                            </div>
                        </div>
                    </div>
                    <div className='benefitsinforow'>
                        <div className='benefitsinfo5'>
                            <div className='benefitsinfo5icon'><CiCircleCheck /></div>
                            <div className='benefitsinfo1details'>
                                <h3>Analytics Dashboard</h3>
                                <p>Track views, leads & performance</p>
                            </div>
                        </div>
                        <div className='benefitsinfo6'>
                            <div className='benefitsinfo6icon'><CiCircleCheck /></div>
                            <div className='benefitsinfo1details'>
                                <h3>Fast Approval</h3>
                                <p>Listings approved within 2 hours</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='upgradeplans'>
                <h2>Upgrade Plans</h2>
                <p>Choose a plan that fits your business needs</p>
                <div className='upgradeplandetails'>
                    <div className='basicplan'>
                        <div className='basicplanicon'><FaRegStar /></div>
                        <h2>Basic</h2>
                        <p>Perfect for getting started</p>
                        <h3>₹2,999<span>/year</span></h3>
                        <ul>
                            <li><CiCircleCheck className='basicplanlisticon'/>15 Active Listings</li>
                            <li><CiCircleCheck className='basicplanlisticon'/>Email Support</li>
                            <li><CiCircleCheck className='basicplanlisticon'/>Basic Analytics</li>
                            <li><CiCircleCheck className='basicplanlisticon'/>Standard Approval (24hrs)</li>
                        </ul>
                        <div className='downgradebutton'>Downgrade to Basic</div>
                    </div>
                    <div className='proplan'>
                        <div className='proplanicon'><LuCrown /></div>
                        <h2>Pro Seller</h2>
                        <p>Most Popular Choice</p>
                        <h3>₹9,999<span>/year</span></h3>
                        <ul>
                            <li><CiCircleCheck className='proplanlisticon'/>50 Active Listings</li>
                            <li><CiCircleCheck className='proplanlisticon'/>Priority 24/7 Support</li>
                            <li><CiCircleCheck className='proplanlisticon'/>Featured Listings</li>
                            <li><CiCircleCheck className='proplanlisticon'/>Fast Approval (2hrs)</li>
                            <li><CiCircleCheck className='proplanlisticon'/>Verified Badge</li>
                            <li><CiCircleCheck className='proplanlisticon'/>Advanced Analytics</li>
                        </ul>
                        <div className='currentbutton'><CiCircleCheck />You're on this plan</div>
                    </div>
                    <div className='eliteplan'>
                        <div className='eliteplanicon'><LuCrown /></div>
                        <h2>Elite</h2>
                        <p>Ultimate seller experience</p>
                        <h3>₹24,999<span>/year</span></h3>
                        <ul>
                            <li><CiCircleCheck className='eliteplanlisticon'/>Unlimited Listings</li>
                            <li><CiCircleCheck className='eliteplanlisticon'/>Dedicated Account Manager</li>
                            <li><CiCircleCheck className='eliteplanlisticon'/>Premium Featured Listings</li>
                            <li><CiCircleCheck className='eliteplanlisticon'/>Instant Approval</li>
                            <li><CiCircleCheck className='eliteplanlisticon'/>Elite Verified Badge</li>
                            <li><CiCircleCheck className='eliteplanlisticon'/>Premium Analytics & Reports</li>
                             <li><CiCircleCheck className='eliteplanlisticon'/>Priority Placement</li>
                        </ul>
                        <div className='upgradebutton'><GoArrowUpRight  />Upgrade to Elite</div>
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
