import { ChangeEvent, useEffect, useState } from "react";
import './styles.css';
import { token } from "@/utils/authUtils";
import User from "@/types/user.type";
import UserType from "@/types/user.type.enum";

interface AddUpdateUserModalProps {
    handleCloseModal: () => void;
    handleAddUser: (user: User) => void;
    handleUpdateUser: (user: User) => void;
    action: 'create' | 'update';
    selectedUser?: User;
}

const AddUpdateUserModal: React.FC<AddUpdateUserModalProps> = ({ handleCloseModal, handleAddUser, handleUpdateUser, action, selectedUser }: AddUpdateUserModalProps) => {

    // Data and api requests
    const [userData, setUserData] = useState<User>({
        user_id: selectedUser ? selectedUser.user_id : 0,
        user_name: selectedUser ? selectedUser.user_name : '',
        user_lastname: selectedUser ? selectedUser.user_lastname : '',
        user_email: selectedUser ? selectedUser.user_email : '',
        user_type: selectedUser ? selectedUser.user_type : '',
        user_created_at: selectedUser ? selectedUser.user_created_at : ''
    });

    useEffect(() => {
        if (action === "update" && selectedUser) {
            setUserData({ ...selectedUser });
        } else {
            setUserData({
                user_id: 0,
                user_name: '',
                user_lastname: '',
                user_type: '',
                user_email: '',
                user_created_at: ''
            });
        }
    }, [action, selectedUser]);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let response;
            const userDataStringified = { ...userData };

            if (action === "update") {
                response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/users/${selectedUser?.user_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(userDataStringified),
                });
            } else {
                response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(userDataStringified),
                });
            }

            if (response.ok) {
                handleCloseModal();
                const responseData = await response.json();
                if (action === "create") {
                    handleAddUser(responseData);
                } else {
                    handleUpdateUser(responseData);
                }
            } else {
                console.error(`Failed to ${action === 'update' ? 'update' : 'add'} user.`);
            }
        } catch (error) {
            console.error(`Error ${action === 'update' ? 'updating' : 'adding'} user:`, error);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-h-80vh overflow-y-auto w-full md:w-3/4 lg:w-1/2 m-10">
                <h2 className="text-2xl font-semibold mb-4">{action === 'update' ? 'Edit User' : 'Add User'}</h2>

                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-3 form-container">
                    <div className="flex flex-col mb-4">
                        <label htmlFor="user_name" className="block text-gray-700 font-semibold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="user_name"
                            name="user_name"
                            value={userData.user_name}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="user_lastname" className="block text-gray-700 font-semibold mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="user_lastname"
                            name="user_lastname"
                            value={userData.user_lastname}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="user_email" className="block text-gray-700 font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="text"
                            id="user_email"
                            name="user_email"
                            value={userData.user_email}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="user_type" className="block text-gray-700 font-semibold mb-2">
                            User Type
                        </label>
                        <select
                            id="user_type"
                            name="user_type"
                            value={userData.user_type}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        >
                            {Object.values(UserType).map(userType => (
                                <option key={userType} value={userType}>{userType.toUpperCase()}</option>
                            ))}
                        </select>
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

export default AddUpdateUserModal;
