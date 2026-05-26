import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";

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
