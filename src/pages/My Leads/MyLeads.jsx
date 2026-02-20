import './MyLeads.css';
import { useState } from "react";
import { FiTarget } from "react-icons/fi";
import ChatCard from '../../components/ChatCard/ChatCard';
import { CiCircleAlert } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";
import { CiCircleCheck } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { LuPhone } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { FiBox } from "react-icons/fi";




const MyLeads = () => {

    const [showChat, setShowChat] = useState(false);

    return <div className='leadscontainer'>
        <div className='leadheader'>
            <div className='leadheaderleft'>
                <h1><FiTarget />Buyer Inquiries</h1>
                <p>Manage buyer leads and respond to inquiries on your listings</p>
            </div>
            <div className='leadheaderright'>
                <h1>5</h1>
                <p>Total Inquiries</p>
            </div>
        </div>
        <div className='inquirystats'>
            <div className='inquirystat'>
                <div className='inquirystatleft'>
                    <p>New Inquiries</p>
                    <h2>1</h2>
                </div>
                <div className='inquirystatright'><CiCircleAlert /> </div>
            </div>
            <div className='inquirystat1'>
                <div className='inquirystatleft'>
                    <p>In Progress</p>
                    <h2>2</h2>
                </div>
                <div className='inquirystatright1'><IoMdTime /> </div>
            </div>
            <div className='inquirystat2'>
                <div className='inquirystatleft'>
                    <p>Responded</p>
                    <h2>1</h2>
                </div>
                <div className='inquirystatright2'><FiMessageSquare  /> </div>
            </div>
            <div className='inquirystat3'>
                <div className='inquirystatleft'>
                    <p>Closed/Converted</p>
                    <h2>1</h2>
                </div>
                <div className='inquirystatright3'><CiCircleCheck  /> </div>
            </div>
        </div>
        <div className='buyerenquiry'>
            <div className='buyerenquirytop'>
                <div className='buyerenquiryfirst'>
                <ul className='buyerenquirytags'>
                    <li className='buyerenquiryid'>L-2891</li>
                    <li className='buyerenquirystage'><CiCircleAlert />New</li>
                    <li className='buyerenquirytag'>High Priority</li>
                </ul>
                <div className='respondbutton' onClick={() => setShowChat(true)}><FiMessageSquare  />Respond</div>
                </div>
                <div className='buyerenquirynext'>
                    <div className='buyerenquiryprofile'>R</div>
                    <div className='buyerinfo'>
                        <h2>Rajesh Kumar</h2>
                        <p><CiLocationOn /> Mumbai, Maharashtra <IoMdTime />2 hours ago
                        </p>
                    </div>
                </div>
            </div>
            <div className='buyerenquirybottom'>
                <div className='buyerenquiryleft'>
                   <h3><FiUser className='buyerenquiryicon'/>Buyer Contact Details</h3> 
                   <ul className='buyercontactdetails'>
                    <li className='buyercontactinfo'><LuPhone />+91 98765 43210</li>
                    <li className='buyercontactinfo'><MdOutlineMail />rajesh.kumar@email.com</li>
                    <li className='buyercontactinfo'><CiCalendar />Received: 17 Feb 2026</li>
                   </ul>
                   <ul className='buyerproductdetails'>
                    <li className='buyerproductinfo'><FiBox />Interested In</li>
                    <li className='buyerproductinfo'>Luxury Penthouse - Worli</li>
                    <li className='buyerproductinfo'>Price: ₹15.5 Cr</li>
                   </ul>
                </div>
                <div className='buyerenquiryright'>
                    <h3>Buyer's Message</h3>
                    <div className='buyermessage'>Very interested in viewing the property. Looking for immediate possession. Budget is flexible. Please contact at earliest.</div>
                    <div className='buyerpreference'>
                        <h3>Viewing Preference</h3>
                        <p>Weekend viewing preferred</p>
                    </div>
                    <div className='buyerenquiryactions'>
                        <h3><CiCircleCheck  /> Mark as Responded</h3>
                        <p>Schedule Meeting</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='buyerenquiry'>
            <div className='buyerenquirytop'>
                <div className='buyerenquiryfirst'>
                <ul className='buyerenquirytags'>
                    <li className='buyerenquiryid'>L-2874</li>
                    <li className='buyerenquirystage1'><IoMdTime />In Progress</li>
                    <li className='buyerenquirystage1'>Medium Priority</li>
                </ul>
                <div className='respondbutton' onClick={() => setShowChat(true)}><FiMessageSquare  />Respond</div>
                </div>
                <div className='buyerenquirynext'>
                    <div className='buyerenquiryprofile'>P</div>
                    <div className='buyerinfo'>
                        <h2>Priya Sharma</h2>
                        <p><CiLocationOn /> Bangalore, Karnataka <IoMdTime />5 hours ago
                        </p>
                    </div>
                </div>
            </div>
            <div className='buyerenquirybottom'>
                <div className='buyerenquiryleft'>
                   <h3><FiUser className='buyerenquiryicon'/>Buyer Contact Details</h3> 
                   <ul className='buyercontactdetails'>
                    <li className='buyercontactinfo'><LuPhone />+91 98234 56789</li>
                    <li className='buyercontactinfo'><MdOutlineMail />priya.sharma@email.com</li>
                    <li className='buyercontactinfo'><CiCalendar />Received: 16 Feb 2026</li>
                   </ul>
                   <ul className='buyerproductdetails'>
                    <li className='buyerproductinfo'><FiBox />Interested In</li>
                    <li className='buyerproductinfo'>BMW X7 2024</li>
                    <li className='buyerproductinfo'>Price: ₹1.85 Cr</li>
                   </ul>
                </div>
                <div className='buyerenquiryright'>
                    <h3>Buyer's Message</h3>
                    <div className='buyermessage'>Interested in test drive. Want to know about warranty details and service history.</div>
                    <div className='buyerpreference'>
                        <h3>Viewing Preference</h3>
                        <p>Weekday evening (6-8 PM)</p>
                    </div>
                    <div className='buyerenquiryactions'>
                        <h3><CiCircleCheck  /> Mark as Responded</h3>
                        <p>Schedule Meeting</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='buyerenquiry'>
            <div className='buyerenquirytop'>
                <div className='buyerenquiryfirst'>
                <ul className='buyerenquirytags'>
                    <li className='buyerenquiryid'>L-2856</li>
                    <li className='buyerenquirystage2'><FiMessageSquare />Responded</li>
                    <li className='buyerenquirystage'>High Priority</li>
                </ul>
                <div className='respondbutton' onClick={() => setShowChat(true)}><FiMessageSquare  />Respond</div>
                </div>
                <div className='buyerenquirynext'>
                    <div className='buyerenquiryprofile'>A</div>
                    <div className='buyerinfo'>
                        <h2>Amit Patel</h2>
                        <p><CiLocationOn /> Ahmedabad, Gujarat <IoMdTime />1 day ago
                        </p>
                    </div>
                </div>
            </div>
            <div className='buyerenquirybottom'>
                <div className='buyerenquiryleft'>
                   <h3><FiUser className='buyerenquiryicon'/>Buyer Contact Details</h3> 
                   <ul className='buyercontactdetails'>
                    <li className='buyercontactinfo'><LuPhone />+91 99887 76543</li>
                    <li className='buyercontactinfo'><MdOutlineMail />amit.patel@email.com</li>
                    <li className='buyercontactinfo'><CiCalendar />Received: 15 Feb 2026</li>
                   </ul>
                   <ul className='buyerproductdetails'>
                    <li className='buyerproductinfo'><FiBox />Interested In</li>
                    <li className='buyerproductinfo'>Rolex Daytona Platinum</li>
                    <li className='buyerproductinfo'>Price: ₹45.8 L</li>
                   </ul>
                </div>
                <div className='buyerenquiryright'>
                    <h3>Buyer's Message</h3>
                    <div className='buyermessage'>Need authenticity certificate. Willing to close deal quickly if genuine.</div>
                    <div className='buyerpreference'>
                        <h3>Viewing Preference</h3>
                        <p>In-person viewing required</p>
                    </div>
                    <div className='buyerenquiryactions'>
                        <h3><CiCircleCheck  /> Mark as Responded</h3>
                        <p>Schedule Meeting</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='buyerenquiry'>
            <div className='buyerenquirytop'>
                <div className='buyerenquiryfirst'>
                <ul className='buyerenquirytags'>
                    <li className='buyerenquiryid'>L-2834</li>
                    <li className='buyerenquirystage1'><IoMdTime />In Progress</li>
                    <li className='buyerenquirystage1'>Medium Priority</li>
                </ul>
                <div className='respondbutton' onClick={() => setShowChat(true)}><FiMessageSquare  />Respond</div>
                </div>
                <div className='buyerenquirynext'>
                    <div className='buyerenquiryprofile'>S</div>
                    <div className='buyerinfo'>
                        <h2>Sneha Reddy</h2>
                        <p><CiLocationOn /> Hyderabad, Telangana <IoMdTime />3 days ago
                        </p>
                    </div>
                </div>
            </div>
            <div className='buyerenquirybottom'>
                <div className='buyerenquiryleft'>
                   <h3><FiUser className='buyerenquiryicon'/>Buyer Contact Details</h3> 
                   <ul className='buyercontactdetails'>
                    <li className='buyercontactinfo'><LuPhone />+91 97654 32109</li>
                    <li className='buyercontactinfo'><MdOutlineMail />sneha.reddy@email.com</li>
                    <li className='buyercontactinfo'><CiCalendar />Received: 14 Feb 2026</li>
                   </ul>
                   <ul className='buyerproductdetails'>
                    <li className='buyerproductinfo'><FiBox />Interested In</li>
                    <li className='buyerproductinfo'>Villa in Jubilee Hills</li>
                    <li className='buyerproductinfo'>Price: ₹8.2 Cr</li>
                   </ul>
                </div>
                <div className='buyerenquiryright'>
                    <h3>Buyer's Message</h3>
                    <div className='buyermessage'>Looking for long-term rental. Need details about maintenance and available amenities</div>
                    <div className='buyerpreference'>
                        <h3>Viewing Preference</h3>
                        <p>Open to all timings</p>
                    </div>
                    <div className='buyerenquiryactions'>
                        <h3><CiCircleCheck  /> Mark as Responded</h3>
                        <p>Schedule Meeting</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='buyerenquiry'>
            <div className='buyerenquirytop'>
                <div className='buyerenquiryfirst'>
                <ul className='buyerenquirytags'>
                    <li className='buyerenquiryid'>L-2819</li>
                    <li className='buyerenquirystage3'><CiCircleCheck />Closed</li>
                    <li className='buyerenquiryid'>Low Priority</li>
                </ul>
                <div className='respondbutton' onClick={() => setShowChat(true)}><FiMessageSquare  />Respond</div>
                </div>
                <div className='buyerenquirynext'>
                    <div className='buyerenquiryprofile'>V</div>
                    <div className='buyerinfo'>
                        <h2>Vikram Singh</h2>
                        <p><CiLocationOn /> Delhi, NCR <IoMdTime />7 days ago
                        </p>
                    </div>
                </div>
            </div>
            <div className='buyerenquirybottom'>
                <div className='buyerenquiryleft'>
                   <h3><FiUser className='buyerenquiryicon'/>Buyer Contact Details</h3> 
                   <ul className='buyercontactdetails'>
                    <li className='buyercontactinfo'><LuPhone />+91 96543 21098</li>
                    <li className='buyercontactinfo'><MdOutlineMail />vikram.singh@email.com</li>
                    <li className='buyercontactinfo'><CiCalendar />Received: 10 Feb 2026</li>
                   </ul>
                   <ul className='buyerproductdetails'>
                    <li className='buyerproductinfo'><FiBox />Interested In</li>
                    <li className='buyerproductinfo'>Mercedes-Benz S-Class 2024</li>
                    <li className='buyerproductinfo'>Price: ₹2.1 Cr</li>
                   </ul>
                </div>
                <div className='buyerenquiryright'>
                    <h3>Buyer's Message</h3>
                    <div className='buyermessage'>Deal completed. Thank you for smooth transaction.</div>
                    <div className='buyerpreference'>
                        <h3>Viewing Preference</h3>
                        <p>N/A</p>
                    </div>
                </div>
            </div>
        </div>
        {showChat && (<ChatCard closeChat={() => setShowChat(false)} />)}
    </div>;
};



export default MyLeads; 