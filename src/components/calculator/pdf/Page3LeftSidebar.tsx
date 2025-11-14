import React from "react";
import "./LeftPanel.css";

const LeftPanel = () => {
  return (
    <div className="left-column">
      <div className="left-panel">
        <div className="panel-header">
          <div className="monitor-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8v4M10 10h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="panel-title">Ingevulde gegevens</h2>
        </div>

        <ul className="data-list">
          <li className="data-item">
            <div className="data-label">OMZET</div>
            <div className="data-value">€ 8.100.000,-</div>
          </li>
          <li className="data-item">
            <div className="data-label">EBITDA</div>
            <div className="data-value">€ 3.100.000,-</div>
          </li>
          <li className="data-item">
            <div className="data-label">FTE</div>
            <div className="data-value">50-100</div>
          </li>
          <li className="data-item">
            <div className="data-label">SECTOR</div>
            <div className="data-value highlight">IT & SOFTWARE</div>
          </li>
          <li className="data-item">
            <div className="data-label">MANAGEMENTSPARTICIPATIE</div>
            <div className="data-value">JA</div>
          </li>
        </ul>
      </div>

      <div className="left-image-section">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
          alt="Business meeting"
          className="business-image"
        />
      </div>

      <div className="fbm-logo">
        <div className="logo-icon"></div>
        <div className="logo-text">
          <span className="logo-fbm">fbm</span>
          <span className="logo-finance">Corporate Finance</span>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
