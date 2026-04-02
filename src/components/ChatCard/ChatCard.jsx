import React, { useState } from "react";
import "./ChatCard.css";
import { FiX } from "react-icons/fi";
import { LuPhone } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import { updateMyEnquiryStatus } from "../../../lib/enquiries";

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Responded" },
  { value: "CLOSED", label: "Closed" },
];

function formatValue(val) {
  if (!val) return "";
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function ChatCard({ closeChat, enquiry, onStatusUpdate }) {
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(enquiry?.status || "NEW");

  if (!enquiry) return null;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;
    try {
      setUpdating(true);
      await updateMyEnquiryStatus(enquiry.id, newStatus);
      setCurrentStatus(newStatus);
      if (onStatusUpdate) onStatusUpdate(enquiry.id, newStatus);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-card">
        <div className="chat-header">
          <div className="profile">
            <div className="avatar">{enquiry.visitorName?.charAt(0).toUpperCase()}</div>
            <div>
              <h3>{enquiry.visitorName}</h3>
              <p>{timeAgo(enquiry.createdAt)}</p>
            </div>
          </div>
          <div className="header-icons">
            <FiX onClick={closeChat} style={{ cursor: "pointer" }} />
          </div>
        </div>
        <div className="lead-info">
          <div className="lead-top">
            <span className="lead-id">Lead ID: {enquiry.id.slice(0, 8)}</span>
            <select
              className="status"
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              style={{ cursor: "pointer" }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="contact-info">
            {enquiry.visitorPhone && (
              <a href={`tel:${enquiry.visitorPhone}`} className="contactinfonote" style={{ textDecoration: "none", color: "inherit" }}>
                <LuPhone /> {enquiry.visitorPhone}
              </a>
            )}
            {enquiry.visitorEmail && (
              <a href={`mailto:${enquiry.visitorEmail}`} className="contactinfonote" style={{ textDecoration: "none", color: "inherit" }}>
                <MdOutlineMail /> {enquiry.visitorEmail}
              </a>
            )}
          </div>

          <div className="property-box">
            <strong>{enquiry.product?.title || "Unknown Product"}</strong>
            {enquiry.product?.value && <p>{formatValue(enquiry.product.value)}</p>}
          </div>
        </div>
        {enquiry.message && (
          <div className="chat-body">
            <p className="message">{enquiry.message}</p>
            <span className="time">{timeAgo(enquiry.createdAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatCard;
