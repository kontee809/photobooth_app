import React from 'react';

function LoginForm() {
    return (
        <main>
            <form action="">
                {/* Main Container */}
                <div className="min-h-screen flex justify-center items-center bg-gray-100">
                    {/* Login Container */}
                    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-3xl p-6 w-full max-w-4xl">
                        
                        {/* Left Box */}
                        <div className="md:w-1/2 bg-emerald-600 rounded-2xl flex flex-col justify-center items-center p-6 text-white">
                            <div className="mb-4">
                                <img
                                    src="images/Spring flower-bro.png"
                                    alt="Flower"
                                    className="w-64"
                                />
                            </div>
                            <p className="text-3xl font-semibold font-mono"><PHOTOBOOTH></PHOTOBOOTH></p>
                            <small className="text-center mt-2 w-64 font-mono">
                                Welcome to our flower shop.
                            </small>
                        </div>

                        {/* Right Box */}
                        <div className="md:w-1/2 mt-6 md:mt-0 md:ml-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold">Đăng nhập</h2>
                                <p className="text-gray-600">Chúng tôi rất vui khi có bạn trở lại.</p>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Tên tài khoản"
                                    className="w-full px-4 py-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    placeholder="Mật khẩu"
                                    className="w-full px-4 py-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div className="mb-6 flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="formCheck"
                                        className="mr-2"
                                    />
                                    <label htmlFor="formCheck" className="text-gray-600">
                                        Lưu thông tin
                                    </label>
                                </div>
                                <a href="#" className="text-emerald-600 hover:underline">
                                    Quên mật khẩu?
                                </a>
                            </div>

                            <div className="mb-4">
                                <button
                                    type="button"
                                    className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
                                >
                                    Đăng nhập
                                </button>
                            </div>

                            <div className="mb-4">
                                <button
                                    type="button"
                                    className="w-full py-3 bg-white border flex items-center justify-center gap-2 text-sm rounded-lg hover:bg-gray-100 transition"
                                >
                                    <img
                                        src="images/google_logo_icon_169090.png"
                                        alt="Google"
                                        className="w-5 h-5"
                                    />
                                    Đăng nhập với Google
                                </button>
                            </div>

                            <div className="text-center text-sm">
                                <span>Bạn không có tài khoản? </span>
                                <a
                                    href="dangky.html"
                                    className="text-emerald-600 hover:underline"
                                >
                                    Đăng ký
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}

export default LoginForm;
