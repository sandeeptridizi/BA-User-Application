import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";
import { MdFavorite } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaCrown } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import api from "../../../lib/api";
import { getFile } from "../../../lib/s3";

const CATEGORY_LABELS = {
  REAL_ESTATE: "Real Estate",
  CARS: "Cars",
  BIKES: "Bikes",
  FURNITURE: "Furniture",
  JEWELLERY_AND_WATCHES: "Jewellery & Watches",
  ARTS_AND_PAINTINGS: "Arts & Paintings",
  ANTIQUES: "Antiques",
  COLLECTABLES: "Collectables",
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return "Price on request";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const getLocationText = (meta) => {
  if (!meta || typeof meta !== "object") return "N/A";
  return (
    meta.location ||
    meta.city ||
    [meta.area, meta.city].filter(Boolean).join(", ") ||
    meta.state ||
    meta.address ||
    "N/A"
  );
};

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const res = await api.get("/api/wishlist/products");
        setProducts(res?.data?.data || []);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch wishlist"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (e, productId) => {
    e.stopPropagation();
    try {
      setRemovingId(productId);
      await api.delete(`/api/wishlist/${productId}`);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to remove from wishlist.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="wishlist-container">
      <div className="wishlist-head">
        <div className="wishlist-head-info">
          <h1 className="wishlist-header">
            <MdFavorite className="wishlist-header-icon" /> My Wishlist
          </h1>
          <span className="wishlist-head-desc">
            Products you've saved from the marketplace
          </span>
        </div>
        <div className="wishlist-count-badge">
          {products.length} item{products.length !== 1 ? "s" : ""}
        </div>
      </div>

      {isLoading && <p className="wishlist-loading">Loading wishlist...</p>}
      {!isLoading && errorMessage && (
        <p className="wishlist-error">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && products.length === 0 && (
        <div className="wishlist-empty">
          <MdFavorite className="wishlist-empty-icon" />
          <h2>Your wishlist is empty</h2>
          <p>Products you heart on the marketplace will appear here.</p>
        </div>
      )}

      {!isLoading && !errorMessage && products.length > 0 && (
        <div className="wishlist-grid">
          {products.map((product) => (
            <div
              className="wishlist-card"
              key={product.id}
              onClick={() => navigate(`/productpage/${product.id}`)}
            >
              <div className="wishlist-card-image-wrap">
                <img
                  src={
                    product.media?.[0]
                      ? getFile(product.media[0])
                      : ""
                  }
                  alt={product.title}
                  className="wishlist-card-img"
                />
                <div className="wishlist-card-badges">
                  <span className="wishlist-badge-verified">
                    <MdVerified /> Verified
                  </span>
                  <span className="wishlist-badge-tier">
                    <FaCrown />{" "}
                    {product.tier
                      ? product.tier.charAt(0) + product.tier.slice(1).toLowerCase()
                      : "General"}
                  </span>
                </div>
              </div>
              <div className="wishlist-card-body">
                <h3 className="wishlist-card-title">{product.title}</h3>
                <span className="wishlist-card-category">
                  {CATEGORY_LABELS[product.category] || product.category}
                </span>
                <span className="wishlist-card-location">
                  <HiOutlineLocationMarker /> {getLocationText(product.meta)}
                </span>
                <div className="wishlist-card-footer">
                  <h3 className="wishlist-card-price">
                    {formatCurrency(product.value)}
                  </h3>
                  <button
                    className="wishlist-remove-btn"
                    onClick={(e) => handleRemove(e, product.id)}
                    disabled={removingId === product.id}
                  >
                    {removingId === product.id ? "Removing..." : (
                      <><MdFavorite /> Remove</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
