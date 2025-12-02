import React, { useState } from 'react';
import { generateTripPDF } from '../utils/pdfGenerator';

export default function TripShare({ trip, onClose }) {
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareUrl = `${window.location.origin}/share/${trip.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    generateTripPDF(trip);
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trip.destination || 'Trip'} Itinerary`,
          text: `Check out my trip itinerary to ${trip.destination || 'this destination'}!`,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      setShowShareOptions(true);
    }
  };

  return (
    <div className="trip-share">
      <div className="trip-share__header">
        <h3>Share Trip Itinerary</h3>
        {onClose && (
          <button className="tm-icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        )}
      </div>
      
      <div className="trip-share__content">
        <div className="trip-share__option">
          <label className="trip-share__label">Shareable Link</label>
          <div className="trip-share__input-group">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="trip-share__input"
              onClick={(e) => e.target.select()}
            />
            <button
              className={`tm-btn ${copied ? 'success' : 'primary'}`}
              onClick={handleCopyLink}
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
          <p className="trip-share__hint">
            Anyone with this link can view your trip itinerary
          </p>
        </div>

        <div className="trip-share__divider"></div>

        <div className="trip-share__actions">
          <button
            className="tm-btn primary"
            onClick={handleDownloadPDF}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          >
            📄 Download as PDF
          </button>
          
          {navigator.share && (
            <button
              className="tm-btn ghost"
              onClick={handleShareNative}
              style={{ width: '100%' }}
            >
              📤 Share via...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

