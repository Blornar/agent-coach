"use client";
import { useRef, useEffect, useState } from "react";

/**
 * Renders HTML inside a phone-shaped frame with realistic bezel.
 * The iframe is sandboxed and sized to 375x812 (iPhone dimensions).
 */
export default function PhoneMockup({ html }) {
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!iframeRef.current || !html) return;
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setLoaded(true);
    }
  }, [html]);

  if (!html) return null;

  return (
    <div className="mt-3 flex justify-center">
      <div className="relative" style={{ width: 260 }}>
        {/* Phone bezel */}
        <div className="relative bg-[#1a1a1a] rounded-[32px] p-[8px] shadow-xl"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.08)" }}>

          {/* Notch / Dynamic Island */}
          <div className="absolute top-[8px] left-1/2 -translate-x-1/2 z-10">
            <div className="w-[72px] h-[22px] bg-[#1a1a1a] rounded-b-[14px]" />
          </div>

          {/* Screen container */}
          <div className="relative overflow-hidden rounded-[24px] bg-white"
            style={{ width: 244, height: 528 }}>
            {/* Loading shimmer */}
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
                <div className="w-6 h-6 border-2 border-[#FFCC00] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <iframe
              ref={iframeRef}
              title="Phone mockup preview"
              sandbox="allow-same-origin"
              className="w-full h-full border-0"
              style={{
                width: 375,
                height: 812,
                transform: "scale(0.6507)",
                transformOrigin: "top left",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pt-[6px] pb-[2px]">
            <div className="w-[80px] h-[4px] rounded-full bg-neutral-600" />
          </div>
        </div>

        {/* Phone label */}
        <p className="text-center text-xs text-neutral-400 mt-3 font-medium">Preview &middot; iPhone 14</p>
      </div>
    </div>
  );
}
