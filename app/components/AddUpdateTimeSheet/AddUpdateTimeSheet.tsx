import { Field, Form, Formik, ErrorMessage } from "formik";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as yup from 'yup';
import Employee from "@/types/employee.type";
import { user, token } from "@/utils/authUtils";

interface TimeSheetsFormValues {
    employee: string;
    hourlyRate: string;
    totalHours: string;
    salaryRate: string;
    checkDate: string;
}

const initialValues: TimeSheetsFormValues = {
    employee: "",
    hourlyRate: "",
    totalHours: "",
    salaryRate: "",
    checkDate: ""
}

const validationSchema = yup.object({
    employee: yup.string().required("Employee is required"),
    hourlyRate: yup.string(),
    totalHours: yup.string().test({
        name: 'totalHours',
        exclusive: false,
        message: 'Total hours is required',
        test: function (value) {
            const { employee, hourlyRate } = this.parent;
            if (employee === 'hourly' && hourlyRate && !value) {
                return false;
            }
            return true;
        }
    }),
    salaryRate: yup.string(),
    checkDate: yup.string().required("Check date is required")
});

export default function AddUpdateTimeSheet({ handleAddTimeSheet }: any) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [validationMessage, setValidationMessage] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = user?.user_type === 'admin' ? `${process.env.NEXT_PUBLIC_HOST}/employees` : `${process.env.NEXT_PUBLIC_HOST}/employees/user/${user.user_id}`;
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

    const handleSubmit = async (values: TimeSheetsFormValues) => {
        try {
            const formData = {
                employee_id: values.employee,
                sheet_pay_rate: selectedEmployee?.employee_pay_type === "hourly" ? values.hourlyRate : values.salaryRate,
                sheet_hours: values.totalHours || 0,
                sheet_check_date: values.checkDate,
            };
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
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {formik => (
                    <Form ref={formRef} className="flex flex-wrap gap-4 justify-between items-end h-full">
                        <div className="w-full sm:w-auto">
                            <label htmlFor="employee" className="block text-sm font-medium text-gray-700">Select Employee</label>
                            <Field
                                as="select"
                                id="employee"
                                name="employee"
                                className="mt-1 block w-full sm:w-48 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                onChange={(e: any) => {
                                    const selectedId = parseInt(e.target.value);
                                    const employee = employees.find(emp => emp.employee_id === selectedId);
                                    if(employee)
                                    setSelectedEmployee(employee);
                                    formik.handleChange(e);
                                }}
                            >
                                <option value="">Select an employee</option>
                                {employees.map(employee => (
                                    <option key={employee.employee_id} value={employee.employee_id}>
                                        {employee.employee_name} {employee.employee_lastname}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="employee" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        {selectedEmployee && (
                            <>
                                {selectedEmployee.employee_pay_type === "hourly" && (
                                    <>
                                        <div className="w-full sm:w-48">
                                            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                                            <Field
                                                type="text"
                                                id="hourlyRate"
                                                name="hourlyRate"
                                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                            <ErrorMessage name="hourlyRate" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div className="w-full sm:w-48">
                                            <label htmlFor="totalHours" className="block text-sm font-medium text-gray-700">Total Hours</label>
                                            <Field
                                                type="text"
                                                id="totalHours"
                                                name="totalHours"
                                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                            <ErrorMessage name="totalHours" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    </>
                                )}
                                {selectedEmployee.employee_pay_type === "salary" && (
                                    <div className="w-full sm:w-48">
                                        <label htmlFor="salaryRate" className="block text-sm font-medium text-gray-700">Salary Rate</label>
                                        <Field
                                            type="text"
                                            id="salaryRate"
                                            name="salaryRate"
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        <ErrorMessage name="salaryRate" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                )}
                            </>
                        )}
                        <div className="w-full sm:w-48">
                            <label htmlFor="checkDate" className="block text-sm font-medium text-gray-700">Check Date</label>
                            <Field
                                type="date"
                                id="checkDate"
                                name="checkDate"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <ErrorMessage name="checkDate" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        {validationMessage && (
                            <div className="w-full sm:w-auto">
                                <p className="text-red-500 text-sm mt-1">{validationMessage}</p>
                            </div>
                        )}
                        <div className="w-full sm:w-auto">
                            <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Send
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}

