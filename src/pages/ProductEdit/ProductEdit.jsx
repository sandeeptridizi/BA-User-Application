import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiLeftArrowAlt } from "react-icons/bi";
import api from "../../../lib/api";
import "../ProductCreation/productcreation.css";
import "./ProductEdit.css";

const LISTING_TYPES = [
  { value: "MARKETPLACE", label: "Marketplace" },
  { value: "BUY_NOW", label: "Buy Now" },
  { value: "AUCTIONS", label: "Auctions" },
  { value: "TO_LET", label: "To-Let" },
];

const CATEGORIES = [
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "CARS", label: "Cars" },
  { value: "BIKES", label: "Bikes" },
  { value: "FURNITURE", label: "Furniture" },
  { value: "JEWELLERY_AND_WATCHES", label: "Jewellery & Watches" },
  { value: "ARTS_AND_PAINTINGS", label: "Arts & Paintings" },
  { value: "ANTIQUES", label: "Antiques" },
  { value: "COLLECTABLES", label: "Collectables" },
];

const TIERS = [
  { value: "GENERAL", label: "General" },
  { value: "LUXURY", label: "Luxury" },
  { value: "CLASSIC", label: "Classic" },
];

const COUNTRIES = [
  { value: "INDIA", label: "India" },
  { value: "UNITED STATES", label: "United States" },
  { value: "UNITED KINGDOM", label: "United Kingdom" },
  { value: "CANADA", label: "Canada" },
  { value: "AUSTRALIA", label: "Australia" },
  { value: "SINGAPORE", label: "Singapore" },
  { value: "DUBAI", label: "Dubai" },
  { value: "MALAYSIA", label: "Malaysia" },
  { value: "QATAR", label: "Qatar" },
  { value: "SAUDI ARABIA", label: "Saudi Arabia" },
  { value: "SWITZERLAND", label: "Switzerland" },
  { value: "KUWAIT", label: "Kuwait" },
];

const APPROVAL_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const camelToLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

const INTERNAL_META_KEYS = new Set(["views", "features", "keyFeatures"]);

