import React from "react";

export default function Navbar() {
  return (
    <>
      <nav className="sticky top-0 h-screen flex-shrink-0 w-1/12 bg-white p-4">
        <ul className="space-y-4">
          <li>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              Map Layers
            </a>
          </li>
          <li>
            <a href="#" className="block text-gray-700 hover:text-gray-900">
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};
