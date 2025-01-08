import React from "react";

interface LoaderProps {
  message?: string;
  color?: string;
  isFullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({message,color,isFullScreen}) => {
  return (
    <div 
    className={`flex  ${isFullScreen?'h-screen':""} items-center justify-center`}
    >
      <button
        type="button"
        className={`flex items-center rounded-lg  px-4 py-2 ${color?`text-${color}-300`:"text-white"} `}
        disabled
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <svg
        className={`mr-3 h-5 w-5 animate-spin ${color?`text-${color}-300`:"text-white"} `}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="font-medium"> {message?message:"Loading..."} </span>
      </button>
    </div>
  );
};

export default Loader;