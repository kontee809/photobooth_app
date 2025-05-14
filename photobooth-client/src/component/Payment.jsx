import React from 'react';

export default function Payment() {
  const handlePayment = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/create_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: 1000 }), // hoặc số tiền bạn muốn
      });

      const data = await response.json();

      if (data.payUrl) {
        window.location.href = data.payUrl; // chuyển hướng tới MoMo
      } else {
        alert('Không thể tạo thanh toán!');
        console.error(data);
      }
    } catch (error) {
      alert('Có lỗi xảy ra!');
      console.error(error);
    }
  };

  return (
    <div className='text-center'>
      <h1>Bạn chưa thanh toán</h1>
      <button className='bg-black text-white p-2' onClick={handlePayment}>Thanh toán ở đây</button>
    </div>
  );
}
