import Employee from "@/types/employee.type";
import { user, token } from "@/utils/authUtils";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function AddUpdateTimeSheet({ handleAddTimeSheet }: any) {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
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
    }, []);

    // Form, validations and inputs
    const [validationMessage, setValidationMessage] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // if (selectedEmployee?.employee_pay_type === 'salary') {
        //     if (!selectedEmployee?.employee_id || e.target.totalHours?.value || e.target.checkDate?.value || e.target.salaryRate?.value) {
        //         setValidationMessage("All fields must be filled to create the time sheet");
        //         return;
        //     }
        // } else {
        //     if (!selectedEmployee?.employee_id || e.target.totalHours?.value || e.target.checkDate?.value || e.target.hourlyRate?.value) {
        //         setValidationMessage("All fields must be filled to create the time sheet");
        //         return;
        //     }
        // }

        const formData = {
            employee_id: selectedEmployee?.employee_id,
            sheet_hours: e.target.totalHours?.value || 0,
            sheet_check_date: e.target.checkDate?.value,
            sheet_pay_rate: selectedEmployee?.employee_pay_type === "hourly" ? e.target.hourlyRate?.value : e.target.salaryRate?.value
        };
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/time-sheets`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            formRef.current?.reset();
            handleAddTimeSheet(response.data);
        } catch (error: any) {
            console.error('Error submitting form:', error);
            if (error.response && error.response.data.message) {
                setValidationMessage(error.response.data.message);
            }
        }
    };

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Create Time Sheet</h2>
            <form ref={formRef} className="flex flex-wrap gap-4 justify-between items-end h-full" onSubmit={handleSubmit}>
                <div className="w-full sm:w-auto">
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
                        className="mt-1 block w-full sm:w-48 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option>
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
                        <div className="w-full sm:w-48">
                            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                            <input type="text" name="hourlyRate" id="hourlyRate" value={selectedEmployee.employee_pay_rate} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div className="w-full sm:w-48">
                            <label htmlFor="totalHours" className="block text-sm font-medium text-gray-700">Total Hours</label>
                            <input type="text" name="totalHours" id="totalHours" className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </>
                ) : (
                    <div className="w-full sm:w-48">
                        <label htmlFor="salaryRate" className="block text-sm font-medium text-gray-700">Salary Rate</label><input
                            type="number"
                            name="salaryRate"
                            id="salaryRate"
                            value={selectedEmployee?.employee_pay_rate || ''}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setSelectedEmployee((prevState: any) => {
                                    if (prevState) {
                                        return { ...prevState, employee_pay_rate: newValue };
                                    }
                                    return prevState;
                                });
                            }}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />

                    </div>
                )}
                <div className="w-full sm:w-48">
                    <label htmlFor="checkDate" className="block text-sm font-medium text-gray-700">Check Date</label>
                    <input type="date" name="checkDate" id="checkDate" className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="w-full sm:w-auto">
                    <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Send
                    </button>
                </div>
                <div className="w-full sm:w-auto">
                    {validationMessage && (
                        <p className="text-red-500 text-sm mt-1">{validationMessage}</p>
                    )}
                </div>
            </form>
        </>
    )
}