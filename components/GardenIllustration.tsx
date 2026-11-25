export function GardenIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 420"
      role="img"
      aria-labelledby="garden-title garden-desc"
    >
      <title id="garden-title">Plan de jardin</title>
      <desc id="garden-desc">
        Illustration d&apos;un jardin à la française : allées, parterres, arbres
        taillés et fontaine centrale.
      </desc>
      <rect width="520" height="420" fill="#e9dfcc" />
      <rect
        x="18"
        y="18"
        width="484"
        height="384"
        fill="none"
        stroke="#2b4539"
        strokeWidth="1"
        opacity="0.35"
      />

      {/* Allées */}
      <rect x="238" y="38" width="44" height="344" fill="#d9c9ab" />
      <rect x="38" y="190" width="444" height="40" fill="#d9c9ab" />
      <rect x="238" y="38" width="44" height="344" fill="none" stroke="#c9b795" strokeWidth="1" />
      <rect x="38" y="190" width="444" height="40" fill="none" stroke="#c9b795" strokeWidth="1" />

      {/* Parterres */}
      {[
        { x: 62, y: 62 },
        { x: 316, y: 62 },
        { x: 62, y: 262 },
        { x: 316, y: 262 },
      ].map((p) => (
        <g key={`${p.x}-${p.y}`}>
          <rect
            x={p.x}
            y={p.y}
            width="142"
            height="96"
            rx="4"
            fill="#dfd4bf"
            stroke="#5d775f"
            strokeWidth="9"
          />
          <circle cx={p.x + 36} cy={p.y + 48} r="19" fill="#6f8870" />
          <circle cx={p.x + 76} cy={p.y + 34} r="13" fill="#5d775f" />
          <circle cx={p.x + 104} cy={p.y + 62} r="21" fill="#6f8870" />
          <circle cx={p.x + 52} cy={p.y + 70} r="9" fill="#b8683f" opacity="0.75" />
        </g>
      ))}

      {/* Arbres d'angle */}
      <g fill="#4f6b55">
        <circle cx="52" cy="54" r="26" />
        <circle cx="472" cy="54" r="26" />
        <circle cx="52" cy="370" r="24" />
        <circle cx="472" cy="370" r="24" />
      </g>

      {/* Fontaine */}
      <circle cx="260" cy="210" r="40" fill="#d5ded9" stroke="#b8683f" strokeWidth="3" />
      <circle cx="260" cy="210" r="26" fill="none" stroke="#2b4539" strokeWidth="1" opacity="0.5" />
      <circle cx="260" cy="210" r="8" fill="#b8683f" />
      <path
        d="M260 186v-12m0 60v12m-24-30h-12m60 0h12"
        stroke="#2b4539"
        strokeWidth="1.2"
        opacity="0.45"
      />

      {/* Bordures */}
      <g fill="#b8683f">
        <circle cx="238" cy="38" r="3" />
        <circle cx="282" cy="38" r="3" />
        <circle cx="238" cy="382" r="3" />
        <circle cx="282" cy="382" r="3" />
      </g>
    </svg>
  );
}
