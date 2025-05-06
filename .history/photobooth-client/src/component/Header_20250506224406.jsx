import React from 'react'
import cameraIcon from '../assets/camera-icon.png';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

export default function Header() {
    const { token, logout } = useContext(AuthContext);
  return (
   <header class="pb-6 lg:pb-0">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* <!-- lg+ --> */}
        <nav class="flex items-center justify-between h-16 lg:h-20">
            <div class="flex-shrink-0">
            <a href="#" class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-black">PhotoBooth</span>
            </a>
            </div>

            
            {
                token?(
                    <button  onClick={logout} title="" class="items-center justify-center hidden px-4 py-3 ml-10 text-base font-semibold text-white transition-all duration-200 bg-[#de767e] border border-transparent rounded-md lg:inline-flex hover:bg-[#c63e81] focus:bg-[#c63e81]" role="button"> Đăng xuất </button>

                ) : (
                    <a href="/sign-in" title="" class="items-center justify-center hidden px-4 py-3 ml-10 text-base font-semibold text-white transition-all duration-200 bg-[#de767e] border border-transparent rounded-md lg:inline-flex hover:bg-[#c63e81] focus:bg-[#c63e81]" role="button"> Đăng nhập </a>

                )
            }
        </nav>
    </div>
</header>
  )
}
