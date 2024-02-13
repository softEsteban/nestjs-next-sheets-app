import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { storedData, user } from "@/utils/authUtils";
import axios from "axios";
import { FaExclamationTriangle, FaPlus } from "react-icons/fa";
import Employee from "@/types/employee.type";
import { formattedDate } from "@/utils/dateUtils";
import AddUpdateEmployeeModal from "@/components/AddUpdateEmployeeModal/AddUpdateEmployeeModal";
import NoData from "@/components/NoData/NoData";

export default function TimeSheets() {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const isAdmin = user?.user_type === 'admin';
    const [selectedEmployee, setSelectedEmployee] = useState<Employee>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = isAdmin ? `${process.env.NEXT_PUBLIC_HOST}/employees` : `${process.env.NEXT_PUBLIC_HOST}/employees/user/${user.user_id}`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${storedData?.token}`
                    }
                });
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [isAdmin]);



    // Mocked payroll history data
    const payrollHistory = [
        {
            id: 1,
            employeeName: "John Doe",
            date: "2024-02-10",
            totalHours: 40,
            hourlyRate: 20,
            totalPay: 800
        },
        {
            id: 2,
            employeeName: "Jane Smith",
            date: "2024-02-10",
            totalHours: 35,
            hourlyRate: 25,
            totalPay: 875
        },
        {
            id: 3,
            employeeName: "Alice Johnson",
            date: "2024-02-09",
            totalHours: 45,
            hourlyRate: 18,
            totalPay: 810
        }
    ];


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
                                    <h2 className="text-2xl font-semibold mb-2">Timesheets history</h2>
                                    <p className="text-sm text-gray-500">View and manage all employees</p>
                                </div>

                                <form className="flex flex-wrap gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="employee" className="block text-sm font-medium text-gray-700">Select Employee</label>
                                        <select
                                            id="employee"
                                            name="employee"
                                            value={selectedEmployee?.employee_id}
                                            onChange={(e) => {
                                                const selectedId = parseInt(e.target.value);
                                                const employee = employees.find(emp => emp.employee_id === selectedId);
                                                setSelectedEmployee(employee);
                                            }}
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option >
                                                Select an employee
                                            </option>
                                            {employees.map(employee => (
                                                <option key={employee.employee_id} value={employee.employee_id}>
                                                    {employee.employee_name} {employee.employee_lastname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedEmployee && selectedEmployee.employee_pay_type === "hourly" ? (
                                        <>
                                            <div className="flex-1">
                                                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                                                <input disabled type="text" name="hourlyRate" id="hourlyRate" value={selectedEmployee.employee_pay_rate} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="totalHours" className="block text-sm font-medium text-gray-700">Total Hours</label>
                                                <input type="text" name="totalHours" id="totalHours" className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                            </div>
                                        </>

                                    ) : (
                                        <div className="flex-1">
                                            <label htmlFor="salaryRate" className="block text-sm font-medium text-gray-700">Salary Rate</label>
                                            <input disabled type="text" name="salaryRate" id="salaryRate" value={selectedEmployee?.employee_pay_rate} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                        </div>
                                    )}

                                    <button type="submit" className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send</button>
                                </form>
                            </div>
                        </section>

                    </section>

                    <div className="overflow-x-auto">
                        {payrollHistory.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hourly Rate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pay</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payrollHistory.map((record) => (
                                        <tr key={record.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{record.employeeName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{record.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{record.totalHours}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${record.hourlyRate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${record.totalPay}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No payroll history available.</p>
                            </div>
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