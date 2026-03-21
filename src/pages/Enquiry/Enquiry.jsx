import './Enquiry.css';
import { LuMessageSquare } from "react-icons/lu";
import { IoIosSend } from "react-icons/io";
import { LuPhone } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { GiBackwardTime } from "react-icons/gi";
import { CiCircleCheck } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";
import { FiAlertCircle } from "react-icons/fi";
import { getUser } from '../../../lib/auth';

const Enquiry = () => {
    const user = getUser();
    const displayName = user?.name || '—';
    const displayEmail = user?.email || '—';
    const displayPhone = user?.phone ? `+91 ${user.phone.replace(/^91/, '').trim()}` : '—';

    return <div className='enquirycontainer'>
        <div className='leadheader'>
            <div className='leadheaderleft'>
                <h1><LuMessageSquare  />Contact Us</h1>
                <p>Have questions? We're here to help you 24/7</p>
            </div>
        </div>
        <div className='contactcontainer'>
           <div className='contactcontainerleft'>
            <div className='contactcontainerleftheader'>
                <h3>Create Support Ticket</h3>
                <p>Submit your query and our support team will assist you within 24 hours</p>
            </div>
            <div className='accountinformation'>
               <h2 className='accountinformationtitle'>Your Account Information</h2> 
               <div className='accountinfo'>
               <div className='accountinformationleft'>
                    <p>Name:<span className='accountinformationtitle'>{displayName}</span></p>
                    <p>Phone:<span className='accountinformationtitle'>{displayPhone}</span></p>
               </div>
               <div className='accountinformationleft'>
                    <p>Email:<span className='accountinformationtitle'>{displayEmail}</span></p>
                    <p>Member Type:<span className='accountinformationtitle'>Pro Seller</span></p>
               </div>
               </div>
            </div>
            <div className='accountformdiv'>
                <h3>Issue Category *</h3>
                <select className='accountformtext'>
                    <option>Select issue category</option>
                    <option>Listing Issue</option>
                    <option>Buyer Inquiry Question</option>
                    <option>Payment & Billing</option>
                    <option>Account Verification</option>
                    <option>Technical Support</option>
                    <option>Feature Request</option>
                    <option>Report Issue/Bug</option>
                    <option>General Question</option>
                </select>
            </div>
            <div className='accountformdiv'>
                <h3>Subject *</h3>
                <input type='text' placeholder='Brief subject of your query' className='accountformtext'></input>
            </div>
            <div className='accountformdiv'>
                <h3>Describe Your Issue *</h3>
                <textarea type='textarea' placeholder='Please provide detailed information about your query or issue..' className='accountformtext1'></textarea>
                <p>Be as specific as possible to help us assist you better</p>
            </div>
            <p className='prioritylevelnote'>Priority Level</p>
            <ul className='prioritylevel'>
                <li className='prioritylevellow'>Low</li>
                <li className='prioritylevelmedium'>Medium</li>
                <li className='prioritylevelhigh'>High</li>
            </ul>
            <div className='ticketsubmitbutton'> <IoIosSend />Submit Support Ticket</div>
        </div>
        <div className='contactcontainerright'>
            <div className='contactcontainerrightheader'>
                <h3>Contact Information</h3>
                <p>Get in touch with us directly</p>
            </div>
            <div className='supportcontactinfo'>
                <div className='supportcontacticon'><LuPhone /></div>
                <div className='supportcontactdetails'>
                    <h3>Phone</h3>
                    <p>+91 7842201879</p>
                    <p>+91 7842501879</p>
                </div>
            </div>
            <div className='supportcontactinfo'>
                <div className='supportcontacticon1'><MdOutlineMail /></div>
                <div className='supportcontactdetails'>
                    <h3>Email</h3>
                    <p>Elite@billionaireauction.com</p>
                    <p>We reply within 24 hours</p>
                </div>
            </div>
            <div className='supportcontactinfo'>
                <div className='supportcontacticon2'><CiLocationOn /></div>
                <div className='supportcontactdetails'>
                    <h3>Office</h3>
                    <p>H no: 5-497, Izzath nagar</p>
                    <p>Kondapur, Telangana, India</p>
                </div>
            </div>
            <div className='supportcontactinfo'>
                <div className='supportcontacticon3'><IoMdTime /></div>
                <div className='supportcontactdetails'>
                    <h3>Business Hours</h3>
                    <p>Mon-Fri: 9:00 AM - 8:00 PM</p>
                    <p>Sat: 10:00 AM - 6:00 PM</p>
                    <p>Sun: Closed</p>
                </div>
            </div>
        </div>
        </div>
        <div className='previoustickets'>
            <div className='previousticketsheader'>
                <h2><GiBackwardTime className='previousticketsicon'/>Previous Support Tickets</h2>
                <p>4 Total Tickets</p>
            </div>
            <div className='ticketdetails'>
                <div className='ticketdetailstop'>
                    <ul className='ticketdetailstags'>
                        <li className='buyerenquiryid'>TKT-8921</li>
                        <li className='buyerenquirystage3'><CiCircleCheck />Resolved</li>
                        <li className='buyerenquirytag'>High Priority</li>
                        <li className='buyerenquirystage2'>Payment & Billing</li>
                    </ul>
                    <h2>Payment gateway issue for listing</h2>
                    <p><IoMdTime />Created: 15 Feb 2026 <CiCircleCheck className='ticketdetailicon'/> Resolved: 15 Feb 2026 <span className='responsetime'>Response Time: 2 hours</span></p>
                </div>
                <div className='yourquery'>
                    <h2>Your Query:</h2>
                    <p>I am unable to complete payment for upgrading my listing to premium. The payment page shows an error.</p>
                </div>
                <div className='yourquery1'>
                    <h2><CiCircleCheck />Support Team Response:</h2>
                    <p>We've resolved the payment gateway issue. Your premium upgrade has been processed successfully. Thank you for your patience.</p>
                </div>
            </div>
            <div className='ticketdetails'>
                <div className='ticketdetailstop'>
                    <ul className='ticketdetailstags'>
                        <li className='buyerenquiryid'>TKT-8845</li>
                        <li className='buyerenquiryid'><RxCrossCircled  />Closed</li>
                        <li className='buyerenquirystage1'>Medium Priority</li>
                        <li className='buyerenquirystage2'>Account Verification</li>
                    </ul>
                    <h2>How to verify my property documents?</h2>
                    <p><IoMdTime />Created: 12 Feb 2026 <CiCircleCheck className='ticketdetailicon'/> Resolved: 13 Feb 2026 <span className='responsetime'>Response Time: 18 hours</span></p>
                </div>
                <div className='yourquery'>
                    <h2>Your Query:</h2>
                    <p>I want to get my property documents verified for the luxury villa listing. What is the process?</p>
                </div>
                <div className='yourquery1'>
                    <h2><CiCircleCheck />Support Team Response:</h2>
                    <p>Please upload your property documents in Settings, Verification section. Our team will review within 48 hours.</p>
                </div>
            </div>
            <div className='ticketdetails'>
                <div className='ticketdetailstop'>
                    <ul className='ticketdetailstags'>
                        <li className='buyerenquiryid'>TKT-8723</li>
                        <li className='buyerenquirystage1'><IoMdTime  />In Progress</li>
                        <li className='buyerenquirytag'>High Priority</li>
                        <li className='buyerenquirystage2'>Technical Support</li>
                    </ul>
                    <h2>Buyer inquiry not showing correctly</h2>
                    <p><IoMdTime />Created: 16 Feb 2026</p>
                </div>
                <div className='yourquery'>
                    <h2>Your Query:</h2>
                    <p>I received a buyer inquiry notification but it's not visible in my Leads section.</p>
                </div>
                <div className='yourquery1'>
                    <h2><CiCircleCheck />Support Team Response:</h2>
                    <p>Our technical team is investigating this issue. We'll update you within 24 hours.</p>
                </div>
            </div>
            <div className='ticketdetails'>
                <div className='ticketdetailstop'>
                    <ul className='ticketdetailstags'>
                        <li className='buyerenquiryid'>TKT-8654</li>
                        <li className='buyerenquirystage'><FiAlertCircle  />Open</li>
                        <li className='buyerenquiryid'>Low Priority</li>
                        <li className='buyerenquirystage2'>Feature Request</li>
                    </ul>
                    <h2>Request for featured listing placement</h2>
                    <p><IoMdTime />Created: 17 Feb 2026</p>
                </div>
                <div className='yourquery'>
                    <h2>Your Query:</h2>
                    <p>Can I get my BMW X7 listing featured on the homepage? I'm a Pro member.</p>
                </div>
                <div className='yourquery1'>
                    <h2><CiCircleCheck />Support Team Response:</h2>
                    <p><IoMdTime  />Waiting for support team response...</p>
                </div>
            </div>
        </div>
    </div>;
};

export default Enquiry; 