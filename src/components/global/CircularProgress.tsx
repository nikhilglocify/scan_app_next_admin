import React from 'react';

interface CircularProgressProps {
  percent: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percent }) => {
  const radius = 50; // Radius of the circle
  const strokeWidth = 8; // Width of the stroke
  const normalizedRadius = radius - strokeWidth * 0.5; // Adjusted radius
  const circumference = normalizedRadius * 2 * Math.PI; // Circumference of the circle
  const strokeDashoffset = ((100 - percent) / 100) * circumference; // Offset based on percent

  return (
    <div className="flex flex-col items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform rotate-90">
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#3b82f6" // Tailwind's blue-500
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }} // Smooth transition
        />
      </svg>
      <p className="text-sm text-gray-500 mt-2">
        {percent}% encoding completed
      </p>
    </div>
  );
};

export default CircularProgress;
