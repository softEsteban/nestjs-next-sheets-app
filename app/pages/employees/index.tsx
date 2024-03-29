import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { user, token } from "@/utils/authUtils";
import axios from "axios";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import Employee from "@/types/employee.type";
import { formattedDate } from "@/utils/dateUtils";
import AddUpdateEmployeeModal from "@/components/AddUpdateEmployeeModal/AddUpdateEmployeeModal";
import NoData from "@/components/NoData/NoData";
import { handleSuccessfulAction } from '@/utils/toastUtils';
import ViewTimeSheetsDetailModal from "@/components/ViewTimeSheetsDetailModal/ViewTimeSheetsDetailModal";

export default function Employees() {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const isAdmin = user?.user_type === 'admin';

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = isAdmin ? `${process.env.NEXT_PUBLIC_HOST}/employees` : `${process.env.NEXT_PUBLIC_HOST}/employees/user/${user.user_id}`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [isAdmin]);

    // Modal
    const [showTimeSheetsDetailModal, setShowTimeSheetsDetailModal] = useState(false);

    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
    const [employeeAction, setEmployeeAction] = useState<'create' | 'update'>('create');


    // Functions to handle modals actions
    const handleViewTimeSheetsDetail = (employee: Employee) => {
        setSelectedEmployee(employee);
        setShowTimeSheetsDetailModal(true);
    };

    const handleCloseTimeSheetsDetailModal = () => {
        setShowTimeSheetsDetailModal(false);
    };

    const handleAddEmployee = () => {
        setEmployeeAction('create');
        setShowEmployeeModal(true);
    };

    const handleEditEmployee = (employee: Employee) => {
        setEmployeeAction('update');
        setShowEmployeeModal(true);
        setSelectedEmployee(employee);
    };

    const handleCloseEmployeeModal = () => {
        setShowEmployeeModal(false);
    };

    const handleAddEmployeeAction = (newEmployee: Employee) => {
        setEmployees([...employees, newEmployee]);
        handleSuccessfulAction("Employee has been successfully created!");
    };

    const handleUpdateEmployeeAction = (updatedEmployee: Employee) => {
        setEmployees(employees.map((employee: Employee) => (employee.employee_id === updatedEmployee.employee_id ? updatedEmployee : employee)));
        handleSuccessfulAction("Employee has been successfully updated!");
    };

    return (
        <AppLayout>
            <title>Employees Management</title>
            <main className="min-h-screen p-4 sm:p-8 bg-gray-100 rounded-xl">
                <section className="mt-8">
                    <section className="flex items-center justify-between mt-8 mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Employees List</h2>
                            <p className="text-sm text-gray-500">View and manage all employees</p>
                        </div>
                        <div className="flex items-center">
                            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md mr-4" onClick={handleAddEmployee}>
                                <FaPlus className="mr-2" /> Add
                            </button>
                        </div>
                    </section>
                    <div className="overflow-x-auto">
                        {employees.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Rate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {employees.map((employee) => (
                                        <tr key={employee.employee_id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{employee.employee_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{employee.employee_lastname}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{employee.employee_pay_type.toUpperCase()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${employee.employee_pay_rate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formattedDate(employee.employee_created_at)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-2" onClick={() => handleEditEmployee(employee)}>
                                                    <FaEdit className="inline-block mr-1" />Edit
                                                </button>
                                                <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleViewTimeSheetsDetail(employee)}>
                                                    <FaEye className="inline-block mr-1" />View pay rolls
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <NoData text={"Try adding some employees to see them here."} />
                        )}
                    </div>

                </section>
            </main>

            {/* Create & Update Employee Modal */}
            {showEmployeeModal && (
                <AddUpdateEmployeeModal
                    handleCloseModal={handleCloseEmployeeModal}
                    handleAddEmployee={handleAddEmployeeAction}
                    handleUpdateEmployee={handleUpdateEmployeeAction}
                    action={employeeAction}
                    selectedEmployee={selectedEmployee}
                />
            )}

            {/* View time sheets detail Modal */}
            {showTimeSheetsDetailModal && (
                <ViewTimeSheetsDetailModal
                    employee={selectedEmployee}
                    handleCloseModal={handleCloseTimeSheetsDetailModal}
                />
            )}
        </AppLayout>
    );
}