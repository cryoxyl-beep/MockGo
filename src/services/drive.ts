import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";
import { PDFFile } from "../types";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
}

export const mapDriveFileToPdfFile = (file: DriveFile): PDFFile => {
  const bytes = file.size ? parseInt(file.size, 10) : 0;
  let sizeStr = "2.5 MB";
  if (!isNaN(bytes) && bytes > 0) {
    if (bytes < 1024) sizeStr = `${bytes} B`;
    else if (bytes < 1024 * 1024) sizeStr = `${(bytes / 1024).toFixed(1)} KB`;
    else sizeStr = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Deduce subject from file name
  let subject = "General Aptitude";
  const lowerName = file.name.toLowerCase();
  if (lowerName.includes("math") || lowerName.includes("calculus") || lowerName.includes("algebra") || lowerName.includes("geom")) {
    subject = "Math";
  } else if (lowerName.includes("chem") || lowerName.includes("organic") || lowerName.includes("stoich")) {
    subject = "Chemistry";
  } else if (lowerName.includes("phys") || lowerName.includes("mechanic") || lowerName.includes("quantum")) {
    subject = "Physics";
  } else if (lowerName.includes("bio") || lowerName.includes("cell") || lowerName.includes("genetics")) {
    subject = "Biology";
  } else if (lowerName.includes("history") || lowerName.includes("civic")) {
    subject = "History";
  }

  // Deduce topics
  let topics = ["Syllabus Mapping", "Academic Reference"];
  if (subject === "Math") {
    topics = ["Derivatives", "Limits", "Integration"];
  } else if (subject === "Chemistry") {
    topics = ["Reactions", "Atomic Models", "Stoichiometry"];
  } else if (subject === "Physics") {
    topics = ["Kinematics", "Newtonian Forces", "Electromagnetism"];
  } else if (subject === "Biology") {
    topics = ["Cell Biology", "Ecology", "Genetics"];
  }

  return {
    id: file.id,
    name: file.name,
    size: sizeStr,
    uploadDate: file.modifiedTime ? file.modifiedTime.split("T")[0] : new Date().toISOString().split("T")[0],
    status: 'ready',
    pageCount: Math.floor(Math.random() * 15) + 10,
    subject,
    topics
  };
};

export const connectGoogleDrive = async (): Promise<boolean> => {
  const provider = new GoogleAuthProvider();
  
  provider.addScope("https://www.googleapis.com/auth/drive.file");

  try {
    const result = await signInWithPopup(auth, provider);
    
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const driveToken = credential?.accessToken; 

    if (driveToken) {
      localStorage.setItem("drive_wristband", driveToken);
      if (result.user?.email) {
        localStorage.setItem("drive_email", result.user.email);
        localStorage.setItem("drive_name", result.user.displayName || "Google User");
      }
      alert("Google Drive linked successfully! You can now read and save PYQs.");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Google Drive connection failed:", error);
    alert("Connection blocked. Double-check that your email is added as a Test User!");
    return false;
  }
};

export const fetchGoogleDrivePdfs = async (): Promise<DriveFile[]> => {
  const token = localStorage.getItem("drive_wristband");
  if (!token) return [];

  try {
    const q = encodeURIComponent("mimeType = 'application/pdf'");
    const fields = encodeURIComponent("files(id, name, mimeType, size, modifiedTime)");
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&pageSize=100`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired
        localStorage.removeItem("drive_wristband");
        localStorage.removeItem("drive_email");
        localStorage.removeItem("drive_name");
      }
      throw new Error(`Google Drive API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (err) {
    console.error("Failed to fetch Google Drive files:", err);
    throw err;
  }
};
