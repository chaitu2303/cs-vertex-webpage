"use client";

import { useState } from "react";

export function ServiceCard({ service }: { service: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="service-card">
      <div className="service-icon">{service.icon}</div>
      <h3>{service.title}</h3>
      <p className="service-desc">{service.description}</p>
      
      <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Less Details" : "Learn More"}
      </button>

      {expanded && (
        <div className="service-details-expanded">
          <div className="detail-group">
            <strong>Key Deliverables:</strong> <p>{service.deliverables}</p>
          </div>
          <div className="detail-group">
            <strong>Industries Served:</strong> <p>{service.industries}</p>
          </div>
          <div className="detail-group">
            <strong>Business Value:</strong> <p>{service.businessValue}</p>
          </div>
        </div>
      )}
    </article>
  );
}
