import React from "react";
import { useRouter } from "next/router";
import AppLayout from "@/components/layouts/AppLayout";
import { FaUsers, FaMoneyBillAlt } from "react-icons/fa";
import { user } from "@/utils/authUtils";
import DashboardBanner from "@/components/DashboardBanner/DashboardBanner";

export default function Home() {
    const router = useRouter();

    const redirectToPayrolls = () => {
        router.push("/payrolls");
    };

    const redirectToEmployees = () => {
        router.push("/employees");
    };

    return (
        <AppLayout>
            <title>Home</title>
            <main className="min-h-screen p-4 sm:p-8 bg-gray-100 rounded-xl">
                <section className="mt-8">
                    <section className="flex items-center justify-between mt-8 mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Welcome back, {user?.user_name}!</h2>
                            <p className="text-sm text-gray-500">Explore different modules in the dashboard</p>
                        </div>
                        <div className="flex items-center">
                            {/* Add button if needed */}
                        </div>
                    </section>

                    <DashboardBanner/>

                    <section className="flex items-center justify-between mt-8 mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Explore Modules</h2>
                        {/* Subtitle can go here */}
                    </section>

                    <section className="flex flex-wrap mt-8">
                        <div
                            onClick={redirectToPayrolls}
                            className="flex flex-col items-center justify-center bg-green-500 mb-4 w-full md:w-1/6 sm:w-2/8 rounded-lg transition duration-300 mx-4 h-24 hover:transform hover:scale-105 hover:shadow-lg cursor-pointer"
                        >
                            <FaMoneyBillAlt className="text-white text-4xl mb-2" />
                            <p className="text-white text-xl font-semibold">View Payrolls</p>
                        </div>
                        <div
                            onClick={redirectToEmployees}
                            className="flex flex-col items-center justify-center bg-green-500 mb-4 w-full md:w-1/6 sm:w-2/8 rounded-lg transition duration-300 mx-4 h-24 hover:transform hover:scale-105 hover:shadow-lg cursor-pointer"
                        >
                            <FaUsers className="text-white text-4xl mb-2" />
                            <p className="text-white text-xl font-semibold">View Employees</p>
                        </div>
                    </section>

                    {/* Additional modules can be added here */}

                </section>
            </main>
        </AppLayout>
    );
}
