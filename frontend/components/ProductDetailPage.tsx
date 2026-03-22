"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProductById } from "../services/productService";
import type { Product } from "../services/types";
import { addToCart } from "../services/cartService";
import { formatPrice } from "../utils/formatPrice";
import { resolveImageUrl } from "../utils/resolveImageUrl";

export default function ProductDetailPage({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    getProductById(productId)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product || !product.stock || product.stock < quantity) return;
    
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      // Show success message (you could add a toast notification here)
      alert(`${quantity} ${product.name} added to cart!`);
    } catch (error) {
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex justify-content-center align-items-center" style={{ height: "500px" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="placeholder-glow">
              <h1 className="placeholder col-8"></h1>
              <p className="placeholder col-6"></p>
              <h3 className="placeholder col-4"></h3>
              <p className="placeholder col-12"></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <a href="/products" className="btn btn-primary">Browse Products</a>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const hasStock = product.stock > 0;
  const maxQuantity = Math.min(product.stock, 10); // Limit to 10 per order

  return (
    <div className="container">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item"><a href="/products">Products</a></li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <div className="row">
        {/* Product Images */}
        <div className="col-md-6">
          <div className="product-images">
            {/* Main Image */}
            <div className="main-image-container mb-3">
              {images.length > 0 ? (
                <Image
                  src={resolveImageUrl(images[selectedImage]?.url)}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="img-fluid rounded main-image"
                  style={{ objectFit: "cover", maxHeight: "600px" }}
                />
              ) : (
                <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: "600px" }}>
                  <div className="text-center text-muted">
                    <i className="bi bi-image fs-1"></i>
                    <p className="mb-0">No Image Available</p>
                  </div>
                </div>
              )}
              
              {!hasStock && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 rounded">
                  <span className="badge bg-danger fs-4">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="thumbnail-container d-flex gap-2 overflow-auto">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail-item ${selectedImage === index ? 'border-primary' : 'border-secondary'}`}
                    onClick={() => setSelectedImage(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      src={resolveImageUrl(image.url)}
                      alt={`${product.name} - Image ${index + 1}`}
                      width={80}
                      height={80}
                      className={`img-thumbnail ${selectedImage === index ? 'border-primary border-2' : ''}`}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <div className="product-details">
            {/* Brand and Category */}
            <div className="mb-3">
              {product.brand && (
                <span className="badge bg-light text-dark text-uppercase me-2">
                  {product.brand}
                </span>
              )}
              {product.category && (
                <span className="badge bg-primary">
                  {product.category.name}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="mb-3">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="mb-3">
                <span className="text-warning">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`bi bi-star${i < Math.floor(product.rating!) ? '-fill' : ''}`}></i>
                  ))}
                </span>
                <span className="text-muted ms-2">({product.rating.toFixed(1)})</span>
              </div>
            )}

            {/* Price */}
            <div className="mb-4">
              <h2 className="text-primary">{formatPrice(product.price)}</h2>
              {product.stock > 0 && (
                <small className="text-success">
                  <i className="bi bi-check-circle"></i> In Stock ({product.stock} available)
                </small>
              )}
              {!hasStock && (
                <small className="text-danger">
                  <i className="bi bi-x-circle"></i> Out of Stock
                </small>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <h5>Description</h5>
              <p className="text-muted">{product.description || "No description available."}</p>
            </div>

            {/* Add to Cart Section */}
            {hasStock && (
              <div className="add-to-cart-section mb-4">
                <div className="row align-items-center mb-3">
                  <div className="col-auto">
                    <label htmlFor="quantity" className="form-label">Quantity:</label>
                  </div>
                  <div className="col-auto">
                    <input
                      type="number"
                      id="quantity"
                      className="form-control"
                      min="1"
                      max={maxQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                      style={{ width: "80px" }}
                    />
                  </div>
                  <div className="col">
                    <small className="text-muted">({maxQuantity} max per order)</small>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg w-100"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cart-plus me-2"></i>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Product Features */}
            <div className="product-features">
              <h5>Product Information</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  {hasStock ? 'Available for immediate shipping' : 'Currently out of stock'}
                </li>
                <li className="mb-2">
                  <i className="bi bi-shield-check text-success me-2"></i>
                  30-day return policy
                </li>
                <li className="mb-2">
                  <i className="bi bi-truck text-success me-2"></i>
                  Free shipping on orders over $50
                </li>
                <li className="mb-2">
                  <i className="bi bi-credit-card text-success me-2"></i>
                  Secure payment processing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .main-image-container {
          position: relative;
          overflow: hidden;
        }
        .thumbnail-item {
          transition: all 0.2s ease-in-out;
        }
        .thumbnail-item:hover {
          transform: scale(1.05);
        }
        .product-details {
          position: sticky;
          top: 20px;
        }
      `}</style>
    </div>
  );
}

