import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { PDFFile } from '../types';
import { useAuth } from './AuthContext';
import { connectGoogleDrive, fetchGoogleDrivePdfs, mapDriveFileToPdfFile } from '../services/drive';

export interface DriveContextType {
  googleDriveConnected: boolean;
  drivePdfs: PDFFile[];
  fetchingDrivePdfs: boolean;
  connectDrive: () => Promise<boolean>;
  disconnectDrive: () => void;
  refreshDrivePdfs: () => Promise<void>;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

export const DriveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const [googleDriveConnected, setGoogleDriveConnected] = useState<boolean>(() => {
    return !!localStorage.getItem("drive_wristband");
  });
  const [drivePdfs, setDrivePdfs] = useState<PDFFile[]>([]);
  const [fetchingDrivePdfs, setFetchingDrivePdfs] = useState<boolean>(false);

  const refreshDrivePdfs = useCallback(async () => {
    const token = localStorage.getItem("drive_wristband");
    if (!token) {
      setDrivePdfs([]);
      setGoogleDriveConnected(false);
      return;
    }

    setFetchingDrivePdfs(true);
    try {
      const files = await fetchGoogleDrivePdfs();
      const mapped = files.map(mapDriveFileToPdfFile);
      setDrivePdfs(mapped);
      setGoogleDriveConnected(true);
    } catch (err: any) {
      console.error("Failed to fetch Google Drive PDFs:", err);
      // Handle expired token states gracefully: if unauthorized, disconnect
      if (err.message?.includes("401") || !localStorage.getItem("drive_wristband")) {
        localStorage.removeItem("drive_wristband");
        localStorage.removeItem("drive_email");
        localStorage.removeItem("drive_name");
        setGoogleDriveConnected(false);
        setDrivePdfs([]);
      }
    } finally {
      setFetchingDrivePdfs(false);
    }
  }, []);

  // Check and restore session automatically when profile changes (e.g. login)
  useEffect(() => {
    const token = localStorage.getItem("drive_wristband");
    if (profile && token) {
      setGoogleDriveConnected(true);
      refreshDrivePdfs();
    } else {
      // Clear Drive state if user is logged out (profile is null)
      if (!profile) {
        setGoogleDriveConnected(false);
        setDrivePdfs([]);
      } else if (!token) {
        setGoogleDriveConnected(false);
        setDrivePdfs([]);
      }
    }
  }, [profile, refreshDrivePdfs]);

  const connectDrive = async (): Promise<boolean> => {
    try {
      const success = await connectGoogleDrive();
      if (success) {
        setGoogleDriveConnected(true);
        await refreshDrivePdfs();
        return true;
      }
      return false;
    } catch (err) {
      console.error("connectDrive failed:", err);
      return false;
    }
  };

  const disconnectDrive = () => {
    localStorage.removeItem("drive_wristband");
    localStorage.removeItem("drive_email");
    localStorage.removeItem("drive_name");
    setGoogleDriveConnected(false);
    setDrivePdfs([]);
  };

  return (
    <DriveContext.Provider
      value={{
        googleDriveConnected,
        drivePdfs,
        fetchingDrivePdfs,
        connectDrive,
        disconnectDrive,
        refreshDrivePdfs,
      }}
    >
      {children}
    </DriveContext.Provider>
  );
};

export const useDrive = () => {
  const context = useContext(DriveContext);
  if (!context) {
    throw new Error('useDrive must be used within a DriveProvider');
  }
  return context;
};
