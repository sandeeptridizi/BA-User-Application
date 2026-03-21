import './MyLeads.css';
import { useState, useEffect, useCallback } from "react";
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
import { getMyEnquiries } from '../../../lib/enquiries';

const statusClass = { NEW: 'buyerenquirystage', IN_PROGRESS: 'buyerenquirystage1', RESOLVED: 'buyerenquirystage2', CLOSED: 'buyerenquirystage3' };
const statusIcon = { NEW: <CiCircleAlert />, IN_PROGRESS: <IoMdTime />, RESOLVED: <FiMessageSquare />, CLOSED: <CiCircleCheck /> };
const statusText = { NEW: 'New', IN_PROGRESS: 'In Progress', RESOLVED: 'Responded', CLOSED: 'Closed' };

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function formatValue(val) {
  if (!val) return '';
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val.toLocaleString('en-IN')}`;
}

const MyLeads = () => {
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [enquiries, setEnquiries] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const statusCounts = {
      NEW: enquiries.filter(e => e.status === 'NEW').length,
      IN_PROGRESS: enquiries.filter(e => e.status === 'IN_PROGRESS').length,
      RESOLVED: enquiries.filter(e => e.status === 'RESOLVED').length,
      CLOSED: enquiries.filter(e => e.status === 'CLOSED').length,
    };

    const fetchEnquiries = useCallback(async () => {
      setLoading(true);
      try {
        const params = { page: pagination.page, limit: 20 };
        if (statusFilter) params.status = statusFilter;
        const res = await getMyEnquiries(params);
        setEnquiries(res.data || []);
        setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
      } catch (err) {
        console.error('Failed to fetch enquiries', err);
      } finally {
        setLoading(false);
      }
    }, [pagination.page, statusFilter]);

    useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

    return <div className='leadscontainer'>
        <div className='leadheader'>
            <div className='leadheaderleft'>
                <h1><FiTarget />Buyer Inquiries</h1>
                <p>Manage buyer leads and respond to inquiries on your listings</p>
            </div>
            <div className='leadheaderright'>
                <h1>{pagination.total}</h1>
                <p>Total Inquiries</p>
            </div>
        </div>
        <div className='inquirystats'>
            <div className={`inquirystat${statusFilter === 'NEW' ? ' active' : ''}`} onClick={() => { setStatusFilter(f => f === 'NEW' ? '' : 'NEW'); setPagination(p => ({...p, page: 1})); }} style={{cursor:'pointer'}}>
                <div className='inquirystatleft'>
                    <p>New Inquiries</p>
                    <h2>{statusCounts.NEW}</h2>
                </div>
                <div className='inquirystatright'><CiCircleAlert /> </div>
            </div>
            <div className={`inquirystat1${statusFilter === 'IN_PROGRESS' ? ' active' : ''}`} onClick={() => { setStatusFilter(f => f === 'IN_PROGRESS' ? '' : 'IN_PROGRESS'); setPagination(p => ({...p, page: 1})); }} style={{cursor:'pointer'}}>
                <div className='inquirystatleft'>
                    <p>In Progress</p>
                    <h2>{statusCounts.IN_PROGRESS}</h2>
                </div>
                <div className='inquirystatright1'><IoMdTime /> </div>
            </div>
            <div className={`inquirystat2${statusFilter === 'RESOLVED' ? ' active' : ''}`} onClick={() => { setStatusFilter(f => f === 'RESOLVED' ? '' : 'RESOLVED'); setPagination(p => ({...p, page: 1})); }} style={{cursor:'pointer'}}>
                <div className='inquirystatleft'>
                    <p>Responded</p>
                    <h2>{statusCounts.RESOLVED}</h2>
                </div>
                <div className='inquirystatright2'><FiMessageSquare  /> </div>
            </div>
            <div className={`inquirystat3${statusFilter === 'CLOSED' ? ' active' : ''}`} onClick={() => { setStatusFilter(f => f === 'CLOSED' ? '' : 'CLOSED'); setPagination(p => ({...p, page: 1})); }} style={{cursor:'pointer'}}>
                <div className='inquirystatleft'>
                    <p>Closed/Converted</p>
                    <h2>{statusCounts.CLOSED}</h2>
                </div>
                <div className='inquirystatright3'><CiCircleCheck  /> </div>
            </div>
        </div>

        {loading ? (
          <p style={{padding: '20px', textAlign: 'center'}}>Loading inquiries...</p>
        ) : enquiries.length === 0 ? (
          <p style={{padding: '20px', textAlign: 'center'}}>No inquiries yet.</p>
        ) : (
          enquiries.map((enq) => (
            <div className='buyerenquiry' key={enq.id}>
              <div className='buyerenquirytop'>
                <div className='buyerenquiryfirst'>
                  <ul className='buyerenquirytags'>
                    <li className='buyerenquiryid'>{enq.id.slice(0, 8)}</li>
                    <li className={statusClass[enq.status] || 'buyerenquirystage'}>{statusIcon[enq.status]}{statusText[enq.status]}</li>
                  </ul>
                  <div className='respondbutton' onClick={() => setSelectedEnquiry(enq)}><FiMessageSquare />Respond</div>
                </div>
                <div className='buyerenquirynext'>
                  <div className='buyerenquiryprofile'>{enq.visitorName?.charAt(0).toUpperCase()}</div>
                  <div className='buyerinfo'>
                    <h2>{enq.visitorName}</h2>
                    <p><IoMdTime />{timeAgo(enq.createdAt)}</p>
                  </div>
                </div>
              </div>
              <div className='buyerenquirybottom'>
                <div className='buyerenquiryleft'>
                  <h3><FiUser className='buyerenquiryicon'/>Buyer Contact Details</h3>
                  <ul className='buyercontactdetails'>
                    {enq.visitorPhone && <li className='buyercontactinfo'><LuPhone />{enq.visitorPhone}</li>}
                    <li className='buyercontactinfo'><MdOutlineMail />{enq.visitorEmail}</li>
                    <li className='buyercontactinfo'><CiCalendar />Received: {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</li>
                  </ul>
                  <ul className='buyerproductdetails'>
                    <li className='buyerproductinfo'><FiBox />Interested In</li>
                    <li className='buyerproductinfo'>{enq.product?.title || 'Unknown Product'}</li>
                    {enq.product?.value && <li className='buyerproductinfo'>Price: {formatValue(enq.product.value)}</li>}
                  </ul>
                </div>
                <div className='buyerenquiryright'>
                  <h3>Buyer's Message</h3>
                  <div className='buyermessage'>{enq.message}</div>
                </div>
              </div>
            </div>
          ))
        )}

        {pagination.totalPages > 1 && (
          <div style={{display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px'}}>
            <button disabled={pagination.page <= 1} onClick={() => setPagination(p => ({...p, page: p.page - 1}))} className='respondbutton'>Prev</button>
            <span style={{alignSelf: 'center'}}>Page {pagination.page} of {pagination.totalPages}</span>
            <button disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination(p => ({...p, page: p.page + 1}))} className='respondbutton'>Next</button>
          </div>
        )}

        {selectedEnquiry && (<ChatCard closeChat={() => setSelectedEnquiry(null)} enquiry={selectedEnquiry} onStatusUpdate={(id, newStatus) => {
          setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
        }} />)}
    </div>;
};

export default MyLeads; 