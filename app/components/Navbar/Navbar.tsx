import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Navbar = () => {
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const toggleMobileNav = () => {
        setMobileNavOpen(!isMobileNavOpen);
    };

    return (
        <>
            {isClient && (
                <div className="fixed top-0 left-0 right-0 p-2 z-50" style={{ backgroundColor: "#58387b" }}>
                    <div className="container mx-auto flex items-center justify-between">
                        <Link href="/">
                            <img
                                src="/ocmi-workers-comp-logo.png"
                                alt="Company Logo"
                                className="mr-2"
                                style={{ maxWidth: '200px', maxHeight: '40px' }}
                            />
                        </Link>

                        <div className="hidden lg:flex">
                            <Link href="/us" className="text-white px-2  text-sm">
                                Us
                            </Link>
                            <Link href="/portfolio" className="text-white px-2  text-sm">
                                Services
                            </Link>
                            <Link href="/login" className="text-white px-2  text-sm">
                                Login
                            </Link>
                        </div>

                        <div className="lg:hidden">
                            <button
                                className="text-white px-2 focus:outline-none"
                                onClick={toggleMobileNav}
                            >
                                ☰
                            </button>
                        </div>
                    </div>

                    <div className={`lg:hidden ${isMobileNavOpen ? 'block' : 'hidden'}`}>
                        <div style={{ backgroundColor: "#58387b" }}>

                            <ul >
                                <li className="text-white py-2">
                                    <Link href="/us" className="text-white px-4  text-sm">
                                        Us
                                    </Link>
                                </li>
                                <li className="text-white py-2">
                                    <Link href="/portfolio" className="text-white px-4  text-sm">
                                        Services
                                    </Link>
                                </li>
                                <li className="text-white py-2">
                                    <Link href="/login" className="text-white px-4  text-sm">
                                        Login
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
