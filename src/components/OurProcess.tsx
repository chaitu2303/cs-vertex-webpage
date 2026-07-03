"use client"

import React from 'react'
import { Search, Calendar, Briefcase } from 'lucide-react'

export function OurProcess() {
  return (
    <section className="section-gap" style={{ background: '#f9f9f9', color: '#111', padding: '100px 4vw', textAlign: 'center' }}>
      <div className="container-1400" style={{ margin: '0 auto' }}>
        
        {/* Scoped CSS Styles for premium look, animations, and responsiveness */}
        <style dangerouslySetInnerHTML={{ __html: `
          .process-flow-container {
            display: flex;
            align-items: stretch; /* Make all cards equal height on desktop */
            justify-content: center;
            position: relative;
            width: 100%;
            margin-top: 50px;
          }

          .process-card {
            background: #ffffff;
            border: 1px solid rgba(0, 0, 0, 0.06);
            border-radius: 16px;
            padding: 45px 35px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
            cursor: default;
            overflow: hidden;
            flex: 1;
            z-index: 2;
          }
          
          /* Glow-line at the top of cards on hover */
          .process-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #eab308, #FF5A2A);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .process-card:hover {
            transform: translateY(-10px) scale(1.02);
            border-color: rgba(234, 179, 8, 0.4);
            box-shadow: 0 25px 50px rgba(234, 179, 8, 0.08), 0 5px 15px rgba(0, 0, 0, 0.03);
          }

          .process-card:hover::before {
            opacity: 1;
          }
          
          /* Circle icon container styling */
          .process-icon-outer {
            width: 110px;
            height: 110px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 25px;
            position: relative;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 2;
          }

          /* Step 1 & 3 Icons (white background, yellow icon) */
          .icon-light-bg {
            background: #fff;
            color: #eab308;
            border: 1px solid rgba(234, 179, 8, 0.2);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
          }

          /* Step 2 Icon (solid yellow/gold background, white icon) */
          .icon-solid-bg {
            background: #eab308;
            color: #fff;
            box-shadow: 0 8px 24px rgba(234, 179, 8, 0.25);
          }

          /* Hover transformations */
          .process-card:hover .process-icon-outer {
            transform: scale(1.08);
          }

          .process-card:hover .icon-light-bg {
            background: rgba(234, 179, 8, 0.05);
            border-color: #eab308;
            color: #ff5a2a;
            box-shadow: 0 12px 30px rgba(234, 179, 8, 0.15);
          }

          .process-card:hover .icon-solid-bg {
            background: #ff5a2a;
            box-shadow: 0 12px 30px rgba(255, 90, 42, 0.3);
          }

          /* Animated outer glow ring on hover */
          .pulse-ring {
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            border: 2px solid #eab308;
            opacity: 0;
            transform: scale(0.9);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
          }
          
          .process-card:hover .pulse-ring {
            opacity: 0.35;
            transform: scale(1.05);
            animation: pulse-expand 2s infinite ease-out;
          }

          .icon-solid-bg .pulse-ring {
            border-color: #ff5a2a;
          }

          @keyframes pulse-expand {
            0% { transform: scale(1.02); opacity: 0.35; }
            50% { transform: scale(1.15); opacity: 0.1; }
            100% { transform: scale(1.02); opacity: 0.35; }
          }

          /* Card typography enhancements */
          .process-card h3 {
            font-size: 21px;
            font-weight: 700;
            color: #111;
            margin: 0 0 12px;
            transition: color 0.3s ease;
          }

          .process-card:hover h3 {
            color: #ff5a2a;
          }

          .process-card p {
            color: #666;
            font-size: 14.5px;
            line-height: 1.6;
            margin: 0;
            transition: color 0.3s ease;
          }

          .process-card:hover p {
            color: #333;
          }

          /* Connectors & Arrows */
          .process-connector {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            position: relative;
            z-index: 1;
          }

          .flow-line {
            stroke-dasharray: 8 6;
            animation: flow-move 1.2s linear infinite;
          }

          @keyframes flow-move {
            to {
              stroke-dashoffset: -28;
            }
          }

          /* Responsive Rules */
          @media (min-width: 900px) {
            .process-flow-container {
              flex-direction: row;
              gap: 15px;
            }
            .process-card {
              max-width: 360px;
            }
            .process-connector {
              width: 80px;
              /* Center horizontal line aligned with circle center */
              /* circle center is at padding-top(45px) + circle-radius(55px) = 100px */
              margin-top: 88px; 
            }
            .desktop-arrow {
              display: block;
              width: 70px;
              height: 24px;
            }
            .mobile-arrow {
              display: none;
            }
          }

          @media (max-width: 899px) {
            .process-flow-container {
              flex-direction: column;
              align-items: center;
              gap: 0;
            }
            .process-card {
              width: 100%;
              max-width: 460px;
              padding: 35px 25px;
            }
            .process-connector {
              height: 50px;
              width: 100%;
              margin: 10px 0;
            }
            .desktop-arrow {
              display: none;
            }
            .mobile-arrow {
              display: block;
              width: 24px;
              height: 44px;
            }
          }
        ` }} />

        <p style={{ color: '#eab308', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>
          Our Process
        </p>
        <h2 style={{ fontSize: '42px', fontWeight: 700, margin: '0 0 60px', color: '#111' }}>
          How We <span style={{ position: 'relative', display: 'inline-block', zIndex: 1 }}>
            Works
            <span style={{ position: 'absolute', bottom: '8px', left: 0, width: '100%', height: '8px', background: '#eab308', zIndex: -1 }}></span>
          </span>
        </h2>

        <div className="process-flow-container">
          
          {/* Step 1 */}
          <article className="process-card">
            <div className="process-icon-outer icon-light-bg">
              <Search size={44} strokeWidth={1.5} />
              <div className="pulse-ring"></div>
            </div>
            <h3>Choose Your Service</h3>
            <p>
              With years of experience, our consultants bring deep technical knowledge and industry insights.
            </p>
          </article>

          {/* Connector 1 */}
          <div className="process-connector">
            {/* Desktop Horizontal Arrow */}
            <svg className="desktop-arrow" viewBox="0 0 70 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="flow-line" d="M 0 12 L 60 12" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 54 6 L 64 12 L 54 18" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Mobile Vertical Arrow */}
            <svg className="mobile-arrow" viewBox="0 0 24 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="flow-line" d="M 12 0 L 12 34" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 6 28 L 12 38 L 18 28" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Step 2 */}
          <article className="process-card">
            <div className="process-icon-outer icon-solid-bg">
              <Calendar size={44} strokeWidth={1.5} />
              <div className="pulse-ring"></div>
            </div>
            <h3>Client-Centric Approach</h3>
            <p>
              We prioritize our clients' needs and tailor solutions to fit their goals, budget, and timeline.
            </p>
          </article>

          {/* Connector 2 */}
          <div className="process-connector">
            {/* Desktop Horizontal Arrow */}
            <svg className="desktop-arrow" viewBox="0 0 70 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="flow-line" d="M 0 12 L 60 12" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 54 6 L 64 12 L 54 18" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Mobile Vertical Arrow */}
            <svg className="mobile-arrow" viewBox="0 0 24 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="flow-line" d="M 12 0 L 12 34" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 6 28 L 12 38 L 18 28" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Step 3 */}
          <article className="process-card">
            <div className="process-icon-outer icon-light-bg">
              <Briefcase size={44} strokeWidth={1.5} />
              <div className="pulse-ring"></div>
            </div>
            <h3>Proven Results</h3>
            <p>
              CS Vertex has a track record of successful projects across various industries, consistently delivering measurable results.
            </p>
          </article>

        </div>

      </div>
    </section>
  )
}
