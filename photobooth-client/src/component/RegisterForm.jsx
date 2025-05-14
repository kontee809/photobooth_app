import React, { useState, useContext } from 'react'; 
import { AuthContext } from '../Context/AuthContext';  // Nhớ import AuthContext

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        user_name: '',
        email: '',
        password: ''
    });

    const { register, errorMessage, setErrorMessage} = useContext(AuthContext);  // Lấy các hàm và state từ context

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        // Gọi register từ context
        await register(formData.user_name, formData.email, formData.password);
    };

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <div className="min-h-screen flex justify-center items-center">
                    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-semibold">Đăng kí</h2>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                name="user_name"
                                placeholder="Username"
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-sm border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-sm border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                name="password"
                                placeholder="Nhập mật khẩu"
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-sm border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        {errorMessage && (
                            <div className="mb-4 text-red-600 text-sm text-center">
                                {errorMessage}
                            </div>
                        )}

                        <div className="mb-4">
                            <button
                                type="submit"
                                className="w-full py-3 text-sm font-medium text-white bg-[#de767e] rounded-lg hover:bg-[#c63e81] transition"
                            >
                                Đăng kí
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        </main>
    );
};

export default RegisterForm;
