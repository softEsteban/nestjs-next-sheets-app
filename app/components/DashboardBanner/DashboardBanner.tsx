import React from 'react';

const DashboardBanner = ({ text }: any) => {
    return (
        <div
            className="bg-cover bg-center h-40 rounded-xl relative mb-8"
            style={{ backgroundImage: `url('/mushrooms-banner.png')` }}
        >
            <div className="absolute inset-0 bg-black opacity-50 rounded-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-4xl font-bold text-white">{text}</h2>
            </div>
        </div>
    );
};

export default DashboardBanner;