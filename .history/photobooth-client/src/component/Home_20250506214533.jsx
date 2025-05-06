import React from 'react'
import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <main className='w-full h-1/2'>
        <div className=''>
            <h1 className='text-center mt-10 text-3xl font-bold'>Các mẫu </h1>
        </div>
        <div className='w-full flex justify-around gap-10 mt-8'>
            <Link to = "/camera" className='flex justify-center' href="">
                <img className='w-full md:w-1/4 lg' src="https://meobeostudio.com/images/4_images.png" alt="" />
            </Link>
        </div>
    </main>
  )
}
