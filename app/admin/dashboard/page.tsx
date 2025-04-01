"use client"

import { useState } from "react"

export default function AdminDashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#d9dbc9] p-6 flex flex-col">
      {/* Admin Dropdown - Top Right */}
      <div className="self-end mb-6">
        <div className="relative">
          <button
            className="px-4 py-2 border border-gray-400 rounded flex items-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Admin <span className="ml-2">▼</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto bg-[#f1ebe5] p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Title and Buttons Column */}
          <div className="md:w-1/2 flex flex-col items-center">
            {/* Admin Dashboard Title */}
            <h1 className="text-5xl md:text-6xl text-center mb-10" style={{ fontFamily: "Quattrocento, serif" }}>
              Admin Dashboard
            </h1>

            {/* Navigation Buttons */}
            <div className="w-full flex flex-col gap-4 max-w-md">
              <button
                className="w-full py-4 px-6 border-2 border-black bg-[#f9f6f0] hover:bg-gray-200 transition-colors font-bold"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Order Management
              </button>
              <button
                className="w-full py-4 px-6 border-2 border-black bg-[#f9f6f0] hover:bg-gray-200 transition-colors font-bold"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                User Management
              </button>
              <button
                className="w-full py-4 px-6 border-2 border-black bg-[#f9f6f0] hover:bg-gray-200 transition-colors font-bold"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Reports
              </button>
            </div>
          </div>

          {/* Recent Orders Column */}
          <div className="md:w-1/2">
            <h2 className="text-xl mb-4" style={{ fontFamily: "Quattrocento, serif" }}>
              Recent Orders
            </h2>
            <div className="bg-[#f9f6f0] p-4 rounded-md shadow-sm">
              <OrderItem quantity="10x" size="A4" color="Black" customer="Hannah Nicole Casing" price="₱30.00" />
              <OrderItem quantity="07x" size="A4" color="Black" customer="Hannah Nicole Casing" price="₱21.00" />
              <OrderItem quantity="03x" size="A4" color="Color" customer="Hannah Nicole Casing" price="₱75.00" />
              <OrderItem quantity="04x" size="A4" color="Color" customer="Hannah Nicole Casing" price="₱100.00" />
              <OrderItem quantity="02x" size="A4" color="Black" customer="Hannah Nicole Casing" price="₱06.00" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderItem({ quantity, size, color, customer, price }) {
  return (
    <div className="border border-gray-200 p-3 mb-3 flex justify-between items-start bg-[#f9f6f0]">
      <div className="flex items-start">
        <span className="font-bold mr-3" style={{ fontFamily: "Garamond, serif" }}>
          {quantity}
        </span>
        <div className="flex flex-col">
          <span style={{ fontFamily: "Quattrocento, serif" }}>
            Size: {size}: {color}
          </span>
          <span className="text-sm text-gray-600">{customer}</span>
        </div>
      </div>
      <span className="font-medium">{price}</span>
    </div>
  )
}

