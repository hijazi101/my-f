import React from 'react';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="flex justify-center items-center py-6 pt-20 pb-17">
      <h3 className="text-lg font-semibold mr-4">CONTACT US:</h3>
      <div className="flex space-x-4">
        <a href="https://www.instagram.com" className="hover:text-gray-400">
          <FaInstagram size={24} />
        </a>
        <a href="https://www.facebook.com" className="hover:text-gray-400">
          <FaFacebook size={24} />
        </a>
        <a href="https://www.whatsapp.com" className="hover:text-gray-400">
          <FaWhatsapp size={24} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
