export function FacadeIllustration({ className }: { className?: string }) {
  const windows = [
    { x: 164, y: 316, lit: false },
    { x: 252, y: 316, lit: false },
    { x: 340, y: 316, lit: true },
    { x: 164, y: 408, lit: false },
    { x: 252, y: 408, lit: true },
    { x: 340, y: 408, lit: false },
    { x: 164, y: 500, lit: true },
    { x: 340, y: 500, lit: false },
  ];

  return (
    <svg
      className={className}
      viewBox="0 0 560 680"
      role="img"
      aria-labelledby="facade-title facade-desc"
    >
      <title id="facade-title">Les Jardins de Vauban</title>
      <desc id="facade-desc">
        Illustration d&apos;une façade classique aux fenêtres cintrées, entourée
        d&apos;arbres et d&apos;un jardin.
      </desc>
      <defs>
        <linearGradient id="facade-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3ead9" />
          <stop offset="100%" stopColor="#e9dcc5" />
        </linearGradient>
        <clipPath id="facade-arch">
          <path d="M40 660V300a240 240 0 0 1 480 0v360Z" />
        </clipPath>
        <pattern
          id="facade-grain"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="0.7" fill="#2b4539" opacity="0.09" />
        </pattern>
      </defs>

      <g clipPath="url(#facade-arch)">
        <rect width="560" height="680" fill="url(#facade-sky)" />
        <circle cx="402" cy="216" r="96" fill="#e4c096" opacity="0.55" />

        {/* Silhouettes lointaines */}
        <path
          d="M40 336V300h34v36Zm412 0v-24h22v24Z"
          fill="#b9c4b2"
          opacity="0.7"
        />
        <path
          d="M40 348h480v18H40Z"
          fill="#c9d1c1"
          opacity="0.55"
        />

        {/* Arbres */}
        <g fill="#4f6b55">
          <rect x="86" y="356" width="9" height="272" rx="4" />
          <circle cx="91" cy="330" r="56" />
          <circle cx="54" cy="366" r="38" opacity="0.85" />
          <circle cx="130" cy="358" r="42" opacity="0.9" />
          <rect x="466" y="390" width="8" height="238" rx="4" />
          <circle cx="470" cy="366" r="46" />
          <circle cx="504" cy="398" r="32" opacity="0.85" />
        </g>

        {/* Façade */}
        <rect x="132" y="286" width="296" height="340" fill="#f2e6d2" />
        <rect x="382" y="286" width="46" height="340" fill="#e7d7bd" />
        <rect
          x="122"
          y="270"
          width="316"
          height="16"
          fill="#dcc9a8"
          stroke="#2b4539"
          strokeWidth="1"
        />
        <rect x="132" y="286" width="296" height="6" fill="#e2d1b3" />
        <rect x="132" y="560" width="296" height="66" fill="#eadcc5" />
        <line
          x1="132"
          y1="560"
          x2="428"
          y2="560"
          stroke="#2b4539"
          strokeWidth="1"
          opacity="0.4"
        />

        {windows.map((win) => (
          <g key={`${win.x}-${win.y}`}>
            <path
              d={`M${win.x} ${win.y + 72}V${win.y + 24}a24 24 0 0 1 48 0v48Z`}
              fill={win.lit ? "#d9a86c" : "#2f4a3f"}
              stroke="#2b4539"
              strokeWidth="1.4"
            />
            <path
              d={`M${win.x + 24} ${win.y + 2}v70M${win.x} ${win.y + 44}h48`}
              stroke="#f2e6d2"
              strokeWidth="1"
              opacity="0.45"
            />
            <rect
              x={win.x - 4}
              y={win.y + 72}
              width="56"
              height="5"
              fill="#d8c4a3"
            />
            {win.lit ? (
              <circle
                cx={win.x + 24}
                cy={win.y + 30}
                r="9"
                fill="#f4d7a8"
                opacity="0.5"
              />
            ) : null}
          </g>
        ))}

        {/* Garde-corps du balcon */}
        <g stroke="#2b4539" strokeWidth="1.4" opacity="0.85">
          <line x1="240" y1="486" x2="312" y2="486" />
          <line x1="240" y1="502" x2="312" y2="502" />
          {[244, 256, 268, 280, 292, 304].map((x) => (
            <line key={x} x1={x} y1="486" x2={x} y2="502" />
          ))}
        </g>
        <rect x="238" y="504" width="76" height="8" rx="2" fill="#b8683f" />
        <circle cx="250" cy="500" r="7" fill="#5d775f" />
        <circle cx="276" cy="498" r="9" fill="#6f8870" />
        <circle cx="300" cy="501" r="6" fill="#5d775f" />

        {/* Porte */}
        <path
          d="M252 626v-54a28 28 0 0 1 56 0v54Z"
          fill="#2b4539"
          stroke="#1f342b"
          strokeWidth="1.5"
        />
        <path
          d="M252 584a28 28 0 0 1 56 0"
          fill="none"
          stroke="#d9a86c"
          strokeWidth="2"
        />
        <line
          x1="280"
          y1="556"
          x2="280"
          y2="626"
          stroke="#f2e6d2"
          strokeWidth="1"
          opacity="0.35"
        />
        <circle cx="306" cy="596" r="2.4" fill="#d9a86c" />
        <rect x="242" y="626" width="76" height="7" fill="#d8c4a3" />

        {/* Jardin */}
        <rect x="0" y="633" width="560" height="47" fill="#5d775f" />
        <rect x="0" y="633" width="560" height="5" fill="#4c644f" />
        <g fill="#6f8870">
          <circle cx="58" cy="644" r="20" />
          <circle cx="108" cy="650" r="15" />
          <circle cx="420" cy="646" r="18" />
          <circle cx="472" cy="650" r="14" />
          <circle cx="518" cy="642" r="17" />
        </g>
        <g fill="#b8683f" opacity="0.9">
          <circle cx="132" cy="646" r="3" />
          <circle cx="146" cy="650" r="2.5" />
          <circle cx="392" cy="648" r="3" />
        </g>
        <path
          d="M200 680c0-18 22-26 40-18s26 12 40 4"
          fill="none"
          stroke="#d9c9ab"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.85"
        />

        <rect width="560" height="680" fill="url(#facade-grain)" />
      </g>

      <path
        d="M40 660V300a240 240 0 0 1 480 0v360"
        fill="none"
        stroke="#2b4539"
        strokeWidth="1.5"
      />
      <path
        d="M54 660V304a226 226 0 0 1 452 0v356"
        fill="none"
        stroke="#2b4539"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  );
}
