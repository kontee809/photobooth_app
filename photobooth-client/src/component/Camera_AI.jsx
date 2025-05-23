import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const WebCamAI = () => {
  const webcamRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [timer, setTimer] = useState(3);
  const [countdown, setCountdown] = useState(null);
  const [isCounting, setIsCounting] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState("");
  const [resultPhotos, setResultPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  //moi
  const [backgroundImage, setBackgroundImage] = useState(null);

  const navigate = useNavigate();

  const capture = useCallback(() => {
    if (photos.length >= 3 || !webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();
    if (screenshot) {
      setPhotos((prev) => [...prev, screenshot]);
    }
  }, [photos]);

  const startAutoCapture = () => {
    if (isCounting || photos.length >= 3) return;

    setIsCounting(true);
    let shotsLeft = 3 - photos.length;

    const captureWithCountdown = (remainingShots) => {
      let current = timer;
      setCountdown(current);

      const interval = setInterval(() => {
        current -= 1;
        if (current > 0) {
          setCountdown(current);
        } else {
          clearInterval(interval);
          setCountdown(null);
          capture();

          if (remainingShots - 1 > 0) {
            setTimeout(() => {
              captureWithCountdown(remainingShots - 1);
            }, 500);
          } else {
            setIsCounting(false);
          }
        }
      }, 1000);
    };

    captureWithCountdown(shotsLeft);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    setPhotos([]);
    setResultPhotos([]);
    setBackgroundImage(null); // reset luôn ảnh nền
  };

  const handleAIProcessing = async () => {
    if (!selectedFunction || photos.length !== 3) return;

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/process", {
        images: photos,
        mode: selectedFunction,
        background: backgroundImage,
      });

      if (res.data.status === "success") {
        setResultPhotos(res.data.results);
      } else {
        alert("Xử lý thất bại: " + res.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gọi AI:", error);
      alert("Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }

  };

  const handleGoToFrame = () => {
    navigate('/frame', { state: { photos: resultPhotos } });
  };
  //moi
  const handleBackgroundUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setBackgroundImage(reader.result); // base64 ảnh nền
  };
  reader.readAsDataURL(file);

};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br p-4">
      <h1 className="text-3xl font-bold mb-6">Chụp ảnh với AI</h1>

      <div className="relative w-[640px] h-[360px] rounded overflow-hidden bg-black mb-6">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
        />
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white text-8xl font-bold">{countdown}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center mb-6">
        <button
          onClick={resetAll}
          className="px-4 py-2 rounded shadow-md border font-medium bg-white hover:bg-gray-100"
        >
          Làm mới
        </button>

        <button
          onClick={startAutoCapture}
          className="px-6 py-2 rounded shadow-md font-semibold bg-white hover:bg-gray-100"
        >
          {photos.length >= 3 ? "Tiếp theo" : `Chụp ảnh (${photos.length}/3)`}
        </button>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-semibold">Thời gian:</label>
          <select
            className="px-2 py-1 rounded border"
            value={timer}
            onChange={(e) => setTimer(Number(e.target.value))}
            disabled={isCounting}
          >
            <option value={3}>3s</option>
            <option value={5}>5s</option>
            <option value={10}>10s</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="relative w-24 h-24 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center overflow-hidden bg-white"
          >
            {photos[index] ? (
              <>
                <img
                  src={photos[index]}
                  alt={`photo-${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  title="Xóa"
                >
                  ✕
                </button>
              </>
            ) : (
              <span className="text-xs text-gray-500">Ảnh</span>
            )}
          </div>
        ))}
      </div>

      {photos.length === 3 && (
        <div className="p-6 max-w-4xl mx-auto rounded-lg w-full">
          <div className="mb-6">
            <select
              id="anime-select"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
            >
              <option value="">Chọn chức năng</option>
              <option value="anime">Chuyển sang ảnh Anime</option>
              {/* moi */}
              <option value="remove-bg">Xóa nền và thay nền</option>
            </select>
          </div>

          {/* moi */}
          {selectedFunction === "remove-bg" && (
            <div className="mb-4">
              <label className="font-medium text-sm">Chọn ảnh nền (mới):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                className="mt-1 block"
              />
            </div>
          )}



          <button
            onClick={handleAIProcessing}
            disabled={!selectedFunction || loading}
            className="px-6 py-2 mb-6 rounded shadow-md font-semibold bg-white hover:bg-gray-100"
          >
            {loading ? "Đang xử lý..." : "Xử lý AI"}
          </button>

          <div>
            <h5 className="font-semibold mb-2">Ảnh preview:</h5>
            <div className="flex gap-4 flex-wrap">
              {resultPhotos.length > 0 ? (
                resultPhotos.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`result-${i}`}
                    className="w-40 h-40 object-cover border rounded"
                  />
                ))
              ) : (
                <p className="text-gray-500">Chưa có kết quả AI</p>
              )}
            </div>
          </div>

          {resultPhotos.length === 3 && (
            <button
              onClick={handleGoToFrame}
              className="mt-6 px-6 py-2 bg-pink-500 text-white rounded-lg"
            >
              Chọn Frame
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WebCamAI;
