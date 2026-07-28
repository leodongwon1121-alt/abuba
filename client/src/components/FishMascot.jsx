export default function FishMascot({ size = 32, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        fill="none"
        stroke="var(--color-navy)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M55,100 C55,70 90,45 130,45 C165,45 185,70 185,100 C185,130 165,155 130,155 C90,155 55,130 55,100 Z"
          fill="var(--color-accent-sky)"
        />
        <path d="M55,100 C30,80 15,85 15,100 C15,115 30,120 55,100" />
        <path d="M75,50 C60,20 100,10 120,25 C130,33 128,45 118,48" />
        <path d="M75,150 C65,175 95,185 110,175 C120,168 118,158 108,155" />
        <circle cx="150" cy="90" r="8" fill="var(--color-navy)" stroke="none" />
      </g>
    </svg>
  );
}
