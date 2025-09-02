interface ArrowIconProps {
  className?: string;
}

export function ArrowIcon({ className = "text-gray-400" }: ArrowIconProps) {
  return (
    <svg width="60" height="30" viewBox="0 0 60 30" className={className}>
      <path 
        d="M5 15 L45 15 M35 5 L45 15 L35 25" 
        stroke="rgba(156, 163, 175, 0.7)" 
        strokeWidth="6" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}