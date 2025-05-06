import React, { useState, useContext } from 'react'; // Kết hợp tất cả các imports của React, useState và useContext
import googleIcon from '../assets/google_logo_icon_169090.png';
import { AuthContext } from '../Context/AuthContext';
const Register = () => {
   const [formData, setFormData] = useState({
        user_name: '',
        email: '',
        password: ''
    });
    const { register } = useContext(AuthContext);
     
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        register(formData.user_name, formData.email, formData.password);
        console.log(formData.user_name, formData.email, formData.password);

    };

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <div className="min-h-screen flex justify-center items-center bg-gray-100">
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
                                type="email" // Sửa type thành email (chuẩn hơn)
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

                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                id="formCheck"
                                className="mr-2"
                            />
                            <label htmlFor="formCheck" className="text-sm text-gray-600">
                                Lưu thông tin
                            </label>
                        </div>

                        <div className="mb-4">
                            <button
                                type="submit" // Chuyển từ type="button" thành type="submit" để submit form
                                className="w-full py-3 text-sm font-medium text-white bg-[#de767e] rounded-lg hover:bg-[#c63e81] transition"
                            >
                                Đăng kí
                            </button>
                        </div>

                        <div className="mb-4">
                            <button className="w-full py-3 text-sm font-medium bg-white border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                                <img
                                    src={googleIcon}
                                    alt="Google icon"
                                    className="w-5 h-5"
                                />
                                <span>Đăng nhập với Google</span>
                            </button>
                        </div>

                        <div className="text-center text-sm">
                            <span>Bạn đã có tài khoản? </span>
                            <a href="/sign-in" className="text-emerald-600 hover:underline">
                                Đăng nhập
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
};

export default Register;
