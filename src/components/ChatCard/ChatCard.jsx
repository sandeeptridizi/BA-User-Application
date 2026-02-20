import React from "react";
import "./ChatCard.css";
import { FiSend, FiX } from "react-icons/fi";
import { LuPhone } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";



function ChatCard({ closeChat }) {
  return (
    <div className="chat-wrapper">
      <div className="chat-card">
        <div className="chat-header">
          <div className="profile">
            <div className="avatar">R</div>
            <div>
              <h3>Rajesh Kumar</h3>
              <p>Mumbai, Maharashtra</p>
            </div>
          </div>
          <div className="header-icons">
            <FiX onClick={closeChat} style={{ cursor: "pointer" }} />
          </div>
        </div>
        <div className="lead-info">
          <div className="lead-top">
            <span className="lead-id">Lead ID: L-2891</span>
            <span className="status">New</span>
          </div>

          <div className="contact-info">
            <span className="contactinfonote"> <LuPhone /> +91 98765 43210</span>
            <span className="contactinfonote"><MdOutlineMail />rajesh.kumar@email.com</span>
          </div>

          <div className="property-box">
            <strong>Luxury Penthouse - Worli</strong>
            <p>₹15.5 Cr</p>
          </div>
        </div>
        <div className="chat-body">
            <p className="message">
              Very interested in viewing the property. Looking for immediate
              possession. Budget is flexible. Please contact at earliest.
            </p>
            <span className="time">Just now</span>
        </div>

        {/* Input */}
        <div className="chat-footer">
          <input type="text" placeholder="Type your message..." />
          <button>
            <FiSend />
          </button>
        </div>
        <p className="messagesending">Press Enter to Send</p>

      </div>
    </div>
  );
}

export default ChatCard;
