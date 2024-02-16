import React from "react";
import { useRouter } from "next/router";
import AppLayout from "@/components/layouts/AppLayout";
import { FaUsers, FaMoneyBillAlt, FaRegUser } from "react-icons/fa";
import { user } from "@/utils/authUtils";
import DashboardBanner from "@/components/DashboardBanner/DashboardBanner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Home() {

    const isAdmin = user?.user_type === 'admin';

    const router = useRouter();

    const redirectToEmployees = () => {
        router.push("/employees");
    };

    const redirectToPayrolls = () => {
        router.push("/time-sheets");
    };

    const redirectToUsers = () => {
        router.push("/users");
    };

    const data = [
        { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
        { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
        { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
        { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
        { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
        { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
    ];

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
                        </div>
                    </section>

                    <DashboardBanner text={"Your payrolls solution"} />

                    <section className="flex items-center justify-between mt-8 mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Explore Modules</h2>
                    </section>

                    <section className="flex flex-wrap mt-8">
                        <div
                            onClick={redirectToEmployees}
                            style={{ backgroundColor: "#58387b" }} className="flex flex-col items-center justify-center mb-4 w-full md:w-1/6 sm:w-2/8 rounded-lg transition duration-300 mx-4 h-24 hover:transform hover:scale-105 hover:shadow-lg cursor-pointer"
                        >
                            <FaUsers className="text-white text-4xl mb-2" />
                            <p className="text-white text-xl font-semibold">View Employees</p>
                        </div>
                        <div
                            onClick={redirectToPayrolls}
                            style={{ backgroundColor: "#58387b" }} className="flex flex-col items-center justify-center bg-green-500 mb-4 w-full md:w-1/6 sm:w-2/8 rounded-lg transition duration-300 mx-4 h-24 hover:transform hover:scale-105 hover:shadow-lg cursor-pointer"
                        >
                            <FaMoneyBillAlt className="text-white text-4xl mb-2" />
                            <p className="text-white text-xl font-semibold">View Payrolls</p>
                        </div>
                        {isAdmin && <div
                            onClick={redirectToUsers}
                            style={{ backgroundColor: "#58387b" }} className="flex flex-col items-center justify-center bg-green-500 mb-4 w-full md:w-1/6 sm:w-2/8 rounded-lg transition duration-300 mx-4 h-24 hover:transform hover:scale-105 hover:shadow-lg cursor-pointer"
                        >
                            <FaRegUser className="text-white text-4xl mb-2" />
                            <p className="text-white text-xl font-semibold">View Users</p>
                        </div>}
                    </section>
                        

                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold mb-2">Salary and Hourly payrolls Chart</h2>
                        <LineChart width={600} height={300} data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                        </LineChart>
                    </section>
                        
                </section>
            </main>
        </AppLayout>
    );
}
