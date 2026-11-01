# UrbanFix AI -- Road Defect Reporting and Management System

UrbanFix AI is a full-stack web application that helps citizens report
road-related issues and enables administrators to review complaints,
view their locations, and track maintenance progress.

**Live application:** https://urbanfix-ai.onrender.com\
**GitHub repository:** https://github.com/Vanukuri10/UrbanFix-AI

## Project Overview

Road defects such as potholes, damaged surfaces, and waterlogging can
affect road safety and daily travel. UrbanFix AI provides a centralized
platform where citizens can submit complaints with relevant details and
location information. Administrators can review submitted complaints and
update their status.

> **Current implementation note:** The application currently provides
> the full-stack complaint reporting and management workflow. AI-based
> road-defect detection is a planned future enhancement and is not
> currently implemented.

## Features

### Citizen

-   Register and log in to the application.
-   Submit a road-related complaint.
-   Select a complaint category: Pothole, Road Damage, Waterlogging, or
    Other.
-   Add a description and location.
-   Use device location or select a point manually on the map.
-   Upload an optional complaint image.
-   View recent complaints.

### Administrator

-   Access the protected admin area.
-   View submitted complaints.
-   Review complaint details and available location information.
-   View geolocated complaints on a map.
-   Update complaint status:
    -   Pending
    -   Verified
    -   In Progress
    -   Resolved

## Technology Stack

  Area                       Technologies
  -------------------------- --------------------------------
  Frontend                   React, HTML, CSS, JavaScript
  API communication          Axios
  Backend                    Node.js, Express.js
  Database                   MongoDB Atlas, Mongoose
  Authentication             JSON Web Token (JWT), bcryptjs
  Image upload and storage   Multer, Cloudinary
  Maps                       Leaflet, React-Leaflet
  Deployment                 Render
  Version control            Git, GitHub

## Application Architecture

Citizen / Administrator
          |
          v
   React Frontend
          |
       Axios
          |
          v
    Express Backend
       /       \
      v         v
MongoDB Atlas  Cloudinary
(users and     (uploaded
complaints)     images)


## Project Structure

UrbanFix-AI/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── README.md


*The structure above shows the main application areas; individual files
may vary as the project develops.*

## Run the Project Locally

### Prerequisites

-   Node.js and npm
-   A MongoDB Atlas database
-   A Cloudinary account for image uploads

### 1. Clone the repository


git clone https://github.com/Vanukuri10/UrbanFix-AI.git
cd UrbanFix-AI


### 2. Configure the backend


cd server
npm install


Create a `.env` file inside the `server` folder and add your own
configuration values:


PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret


Do not commit the `.env` file or publish database passwords, API
secrets, or JWT secrets.

Start the backend:
npm run dev

If the project does not have a development script, use the start script
defined in `server/package.json`.

### 3. Configure the frontend

Open a second terminal from the project root:

cd client
npm install
npm run dev

Open the local URL shown by Vite in the terminal.

## API Overview

The backend includes routes for the following operations:

  Method   Endpoint                             Purpose
  -------- ------------------------------------ --------------------------------------
  GET      `/api/health`                        Check backend health
  POST     `/api/auth/register`                 Register a citizen
  POST     `/api/auth/login`                    Log in
  POST     `/api/complaints`                    Submit a complaint
  GET      `/api/complaints`                    Retrieve complaints
  GET      `/api/admin/complaints`              Retrieve complaints for admin review
  PATCH    `/api/admin/complaints/:id/status`   Update complaint status

Protected administrator endpoints require a valid JWT and administrator
access.

## Security Notes

-   Passwords are hashed using bcryptjs before storage.
-   JWT is used to authenticate protected requests.
-   Administrator routes check the authenticated user's role.
-   Environment variables are used for private configuration.
-   Keep `.env` out of Git by adding it to `.gitignore`.

## Future Enhancements

-   AI-based detection of potholes and other road defects from uploaded
    images.
-   Automatic defect severity estimation.
-   Duplicate complaint detection based on location and image details.
-   Notifications when complaint status changes.
-   Analytics and reports to support maintenance planning.

## Deployment

The application is deployed on Render and uses MongoDB Atlas for
database storage and Cloudinary for uploaded images.

**Live URL:** https://urbanfix-ai.onrender.com

## Author

**Vanukuri Hasitha Sai Lakshmi**

------------------------------------------------------------------------

If you find an issue or have a suggestion, feel free to open an issue in
the repository.
