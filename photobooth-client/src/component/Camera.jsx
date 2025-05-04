import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

import basicFrame from '../assets/basic-5.png'; // Import ảnh vào
import cute1Frame from '../assets/cute-1.png'; // Import ảnh vào
import cute5Frame from '../assets/cute-5.png'; // Import ảnh vào
import cute7Frame from '../assets/cute-7.png';
import vietnamFrame from '../assets/vietnam-1.png'; // Import ảnh vào

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [countdown, setCountdown] = useState(0);
  const [numPhotos, setNumPhotos] = useState(4);
  const [delay, setDelay] = useState(3);
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [mergedImage, setMergedImage] = useState(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user'
  };

  const capturePhotos = async () => {
    if (!webcamRef.current) return;
    setPhotos([]);
    setSelectedPhotos([]);
    setMergedImage(null);
    setIsCapturing(true);

    for (let i = 0; i < numPhotos; i++) {
      await startCountdown(delay);

      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhotos(prev => [...prev, imageSrc]);
      }
    }

    setIsCapturing(false);
  };

  const startCountdown = (seconds) => {
    return new Promise((resolve) => {
      let counter = seconds;
      setCountdown(counter);

      const interval = setInterval(() => {
        counter -= 1;
        setCountdown(counter);

        if (counter === 0) {
          clearInterval(interval);
          setCountdown(0);
          resolve();
        }
      }, 1000);
    });
  };

  const togglePhotoSelect = (photo) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photo)) {
        return prev.filter(p => p !== photo);
      } else {
        if (prev.length < 4) {
          return [...prev, photo];
        } else {
          alert("Bạn chỉ được chọn tối đa 4 ảnh!");
          return prev;
        }
      }
    });
  };

  const mergePhotosWithFrame = async () => {
    if (!selectedFrame) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
  
    const frameWidth = 250;
    const frameHeight = 800;
    canvas.width = frameWidth;
    canvas.height = frameHeight;
  
    // Fill nền trắng trước
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, frameWidth, frameHeight);
  
    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = selectedFrame;
  
    // Load tất cả ảnh user chọn
    const loadImages = selectedPhotos.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
      });
    });
  
    const loadedPhotos = await Promise.all(loadImages);
  
    // Vị trí và kích thước ảnh
    const photoPositions = [
      { x: 21, y: 20, width: 208, height: 158 },  // Ảnh 1
      { x: 21, y: 200, width: 208, height: 158 }, // Ảnh 2
      { x: 21, y: 378, width: 208, height: 158 }, // Ảnh 3
      { x: 21, y: 555, width: 208, height: 158 }, // Ảnh 4
    ];
  
    // Vẽ từng ảnh vào đúng vị trí
    loadedPhotos.forEach((img, index) => {
      const pos = photoPositions[index];
      ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height);
    });
  
    // Khi Frame load xong thì vẽ Frame lên cuối cùng
    frameImg.onload = () => {
      ctx.drawImage(frameImg, 0, 0, frameWidth, frameHeight);
      const merged = canvas.toDataURL('image/jpeg');
      setMergedImage(merged);
    };
  };
  

  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-bold mb-4">Chụp Ảnh Tự Động</h2>

      <Webcam
        audio={false}
        height={480}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        videoConstraints={videoConstraints}
        className="rounded-lg shadow-md mx-auto"
      />

      {countdown > 0 && (
        <div className="text-4xl font-bold mt-4 text-red-500">{countdown}</div>
      )}

      <div className="mt-4">
        <label className="mr-2">Số lượng ảnh:</label>
        <select
          value={numPhotos}
          onChange={(e) => setNumPhotos(parseInt(e.target.value))}
          className="border rounded px-2 py-1 mr-4"
        >
          <option value={2}>2</option>
          <option value={4}>4</option>
          <option value={6}>6</option>
        </select>

        <label className="mr-2 ml-4">Thời gian đếm ngược (giây):</label>
        <select
          value={delay}
          onChange={(e) => setDelay(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        >
          <option value={1}>1s</option>
          <option value={3}>3s</option>
          <option value={5}>5s</option>
        </select>
      </div>

      <button
        onClick={capturePhotos}
        className={`mt-6 px-6 py-3 rounded-lg text-white ${isCapturing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        disabled={isCapturing}
      >
        {isCapturing ? "Đang chụp..." : "Bắt đầu chụp"}
      </button>

      <div className='ml-40 text-left'>
        <div>
          <b>Ảnh Preview:</b>
          <p>Nhấn vào ảnh để chọn hoặc hủy chọn ảnh muốn xuất (chọn đúng 4 ảnh).</p>
          <p>Lưu ý: Ảnh được upload sẽ hiển thị chữ “UPLOAD” và không có video!</p>
        </div>

        {photos.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-8 gap-2">
            {photos.map((photo, idx) => {
              const isSelected = selectedPhotos.includes(photo);
              return (
                <div key={idx}>
                  <img
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    className={`object-cover h-40 cursor-pointer hover:opacity-75 border-4 ${isSelected ? 'border-blue-500' : 'border-transparent'}`}
                    onClick={() => togglePhotoSelect(photo)}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <b>Chọn Frame:</b>
          <div className="flex gap-4 mt-2">
            <img
              src={basicFrame}
              alt="Frame"
              className={`w-40 h-full object-cover cursor-pointer ${selectedFrame === basicFrame ? 'border-4 border-green-500' : 'border-transparent'}`}
              onClick={() => setSelectedFrame(basicFrame)}
              onError={(e) => console.error('Error loading image:', e.target.src)}
            />

            <img
              src={cute1Frame}
              alt="Frame"
              className={`w-40 h-full object-cover cursor-pointer ${selectedFrame === cute1Frame ? 'border-4 border-green-500' : 'border-transparent'}`}
              onClick={() => setSelectedFrame(cute1Frame)}
              onError={(e) => console.error('Error loading image:', e.target.src)}
            />

            <img
              src={cute5Frame}
              alt="Frame"
              className={`w-40 h-full object-cover cursor-pointer ${selectedFrame === cute5Frame ? 'border-4 border-green-500' : 'border-transparent'}`}
              onClick={() => setSelectedFrame(cute5Frame)}
              onError={(e) => console.error('Error loading image:', e.target.src)}
            />


            <img
              src={cute7Frame}
              alt="Frame"
              className={`w-40 h-full object-cover cursor-pointer ${selectedFrame === cute7Frame ? 'border-4 border-green-500' : 'border-transparent'}`}
              onClick={() => setSelectedFrame(cute7Frame)}
              onError={(e) => console.error('Error loading image:', e.target.src)}
            />

            <img
              src={vietnamFrame}
              alt="Frame"
              className={`w-40 h-full object-cover cursor-pointer ${selectedFrame === vietnamFrame ? 'border-4 border-green-500' : 'border-transparent'}`}
              onClick={() => setSelectedFrame(vietnamFrame)}
              onError={(e) => console.error('Error loading image:', e.target.src)}
            />
            {/* Bạn có thể thêm nhiều frame khác ở đây */}
          </div>
        </div>

        {selectedPhotos.length === 4 && selectedFrame && (
          <button
            onClick={mergePhotosWithFrame}
            className="mt-6 px-6 py-3 rounded-lg text-white bg-green-500 hover:bg-green-600"
          >
            Ghép ảnh
          </button>
        )}
      </div>

      {mergedImage && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Ảnh đã ghép:</h2>
            <img src={mergedImage} alt="Merged" className="mx-auto rounded-lg shadow-lg" />
            <a
              href={mergedImage}
              download="photo-merged.jpg"
              className="block mt-4 text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            >
              Tải về
            </a>
          </div>
        )}
        
    </div>
  );
};

export default WebcamCapture;
