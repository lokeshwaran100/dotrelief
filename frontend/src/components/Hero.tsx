import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center px-6 py-20">
      <div className="text-center max-w-4xl mx-auto">
        {/* Brand Name */}
        <h1 className="text-pink-500 text-3xl font-bold mb-8">
          Dot Relief
        </h1>

        {/* Main Heading */}
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-12 leading-tight">
          Decentralised crowdfunding platform with{' '}
          <span className="text-gray-900">DAO based verification.</span>
        </h2>

        {/* Features */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏛️</span>
            <span className="font-medium">DAO Mechanism</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👥</span>
            <span className="font-medium">Social Network</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💰</span>
            <span className="font-medium">Direct Donation</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <span className="font-medium">No Human Intervention</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="bg-pink-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-pink-600 transition-colors shadow-lg">
          Donate Now
        </button>
      </div>
    </div>
  );
}; 