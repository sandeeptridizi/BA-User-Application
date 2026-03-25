import './Enquiry.css';
import { useState } from 'react';
import { LuMessageSquare } from "react-icons/lu";
import { IoIosSend } from "react-icons/io";
import { LuPhone } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { getUser } from '../../../lib/auth';
import { submitSupportTicket } from '../../../lib/enquiries';

const Enquiry = () => {
    const user = getUser();
    const displayName = user?.name || '—';
    const displayEmail = user?.email || '—';
    const displayPhone = user?.phone ? `+91 ${user.phone.replace(/^91/, '').trim()}` : '—';

    const [category, setCategory] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Low');
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async () => {
        setSuccessMsg('');
        setErrorMsg('');

        if (!category || category === 'Select issue category') {
            setErrorMsg('Please select an issue category');
            return;
        }
        if (!subject.trim()) {
            setErrorMsg('Please enter a subject');
            return;
        }
        if (!description.trim()) {
            setErrorMsg('Please describe your issue');
            return;
        }

        setSubmitting(true);
        try {
            await submitSupportTicket({
                category,
                subject: subject.trim(),
                message: description.trim(),
                priority,
                visitorName: user?.name || 'User',
                visitorEmail: user?.email || '',
                visitorPhone: user?.phone || '',
            });
            setSuccessMsg('Support ticket submitted successfully!');
            setCategory('');
            setSubject('');
            setDescription('');
            setPriority('Low');
        } catch {
            setErrorMsg('Failed to submit ticket. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

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
                <select className='accountformtext' value={category} onChange={(e) => setCategory(e.target.value)}>
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
                <input type='text' placeholder='Brief subject of your query' className='accountformtext' value={subject} onChange={(e) => setSubject(e.target.value)}></input>
            </div>
            <div className='accountformdiv'>
                <h3>Describe Your Issue *</h3>
                <textarea placeholder='Please provide detailed information about your query or issue..' className='accountformtext1' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <p>Be as specific as possible to help us assist you better</p>
            </div>
            <p className='prioritylevelnote'>Priority Level</p>
            <ul className='prioritylevel'>
                <li className={`prioritylevellow${priority === 'Low' ? ' priorityactive' : ''}`} onClick={() => setPriority('Low')}>Low</li>
                <li className={`prioritylevelmedium${priority === 'Medium' ? ' priorityactive' : ''}`} onClick={() => setPriority('Medium')}>Medium</li>
                <li className={`prioritylevelhigh${priority === 'High' ? ' priorityactive' : ''}`} onClick={() => setPriority('High')}>High</li>
            </ul>
            {errorMsg && <p className='enquiry-error-msg'>{errorMsg}</p>}
            {successMsg && <p className='enquiry-success-msg'>{successMsg}</p>}
            <div className='ticketsubmitbutton' onClick={handleSubmit} style={{ opacity: submitting ? 0.6 : 1, pointerEvents: submitting ? 'none' : 'auto' }}>
                <IoIosSend />{submitting ? 'Submitting...' : 'Submit Support Ticket'}
            </div>
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
    </div>;
};

export default Enquiry;
