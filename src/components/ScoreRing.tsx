'use client';

interface ScoreRingProps {
  score: number; // 0 to 100 or 0 to 10
  size?: number;
  strokeWidth?: number;
  label?: string;
  maxScore?: number;
}

export default function ScoreRing({
  score,
  size = 110,
  strokeWidth = 8,
  label,
  maxScore = 100,
}: ScoreRingProps) {
  const normalizedScore = maxScore === 10 ? (score / 10) * 100 : score;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = '#087F5B'; // Emerald
  if (normalizedScore < 60) colorClass = '#D64545'; // Red
  else if (normalizedScore < 75) colorClass = '#D99A2B'; // Amber

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E5E1"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#17201B]">
            {maxScore === 10 ? score.toFixed(1) : `${Math.round(score)}%`}
          </span>
          {maxScore === 10 && <span className="text-[10px] text-[#66736B]">/ 10</span>}
        </div>
      </div>
      {label && <span className="mt-2 text-xs font-medium text-[#66736B]">{label}</span>}
    </div>
  );
}
