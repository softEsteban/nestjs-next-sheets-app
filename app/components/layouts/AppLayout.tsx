import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Sidebar from '../Sidebar/Sidebar';
import { ToastContainer } from 'react-toastify';

const AppLayout = ({ children }: any) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {

        setIsClient(true);

        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Initial check for screen size
        handleResize();

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            {isClient && (
                <>
                    {isSidebarOpen && <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
                    <div className="flex flex-col w-full">
                        <button style={{ zIndex: 1000, backgroundColor: "#58387b" }} onClick={toggleSidebar} className="fixed ml-4 mt-5 rounded-full w-8 h-8 text-white flex items-center justify-center">
                            {isSidebarOpen ?
                                <FaArrowLeft style={{ fontSize: 15 }} className="text-white-500 hover:text-white-700" /> : (
                                    <FaArrowRight style={{ fontSize: 15 }} className="text-white-500 hover:text-white-700" />
                                )}
                        </button>
                        <main className={`flex-1 p-3 overflow-y-auto ${isSidebarOpen ? 'ml-0 md:ml-64' : ''}`}>
                            <div>
                                {children}
                            </div>
                        </main>
                    </div>
                </>
            )}
        </>
    );
};

export default AppLayout;