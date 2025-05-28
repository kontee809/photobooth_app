import React, { useState, useContext, useRef, useEffect } from 'react'
import { AuthContext } from '../Context/AuthContext';
import cameraIcon from '../assets/camera-icon.png';

export default function Header() {
  const { token, logout, user } = useContext(AuthContext); 
  // giả sử trong user có info như { name: 'Nguyễn Văn A', avatarUrl: '...' }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  return (
    <header className="pb-6 lg:pb-0">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-black">PhotoBooth</span>
            </a>
          </div>

          {
            token ? (
              <div className="relative flex items-center space-x-2" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#c63e81]"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                >
                    <img
                    src={cameraIcon}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    />
                </button>
                <p className='text-black font-medium'>{"Ti"}</p>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-36 w-48 bg-white rounded-md shadow-lg z-20">
                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Hồ sơ của tôi</a>
                    <button
                        onClick={logout}    
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                        Đăng xuất
                    </button>
                    </div>
                )}
                </div>
                
            ) : (
              <a
                href="/sign-in"
                title="Đăng nhập"
                className="items-center justify-center hidden px-4 py-3 ml-10 text-base font-semibold text-white transition-all duration-200 bg-[#de767e] border border-transparent rounded-md lg:inline-flex hover:bg-[#c63e81] focus:bg-[#c63e81]"
                role="button"
              >
                Đăng nhập
              </a>
            )
          }
        </nav>
      </div>
    </header>
  )
}
