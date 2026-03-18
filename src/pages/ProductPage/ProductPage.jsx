import "./ProductPage.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFile } from "../../../lib/s3";

const getImageUrl = (key) =>
  key && String(key).startsWith("http") ? key : getFile(key);
import { BiLeftArrowAlt } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineCube } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { LuPhone } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";

import api from "../../../lib/api";

const PLACEHOLDER_IMAGES = [
  "https://via.placeholder.com/678x396?text=No+Image",
  "https://via.placeholder.com/208x122?text=Image",
  "https://via.placeholder.com/208x122?text=Image",
  "https://via.placeholder.com/208x122?text=Image",
];

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

const LISTING_TYPE_LABELS = {
  MARKETPLACE: "Marketplace",
  BUY_NOW: "Buy Now",
  AUCTIONS: "Auctions",
  TO_LET: "To-Let",
};

const TIER_LABELS = {
  GENERAL: "General",
  LUXURY: "Luxury",
  CLASSIC: "Classic",
};

const statusToLabel = (status) => {
  if (status === "APPROVED") return "active";
  if (status === "REJECTED") return "rejected";
  return "inactive";
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const getLocationText = (meta) => {
  if (!meta || typeof meta !== "object") return "Location not added";
  const location =
    meta.location ||
    meta.city ||
    [meta.area, meta.city].filter(Boolean).join(", ") ||
    meta.state ||
    meta.address;
  return location || "Location not added";
};

const getViews = (meta) => (meta && typeof meta === "object" ? Number(meta.views || 0) : 0);

const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const camelToLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

const SKIP_META_KEYS = new Set(["views", "features", "keyFeatures", "location", "city", "area", "state", "address"]);

const getMetaDetails = (meta) => {
  if (!meta || typeof meta !== "object") return [];
  return Object.entries(meta)
    .filter(([key, value]) => !SKIP_META_KEYS.has(key) && value !== "" && value !== null && value !== undefined)
    .map(([key, value]) => ({
      label: camelToLabel(key),
      value: typeof value === "object" ? JSON.stringify(value) : String(value),
    }));
};

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageQueue, setImageQueue] = useState(PLACEHOLDER_IMAGES);

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
        const response = await api.get(`/api/product/${id}`);
        const data = response?.data?.data;
        setProduct(data);
        const urls = Array.isArray(data?.media) && data.media.length > 0
          ? data.media
          : PLACEHOLDER_IMAGES;
        setImageQueue(urls);
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Failed to fetch product.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (imageQueue.length === 0) return;
    const interval = setInterval(() => {
      setImageQueue((prev) => {
        const updated = [...prev];
        const first = updated.shift();
        updated.push(first);
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [product?.id]);

  if (loading) {
    return (
      <div className="productpagecontainer">
        <p>Loading...</p>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="productpagecontainer">
        <div className="producthead1">
          <div className="backbutton" onClick={() => navigate("/products")}>
            <BiLeftArrowAlt />
          </div>
        </div>
        <p>{error || "Product not found"}</p>
      </div>
    );
  }

  const meta = product.meta || {};
  const features = Array.isArray(meta.features) ? meta.features : (meta.keyFeatures ? [meta.keyFeatures] : []);
  const owner = product.owner || {};
  const views = getViews(meta);
  const metaDetails = getMetaDetails(meta);

  return (
    <div className="productpagecontainer">
      <div className="producthead1">
        <div className="backbutton" onClick={() => navigate("/products")}>
          <BiLeftArrowAlt />
        </div>
        <div className="producthead">
          <div className="productheadinfo">
            <h1 className="productsheader">{product.title}</h1>
            <span className="productheaddesc1">
              <HiOutlineCube />{" "}
              {CATEGORY_LABELS[product.category] || product.category}
            </span>
            <span className="productheaddesc1">
              <IoLocationOutline /> {getLocationText(meta)}
            </span>
          </div>
          <button
            className="addproduct"
            onClick={() => navigate(`/productedit/${product.id}`)}
          >
            {" "}
            <FaRegEdit /> Edit Product
          </button>
        </div>
      </div>
      <div className="productpagedetail">
        <div className="productpageleft">
          <div className="productpageimage">
            <img
              src={getImageUrl(imageQueue[0])}
              alt="product"
              className="productheaderimage"
            />
            <ul className="productimagescroller">
              {imageQueue.slice(1, 4).map((img, index) => (
                <li key={index}>
                  <img
                    src={getImageUrl(imageQueue[index])}
                    alt="product"
                    className="productimageone"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="productdescription">
            <h2 className="producttitle">Product Description</h2>
            <p className="productdescpara">
              {product.description || "No description."}
            </p>
          </div>

          <div className="productdescription">
            <h2 className="producttitle">Basic Information</h2>
            <div className="productdetails-grid">
              <div className="productdetail-item">
                <span className="productdetail-label">Listing Type</span>
                <span className="productdetail-value">
                  {LISTING_TYPE_LABELS[product.listingType] || product.listingType}
                </span>
              </div>
              <div className="productdetail-item">
                <span className="productdetail-label">Category</span>
                <span className="productdetail-value">
                  {CATEGORY_LABELS[product.category] || product.category}
                </span>
              </div>
              <div className="productdetail-item">
                <span className="productdetail-label">Tier</span>
                <span className="productdetail-value">
                  {TIER_LABELS[product.tier] || product.tier}
                </span>
              </div>
              <div className="productdetail-item">
                <span className="productdetail-label">Value</span>
                <span className="productdetail-value">
                  {formatCurrency(product.value)}
                </span>
              </div>
              {product.country && (
                <div className="productdetail-item">
                  <span className="productdetail-label">Country</span>
                  <span className="productdetail-value">{product.country}</span>
                </div>
              )}
              {meta.city && (
                <div className="productdetail-item">
                  <span className="productdetail-label">City</span>
                  <span className="productdetail-value">{meta.city}</span>
                </div>
              )}
              {meta.socialMediaLink && (
                <div className="productdetail-item">
                  <span className="productdetail-label">Social Media Link</span>
                  <span className="productdetail-value">{meta.socialMediaLink}</span>
                </div>
              )}
            </div>
          </div>

          {metaDetails.length > 0 && (
            <div className="productdescription">
              <h2 className="producttitle">Product Specifications</h2>
              <div className="productdetails-grid">
                {metaDetails.map((detail, i) => (
                  <div className="productdetail-item" key={i}>
                    <span className="productdetail-label">{detail.label}</span>
                    <span className="productdetail-value">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {features.length > 0 && (
            <div className="productdescription">
              <h2 className="producttitle">Key Features</h2>
              <div className="productfeatures">
                <ul className="productfeaturesleft">
                  {features.slice(0, 3).map((f, i) => (
                    <li key={i} className="productfeaturelist">
                      <LuDot className="featuredoticon" />
                      {typeof f === "string" ? f : JSON.stringify(f)}
                    </li>
                  ))}
                </ul>
                <ul className="productfeaturesright">
                  {features.slice(3, 6).map((f, i) => (
                    <li key={i} className="productfeaturelist">
                      <LuDot className="featuredoticon" />
                      {typeof f === "string" ? f : JSON.stringify(f)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="productowner">
            <h2 className="producttitle">Owner Information</h2>
            <div className="productownerinfo">
              <div className="productownericon">
                <FiUser />
              </div>
              <ul className="productownedetails">
                <li className="productownerdata">Owner Name</li>
                <li className="productownername">{owner.name || "—"}</li>
              </ul>
            </div>
            <div className="productownerinfo">
              <div className="productownericon">
                <LuPhone />
              </div>
              <ul className="productownedetails">
                <li className="productownerdata">Contact Number</li>
                <li className="productownername">{owner.phone || "—"}</li>
              </ul>
            </div>
            <div className="productownerinfo">
              <div className="productownericon">
                <MdOutlineEmail />
              </div>
              <ul className="productownedetails">
                <li className="productownerdata">Email Address</li>
                <li className="productownername">{owner.email || "—"}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="productpageright">
          <div className="productstatus">
            <h2 className="producttitle">Product Status</h2>
            <span className="currentstatus">Current Status</span>
            <p className="productpageactivetag">
              {statusToLabel(product.approvalStatus)}
            </p>
            <div className="productbreakline"></div>
            <span className="currentstatus">Listed Price</span>
            <p className="productpagepricetag">
              {formatCurrency(product.value)}
            </p>
            <span className="currentstatus">
              {formatCurrency(product.value)}
            </span>
          </div>
          {/* <div className="productperformance">
            <h2 className="producttitle">Performance</h2>
            <div className="performanceviews">
              <span className="currentstatus1">
                <IoEyeOutline />
                Total Views
              </span>
              <span className="performancecount">
                {new Intl.NumberFormat("en-IN").format(views)}
              </span>
            </div>
            <div className="productbreakline"></div>
            <div className="performanceviews">
              <span className="currentstatus1">
                <FiUser />
                Leads Generated
              </span>
              <span className="performancecount">—</span>
            </div>
          </div> */}
          <div className="productowner1">
            <h2 className="producttitle">Timeline</h2>
            <div className="productownerinfo">
              <div className="productownericon">
                <CiCalendar />
              </div>
              <ul className="productownedetails">
                <li className="productownerdata">Created</li>
                <li className="productownername">
                  {formatDate(product.createdAt)}
                </li>
              </ul>
            </div>
            <div className="productownerinfo">
              <div className="productownericon">
                <CiCalendar />
              </div>
              <ul className="productownedetails">
                <li className="productownerdata">Last Updated</li>
                <li className="productownername">
                  {formatDate(product.updatedAt)}
                </li>
              </ul>
            </div>
          </div>
          <div className="productpagebuttons">
            <button
              className="editproductbutton"
              onClick={() => navigate(`/productedit/${product.id}`)}
            >
              <FiEdit />
              Edit Product
            </button>
            <button
              className="productsbackbutton"
              onClick={() => navigate("/products")}
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
