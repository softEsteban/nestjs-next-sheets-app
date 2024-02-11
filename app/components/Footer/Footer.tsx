import React, { useEffect, useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []); 

    return (
        <>
            {isClient && (
                <div className="p-4 text-white" style={{backgroundColor: "#58387b"}}>
                    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-2xl font-bold mb-2">
                                OCMI Workers Comp
                            </h2>
                            <p className="text-sm">
                                Your partner for payroll services, employee data handling, and time sheet management.
                            </p>
                        </div>
                        <div className="flex flex-wrap">
                            <div className="mr-6 mb-4">
                                <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
                                <ul className="list-none">
                                    <li><a href="/about" className="text-white">About Us</a></li>
                                    <li><a href="/services" className="text-white">Services</a></li>
                                    <li><a href="/contact" className="text-white">Contact</a></li>
                                </ul>
                            </div>
                            <div className="mr-6 mb-4">
                                <h3 className="text-lg font-semibold mb-2">Resources</h3>
                                <ul className="list-none">
                                    <li><a href="/faq" className="text-white">FAQs</a></li>
                                    <li><a href="/terms" className="text-white">Terms of Service</a></li>
                                    <li><a href="/privacy" className="text-white">Privacy Policy</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="mr-4">
                                <a href="https://www.facebook.com/ocmiworkerscomp" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                    <FaFacebook size={24} />
                                </a>
                            </div>
                            <div className="mr-4">
                                <a href="https://www.instagram.com/ocmiworkerscomp" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                    <FaInstagram size={24} />
                                </a>
                            </div>
                            <div className="mr-4">
                                <a href="https://www.youtube.com/channel/UC2o16gt10SD_V-bJL3ZmM2A" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                    <FaYoutube size={24} />
                                </a>
                            </div>
                            <div>
                                <a href="https://www.linkedin.com/company/ocmiworkerscomp" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                    <FaLinkedin size={24} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;
