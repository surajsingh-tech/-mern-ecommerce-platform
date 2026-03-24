import React from "react";
import { FaFacebook, FaInstagram ,FaTwitter ,FaPinterest  } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo / Brand */}
        <div>
          <img src="/images/logo.png" alt="" />
          <p className="mt-4 text-sm text-gray-400">
            Best deals, offers and shopping experience.
          </p>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">Returns</li>
            <li className="hover:text-white cursor-pointer">Shipping</li>
            <li className="hover:text-white cursor-pointer">FAQs</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <FaFacebook  className="hover:text-white cursor-pointer text-2xl" />
            <FaInstagram   className="hover:text-white cursor-pointer text-2xl"/>
            <FaTwitter   className="hover:text-white cursor-pointer text-2xl "/>
            <FaPinterest   className="hover:text-white cursor-pointer text-2xl "/>           
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Stay in the Loop
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Subscribe to get special offers, free giveaways, and more.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded-l-md bg-gray-800 text-sm outline-none"
            />
            <button className="bg-pink-500 px-4 py-2 rounded-r-md text-white text-sm hover:bg-pink-600">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © 2026 SHOPPING. All rights reserved.
      </div>
    </footer>
  );
}
