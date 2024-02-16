import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { user, token } from "@/utils/authUtils";
import axios from "axios";
import AddUpdateTimeSheet from "@/components/AddUpdateTimeSheet/AddUpdateTimeSheet";
import NoData from "@/components/NoData/NoData";
import TimeSheet from "@/types/time.sheet.type";
import TimeSheetState from "@/components/TimeSheetState/TimeSheetState";


export default function TimeSheets() {

    const isAdmin = user?.user_type === 'admin';
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

    const handleAddTimeSheetAction = (newTimeSheet: TimeSheet) => {
        setTimeSheets([...timeSheets, newTimeSheet]);
    };

    const handleStateUpdate = async (sheetId: number, newState: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/time-sheets/${sheetId}/${newState}`, {
                headers: {
                    'Accept': '*/*',
                    'Authorization': `Bearer ${token}`
                }
            });

            const updatedIndex = timeSheets.findIndex(sheet => sheet.sheet_id === sheetId);
            if (updatedIndex !== -1) {
                setTimeSheets(prevTimeSheets => {
                    const newTimeSheets = [...prevTimeSheets];
                    newTimeSheets[updatedIndex].sheet_state = newState;
                    return newTimeSheets;
                });
            }

            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <AppLayout>
                <title>Timesheets Management</title>
                <main className="min-h-screen p-4 sm:p-8 bg-gray-100 rounded-xl">
                    <section className="mt-8">
                        <section className="flex items-start justify-between mt-8 mb-8">
                            <div className="w-70 flex flex-col mr-8">
                                <div className="mb-10">
                                    <h2 className="text-2xl font-semibold mb-2">Time sheets history</h2>
                                    <p className="text-sm text-gray-500">View and manage all time sheets</p>
                                </div>
                                <section className="bg-white p-6 rounded-lg shadow-md">
                                    <AddUpdateTimeSheet handleAddTimeSheet={handleAddTimeSheetAction} />
                                </section>
                            </div>
                        </section>
                    </section>

                    <div className="overflow-x-auto">
                        {timeSheets.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Pay type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hourly Rate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pay</th>
                                        {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {timeSheets.map((timesheet) => (
                                        <tr key={timesheet.sheet_id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{`${timesheet.employee.employee_name} ${timesheet.employee.employee_lastname}`}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{timesheet.employee.employee_pay_type.toUpperCase()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{timesheet.sheet_check_date}</td>
                                            <TimeSheetState sheet_state={timesheet.sheet_state} />
                                            <td className="px-6 py-4 whitespace-nowrap">{timesheet.sheet_hours}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${timesheet.sheet_pay_rate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${timesheet.sheet_total_payed}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {isAdmin && timesheet.sheet_state === "pending" && (
                                                    <>
                                                        <button className="bg-red-400 text-white px-4 py-2 rounded-md mr-2" onClick={() => handleStateUpdate(timesheet.sheet_id, 'declined')}>Decline</button>
                                                        <button className="bg-green-400 text-white px-4 py-2 rounded-md" onClick={() => handleStateUpdate(timesheet.sheet_id, 'approved')}>Approve</button>
                                                    </>
                                                )}

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <NoData text={"No time sheets history available."} />
                        )}
                    </div>
                </main>
            </AppLayout>
        </>
    );
}