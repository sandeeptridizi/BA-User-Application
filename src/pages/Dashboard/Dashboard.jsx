import './Dashboard.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegStar } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { GoArrowUpRight } from "react-icons/go";
import { FiMessageSquare } from "react-icons/fi";
import { LuAward } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa6";
import { BsLightningCharge } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { LuCrown } from "react-icons/lu";
import { getUser } from '../../../lib/auth';
import api from '../../../lib/api';
import { getMyEnquiries } from '../../../lib/enquiries';

const PLAN_LABELS = { BASIC: 'Premium', PRO: 'Pro', ELITE: 'Enterprise' };

const CATEGORY_LABELS = {
  REAL_ESTATE: 'Real Estate', CARS: 'Cars', BIKES: 'Bikes', FURNITURE: 'Furniture',
  JEWELLERY_AND_WATCHES: 'Jewellery & Watches', ARTS_AND_PAINTINGS: 'Arts & Paintings',
  ANTIQUES: 'Antiques', COLLECTABLES: 'Collectables',
};

const statusTagClass = { NEW: 'buyertag', IN_PROGRESS: 'progresstag', RESOLVED: 'respondedtag', CLOSED: 'respondedtag' };
const statusTagText = { NEW: 'New', IN_PROGRESS: 'In progress', RESOLVED: 'Responded', CLOSED: 'Closed' };

