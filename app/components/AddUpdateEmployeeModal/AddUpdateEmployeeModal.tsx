import { ChangeEvent, useEffect, useState } from "react";
import './styles.css';
import Employee from "@/types/employee.type";
import { storedData, token } from "@/utils/authUtils";
import PayType from "@/types/pay.type.enum";

interface AddUpdateEmployeeFormProps {
    handleCloseModal: () => void;
    handleAddEmployee: (employee: Employee) => void;
    handleUpdateEmployee: (employee: Employee) => void;
    action: 'create' | 'update';
    selectedEmployee?: Employee;
}

const AddUpdateEmployeeForm: React.FC<AddUpdateEmployeeFormProps> = ({ handleCloseModal, handleAddEmployee, handleUpdateEmployee, action, selectedEmployee }: AddUpdateEmployeeFormProps) => {

    // Data and api requests
    const [employeeData, setEmployeeData] = useState<Employee>({
        employee_id: selectedEmployee ? selectedEmployee.employee_id : 0,
        employee_name: selectedEmployee ? selectedEmployee.employee_name : '',
        employee_lastname: selectedEmployee ? selectedEmployee.employee_lastname : '',
        employee_pay_type: selectedEmployee ? selectedEmployee.employee_pay_type : 'salary',
        employee_pay_rate: selectedEmployee ? selectedEmployee.employee_pay_rate : 0,
        employee_created_at: selectedEmployee ? selectedEmployee.employee_created_at : '',
        user_id: storedData?.user_id
    });

    useEffect(() => {
        if (action === "update" && selectedEmployee) {
            setEmployeeData({ ...selectedEmployee });
        } else {
            setEmployeeData({
                employee_id: 0,
                employee_name: '',
                employee_lastname: '',
                employee_pay_type: 'salary',
                employee_pay_rate: 0,
                employee_created_at: '',
                user_id: storedData?.user_id
            });
        }
    }, [action, selectedEmployee]);

    // Form validations and inputs
    const [validationMessage, setValidationMessage] = useState<string>('');

    const validatePayRate = (value: number) => {
        if (value < 12) {
            setValidationMessage('The pay rate cannot be lower than 12.');
        } else {
            setValidationMessage('');
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let response;
            const employeeDataStringified = { ...employeeData, employee_pay_rate: String(employeeData.employee_pay_rate) };

            if (action === "update") {
                response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/employees/${selectedEmployee?.employee_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(employeeDataStringified),
                });
            } else {
                response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/employees`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(employeeDataStringified),
                });
            }

            if (response.ok) {
                handleCloseModal();
                const responseData = await response.json();
                if (action === "create") {
                    handleAddEmployee(responseData);
                } else {
                    handleUpdateEmployee(responseData);
                }
            } else {
                console.error(`Failed to ${action === 'update' ? 'update' : 'add'} employee.`);
            }
        } catch (error) {
            console.error(`Error ${action === 'update' ? 'updating' : 'adding'} employee:`, error);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmployeeData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        // Validate pay rate when input value changes
        if (name === 'employee_pay_rate') {
            validatePayRate(Number(value));
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-h-80vh overflow-y-auto w-full md:w-3/4 lg:w-1/2 m-10">
                <h2 className="text-2xl font-semibold mb-4">{action === 'update' ? 'Edit Employee' : 'Add Employee'}</h2>

                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-3 form-container">
                    <div className="flex flex-col mb-4">
                        <label htmlFor="employee_name" className="block text-gray-700 font-semibold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="employee_name"
                            name="employee_name"
                            value={employeeData.employee_name}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="employee_lastname" className="block text-gray-700 font-semibold mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="employee_lastname"
                            name="employee_lastname"
                            value={employeeData.employee_lastname}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="employee_pay_type" className="block text-gray-700 font-semibold mb-2">
                            Pay Type
                        </label>
                        <select
                            id="employee_pay_type"
                            name="employee_pay_type"
                            value={employeeData.employee_pay_type}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        >
                            {Object.values(PayType).map(payType => (
                                <option key={payType} value={payType}>{payType}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="employee_pay_rate" className="block text-gray-700 font-semibold mb-2">
                            Pay Rate
                        </label>
                        <input
                            type="number"
                            id="employee_pay_rate"
                            name="employee_pay_rate"
                            value={employeeData.employee_pay_rate}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                        {validationMessage && (
                            <p className="text-red-500 text-sm mt-1">{validationMessage}</p>
                        )}
                    </div>
                    <div className="flex justify-start mt-4">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2"
                        >
                            {action === 'update' ? 'Update' : 'Add'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUpdateEmployeeForm;
