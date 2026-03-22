import Image from "next/image";
import Link from "next/link";
import type { Product } from "../services/types";
import { formatPrice } from "../utils/formatPrice";
import { resolveImageUrl } from "../utils/resolveImageUrl";

export default function ProductCard({ product }: { product: Product }) {
  const mainImage = resolveImageUrl(product.images?.[0]?.url);
  const hasStock = product.stock > 0;
  
  return (
    <div className="card h-100 product-card">
      <div className="position-relative">
        {mainImage ? (
          <div className="image-container">
            <Image
              src={mainImage}
              alt={product.name}
              width={400}
              height={250}
              className="card-img-top product-image"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: "250px" }}>
            <div className="text-center text-muted">
              <i className="bi bi-image fs-1"></i>
              <p className="mb-0 small">No Image</p>
            </div>
          </div>
        )}
        
        {!hasStock && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75">
            <span className="badge bg-danger fs-6">Out of Stock</span>
          </div>
        )}
        
        {product.rating && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-warning text-dark">
              <i className="bi bi-star-fill me-1"></i>
              {product.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <div className="mb-2">
          {product.brand && (
            <small className="text-muted text-uppercase">{product.brand}</small>
          )}
        </div>
        <h5 className="card-title">{product.name}</h5>
        
        <div className="mb-3">
          <span className="h4 text-primary fw-bold">
            {formatPrice(product.price)}
          </span>
          {product.stock > 0 && (
            <small className="text-muted ms-2">
              <i className="bi bi-box-seam"></i> {product.stock} left
            </small>
          )}
        </div>
        
        {product.category && (
          <div className="mb-3">
            <span className="badge bg-light text-dark">
              {product.category.name}
            </span>
          </div>
        )}
        
        <div className="mt-auto">
          <Link 
            href={`/products/${product._id}`} 
            className={`btn w-100 ${hasStock ? 'btn-primary' : 'btn-secondary'}`}
          >
            <i className="bi bi-eye me-2"></i>
            {hasStock ? 'View Details' : 'View Details'}
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        .product-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .image-container {
          position: relative;
          overflow: hidden;
        }
        .product-image {
          transition: transform 0.3s ease-in-out;
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}

