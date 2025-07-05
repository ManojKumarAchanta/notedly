
# Notedly - A Modern Note-Taking App

**Notedly** is a full-stack note-taking application designed to help you capture and organize your thoughts, ideas, and inspirations. With a clean, modern interface and powerful features, Notedly makes it easy to create, edit, and manage your notes from anywhere.

## ✨ Features

*   **🔐 Secure User Authentication:** Register and log in securely with JWT-based authentication.
*   **📝 Rich Text Editor:** Create beautiful and well-structured notes with a powerful TinyMCE rich text editor.
*   **🖼️ Image Uploads:** Add images to your notes to make them more visual and engaging.
*   **🗂️ Category Management:** Organize your notes into categories for easy access and management.
*   **🚀 Full CRUD Functionality:** Create, read, update, and delete notes and categories with ease.
*   **📱 Responsive Design:** A fully responsive layout that works seamlessly on all devices.
*   **🔐 Protected Routes:** Secure access to your notes and personal information.

## 🚀 Live Demo
https://notedly-delta.vercel.app

## 🛠️ Tech Stack

**Client (Frontend):**

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast and modern build tool for web development.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **Redux Toolkit:** A state management library for React applications.
*   **TinyMCE:** A powerful and flexible rich text editor.
*   **React Router:** A standard library for routing in React.

**Server (Backend):**

*   **Node.js:** A JavaScript runtime for building server-side applications.
*   **Express.js:** A fast and minimalist web framework for Node.js.
*   **MongoDB:** A NoSQL database for storing application data.
*   **Mongoose:** An ODM library for MongoDB and Node.js.
*   **JWT (JSON Web Tokens):** A standard for creating access tokens.
*   **Cloudinary:** A cloud-based service for image and video management.

## ⚙️ Getting Started

### Prerequisites

*   Node.js and npm (or pnpm/yarn)
*   MongoDB
*   A Cloudinary account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/notedly.git
    cd notedly
    ```

2.  **Install server dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install client dependencies:**
    ```bash
    cd ../client
    npm install
    ```

4.  **Set up environment variables:**
    *   Create a `.env` file in the `server` directory.
    *   Add the following environment variables to the `.env` file:
        ```
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
        CLOUDINARY_API_KEY=your_cloudinary_api_key
        CLOUDINARY_API_SECRET=your_cloudinary_api_secret
        ```

### Running the Application

1.  **Start the server:**
    ```bash
    cd server
    npm start
    ```

2.  **Start the client:**
    ```bash
    cd ../client
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

## Screenshots

**Dashboard**
![image](https://github.com/user-attachments/assets/a7936c86-3d07-4b5e-8659-09bd19b3a07d)


**Notes Page**

![image](https://github.com/user-attachments/assets/be1e345e-36c4-4d5b-84a6-87a8794b4cb2)


**Create Note Page**

![image](https://github.com/user-attachments/assets/86837e6a-d3ab-4e34-9895-4bb78d2ae8bc)


## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.
