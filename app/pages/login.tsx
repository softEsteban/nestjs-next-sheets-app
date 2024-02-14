import React, { useState } from 'react';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import '../app/globals.css';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import PublicLayout from '@/components/layouts/PublicLayout';
import { setSelectedComponent } from '@/redux/reducer';
import { handleSuccessfulAction, handleInfoAction, handleFailedAction } from '@/utils/toastUtils';

const Login = () => {
    const router = useRouter();

    //Store
    const dispatch = useDispatch();
    const setSelectedComponentMenu = (menu: any) => {
        dispatch(setSelectedComponent(menu));
    };

    const [user, setUser] = useState({ email: '', password: '' });

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/auth/login`, {
                user_email: user.email,
                user_password: user.password,
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

            else if (response.data.message === "User was not found") {
                handleFailedAction("User was not found!");
            }
            else if (response.data.message === "Password is incorrect") {
                handleFailedAction("Password is incorrect!");
            }

        } catch (error: any) {
            const response = error?.response.data;
            if (response.error === "User does not exist") {
                handleFailedAction("El usuario no existe");
            } else if (response.error === "Invalid credentials") {
                handleFailedAction("La contraseña es incorrecta");
            } else if (response.error === "User has not confirm email yet") {
                handleFailedAction("El correo no ha sido confirmado");
            } else {
                handleInfoAction("Ha habido un error en el servidor. Inténtalo de nuevo más tarde");
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
                    <div className="mb-4">
                        <div className="flex items-center border rounded-full p-2">
                            <FaUserCircle className="text-gray-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Email"
                                className="w-full outline-none text-gray-700 bg-gray-500 bg-opacity-0"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center border rounded-full p-2">
                            <FaLock className="text-gray-500 mr-2" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full outline-none text-gray-700 bg-gray-500 bg-opacity-0"
                                value={user.password}

                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleLogin}
                        className="bg-purple-800 text-white rounded-full py-2 px-6 hover:bg-purple-900 w-full mb-4"
                    >
                        Sign In
                    </button>
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