import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, firebaseReady } from "../firebase.js";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // user = Firestore 프로필 문서. Firebase Auth 계정과는 별개다.
  const [user, setUser] = useState(null);
  // 새로고침 직후 로그인 상태를 복원하는 동안 화면이 깜빡이지 않게 한다.
  const [loading, setLoading] = useState(firebaseReady);

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (account) => {
      if (!account) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        setUser(await api.getMyProfile());
      } catch {
        // 가입 도중(프로필 문서가 아직 없는 상태)일 수 있다.
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const signIn = useCallback(async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    const profile = await api.getMyProfile();
    setUser(profile);
    return profile;
  }, []);

  // 가입은 Auth 계정 생성 → 서버에 프로필 문서 생성 2단계다.
  const signUp = useCallback(async (email, password, createProfile) => {
    await createUserWithEmailAndPassword(auth, email, password);
    const profile = await createProfile();
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      logout,
      // 프로필 수정 결과를 화면에 반영할 때 쓴다.
      setProfile: setUser,
    }),
    [user, loading, signIn, signUp, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