function formatCurrency(value) {
  if (!value && value !== 0) return '₹0';
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function daysAgo(dateStr) {
  if (!dateStr) return '';
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'Posted today';
  return `Posted ${days} day${days > 1 ? 's' : ''} ago`;
}

const DashboardPage = () => {
    const user = getUser();
    const userId = user?.id || user?.userId || user?._id;
    const displayName = user?.name || 'User';
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingEnquiries, setLoadingEnquiries] = useState(true);

    useEffect(() => {
      api.get('/api/user/me').then(res => setProfile(res.data?.data)).catch(() => {});
    }, []);

    useEffect(() => {
      if (!userId) return;
      const fetchProducts = async () => {
        try {
          const res = await api.get('/api/product', { params: { ownerId: userId } });
          const raw = res?.data?.data || [];
          const mine = raw.filter(p => p.ownerId === userId || p.owner?.id === userId);
          setProducts(mine.length > 0 ? mine : raw);
        } catch (err) {
          console.error('Failed to fetch products', err);
        } finally {
          setLoadingProducts(false);
        }
      };
      const fetchEnquiries = async () => {
        try {
          const res = await getMyEnquiries({ page: 1, limit: 5 });
          setEnquiries(res.data || []);
        } catch (err) {
          console.error('Failed to fetch enquiries', err);
        } finally {
          setLoadingEnquiries(false);
        }
      };
      fetchProducts();
      fetchEnquiries();
    }, [userId]);

    const currentPlan = profile?.subscriptionPlan;
    const isActive = profile?.subscriptionStatus === 'ACTIVE';
    const planLabel = isActive && currentPlan && currentPlan !== 'NONE' ? PLAN_LABELS[currentPlan] : null;

    const totalListings = products.length;
    const activeListings = products.filter(p => p.approvalStatus === 'APPROVED');
    const activeLeads = enquiries.length;

    const recentProducts = activeListings.slice(0, 4);
    const recentEnquiries = enquiries.slice(0, 5);

    return <div className='dashboardcontainer'>
        <div className='dashboardheader'>
            <div className='dashboardheaddetails'>
                <h1>Welcome Back, {displayName}!</h1>
                <p>Manage your property listings and track buyer inquiries</p>
                <div className='headertags'>
                {planLabel && <span className='protag'><FaRegStar /> {planLabel} Seller</span>}
                <span className='verifiedtag'><CiCircleCheck />Verified Seller</span></div>
            </div>
            <button className='addnewlisting' onClick={() => navigate('/productcreation/marketplace')}><FaPlus />Add New Listing</button>
        </div>
        <div className='dashboardstats'>
            <div className='mylistings'>
                <div className='mylistingstop'>
                    <p className='mylistingsname'>My Listings</p>
                    <span><FiBox /></span>
                </div>
                <h2 className='dashboardstatnum'>{loadingProducts ? '...' : totalListings}</h2>
                <p className='dashboardstatcta' onClick={() => navigate('/products')} style={{cursor:'pointer'}}>View Details <GoArrowUpRight /></p>
            </div>
        </div>
        {/* <div className='performancemetrics'>
            <div className='performancementricshead'>
                <p className='performancemetricstitle'><LuAward className='performancemetricsicon'/>Performance Metrics</p>
                <p className='performancemetricsnote'>Your selling performance this month</p>
            </div>
            <div className='performancestats'>
                <div className='perfromstat'>
                    <p>Response Rate</p>
                    <div className='performvalue'>
                        <h2 className='performvaluenum'>94%</h2>
                        <span className='performvaluegrowth'>+5%</span>
                    </div>
                </div>
                <div className='perfromstat'>
                    <p>Avg. Response Time</p>
                    <div className='performvalue'>
                        <h2 className='performvaluenum1'>2.3 hrs</h2>
                        <span className='performvaluegrowth1'>-0.5hrs</span>
                    </div>
                </div>
                <div className='perfromstat'>
                    <p>Conversion Rate</p>
                    <div className='performvalue'>
                        <h2 className='performvaluenum2'>28%</h2>
                        <span className='performvaluegrowth2'>+8%</span>
                    </div>
                </div>
                <div className='perfromstat'>
                    <p>Customer Rating</p>
                    <div className='performvalue'>
                        <h2 className='performvaluenum3'>4.8</h2>
                        <span className='performvaluegrowth3'>+0.2</span>
                    </div>
                </div>
            </div>
        </div> */}
        <div className='activelistings'>
            <div className='activelistingshead'>
                <div className='activelistingsheader'>
                <p className='performancemetricstitle'><FiBox className='activelistingsicon'/>My Active Listings</p>
                <p className='performancemetricsnote'>Manage and monitor your property listings</p></div>
                <span className='viewalllistings' onClick={() => navigate('/products')} style={{cursor:'pointer'}}>View All Listings</span>
            </div>
            <div className='activelistingslist'>
                {loadingProducts ? (
                    <p style={{padding:'20px'}}>Loading listings...</p>
                ) : recentProducts.length === 0 ? (
                    <p style={{padding:'20px'}}>No active listings yet.</p>
                ) : recentProducts.map(product => (
                    <div className='listingcontainer' key={product.id} onClick={() => navigate(`/productpage/${product.id}`)} style={{cursor:'pointer'}}>
                        <div className='listingcontainertop'>
                            <div className='listingcontainerleft'>
                                <div className='headertags'>
                                <span className='categorytag'>{CATEGORY_LABELS[product.category] || product.category}</span>
                                <span className='verifiedtag1'>Active</span></div>
                                <h2>{product.title}</h2>
                                <p>{daysAgo(product.createdAt)}</p>
                            </div>
                            <div className='listingcontainerright'>{formatCurrency(product.value)}</div>
                        </div>
                        {/* <div className='listingcontainerbottom'>
                            <div className='listingproductstat'>
                                <span><FaRegEye  /></span>
                                <h3>{getViews(product.meta).toLocaleString('en-IN')}</h3>
                                <p>Views</p>
                            </div>
                            <div className='listingproductstat1'>
                                <span><FiMessageSquare  /></span>
                                <h3>—</h3>
                                <p>Leads</p>
                            </div>
                            <div className='listingproductstat2'>
                                <span><FaArrowTrendUp   /></span>
                                <h3>—</h3>
                                <p>Interest</p>
                            </div>
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
        {/* <div className='buyerenquiries'>
            <div className='activelistingshead1'>
                <div className='activelistingsheader'>
                <p className='performancemetricstitle'><FiMessageSquare className='enquiriesicon'/>Recent Buyer Enquiries</p>
                <p className='performancemetricsnote'>New leads received on your listings</p></div>
                <span className='viewallleads' onClick={() => navigate('/myleads')} style={{cursor:'pointer'}}>View All Leads</span>
            </div>
            <div className='enquiriesdetails'>
                {loadingEnquiries ? (
                    <p style={{padding:'20px'}}>Loading enquiries...</p>
                ) : recentEnquiries.length === 0 ? (
                    <p style={{padding:'20px'}}>No enquiries yet.</p>
                ) : recentEnquiries.map(enq => (
                    <div className='enquiryinfo' key={enq.id}>
                        <div className='enquiryinfoleft'>
                            <span className='buyerprofile'>{enq.visitorName?.charAt(0).toUpperCase()}</span>
                            <ul className='buyerdetails'>
                                <li className='buyername'>{enq.visitorName} <span className={statusTagClass[enq.status] || 'buyertag'}>{statusTagText[enq.status]}</span></li>
                                <li className='buyerproduct'>{enq.product?.title || 'Unknown Product'}</li>
                                <li className='buyertime'>{timeAgo(enq.createdAt)}</li>
                            </ul>
                        </div>
                        <span className='respondtag' onClick={() => navigate('/myleads')} style={{cursor:'pointer'}}>Respond</span>
                    </div>
                ))}
            </div>
        </div> */}
        {/* <div className='supporttickets'>
            <div className='supportticketsheader'>
                <p className='performancemetricstitle'><FaRegBell  className='ticketsicon'/>Support Tickets</p>
                <p className='performancemetricsnote'>Manage your support tickets</p></div>
            <div className='enquiriesdetails'>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile1'>T</span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Payment gateway issue <span className='respondedtag'>Resolved</span></li>
                            <li className='buyertime'>15 Feb 2026</li>
                        </ul>
                    </div>
                    <span className='ticketviewtag'>View</span>
                </div>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile1'>T</span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Buyer inquiry not showing <span className='progresstag'>In Progress</span></li>
                            <li className='buyertime'>16 Feb 2026</li>
                        </ul>
                    </div>
                    <span className='ticketviewtag'>View</span>
                </div>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile1'>T</span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Featured listing request <span className='buyertag'>Open</span></li>
                            <li className='buyertime'>17 Feb 2026</li>
                        </ul>
                    </div>
                    <span className='ticketviewtag'>View</span>
                </div>
            </div>
        </div> */}
        <div className='quickactions'>
            <div className='quickactionsheader'>
                <p className='performancemetricstitle'><BsLightningCharge className='actionsicon'/>Quick Actions</p>
                <p className='performancemetricsnote'>Perform common tasks quickly</p></div>
            <div className='enquiriesdetails'>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile2'><FaPlus /></span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Create Listing</li>
                            <li className='buyertime'>Add a new property</li>
                        </ul>
                    </div>
                    <span className='quickactiontag' onClick={() => navigate('/productcreation/marketplace')} style={{cursor:'pointer'}}>Go</span>
                </div>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile2'><LuUsers /></span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>View Leads</li>
                            <li className='buyertime'>Check buyer inquiries</li>
                        </ul>
                    </div>
                    <span className='quickactiontag' onClick={() => navigate('/myleads')} style={{cursor:'pointer'}}>Go</span>
                </div>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile2'><FaRegCircleQuestion /></span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Contact Support</li>
                            <li className='buyertime'>Get help & assistance</li>
                        </ul>
                    </div>
                    <span className='quickactiontag' onClick={() => navigate('/enquiry')} style={{cursor:'pointer'}}>Go</span>
                </div>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile2'><LuCrown  /></span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Membership</li>
                            <li className='buyertime'>Upgrade your plan</li>
                        </ul>
                    </div>
                    <span className='quickactiontag' onClick={() => navigate('/settings')} style={{cursor:'pointer'}}>Go</span>
                </div>
            </div>
        </div>
    </div>;
};

export default DashboardPage;
