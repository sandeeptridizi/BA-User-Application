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

const APPROVAL_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

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
    value: "",
    approvalStatus: "PENDING",
    metaJson: "{}",
  });

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
          value: p.value != null ? String(p.value) : "",
          approvalStatus: p.approvalStatus || "PENDING",
          metaJson:
            p.meta != null
              ? JSON.stringify(p.meta, null, 2)
              : "{}",
        });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;
    let meta;
    try {
      meta = form.metaJson.trim() ? JSON.parse(form.metaJson) : null;
    } catch {
      alert("Invalid JSON in Meta field.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      listingType: form.listingType,
      category: form.category,
      tier: form.tier,
      value: form.value.trim() ? parseInt(form.value, 10) : null,
      approvalStatus: form.approvalStatus,
      meta,
    };
    try {
      setSaving(true);
      await api.patch(`/api/product/${id}`, payload);
      navigate(`/productpage/${id}`);
    } catch (err) {
      alert(
        err?.response?.data?.message || err?.message || "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
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
            <label>Tier</label>
            <select
              value={form.tier}
              onChange={(e) => handleChange("tier", e.target.value)}
            >
              {TIERS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="productedit-field">
            <label>Value (₹)</label>
            <input
              type="number"
              min={0}
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
            />
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
        <div className="productedit-field">
          <label>Meta (JSON)</label>
          <textarea
            value={form.metaJson}
            onChange={(e) => handleChange("metaJson", e.target.value)}
            rows={6}
            className="productedit-meta"
            placeholder='{"location": "...", "views": 0}'
          />
        </div>
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
