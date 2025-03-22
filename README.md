# DLSU Student Co-Operative (SCoOp) Advanced Order System

A web-based application designed to streamline order processing for the DLSU Student Co-Operative (SCoOp). This system will help manage orders efficiently, reduce manual workload, and provide real-time tracking for both customers and administrators.

## Table of Contents

- [Overview](#overview)
- [Background](#background)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Project Timeline](#project-timeline)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Overview

The SCoOp Advanced Order System is developed to replace the current manual process (using tools like Google Forms and spreadsheets) with a centralized, automated solution. This platform will allow students, organizations, and offices to place orders for services (e.g., printing and tarpaulin production) while providing SCoOp with real-time order tracking and reporting capabilities.

## Background

The current order system at SCoOp suffers from:

- **Inefficient Communication:** Manual forwarding of bulk orders leading to delays.
- **Lack of Real-Time Tracking:** No centralized system to monitor order status or payment confirmations.
- **Operational Bottlenecks:** Challenges in managing high volumes of orders, leading to supply shortages and missed deadlines.

By integrating this advanced order system, SCoOp aims to improve overall operational efficiency, reduce errors, and enhance customer satisfaction.

## Features

### For Users/Orders

- **User Registration & Login:**

  - Create an account using email, contact number, and name.
  - Secure login functionality.

- **Order Placement:**

  - Fill out an order form specifying service type, quantity, due dates, remarks, and contact details.

- **Product Customization:**

  - Customize options for size, paper type, color, print quality, finishes, GSM, and add-ons.

- **File Upload:**

  - Upload documents or images required for order processing.

- **Order Confirmation:**

  - Receive an order summary with confirmation details and deadlines.

### For Admin

- **Dashboard & Order Management:**

  - View all orders with real-time statuses (Received, Processing, Completed).
  - Edit or update order details as needed.

- **Customer/User Management:**

  - Access order history, contact information, and transaction records for each user.

- **Reporting:**

  - Generate reports on order volume and revenue to monitor performance.

## System Architecture

The system is organized into two main interfaces:

1. **User Interface:**
   - Home, Login, Signup, Order Form, Product Customization, File Upload, and Order Confirmation pages.
2. **Admin Interface:**
   - Dashboard, Order Management, User Management, and Reports pages.

This separation ensures that both users and administrators have access to the tools they need to manage orders effectively.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/advanced-order-system.git
   cd advanced-order-system
   ```
2. **Install Dependencies:**\
   Ensure you have Node.js and npm installed. Then run:
   ```bash
   npm install
   ```
3. **Run the Application:**
   ```bash
   npm start
   ```
4. **Access the Application:**\
   Open your browser and navigate to `http://localhost:3000`.

*Note: Further instructions for environment configuration may be added as the project evolves.*

## Usage

- **For Users:**

  - Sign up or log in to your account.
  - Use the order form to place a new order, customize your product, and upload any required files.
  - Confirm your order details and track progress through your account.

- **For Administrators:**

  - Log in to the admin dashboard.
  - Monitor, manage, and update incoming orders.
  - Generate reports to review overall sales and order performance.

## Project Timeline

Development of the system is scheduled from Week 8 to Week 13 of the current term. This period includes design, development, testing, and deployment phases.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- **Department in Information Technology, College of Computer Studies, De La Salle University.**
- **Project Faculty:** Joel Andrew B. Cruz Jr, MSIT.
- **Team Members:** Ashley Hannah Cosing, Denise Gabrielle Francisco, Kean Angelo Genota, Ronaldo Miguel Manlapig.
