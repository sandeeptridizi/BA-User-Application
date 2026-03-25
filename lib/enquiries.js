import api from "./api";

export const getMyEnquiries = async (params = {}) => {
  const response = await api.get("/api/enquiry/my", { params });
  return response.data;
};

export const updateMyEnquiryStatus = async (id, status) => {
  const response = await api.patch(`/api/enquiry/my/${id}`, { status });
  return response.data;
};

export const deleteMyEnquiry = async (id) => {
  const response = await api.delete(`/api/enquiry/my/${id}`);
  return response.data;
};

export const submitSupportTicket = async ({ category, subject, message, priority, visitorName, visitorEmail, visitorPhone }) => {
  const fullMessage = `[${priority} Priority] [${category}]\n\nSubject: ${subject}\n\n${message}`;
  const response = await api.post("/api/enquiry", {
    visitorName,
    visitorEmail,
    visitorPhone,
    message: fullMessage,
    source: category,
  });
  return response.data;
};
