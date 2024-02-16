import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { token } from "@/utils/authUtils";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import Employee from "@/types/employee.type";
import { formattedDate } from "@/utils/dateUtils";
import AddUpdateEmployeeModal from "@/components/AddUpdateEmployeeModal/AddUpdateEmployeeModal";
import NoData from "@/components/NoData/NoData";
import { handleSuccessfulAction } from '@/utils/toastUtils';
import User from "@/types/user.type";

export default function Users() {

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `${process.env.NEXT_PUBLIC_HOST}/users`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Modal
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [employeeAction, setUserAction] = useState<'create' | 'update'>('create');

    // Functions to handle modal actions
    const handleAddUser = () => {
        setUserAction('create');
        setShowUserModal(true);
    };

    const handleEditUser = (user: User) => {
        setUserAction('update');
        setShowUserModal(true);
        setSelectedUser(user);
    };

    // const handleCloseEmployeeModal = () => {
    //     setShowUserModal(false);
    // };

    // const handleAddEmployeeAction = (newEmployee: Employee) => {
    //     setEmployees([...employees, newEmployee]);
    //     handleSuccessfulAction("Employee has been successfully created!");
    // };

    // const handleUpdateEmployeeAction = (updatedEmployee: Employee) => {
    //     setEmployees(employees.map((employee: Employee) => (employee.employee_id === updatedEmployee.employee_id ? updatedEmployee : employee)));
    //     handleSuccessfulAction("Employee has been successfully updated!");
    // };

    return (
        <AppLayout>
            <title>Employees Management</title>
            <main className="min-h-screen p-4 sm:p-8 bg-gray-100 rounded-xl">
                <section className="mt-8">
                    <section className="flex items-center justify-between mt-8 mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Users List</h2>
                            <p className="text-sm text-gray-500">View and manage all users</p>
                        </div>
                        <div className="flex items-center">
                            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md mr-4" onClick={handleAddUser}>
                                <FaPlus className="mr-2" /> Add
                            </button>
                        </div>
                    </section>
                    <div className="overflow-x-auto">
                        {users.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.user_id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.user_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.user_lastname}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.user_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formattedDate(user.user_created_at)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-2" onClick={() => handleEditUser(user)}>Edit</button>
                                                {/* <button className="text-indigo-600 hover:text-indigo-900">View pay rolls</button> */}
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

            {/* Create & Update Product Modal */}
            {/* {showEmployeeModal && (
                <AddUpdateEmployeeModal
                    handleCloseModal={handleCloseEmployeeModal}
                    handleAddEmployee={handleAddEmployeeAction}
                    handleUpdateEmployee={handleUpdateEmployeeAction}
                    action={employeeAction}
                    selectedUser={selectedUser}
                />
            )} */}
        </AppLayout>
    );
}