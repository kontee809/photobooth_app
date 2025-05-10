import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Import tất cả frame
import frameImg from '../assets/1.png'; // mặc định
import frameImg2 from '../assets/2.png';
import frameImg3 from '../assets/3.png';
import frameImg4 from '../assets/4.png';
import frameImg5 from '../assets/5.png';
import frameImg6 from '../assets/6.png';
import frameImg7 from '../assets/7.png';

const FrameAI = () => {
  const { state } = useLocation();
  const photos = state?.photos || [];

  const canvasRef = useRef(null);
  const [compositedImage, setCompositedImage] = useState(null);

  // Danh sách frame
  const frames = [frameImg, frameImg2, frameImg3, frameImg4, frameImg5, frameImg6, frameImg7];

  // Frame được chọn (mặc định là frame 1)
  const [selectedFrame, setSelectedFrame] = useState(frameImg);

  const navigate = useNavigate();

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'photo_with_frame.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const goHome = () => {
    
    navigate('/')
  }

  const compositeImages = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const frame = new Image();
    frame.src = selectedFrame;
    await new Promise((resolve) => (frame.onload = resolve));

    canvas.width = 300;
    canvas.height = 620;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

    const positions = [
      { x: 15, y: 15, w: 270, h: 170 },
      { x: 15, y: 200, w: 270, h: 170 },
      { x: 15, y: 385, w: 270, h: 170 },
    ];

    for (let i = 0; i < 3; i++) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = photos[i];
      await new Promise((res) => (img.onload = res));
      const pos = positions[i];
      ctx.drawImage(img, pos.x, pos.y, pos.w, pos.h);
    }

    setCompositedImage(canvas.toDataURL());
  };

  useEffect(() => {
    if (photos.length === 3) {
      compositeImages();
    }
  }, [photos, selectedFrame]);

  if (photos.length !== 3) {
    return  <div>
        <p className="text-red-500 text-center mt-4">Bạn chưa có ảnh!</p>
        <div className='flex justify-center'>    
            <button
                onClick={goHome}
                className="px-6 py-2 bg-[#de767e] text-white hover:bg-[#c63e81] rounded items-center"
            >
                Quay lại trang chủ
            </button>
        </div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br p-4">
      <h2 className="text-2xl font-semibold mb-6">Choose Your Frame</h2>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* LEFT: FRAME PREVIEW */}
        <div className="shadow-lg rounded">
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {compositedImage && (
            <img
              src={compositedImage}
              alt="Composited Frame"
              width={300}
              height={700}
            />
          )}
        </div>

        {/* RIGHT: OPTIONS */}
        <div className="text-center space-y-6">
          <div>
            <h3 className="font-semibold">Background Texture</h3>
            <div className="flex justify-center gap-3 mt-2 flex-wrap max-w-[220px]">
              {frames.map((frame, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-full border-2 cursor-pointer overflow-hidden ${
                    selectedFrame === frame ? 'border-black' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedFrame(frame)}
                >
                  <img
                    src={frame}
                    alt={`Frame ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-[#de767e] text-white hover:bg-[#c63e81] rounded"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrameAI;
