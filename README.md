# TravelWise - Full Execution Guide

This guide provides the necessary steps to run the TravelWise application locally using PowerShell.

## Prerequisites
- **Node.js**: Ensure you have Node.js installed.
- **Dependencies**: All dependencies have been installed, but if you encounter issues, run `npm install` in both `frontend` and `backend` directories.

## Simplified Run (Recommended)
The easiest way to run both the frontend and backend simultaneously is to use the `dev:all` script located in the frontend.

1.  **Open PowerShell**.
2.  **Navigate to the frontend directory**:
    ```powershell
    cd c:\Users\koush\OneDrive\Desktop\travelwise\frontend
    ```
3.  **Start the project**:
    ```powershell
    npm run dev:all
    ```
    - The **Frontend** will be available at: `http://localhost:5173`
    - The **Backend Gateway** will be running at: `http://localhost:5002`

---

## Manual Step-by-Step Run (Separate Terminals)

If you prefer to run the services in separate PowerShell windows for easier debugging:

### 1. Start the Backend
1.  Open a new PowerShell window.
2.  Go to the backend directory:
    ```powershell
    cd c:\Users\koush\OneDrive\Desktop\travelwise\backend
    ```
3.  (Optional) Reset the database if needed:
    ```powershell
    npx prisma db push
    ```
4.  Start the server:
    ```powershell
    npm run dev
    ```

### 2. Start the Frontend
1.  Open another PowerShell window.
2.  Go to the frontend directory:
    ```powershell
    cd c:\Users\koush\OneDrive\Desktop\travelwise\frontend
    ```
3.  Start the Next.js development server:
    ```powershell
    npm run dev
    ```

---

## Troubleshooting
- **Gateway: OFFLINE**: Ensure the backend is running on port `5002`.
- **Database Errors**: Ensure you have run `npx prisma db push` in the `backend` folder.
- **Missing Imports**: If `Link` is not found, ensure you are using the latest code where I fixed the imports.
