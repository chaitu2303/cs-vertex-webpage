"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Quote, Star } from 'lucide-react'

export function ClientReviews({ testimonials = [] }: { testimonials?: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (testimonials.length === 0) return null;

  // Duplicate the array for infinite scrolling effect
  const sliderItems = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="reviews" className="section-gap" style={{ background: '#0B0B0B', color: '#fff', overflow: 'hidden' }}>
      <div className="container-1400" style={{ marginBottom: '50px' }}>
        <div className="section-index"><i></i> <span>08</span> <span>/</span> <span>CLIENT REVIEWS</span></div>
        <h2 style={{ fontSize: 'clamp(38px, 4.3vw, 70px)', color: 'var(--acid)', fontWeight: 500, letterSpacing: '-.065em', lineHeight: .93 }}>
          Client <span style={{ color: '#ffffff', fontWeight: 400, fontStyle: 'normal' }}>Testimonials</span>
        </h2>
      </div>

      <div className="reviews-marquee-container">
        <div className={`reviews-track ${mounted ? 'animate' : ''}`}>
          {sliderItems.map((review: any, i: number) => (
            <div key={`${review.id}-${i}`} className="review-card">
              <div className="review-header">
                <div className="client-info">
                  {review.image ? (
                    <Image src={review.image} alt={review.name} width={50} height={50} className="client-photo" unoptimized />
                  ) : (
                    <div className="client-photo-placeholder">{review.name.charAt(0)}</div>
                  )}
                  <div>
                    <h4 className="client-name">{review.name}</h4>
                    <p className="client-role">{review.role || 'Enterprise Client'}</p>
                  </div>
                </div>
                {review.companyLogo && (
                   <Image src={review.companyLogo} alt="Company" width={100} height={30} className="company-logo" unoptimized />
                )}
              </div>
              
              <div className="review-stars">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={14} fill={idx < (review.rating || 5) ? "#FF6B2C" : "transparent"} color={idx < (review.rating || 5) ? "#FF6B2C" : "#333"} />
                ))}
              </div>

              <p className="review-text">"{review.message}"</p>
              
              <div className="review-footer">
                <span className="review-date">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}</span>
                <Quote size={24} color="rgba(255, 107, 44, 0.2)" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .reviews-marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 20px 0;
        }

        .reviews-marquee-container::before,
        .reviews-marquee-container::after {
          content: "";
          position: absolute;
          top: 0;
          width: 15%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .reviews-marquee-container::before {
          left: 0;
          background: linear-gradient(to right, #0B0B0B, transparent);
        }

        .reviews-marquee-container::after {
          right: 0;
          background: linear-gradient(to left, #0B0B0B, transparent);
        }

        .reviews-track {
          display: flex;
          gap: 30px;
          width: max-content;
        }

        .reviews-track.animate {
          animation: marquee 40s linear infinite;
        }

        .reviews-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }

        .review-card {
          width: 450px;
          background: #111111;
          border: 1px solid #222;
          border-radius: 16px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
          flex-shrink: 0;
        }

        .review-card:hover {
          transform: translateY(-5px);
          border-color: #333;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .client-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .client-photo {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #222;
        }

        .client-photo-placeholder {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #222;
          color: #FF6B2C;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 20px;
        }

        .client-name {
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .client-role {
          margin: 0;
          font-size: 13px;
          color: #888;
        }

        .company-logo {
          height: 25px;
          width: auto;
          opacity: 0.7;
          filter: grayscale(100%) brightness(200%);
        }

        .review-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 20px;
        }

        .review-text {
          font-size: 15px;
          line-height: 1.7;
          color: #aaa;
          margin: 0 0 30px;
          flex-grow: 1;
        }

        .review-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .review-date {
          font-size: 12px;
          color: #666;
          font-family: var(--mono);
        }

        @media (max-width: 768px) {
          .review-card {
            width: 320px;
            padding: 24px;
          }
        }
      `}</style>
    </section>
  )
}
