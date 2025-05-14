import json
import uuid
import hmac
import hashlib
import requests

def create_momo_payment(amount, order_id, user_id):
    endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
    partnerCode = "MOMO"
    accessKey = "F8BBA842ECF85"
    secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
    orderInfo = "Pay Premium"
    redirectUrl = "http://localhost:3000/done-payment"
    ipnUrl = "https://77d7-113-165-143-76.ngrok-free.app/ipn_momo"  # <-- thay bằng URL thực tế hoặc ngrok
    requestId = str(uuid.uuid4())
    requestType = "captureWallet"

    # Truyền thông tin user qua extraData (được gửi lại khi thanh toán thành công)
    extraData = json.dumps({
        "user_id": user_id,
    })

    # Tạo chữ ký (signature)
    raw_signature = (
        f"accessKey={accessKey}&amount={amount}&extraData={extraData}&ipnUrl={ipnUrl}"
        f"&orderId={order_id}&orderInfo={orderInfo}&partnerCode={partnerCode}"
        f"&redirectUrl={redirectUrl}&requestId={requestId}&requestType={requestType}"
    )
    signature = hmac.new(secretKey.encode(), raw_signature.encode(), hashlib.sha256).hexdigest()

    data = {
        "partnerCode": partnerCode,
        "partnerName": "Test",
        "storeId": "MomoTestStore",
        "requestId": requestId,
        "amount": amount,
        "orderId": order_id,
        "orderInfo": orderInfo,
        "redirectUrl": redirectUrl,
        "ipnUrl": ipnUrl,
        "lang": "vi",
        "extraData": extraData,
        "requestType": requestType,
        "signature": signature,
    }

    res = requests.post(endpoint, json=data, headers={"Content-Type": "application/json"})
    try:
        response_data = res.json()
        # print("[MoMo Response]", json.dumps(response_data, indent=2))
    except Exception as e:
        print("[MoMo Error]", str(e))

    return res.json() if res.ok else None
