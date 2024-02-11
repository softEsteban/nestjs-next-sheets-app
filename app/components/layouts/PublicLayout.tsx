"use client"

import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const PublicLayout = ({ children }: any) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            {isClient && (
                <>
                    <Navbar />
                    {children}
                    <Footer />
                </>
            )}
        </>
    );
};


export default PublicLayout;