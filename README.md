# StoreIt – Cloud-Based Storage Management Platform


![StoreIt Dashboard](/client/public/assets/storeIt_img.png)

## Overview

**StoreIt** is a scalable, full-stack cloud storage platform inspired by industry leaders like Google Drive, Dropbox, and OneDrive. Designed for seamless file management, StoreIt empowers users to upload, view, share, rename, delete, and download files in a user-friendly dashboard interface. It incorporates advanced features such as global file search with debouncing for real-time suggestions and performance optimization.

---

## Features

- **File Upload & Management**
  - Upload files securely using Multer; files are stored in Cloudinary.
  - Perform actions: rename, view details, share, download, and delete.

- **Authentication & Security**
  - OTP-based email authentication using Nodemailer.
  - Secure sessions managed by JWT tokens stored in HTTP-only cookies.

- **Search Optimization**
  - Global file search with debouncing to reduce redundant queries and ensure fast, relevant results.

- **Beautiful UI/UX**
  - Built with React and TypeScript.
  - Enhanced with Shadcn UI and TailwindCSS for a clean, responsive, modern user interface.
  - File-type categorized sections for Documents, Images, Media, and Others.

---

## Tech Stack

### Frontend

- **React**
- **TypeScript**
- **TailwindCSS**
- **Shadcn UI**

### Backend

- **Node.js**
- **Express.js**
- **MongoDB** (for metadata storage)
- **Cloudinary** (for file storage)
- **Multer** (for file handling)
- **Nodemailer** (for email OTP)

---

## Key Functionalities

- User registration and secure login via email OTP.
- Upload, categorize, and manage files with real-time status and actions.
- Share files using shareable emails.
- Global file search with instant, debounced suggestions.
- Modern, responsive dashboard UI with storage usage visualization.
- File categorization: Documents, Images, Media, Others.

---

## Dashboard Preview

![StoreIt Dashboard](/client/public/assets/storeIt_img.png)

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB instance (local or cloud)
- Cloudinary account
- Email provider credentials for Nodemailer

---

## Author

- **Rehan Pathan** ([rehanpathan8012@gmail.com](mailto:rehanpathan8012@gmail.com))

---
