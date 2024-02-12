import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const NoData = ({ text }: any) => {
    return (
        <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
                <FaExclamationTriangle className="text-gray-400 text-4xl mb-2" />
                <p className="text-gray-500 font-semibold text-lg">Oops! No data found</p>
                <p className="text-gray-500 mt-2">{text}</p>
            </div>
        </div>
    );
};

export default NoData;