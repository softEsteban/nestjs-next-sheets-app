import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "@/components/layouts/AppLayout";
import { FaUsers, FaMoneyBillAlt, FaRegUser } from "react-icons/fa";
import { user, token } from "@/utils/authUtils";
import DashboardBanner from "@/components/DashboardBanner/DashboardBanner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import TimeSheet from "@/types/time.sheet.type";
import axios from "axios";

interface MonthlyData {
    salary: number;
    hourly: number;
}

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

    const [timeSheets, setTimeSheets] = useState<TimeSheet[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = isAdmin ? `${process.env.NEXT_PUBLIC_HOST}/time-sheets` : `${process.env.NEXT_PUBLIC_HOST}/time-sheets/user/${user.user_id}`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTimeSheets(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [isAdmin]);


    // Grouping time sheets data by month
    const groupedData: { [key: string]: MonthlyData } = timeSheets.reduce((acc: any, sheet: any) => {
        const month = sheet.sheet_check_date.substring(0, 7);
        if (!acc[month]) {
            acc[month] = { salary: 0, hourly: 0 };
        }
        if (sheet.employee.employee_pay_type === 'salary') {
            acc[month].salary += sheet.sheet_total_payed;
        } else if (sheet.employee.employee_pay_type === 'hourly') {
            acc[month].hourly += sheet.sheet_total_payed;
        }
        return acc;
    }, {});

    // Converting grouped data into the desired format
    const formattedData = Object.entries(groupedData).map(([month, { salary, hourly }]) => ({
        name: month,
        salary,
        hourly,
    }));

    formattedData.sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA.getTime() - dateB.getTime();
    });

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
                        <div className="mb-10">
                            <h2 className="text-2xl font-semibold mb-2">Payrolls Chart</h2>
                            <p className="text-sm text-gray-500">Amounts payed by salary or hourly</p>
                        </div>

                        <LineChart width={600} height={300} data={formattedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="salary" stroke="#8884d8" />
                            <Line type="monotone" dataKey="hourly" stroke="#82ca9d" />
                        </LineChart>
                    </section>

                </section>
            </main>
        </AppLayout>
    );
}
