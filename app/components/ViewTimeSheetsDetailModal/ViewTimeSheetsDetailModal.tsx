import Employee from "@/types/employee.type";
import TimeSheet from "@/types/time.sheet.type";
import { token } from "@/utils/authUtils";
import axios from "axios";
import { useEffect, useState } from "react";
import NoData from "../NoData/NoData";
import TimeSheetState from "../TimeSheetState/TimeSheetState";

interface Props {
    employee?: Employee;
    handleCloseModal: () => void;
}

export default function ViewTimeSheetsDetailModal({ employee, handleCloseModal }: Props) {

    const [timeSheets, setTimeSheets] = useState<TimeSheet[]>([]);
    const [totalPayroll, setTotalPayroll] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `${process.env.NEXT_PUBLIC_HOST}/time-sheets/employee/${employee?.employee_id}`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTimeSheets(response.data);

                // Calculate total payroll
                const total = response.data.reduce((acc: number, timeSheet: TimeSheet) => acc + timeSheet.sheet_total_payed, 0);
                setTotalPayroll(total);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [employee]);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-h-80vh overflow-y-auto w-full md:w-3/4 lg:w-1/2 m-10">

                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Time sheets detail</h2>
                    <p className="text-sm text-gray-500">{employee?.employee_name} {employee?.employee_lastname}</p>
                    <p className="text-sm text-gray-500">Total Payroll: ${totalPayroll.toLocaleString()}</p>
                </div>

                <div className="overflow-x-auto">
                    {timeSheets.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total hours</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hourly Rate</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {timeSheets.map((timeSheet, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap">{timeSheet.sheet_check_date}</td>
                                        <TimeSheetState sheet_state={timeSheet.sheet_state} />
                                        <td className="px-6 py-4 whitespace-nowrap">{timeSheet.sheet_hours}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${timeSheet.sheet_total_payed.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <NoData text={"No time sheets history available"}/>
                    )}
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={handleCloseModal}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}