const SELECT_OPTIONS = {
  propertyType: ["House", "Villa", "Apartment", "Flat", "Plot", "Land", "Commercial"],
  ownershipType: ["Freehold", "Leasehold", "Co-Operative Society", "Power of Attorney"],
  approvalStatus2: ["RERA Approved", "Authority Approved", "Not Approved", "Under Process"],
  availability: ["Immediate", "Ready to Move", "Under Construction", "Within 3 Months", "Within 6 Months"],
  facing: ["North", "East", "West", "South", "North-East", "North-West", "South-East", "South-West"],
  noOfCarParking: ["1", "2", "3", "4"],
  furnishing: ["Unfurnished", "Semi-Furnished", "Furnished"],
  garden: ["Yes", "No"],
  gatedCommunity: ["Yes", "No"],
  maintenanceCharges: ["Included", "Excluded", "On Request"],
  lift: ["Yes", "No"],
  parkingType: ["No", "Open", "Covered"],
  approvalType: ["DTCP", "HMDA", "RERA", "Panchayat", "NA"],
  boundaryWall: ["Yes", "No"],
  cornerPlot: ["Yes", "No"],
  electricityAvailable: ["Yes", "No"],
  waterConnection: ["Municipal", "Borewell", "Both", "None"],
  commercialType: ["Office", "Shop", "Showroom", "Warehouse", "Industrial"],
  parking: ["Yes", "No"],
  suitableFor: ["Office", "Retail", "Clinic", "Restaurant", "Storage"],
  washroom: ["Private", "Common", "None"],
  furnishedStatus: ["Unfurnished", "Semi-Furnished", "Furnished"],
  fireSafetyCompliance: ["Yes", "No"],
  noOfOwners: ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner"],
  fuelType: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
  condition: ["Excellent", "Good", "Fair"],
  transmission: ["Manual", "Automatic", "AMT"],
  tyres: ["Brand New", "Used / Part-Own", "Worn Out"],
  accidentHistory: ["Yes", "No"],
  serviceHistory: ["Available", "Not Available"],
  numberOfKeys: ["1", "2", "More"],
  sellerType: ["Owner", "Dealer"],
  negotiable: ["Yes", "No"],
  insuranceValidity: ["Active", "Expired"],
  rcAvailable: ["Yes/Available", "No/Missing"],
  ownership: ["Owner", "Agent", "Builder"],
  rentalType: ["Flat", "Apartment", "Independent House", "Villa", "Studio", "Penthouse"],
  leaseDuration: ["11 Months", "1 Year", "2 Years", "3 Years"],
  furnishingStatus: ["Furnished", "Semi Furnished", "Unfurnished", "Other"],
};

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    listingType: "MARKETPLACE",
    category: "REAL_ESTATE",
    tier: "GENERAL",
    country: "INDIA",
    value: "",
    approvalStatus: "PENDING",
  });
  const [metaFields, setMetaFields] = useState({});

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Product not found");
      return;
    }
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/product/${id}`);
        const p = res?.data?.data;
        if (!p) {
          setError("Product not found");
          return;
        }
        setForm({
          title: p.title || "",
          description: p.description || "",
          listingType: p.listingType || "MARKETPLACE",
          category: p.category || "REAL_ESTATE",
          tier: p.tier || "GENERAL",
          country: p.country || "INDIA",
          value: p.value != null ? String(p.value) : "",
          approvalStatus: p.approvalStatus || "PENDING",
        });
        if (p.meta && typeof p.meta === "object") {
          const editableMeta = {};
          for (const [key, value] of Object.entries(p.meta)) {
            if (INTERNAL_META_KEYS.has(key)) continue;
            editableMeta[key] = value != null ? String(value) : "";
          }
          setMetaFields(editableMeta);
        }
      } catch (err) {
        setError(
          err?.response?.data?.message || err?.message || "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMetaChange = (key, value) => {
    setMetaFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    const meta = {};
    for (const [key, value] of Object.entries(metaFields)) {
      if (value !== "") {
        meta[key] = value;
      }
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      listingType: form.listingType,
      category: form.category,
      tier: "GENERAL",
      country: form.country,
      value: form.value.trim() ? parseInt(form.value, 10) : null,
      approvalStatus: form.approvalStatus,
      meta,
    };
    try {
      setSaving(true);
      await api.patch(`/api/product/my/${id}`, payload);
      navigate(`/productpage/${id}`);
    } catch (err) {
      alert(
        err?.response?.data?.message || err?.message || "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  const renderMetaInput = (key, value) => {
    const options = SELECT_OPTIONS[key];
    if (options) {
      return (
        <select
          value={value}
          onChange={(e) => handleMetaChange(key, e.target.value)}
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleMetaChange(key, e.target.value)}
      />
    );
  };

  if (loading) {
    return (
      <div className="productcontainer1">
        <p>Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="productcontainer1">
        <div className="producthead1">
          <div className="backbutton" onClick={() => navigate("/products")}>
            <BiLeftArrowAlt />
          </div>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  const metaKeys = Object.keys(metaFields);

  return (
    <div className="productcontainer1">
      <div className="producthead1">
        <div className="backbutton" onClick={() => navigate(`/productpage/${id}`)}>
          <BiLeftArrowAlt />
        </div>
        <div className="productheadinfo">
          <h1 className="productsheader">Edit Product</h1>
          <span className="productheaddesc">Update product details</span>
        </div>
      </div>

      <form className="productedit-form" onSubmit={handleSubmit}>
        <h3 className="productedit-section-title">Basic Information</h3>
        <div className="productedit-field">
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </div>
        <div className="productedit-field">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
          />
        </div>
        <div className="productedit-row">
          <div className="productedit-field">
            <label>Listing Type</label>
            <select
              value={form.listingType}
              onChange={(e) => handleChange("listingType", e.target.value)}
            >
              {LISTING_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="productedit-field">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              {CATEGORIES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="productedit-row">
          <div className="productedit-field">
            <label>Price (&#8377;)</label>
            <input
              type="number"
              min={0}
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
            />
          </div>
          <div className="productedit-field">
            <label>Country</label>
            <select
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
            >
              {COUNTRIES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="productedit-field">
          <label>Approval Status</label>
          <select
            value={form.approvalStatus}
            onChange={(e) => handleChange("approvalStatus", e.target.value)}
          >
            {APPROVAL_STATUSES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {metaKeys.length > 0 && (
          <>
            <div className="productedit-divider"></div>
            <h3 className="productedit-section-title">Product Specifications</h3>
            <div className="productedit-meta-grid">
              {metaKeys.map((key) => (
                <div className="productedit-field" key={key}>
                  <label>{camelToLabel(key)}</label>
                  {renderMetaInput(key, metaFields[key])}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="productedit-actions">
          <button
            type="button"
            className="productsbackbutton"
            onClick={() => navigate(`/productpage/${id}`)}
          >
            Cancel
          </button>
          <button type="submit" className="editproductbutton" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
