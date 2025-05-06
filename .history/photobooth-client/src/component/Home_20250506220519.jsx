import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ">
      <h1 className="text-4xl mb-12 text-center te-w font-medium">Chọn mẫu của bạn</h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-16 px-4">
        {/* Template 1 */}
        <div className="border border-black rounded-md p-6 px-40 text-center hover:scale-105 transition">
          <Link to="/camera">
            <img
              src="https://meobeostudio.com/images/4_images.png"
              alt="3 Pictures (Diagonal)"
              className="w-28 h-auto mx-auto mb-4"
            />
            <p className="font-medium">Chụp ảnh miễn phí</p>
          </Link>
        </div>

        {/* Template 2 */}
        <div className="border border-black rounded-md py-6 px-40 text-center hover:scale-105 transition">
          <Link to="/camera">
            <img
              src="https://meobeostudio.com/images/4_images.png"
              alt="4 Pictures (2x2)"
              className="w-28 h-auto mx-auto mb-4"
            />
            <p className="font-medium">Chụp ảnh với AI</p>
          </Link>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-10">
        <Link to="/" className="px-6 py-2 border border-black rounded hover:bg-black hover:text-white transition">
          BACK
        </Link>
      </div>
    </main>
  );
}
