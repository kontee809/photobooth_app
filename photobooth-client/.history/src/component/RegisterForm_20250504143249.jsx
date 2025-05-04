import React from 'react';
import 

function RegisterForm() {
    return (
        <main>
            <form action="">
                <div className="min-h-screen flex justify-center items-center bg-gray-100">
                    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-semibold">Đăng kí</h2>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Tên tài khoản"
                                className="w-full px-4 py-3 text-sm border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                className="w-full px-4 py-3 text-sm border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Nhập lại mật khẩu"
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
                                type="button"
                                className="w-full py-3 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition"
                            >
                                Đăng kí
                            </button>
                        </div>

                        <div className="mb-4">
                            <button className="w-full py-3 text-sm font-medium bg-white border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                                <img
                                    src="../assets/google_logo_icon_169090.png"
                                    alt="Google icon"
                                    className="w-5 h-5"
                                />
                                <span>Đăng nhập với Google</span>
                            </button>
                        </div>

                        <div className="text-center text-sm">
                            <span>Bạn đã có tài khoản? </span>
                            <a href="dangnhap.html" className="text-emerald-600 hover:underline">
                                Đăng nhập
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}

export default RegisterForm;
