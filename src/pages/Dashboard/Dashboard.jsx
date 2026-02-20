import './Dashboard.css';
import { FaRegStar } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { GoArrowUpRight } from "react-icons/go";
import { FaRegEye } from "react-icons/fa6";
import { FiMessageSquare } from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";
import { LuAward } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa6";
import { BsLightningCharge } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { LuCrown } from "react-icons/lu";
import { ImCross } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";





const DashboardPage = () => {
    return <div className='dashboardcontainer'>
        <div className='dashboardheader'>
            <div className='dashboardheaddetails'>
                <h1>Welcome Back, Rajesh!</h1>
                <p>Manage your property listings and track buyer inquiries</p>
                <div className='headertags'>
                <span className='protag'><FaRegStar /> Pro Seller</span>
                <span className='verifiedtag'><CiCircleCheck />Verified Seller</span></div>
            </div>
            <button className='addnewlisting'><FaPlus />Add New Listing</button>
        </div>
        <div className='dashboardstats'>
            <div className='mylistings'>
                <div className='mylistingstop'>
                    <p className='mylistingsname'>My Listings</p>
                    <span><FiBox /></span>
                </div>
                <h2 className='dashboardstatnum'>18</h2>
                <p className='dashboardstatcta'>View Detials <GoArrowUpRight /></p>
            </div>
            <div className='mylistings1'>
                <div className='mylistingstop'>
                    <p className='mylistingsname'>Total Views</p>
                    <span><FaRegEye  /></span>
                </div>
                <h2 className='dashboardstatnum'>12,456</h2>
                <p className='dashboardstatcta'>View Detials <GoArrowUpRight /></p>
            </div>
            <div className='mylistings2'>
                <div className='mylistingstop'>
                    <p className='mylistingsname'>Active Leads</p>
                    <span><FiMessageSquare /></span>
                </div>
                <h2 className='dashboardstatnum'>34</h2>
                <p className='dashboardstatcta'>View Detials <GoArrowUpRight /></p>
            </div>
            <div className='mylistings3'>
                <div className='mylistingstop'>
                    <p className='mylistingsname'>Total Earnings</p>
                    <span><MdCurrencyRupee  /></span>
                </div>
                <h2 className='dashboardstatnum'>₹2.4L</h2>
                <p className='dashboardstatcta'>View Detials <GoArrowUpRight /></p>
            </div>
        </div>
        <div className='performancemetrics'>
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
        </div>
        <div className='activelistings'>
            <div className='activelistingshead'>
                <div className='activelistingsheader'>
                <p className='performancemetricstitle'><FiBox className='activelistingsicon'/>My Active Listings</p>
                <p className='performancemetricsnote'>Manage and monitor your property listings</p></div>
                <span className='viewalllistings'>View All Listings</span>
            </div>
            <div className='activelistingslist'>
                <div className='listingcontainer'>
                    <div className='listingcontainertop'>
                        <div className='listingcontainerleft'>
                            <div className='headertags'>
                            <span className='categorytag'>Real Estate</span>
                            <span className='verifiedtag1'>Active</span></div>
                            <h2>Luxury Villa - Bandra West</h2>
                            <p>Posted 10 days ago</p>
                        </div>
                        <div className='listingcontainerright'>₹8.5 Cr</div>
                    </div>
                    <div className='listingcontainerbottom'>
                        <div className='listingproductstat'>
                            <span><FaRegEye  /></span>
                            <h3>2,453</h3>
                            <p>Views</p>
                        </div>
                        <div className='listingproductstat1'>
                            <span><FiMessageSquare  /></span>
                            <h3>12</h3>
                            <p>Leads</p>
                        </div>
                        <div className='listingproductstat2'>
                            <span><FaArrowTrendUp   /></span>
                            <h3>High</h3>
                            <p>Interest</p>
                        </div>
                    </div>
                </div>
                <div className='listingcontainer'>
                    <div className='listingcontainertop'>
                        <div className='listingcontainerleft'>
                            <div className='headertags'>
                            <span className='categorytag'>Cars</span>
                            <span className='verifiedtag1'>Active</span></div>
                            <h2>BMW X7 2024</h2>
                            <p>Posted 5 days ago</p>
                        </div>
                        <div className='listingcontainerright'>₹1.2 Cr</div>
                    </div>
                    <div className='listingcontainerbottom'>
                        <div className='listingproductstat'>
                            <span><FaRegEye  /></span>
                            <h3>1,823</h3>
                            <p>Views</p>
                        </div>
                        <div className='listingproductstat1'>
                            <span><FiMessageSquare  /></span>
                            <h3>8</h3>
                            <p>Leads</p>
                        </div>
                        <div className='listingproductstat2'>
                            <span><FaArrowTrendUp   /></span>
                            <h3>High</h3>
                            <p>Interest</p>
                        </div>
                    </div>
                </div>
                <div className='listingcontainer'>
                    <div className='listingcontainertop'>
                        <div className='listingcontainerleft'>
                            <div className='headertags'>
                            <span className='categorytag'>Furniture</span>
                            <span className='verifiedtag2'>Sold</span></div>
                            <h2>Antique Furniture Set</h2>
                            <p>Posted 20 days ago</p>
                        </div>
                        <div className='listingcontainerright'>₹4.8 L</div>
                    </div>
                    <div className='listingcontainerbottom'>
                        <div className='listingproductstat'>
                            <span><FaRegEye  /></span>
                            <h3>967</h3>
                            <p>Views</p>
                        </div>
                        <div className='listingproductstat1'>
                            <span><FiMessageSquare  /></span>
                            <h3>15</h3>
                            <p>Leads</p>
                        </div>
                        <div className='listingproductstat2'>
                            <span><FaArrowTrendUp   /></span>
                            <h3>High</h3>
                            <p>Interest</p>
                        </div>
                    </div>
                </div>
                <div className='listingcontainer'>
                    <div className='listingcontainertop'>
                        <div className='listingcontainerleft'>
                            <div className='headertags'>
                            <span className='categorytag'>Watches</span>
                            <span className='verifiedtag3'>Pending</span></div>
                            <h2>Rolex Submariner</h2>
                            <p>Posted 3 days ago</p>
                        </div>
                        <div className='listingcontainerright'>₹12.5 L</div>
                    </div>
                    <div className='listingcontainerbottom'>
                        <div className='listingproductstat'>
                            <span><FaRegEye  /></span>
                            <h3>1,234</h3>
                            <p>Views</p>
                        </div>
                        <div className='listingproductstat1'>
                            <span><FiMessageSquare  /></span>
                            <h3>6</h3>
                            <p>Leads</p>
                        </div>
                        <div className='listingproductstat2'>
                            <span><FaArrowTrendUp   /></span>
                            <h3>High</h3>
                            <p>Interest</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='buyerenquiries'>
            <div className='activelistingshead1'>
                <div className='activelistingsheader'>
                <p className='performancemetricstitle'><FiMessageSquare className='enquiriesicon'/>Recent Buyer Enquiries</p>
                <p className='performancemetricsnote'>New leads received on your listings</p></div>
                <span className='viewallleads'>View All Leads</span>
            </div>
            <div className='enquiriesdetails'>
                <div className='enquiryinfo'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile'>R</span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Rajesh Kumar <span className='buyertag'>New</span></li>
                            <li className='buyerproduct'>Luxury Villa - Bandra West</li>
                            <li className='buyertime'>2 hours ago</li>
                        </ul>
                    </div>
                    <span className='respondtag'>Respond</span>
                </div>
                <div className='enquiryinfo'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile'>P</span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Priya Sharma <span className='progresstag'>In progress</span></li>
                            <li className='buyerproduct'>BMW X7 2024</li>
                            <li className='buyertime'>5 hours ago</li>
                        </ul>
                    </div>
                    <span className='respondtag'>Respond</span>
                </div>
                <div className='enquiryinfo'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile'>A</span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Amit Patel <span className='respondedtag'>Responded</span></li>
                            <li className='buyerproduct'>Rolex Submariner</li>
                            <li className='buyertime'>1 day ago</li>
                        </ul>
                    </div>
                    <span className='respondtag'>Respond</span>
                </div>
            </div>
        </div>
        <div className='supporttickets'>
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
        </div>
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
                    <span className='quickactiontag'>Go</span>
                </div>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile2'><LuUsers /></span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>View Leads</li>
                            <li className='buyertime'>Check buyer inquiries</li>
                        </ul>
                    </div>
                    <span className='quickactiontag'>Go</span>
                </div>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile2'><FaRegCircleQuestion /></span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Contact Support</li>
                            <li className='buyertime'>Get help & assistance</li>
                        </ul>
                    </div>
                    <span className='quickactiontag'>Go</span>
                </div>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile2'><LuCrown  /></span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Membership</li>
                            <li className='buyertime'>Upgrade your plan</li>
                        </ul>
                    </div>
                    <span className='quickactiontag'>Go</span>
                </div>
            </div>
        </div>
        <div className='quickactions'>
            <div className='membershipbenifitsheader'>
                <p className='performancemetricstitle'><LuCrown className='benefitsicon'/>Membership Benefits</p>
                <p className='performancemetricsnote'>Upgrade your plan for more features</p></div>
            <div className='enquiriesdetails'>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile3'><CiCircleCheck  /></span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Priority Support <span className='respondedtag'>Active</span></li>
                            <li className='buyertime'>24/7 premium assistance</li>
                        </ul>
                    </div>
                    <span className='benefitstag'>Upgrade</span>
                </div>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile3'><CiCircleCheck  /></span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Featured Listings <span className='respondedtag'>Active</span></li>
                            <li className='buyertime'>Top placement on homepage</li>
                        </ul>
                    </div>
                    <span className='benefitstag'>Upgrade</span>
                </div>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile3'><CiCircleCheck  /></span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Advanced Analytics<span className='respondedtag'>Active</span></li>
                            <li className='buyertime'>Detailed performance insights</li>
                        </ul>
                    </div>
                    <span className='benefitstag'>Upgrade</span>
                </div>
                <div className='enquiryinfo1'>
                    <div className='enquiryinfoleft'>
                        <span className='buyerprofile3'><RxCross2 /></span>
                        <ul className='buyerdetails'>
                            <li className='buyername'>Unlimited Listings <span className='progresstag'>Inactive</span></li>
                            <li className='buyertime'>No cap on properties</li>
                        </ul>
                    </div>
                    <span className='benefitstag'>Upgrade</span>
                </div>
            </div>
        </div>
    </div>;
};

export default DashboardPage; 