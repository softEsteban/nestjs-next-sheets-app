import React from 'react';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import PublicLayout from '@/components/layouts/PublicLayout';
import { setSelectedComponent } from '@/redux/reducer';
import { handleSuccessfulAction, handleInfoAction, handleFailedAction } from '@/utils/toastUtils';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';

interface LoginFormValues {
    email: string;
    password: string;
}

const initialValues: LoginFormValues = {
    email: "",
    password: ""
}

const validationSchema = yup.object({
    email: yup.string().required("Email is required").email("Email must be a valid email format"),
    password: yup.string().required("Password is required. Come on!").min(8),
})

const Login = () => {
    const router = useRouter();

    //Store
    const dispatch = useDispatch();
    const setSelectedComponentMenu = (menu: any) => {
        dispatch(setSelectedComponent(menu));
    };

    const handleLogin = async (values: LoginFormValues) => {
        try {
            
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/auth/login`, {
                user_email: values.email,
                user_password: values.password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Successful request
            if (response.data.user) {
                const data = response.data;
                const token = data.token;

                if (token) {
                    handleSuccessfulAction("Successful login!");

                    // Localstorage
                    const userData = {
                        user: data.user,
                        menu: data.user.profile.profile_config,
                        token: data.token,
                    };
                    const userSessionDataString = JSON.stringify(userData);
                    localStorage.setItem('userSession', userSessionDataString);

                    setSelectedComponentMenu("/home");
                    setTimeout(() => {
                        router.push('/home');
                    }, 1000);
                }
            }

        } catch (error: any) {
            const response = error?.response.data;
            if (response.message === "User was not found") {
                handleFailedAction("User was not found");
            } else if (response.message === "Password is incorrect") {
                handleFailedAction("Password is incorrect");
            } else {
                handleInfoAction("There has been a server error. Try later, please!");
            }
        }
    };

    return (
        <PublicLayout>
            <title>Login | OCMI</title>
            <ToastContainer />
            <div className="min-h-screen flex items-center justify-center bg-cover relative" style={{ backgroundImage: `url("/civil-work.jpg")` }}>
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
                <div className="bg-white bg-opacity-90 shadow-lg rounded-md p-8 max-w-md w-full relative z-10">
                    <h2 className="text-3xl lg:text-4xl font-semibold mb-4 text-purple-900 text-center">
                        Sign In
                    </h2>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            handleLogin(values);
                            setSubmitting(false);
                        }}
                    >
                        {({ isSubmitting, isValidating, isValid }) => (
                            <Form className="space-y-4">
                                <div className="mb-4">
                                    <div className="flex items-center border rounded-full p-2">
                                        <FaUserCircle className="text-gray-500 mr-2" />
                                        <Field type="email" name="email" placeholder="Email" className="w-full outline-none text-gray-700 bg-gray-500 bg-opacity-0" />
                                    </div>
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm ml-8" />
                                </div>
                                <div className="mb-4">
                                    <div className="flex items-center border rounded-full p-2">
                                        <FaLock className="text-gray-500 mr-2" />
                                        <Field type="password" name="password" placeholder="Password" className="w-full outline-none text-gray-700 bg-gray-500 bg-opacity-0" />
                                    </div>
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm ml-8" />
                                </div>
                                <button type="submit" disabled={isSubmitting || isValidating || !isValid} className="bg-purple-800 text-white rounded-full py-2 px-6 hover:bg-purple-900 w-full mb-4">
                                    Submit
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <div className="text-sm text-center pt-2">
                        <a href="#" className="text-blue-500 hover:underline">
                            Forgot your password?
                        </a>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default Login;