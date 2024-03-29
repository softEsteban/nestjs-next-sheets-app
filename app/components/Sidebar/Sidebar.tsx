import React from 'react';
import { FaBars, FaClock, FaFileAlt, FaHardHat, FaHome, FaRegUser, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { menu, user } from "@/utils/authUtils";

const Sidebar = ({ isSidebarOpen }: any) => {

    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("userSession");
        setTimeout(() => {
            router.push('/');
        }, 1000);
    }

    // Menu
    const renderMenuItems = (items: any) => {
        return items.map((item: any) => (
            <div key={item.menu_name} className="py-2">
                {/* Main menus */}

                <div
                    className="flex items-center text-gray-800 mb-2"
                    style={{ paddingLeft: !item.menu_icon ? '20px' : '0' }}
                    onClick={() => handleMenuItemClick(item.menu_link)}
                    role="button"
                >

                    {item.menu_icon === 'FaHome' && (
                        <span className="mr-2">
                            <FaHome />
                        </span>
                    )}
                    {item.menu_icon === 'FaBars' && (
                        <span className="mr-2">
                            <FaBars />
                        </span>
                    )}
                    {item.menu_icon === 'FaRegUser' && (
                        <span className="mr-2">
                            <FaRegUser />
                        </span>
                    )}
                    {item.menu_icon === 'FaClock' && (
                        <span className="mr-2">
                            <FaClock />
                        </span>
                    )}
                    {item.menu_icon === 'FaHardHat' && (
                        <span className="mr-2">
                            <FaHardHat />
                        </span>
                    )}
                    {item.menu_icon === 'FaSignOutAlt' && (
                        <span className="mr-2">
                            <FaSignOutAlt />
                        </span>
                    )}
                    {item.menu_icon === 'FaFileAlt' && (
                        <span className="mr-2">
                            <FaFileAlt />
                        </span>
                    )}

                    {item.menu_name}
                </div>

                {/* Menu children */}
                {item.children && item.children.length > 0 && (
                    <div className="ml-4">{renderMenuItems(item.children)}</div>
                )}
            </div>
        ));
    };

    const handleMenuItemClick = (menuUrl: any) => {
        router.push({
            pathname: menuUrl,

        });
    };


    // User data
    const tagUserType = (userType: string) => {
        if (userType === "client") {
            return "Client";
        } else if (userType === "admin") {
            return "Admin";
        }
        return "";
    };

    const userTag = tagUserType(user?.user_type || "");

    const getFirstLetter = () => {
        return user?.user_name ? user.user_name.charAt(0).toUpperCase() : '';
    };

    return (
        <aside
            className={`bg-white text-gray-800 w-64 flex flex-col shadow-md ${isSidebarOpen ? 'block' : 'hidden'} md:block`}
            style={{
                position: 'fixed',
                height: '100vh',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 1000,
            }}
        >

            {/* Logo */}
            <div className="pb-2 pt-4 px-4 font-bold text-2xl text-green-600 flex justify-end">
                <a className="text-2xl text-white font-bold flex items-center">
                    <img
                        src="/ocmi-workers-logo.jpg"
                        alt="Company Logo"
                        className="mr-2"
                        style={{ width: '40px', height: '40px' }}
                    />
                </a>
            </div>

            {/* Sidebar header */}
            <div className="pb-2 pt-4 px-4 flex items-start">
                <div className="flex-shrink-0 mr-4">
                    <div style={{ backgroundColor: "#8c7cf2" }} className="w-12 h-12 rounded-full text-white flex items-center justify-center text-xl">
                        {getFirstLetter()}
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    <div>
                        <p className="font-bold">{`${user?.user_name}`}</p>
                        <p className="text-gray-500">{`${user?.user_lastname}`}</p>
                    </div>
                    <div className="mt-2 flex flex-col items-center md:flex-row md:items-center">
                        <span className="bg-gray-200 rounded-md py-1 px-2 text-sm text-gray-600 mb-2 md:mb-0 md:mr-2">
                            {userTag}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 focus:outline-none flex items-center"
                            style={{ color: 'inherit', transition: 'color 0.3s' }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'red'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}
                        >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-300 my-4 mx-4"></div>

            {/* Sidebar menu */}
            <div className="p-4 border-r border-gray-300 h-full">
                <div className='text-sm'>
                    {menu && menu.length > 0 && renderMenuItems(menu)}
                </div>
            </div>

        </aside>
    );
};

export default Sidebar;