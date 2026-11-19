import { useEffect } from "react";

/**
 * The discovery chamber is a lightweight SVG / CSS illustration, not a game of
 * chance. Random project selection happens exactly once in the route. The
 * changing silhouettes are decorative and never alter the selected result.
 */
export function FinalBuildScanner({
  scanning,
  onSkip,
}: {
  scanning: boolean;
  onSkip: () => void;
}) {
  useEffect(() => {
    if (scanning && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      onSkip();
    }
  }, [scanning, onSkip]);

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[680px] items-center justify-center overflow-hidden">
      <style>{`
        @keyframes bsr-scan-line {
          0% { transform: translateY(-162px); opacity: 0; }
          15% { opacity: .9; }
          85% { opacity: .9; }
          100% { transform: translateY(170px); opacity: 0; }
        }
        @keyframes bsr-robot-flicker {
          0%, 26% { opacity: .13; transform: translateX(-8px) scale(.92); }
          30%, 59% { opacity: .95; transform: translateX(0px) scale(1); }
          63%, 100% { opacity: .13; transform: translateX(9px) scale(.94); }
        }
        @keyframes bsr-energy {
          0%, 100% { opacity: .55; filter: drop-shadow(0 0 3px #34ebff); }
          50% { opacity: 1; filter: drop-shadow(0 0 13px #34ebff); }
        }
        @keyframes bsr-levitate {
          0%, 100% { transform: translateY(3px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes bsr-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes bsr-orbit {
          to { transform: rotate(360deg); }
        }
        .bsr-scanner-glow { animation: bsr-energy 2s ease-in-out infinite; }
        .bsr-scanner-float { animation: bsr-levitate 3s ease-in-out infinite; }
        .bsr-scanner-beam { animation: bsr-scan-line 1.05s linear infinite; }
        .bsr-scanner-robot-a { animation: bsr-robot-flicker 1.35s linear infinite; transform-origin: 280px 270px; }
        .bsr-scanner-robot-b { animation: bsr-robot-flicker 1.35s -.45s linear infinite; transform-origin: 280px 270px; }
        .bsr-scanner-robot-c { animation: bsr-robot-flicker 1.35s -.9s linear infinite; transform-origin: 280px 270px; }
        .bsr-scanner-progress { animation: bsr-progress 4.15s linear both; transform-origin: left center; }
        .bsr-scanner-satellite { animation: bsr-orbit 18s linear infinite; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) {
          .bsr-scanner-glow,.bsr-scanner-float,.bsr-scanner-beam,
          .bsr-scanner-robot-a,.bsr-scanner-robot-b,.bsr-scanner-robot-c,
          .bsr-scanner-progress,.bsr-scanner-satellite { animation: none !important; }
          .bsr-scanner-robot-b,.bsr-scanner-robot-c { opacity: 0 !important; }
        }
      `}</style>
      <svg
        viewBox="0 0 560 510"
        className="relative block h-auto max-h-full w-full max-w-[min(100%,620px)] shrink"
        role="img"
        aria-label={scanning ? "A cyan laser scans through glowing robot silhouettes inside a STEM discovery chamber" : "A mystery robot floats inside a glowing futuristic STEM discovery chamber"}
      >
        <defs>
          <radialGradient id="bsr-chamber-bg" cx="50%" cy="44%" r="70%">
            <stop offset="0%" stopColor="#164F9F"/>
            <stop offset="56%" stopColor="#0E2D70"/>
            <stop offset="100%" stopColor="#0B1B4E"/>
          </radialGradient>
          <linearGradient id="bsr-tube" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0CD9FC" stopOpacity=".28"/>
            <stop offset="23%" stopColor="#D3F9FF" stopOpacity=".10"/>
            <stop offset="77%" stopColor="#B1F4FF" stopOpacity=".08"/>
            <stop offset="100%" stopColor="#0ABBF9" stopOpacity=".34"/>
          </linearGradient>
          <linearGradient id="bsr-beam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#62F6FE" stopOpacity="0"/>
            <stop offset="52%" stopColor="#62F6FE" stopOpacity=".20"/>
            <stop offset="100%" stopColor="#7EF9FF" stopOpacity=".78"/>
          </linearGradient>
          <linearGradient id="bsr-metal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#62DCFF"/>
            <stop offset="50%" stopColor="#174998"/>
            <stop offset="100%" stopColor="#102759"/>
          </linearGradient>
          <radialGradient id="bsr-platform">
            <stop offset="0%" stopColor="#C8FFFF"/>
            <stop offset="55%" stopColor="#47DBF5"/>
            <stop offset="100%" stopColor="#1B63C3"/>
          </radialGradient>
          <clipPath id="bsr-tube-mask"><rect x="166" y="135" width="228" height="265" rx="36"/></clipPath>
          <filter id="bsr-soft-glow">
            <feGaussianBlur stdDeviation="8"/>
          </filter>
        </defs>
        <rect x="0" y="0" width="560" height="510" rx="38" fill="url(#bsr-chamber-bg)" />
        {/* Laboratory's decorative constellations and floor */}
        <g opacity=".22" stroke="#75D9FF" fill="none">
          <path d="M0 410 Q280 345 560 410 M0 442 Q280 378 560 442 M0 476 Q280 413 560 476"/>
          <path d="M66 510 L205 365 M147 510 L235 365 M280 510 V365 M413 510 L325 365 M494 510 L355 365"/>
        </g>
        {Array.from({length:20},(_,i)=>{
          const x=28 + (i*97)%505, y=39 + (i*79)%356;
          return <circle key={i} cx={x} cy={y} r={i%3===0?3:1.6}
            fill={i%4===0?"#FFDC5B":"#90EFFF"} opacity={i%4===0?.85:.5}/>;
        })}
        {/* Side control panels */}
        <g opacity=".95">
          <rect x="28" y="163" width="108" height="162" rx="20" fill="#102961" stroke="#1B85C8" strokeWidth="4"/>
          <rect x="40" y="176" width="85" height="103" rx="12" fill="#0E3C82" stroke="#4DE2FF" strokeWidth="2"/>
          <path d="M50 207h61M50 229h61M50 250h36" stroke="#32ECFA" opacity=".7" strokeWidth="5" strokeLinecap="round" strokeDasharray="25 7"/>
          <circle cx="66" cy="300" r="7" fill="#A5F86D"/><circle cx="88" cy="300" r="7" fill="#FFD666"/><circle cx="110" cy="300" r="7" fill="#FF89C2"/>
          <rect x="424" y="181" width="110" height="125" rx="18" fill="#102961" stroke="#1B85C8" strokeWidth="4"/>
          <rect x="437" y="195" width="84" height="70" rx="10" fill="#0E3C82" stroke="#4DE2FF" strokeWidth="2"/>
          <circle cx="479" cy="231" r="23" stroke="#43E8FF" strokeWidth="3" fill="none" strokeDasharray="8 8"/>
          <path d="M463 231h32M479 215v32" stroke="#43E8FF" strokeWidth="2"/>
          <circle cx="455" cy="284" r="6" fill="#FFD45A"/><circle cx="475" cy="284" r="6" fill="#7CFFDD"/><circle cx="495" cy="284" r="6" fill="#F68CCA"/>
        </g>
        {/* Header ring + fluorescent upper scanner */}
        <ellipse cx="280" cy="123" rx="156" ry="37" fill="#102A72" stroke="#198AD1" strokeWidth="12"/>
        <ellipse cx="280" cy="116" rx="133" ry="23" fill="none" stroke="#29EAFE" strokeWidth="12" className="bsr-scanner-glow"/>
        <ellipse cx="280" cy="117" rx="91" ry="12" fill="#FFF0AB"/>
        <rect x="165" y="134" width="230" height="266" rx="36" fill="url(#bsr-tube)" stroke="#48DFFB" strokeWidth="4"/>
        <path d="M180 169v189 M380 169v189" stroke="#CCF9FF" strokeWidth="7" strokeLinecap="round" opacity=".35"/>
        <g clipPath="url(#bsr-tube-mask)">
          <rect x="169" y="136" width="222" height="258" fill="#19CBFF" opacity=".07"/>
          {scanning && <g className="bsr-scanner-beam">
            <rect x="168" y="198" width="224" height="68" fill="url(#bsr-beam)"/>
            <rect x="168" y="259" width="224" height="5" rx="2.5" fill="#D7FFFF"/>
          </g>}
          <g className={scanning ? "bsr-scanner-robot-a" : "bsr-scanner-float"}>
            {/* Front-view mystery robot, line art */}
            <g stroke="#48EFFF" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" fill="#0B4A95">
              <rect x="235" y="245" width="90" height="90" rx="17"/>
              <rect x="211" y="268" width="24" height="42" rx="11"/>
              <rect x="325" y="268" width="24" height="42" rx="11"/>
              <rect x="247" y="334" width="20" height="16" rx="5"/>
              <rect x="295" y="334" width="20" height="16" rx="5"/>
              <rect x="222" y="197" width="116" height="65" rx="23"/>
              <path d="M249 197l-11-23 M311 197l11-23"/>
              <circle cx="235" cy="171" r="6" fill="#FFE573"/>
              <circle cx="325" cy="171" r="6" fill="#FFE573"/>
              <circle cx="255" cy="224" r="6" fill="#9CFCFF" stroke="none"/>
              <circle cx="305" cy="224" r="6" fill="#9CFCFF" stroke="none"/>
              <path d="M258 244 Q280 255 302 244" fill="none" strokeWidth="3"/>
            </g>
            <text x="280" y="306" fontSize="33" fill="#EFFBFF" fontWeight="900" textAnchor="middle">?</text>
          </g>
          {scanning && <g className="bsr-scanner-robot-b" stroke="#74E4FF" strokeWidth="5" fill="none" strokeLinecap="round">
            <circle cx="280" cy="229" r="46"/><circle cx="262" cy="223" r="6"/><circle cx="298" cy="223" r="6"/>
            <path d="M259 247Q280 256 301 247 M280 180v-17 M258 278l-30 31 M302 278l30 31"/>
            <rect x="247" y="281" width="66" height="55" rx="12"/>
          </g>}
          {scanning && <g className="bsr-scanner-robot-c" stroke="#9FE8FF" strokeWidth="5" fill="none" strokeLinejoin="round">
            <rect x="233" y="185" width="94" height="68" rx="16"/><rect x="249" y="278" width="62" height="57" rx="10"/>
            <path d="M244 275l-24 20M316 275l24 20M264 335l-10 18M296 335l10 18"/>
            <path d="M259 212h42M259 230h42"/>
          </g>}
        </g>
        {/* Floating platform */}
        <ellipse cx="280" cy="394" rx="131" ry="29" fill="#4BF7FF" opacity=".35" filter="url(#bsr-soft-glow)"/>
        <ellipse cx="280" cy="395" rx="147" ry="28" fill="#12295E" stroke="#2EDBFD" strokeWidth="10"/>
        <ellipse cx="280" cy="395" rx="105" ry="16" fill="url(#bsr-platform)" className="bsr-scanner-glow"/>
        <path d="M136 397v23c0 34 288 34 288 0v-23" fill="url(#bsr-metal)" stroke="#2A80CB" strokeWidth="3"/>
        <ellipse cx="280" cy="418" rx="143" ry="30" fill="none" stroke="#1F71C7" strokeWidth="3"/>
        {/* Discovery indicators */}
        <g fontWeight="900" fontSize="14" textAnchor="middle">
          <rect x="169" y="33" width="222" height="40" rx="20" fill="#14346E" stroke="#3BBAFC" strokeWidth="2"/>
          <text x="280" y="59" fill="#CAFEFF">{scanning ? "SCANNING ROBOTS..." : "MYSTERY ROBOT · READY"}</text>
        </g>
        <g>
          <rect x="135" y="465" width="290" height="12" rx="6" fill="#0C255B" stroke="#326DAA" strokeWidth="2"/>
          {scanning ? <rect className="bsr-scanner-progress" x="137" y="467" width="286" height="8" rx="4" fill="#54F3E5"/> :
            <rect x="137" y="467" width="286" height="8" rx="4" fill="#2D82E0" opacity=".5"/>}
          <text x="280" y="498" fill="#C5DFFF" fontSize="11" textAnchor="middle" fontWeight="700">
            {scanning ? "Finding your next STEM challenge" : "59 robots waiting to be discovered"}
          </text>
        </g>
        <g stroke="#FFD867" strokeWidth="4" strokeLinecap="round">
          <path d="M420 86v20M410 96h20 M91 105v12 M85 111h12" opacity=".8"/>
        </g>
      </svg>
    </div>
  );
}
