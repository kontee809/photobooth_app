import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const DonePayment = () => {
  const location = useLocation();
  const [paymentData, setPaymentData] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    let extraDataRaw = queryParams.get('extraData');
    let extraData = {};

    try {
      if (extraDataRaw) {
        extraData = JSON.parse(decodeURIComponent(extraDataRaw));
      }
    } catch (error) {
      console.error('Lỗi parse extraData:', error);
    }

    const data = {
      partnerCode: queryParams.get('partnerCode'),
      orderId: queryParams.get('orderId'),
      requestId: queryParams.get('requestId'),
      amount: queryParams.get('amount'),
      orderInfo: queryParams.get('orderInfo'),
      orderType: queryParams.get('orderType'),
      transId: queryParams.get('transId'),
      resultCode: queryParams.get('resultCode'),
      message: queryParams.get('message'),
      payType: queryParams.get('payType'),
      responseTime: queryParams.get('responseTime'),
      signature: queryParams.get('signature'),
      extraData: extraData,
    };
    console.log(data);
    setPaymentData(data);

    const isPaid = queryParams.get('resultCode') === '0';
    setIsSuccess(isPaid);

    if (isPaid && extraData.user_id) {
      // Gửi dữ liệu thanh toán về server
    fetch('http://localhost:5000/update', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    orderId: data.orderId,
    amount: data.amount,
    resultCode: parseInt(data.resultCode, 10),
    plan_duration: '7',
  }),
})
  .then(async res => {
    const result = await res.json();
    setServerResponse(result);

    if (res.status === 200 && result.payURL) {
      // Chuyển hướng sang trang AI camera
      window.location.href = result.payURL;
    }
  })
  .catch(err => {
    console.error('Lỗi gửi dữ liệu lên server:', err);
  });
    }
  }, [location.search]);

  return (
    <div>
      <h1>Kết quả thanh toán</h1>
      {isSuccess ? (
        <p style={{ color: 'green' }}>✅ Thanh toán thành công!</p>
      ) : (
        <p style={{ color: 'red' }}>❌ Thanh toán thất bại.</p>
      )}

      <pre>{JSON.stringify(paymentData, null, 2)}</pre>

      {serverResponse && (
        <>
          <h2>Phản hồi từ server:</h2>
          <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export default DonePayment;
