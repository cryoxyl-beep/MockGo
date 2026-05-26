import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User as FirebaseUser 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  profilePhoto: string;
  createdAt: any;
}

export const loginWithGoogle = async (): Promise<FirebaseUser> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const upsertUserProfile = async (user: FirebaseUser): Promise<UserProfile> => {
  const userDocRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userDocRef);

  const profileData: UserProfile = {
    uid: user.uid,
    name: user.displayName || "Academic Learner",
    email: user.email || "",
    profilePhoto: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    createdAt: docSnap.exists() ? docSnap.data().createdAt : serverTimestamp()
  };

  await setDoc(userDocRef, profileData, { merge: true });
  return profileData;
};
