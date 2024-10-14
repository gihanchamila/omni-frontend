import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules'; // Updated module imports
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const AutoSwippableFacts = () => {
  const facts = [
    "Two-Factor Authentication (2FA) significantly enhances security by requiring not only your password but also a second factor for verification.",
    "2FA reduces the risk of unauthorized access, even if your password is compromised.",
    "With 2FA, you can control your account's security, enabling or disabling it as needed.",
    "Auto-swipe features streamline the authentication process, making logins easier and faster.",
    "Always ensure that features like auto-swipe are securely implemented to maintain your account's safety."
  ];

  return (
    <div className="flex flex-col space-y-6 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">Facts About Two-Factor Authentication (2FA)</h3>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="swiper-container"
      >
        {facts.map((fact, index) => (
          <SwiperSlide key={index}>
            <div className="p-4 text-center bg-gray-50 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-700">{fact}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AutoSwippableFacts;
