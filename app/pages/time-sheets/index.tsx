import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { storedData, user } from "@/utils/authUtils";
import axios from "axios";
import AddUpdateTimeSheet from "@/components/AddUpdateTimeSheet/AddUpdateTimeSheet";
import NoData from "@/components/NoData/NoData";
import TimeSheets from "@/types/time.sheets.type";

export default function TimeSheets() {

    const isAdmin = user?.user_type === 'admin';
    const [timeSheets, setTimeSheets] = useState<TimeSheets[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = isAdmin ? `${process.env.NEXT_PUBLIC_HOST}/time-sheets` : `${process.env.NEXT_PUBLIC_HOST}/time-sheets/user/${user.user_id}`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${storedData?.token}`
                    }
                });
                setTimeSheets(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [isAdmin]);


    // // Modal
    // const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    // const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
    // const [employeeAction, setEmployeeAction] = useState<'create' | 'update'>('create');

    // // Functions to handle modal actions
    // const handleAddEmployee = () => {
    //     setEmployeeAction('create');
    //     setShowEmployeeModal(true);
    // };

    // const handleEditEmployee = (employee: Employee) => {
    //     setEmployeeAction('update');
    //     setShowEmployeeModal(true);
    //     setSelectedEmployee(employee);
    // };

    // const handleCloseEmployeeModal = () => {
    //     setShowEmployeeModal(false);
    // };

    // const handleAddEmployeeAction = (newEmployee: Employee) => {
    //     setEmployees([...employees, newEmployee]);
    // };

    // const handleUpdateEmployeeAction = (updatedEmployee: Employee) => {
    //     setEmployees(employees.map((employee: Employee) => (employee.employee_id === updatedEmployee.employee_id ? updatedEmployee : employee)));
    // };

    // const handleDeleteEmployee = async (pemployeeId: any) => {
    //     // try {
    //     //     // Perform DELETE request
    //     //     setProducts(products.filter((product) => product.id !== productId));
    //     // } catch (error) {
    //     //     console.error(`Error deleting product with ID ${productId}:`, error);
    //     // }
    // };


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
                                    <AddUpdateTimeSheet />

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
                                            <td className="px-6 py-4 whitespace-nowrap">{timesheet.employee.employee_pay_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{timesheet.sheet_check_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{timesheet.sheet_hours}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${timesheet.sheet_pay_rate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${timesheet.sheet_total_payed}</td>
                                            {isAdmin && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button className="bg-red-400 text-white px-4 py-2 rounded-md mr-2">Decline</button>
                                                    <button className="bg-green-400 text-white px-4 py-2 rounded-md">Approve</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <NoData text={"No time sheets history available."} />
                        )}
                    </div>
                </main>

                {/* Create & Update Product Modal */}
                {/* {showEmployeeModal && (
                    <AddUpdateEmployeeModal
                        handleCloseModal={handleCloseEmployeeModal}
                        handleAddEmployee={handleAddEmployeeAction}
                        handleUpdateEmployee={handleUpdateEmployeeAction}
                        action={employeeAction}
                        selectedEmployee={selectedEmployee}
                    />
                )} */}
            </AppLayout>
        </>
    );
}