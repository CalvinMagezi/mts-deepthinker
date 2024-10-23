import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-primary_bg">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-brand_blue"></div>
        <div className="animate-spin rounded-full h-32 w-32 border-r-4 border-l-4 border-brand_green absolute top-0 left-0 animate-[spin_1.5s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-brand_gray font-bold">
          Loading
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
