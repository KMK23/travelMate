// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import {
  getAuth,
  signInWithRedirect,
  OAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getRedirectResult,
  signInWithPopup,
  GoogleAuthProvider,
} from "@firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  setDoc,
  getDoc,
} from "@firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsdcoqtfQvqRMO6V_ipzDPPXhlfHFBTLY",
  authDomain: "travelmate-b950c.firebaseapp.com",
  projectId: "travelmate-b950c",
  storageBucket: "travelmate-b950c.firebasestorage.app",
  messagingSenderId: "944824258669",
  appId: "1:944824258669:web:1c7ee59728fd39a4b62f64",
  measurementId: "G-TCJ6CKB4V9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { db };

// 네이버 로그인
export const signInWithNaver = async () => {
  try {
    console.log("네이버 로그인 시작");

    // 네이버 로그인 인스턴스 생성
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
      callbackUrl: `${window.location.origin}/auth/naver/callback`,
      isPopup: false,
    });

    // 네이버 로그인 초기화
    naverLogin.init();

    // 로그인 요청
    return new Promise((resolve, reject) => {
      naverLogin.getLoginStatus(async (status) => {
        if (status) {
          console.log("네이버 사용자 정보:", naverLogin.user);

          try {
            // 사용자 정보 구성
            const user = {
              displayName: naverLogin.user.name,
              email: naverLogin.user.email,
              photoURL: naverLogin.user.profile_image,
              provider: "naver",
            };

            console.log("저장할 네이버 사용자 정보:", user);

            // 사용자 문서 생성 (자동 ID 사용)
            const userCollectionRef = collection(db, "users");
            const userDocRef = await addDoc(userCollectionRef, {
              ...user,
              lastLoginAt: new Date().toISOString(),
            });

            const userData = {
              ...user,
              uid: userDocRef.id,
            };

            console.log("네이버 사용자 정보 저장 완료:", userData);

            // 로컬 스토리지에 인증 상태 저장
            localStorage.setItem(
              "authState",
              JSON.stringify({
                isAuthenticated: true,
                user: userData,
              })
            );

            resolve(userData);
          } catch (error) {
            console.error("네이버 사용자 정보 저장 실패:", error);
            reject(error);
          }
        } else {
          naverLogin.authorize();
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("네이버 로그인 에러:", error);
    throw error;
  }
};

// 로그아웃
export const signOutUser = async () => {
  try {
    await firebaseSignOut(auth);

    // 카카오 로그아웃
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("c24eaf7be166a89019002f13c5e19778");
    }
    if (window.Kakao?.Auth?.getAccessToken()) {
      window.Kakao.Auth.logout();
    }

    // 네이버 로그아웃
    if (window.naver && window.naver.LoginWithNaverId) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
        callbackUrl: `${window.location.origin}/auth/naver/callback`,
      });
      naverLogin.init();
      naverLogin.logout();
    }

    // 로컬 스토리지 정리
    localStorage.removeItem("authState");
  } catch (error) {
    console.error("로그아웃 에러:", error);
    throw error;
  }
};

// 인증 상태 변경 감지
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    console.log("Firebase 인증 상태 변경:", user ? "로그인됨" : "로그아웃됨");
    callback(user);
  });
};

// 데이터 추가
export const addDatas = async (collectionName, data, userId = null) => {
  try {
    let docRef;
    if (userId && collectionName === "favorites") {
      // users/{userId}/favorites 컬렉션에 추가
      docRef = await addDoc(collection(db, "users", userId, "favorites"), data);
    } else {
      docRef = await addDoc(collection(db, collectionName), data);
    }
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding data:", error);
    throw error;
  }
};

// 데이터 조회
export const getDatas = async (collectionName, userId = null) => {
  try {
    let querySnapshot;
    if (userId && collectionName === "favorites") {
      // users/{userId}/favorites 컬렉션에서 조회
      querySnapshot = await getDocs(
        collection(db, "users", userId, "favorites")
      );
    } else {
      querySnapshot = await getDocs(collection(db, collectionName));
    }
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting data:", error);
    throw error;
  }
};

// 데이터 삭제
export const deleteDatas = async (collectionName, docId, userId = null) => {
  try {
    if (userId && collectionName === "favorites") {
      // users/{userId}/favorites/{docId} 문서 삭제
      await deleteDoc(doc(db, "users", userId, "favorites", docId));
    } else {
      await deleteDoc(doc(db, collectionName, docId));
    }
    return docId;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

// 데이터 수정
export const updateDatas = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return { id: docId, ...data };
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

// 카카오 로그인
export const signInWithKakao = async () => {
  try {
    console.log("카카오 로그인 시작");

    // Kakao SDK 초기화 확인
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("c24eaf7be166a89019002f13c5e19778");
    }

    // 카카오 로그인 요청
    const data = await new Promise((resolve, reject) => {
      window.Kakao.Auth.login({
        success: (auth) => {
          console.log("카카오 로그인 성공", auth);
          resolve(auth);
        },
        fail: (err) => {
          console.log("카카오 로그인 실패", err);
          reject(err);
        },
      });
    });

    // 사용자 정보 요청
    const profile = await new Promise((resolve, reject) => {
      window.Kakao.API.request({
        url: "/v2/user/me",
        success: (response) => {
          console.log("카카오 사용자 정보 성공", response);
          resolve(response);
        },
        fail: (error) => {
          console.log("카카오 사용자 정보 실패", error);
          reject(error);
        },
      });
    });

    // 사용자 정보 구성
    const user = {
      displayName: profile.properties.nickname,
      photoURL: profile.properties.profile_image,
      email: null, // 카카오는 이메일을 null로 설정
      provider: "kakao",
    };

    console.log("저장할 카카오 사용자 정보:", user);

    // 사용자 문서 생성 (자동 ID 사용)
    const userCollectionRef = collection(db, "users");
    const userDocRef = await addDoc(userCollectionRef, {
      ...user,
      lastLoginAt: new Date().toISOString(),
    });

    const userData = {
      ...user,
      uid: userDocRef.id,
    };

    console.log("카카오 사용자 정보 저장 완료:", userData);

    // 로컬 스토리지에 인증 상태 저장
    localStorage.setItem(
      "authState",
      JSON.stringify({
        isAuthenticated: true,
        user: userData,
      })
    );

    return userData;
  } catch (error) {
    console.error("카카오 로그인 에러:", error);
    throw error;
  }
};

// 소셜 로그인 결과 처리
export const getAuthResult = async () => {
  try {
    console.log("인증 결과 확인 시작");

    // 현재 사용자 확인
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log("이미 로그인된 사용자 존재:", currentUser);
      return currentUser;
    }

    const result = await getRedirectResult(auth);
    console.log("리다이렉트 결과:", result);

    if (result) {
      const credential = OAuthProvider.credentialFromResult(result);
      console.log("인증 정보:", credential);
      console.log("사용자 정보:", result.user);
      return result.user;
    } else {
      console.log("리다이렉트 결과 없음");
      return null;
    }
  } catch (error) {
    console.error("인증 결과 처리 에러:", error);
    console.error("에러 상세:", {
      code: error.code,
      message: error.message,
      email: error.email,
      credential: error.credential,
    });
    throw error;
  }
};

// 구글 로그인
export const signInWithGoogle = async () => {
  try {
    console.log("구글 로그인 시작");
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");

    // 팝업으로 시도
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("구글 로그인 성공");
      return result.user;
    } catch (popupError) {
      console.log("구글 팝업 로그인 실패, 리다이렉트로 시도:", popupError);

      // 팝업이 차단되었거나 실패한 경우 리다이렉트로 시도
      await signInWithRedirect(auth, provider);
      return null;
    }
  } catch (error) {
    console.error("구글 로그인 에러:", error);
    throw error;
  }
};

// 사용자 정보 저장
export const saveUserToFirestore = async (user) => {
  try {
    if (!user || !user.uid) {
      throw new Error("유효하지 않은 사용자 정보입니다.");
    }

    console.log("Firestore에 저장할 사용자 정보:", user);

    // 문서 ID를 uid로 설정
    const userDocRef = doc(db, "users", user.uid);

    // 사용자 문서에 저장할 필드 데이터
    const userData = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      provider: user.provider || null,
      lastLoginAt: new Date().toISOString(),
    };

    // 사용자 문서 생성 또는 업데이트 (merge: true로 설정하여 기존 데이터 유지)
    await setDoc(userDocRef, userData, { merge: true });
    console.log("사용자 정보 저장 완료:", userData);

    // 저장된 문서 확인
    const savedDoc = await getDoc(userDocRef);
    if (!savedDoc.exists()) {
      throw new Error("사용자 문서 저장 실패");
    }

    return userData;
  } catch (error) {
    console.error("사용자 정보 저장 실패:", error);
    throw error;
  }
};

// 사용자 정보 업데이트
export const updateUserFavorites = async (uid, category, item) => {
  try {
    // 현재 사용자 정보 가져오기
    const userData = await getDatas("users", uid);
    if (!userData) throw new Error("사용자를 찾을 수 없습니다.");

    // favorites 배열에 새 항목 추가 (중복 체크)
    const favorites = userData.favorites[category] || [];
    const isDuplicate = favorites.some((fav) => fav.id === item.id);

    if (!isDuplicate) {
      favorites.push({
        ...item,
        savedAt: new Date().toISOString(),
      });

      // Firestore 업데이트
      await updateDatas("users", uid, {
        [`favorites.${category}`]: favorites,
      });

      // 로컬 스토리지 업데이트
      const localFavorites = JSON.parse(
        localStorage.getItem(`favorites_${uid}`) || "{}"
      );
      localFavorites[category] = favorites;
      localStorage.setItem(`favorites_${uid}`, JSON.stringify(localFavorites));

      console.log(`${category} 카테고리에 항목 추가 완료`);
    }

    return favorites;
  } catch (error) {
    console.error("즐겨찾기 업데이트 실패:", error);
    throw error;
  }
};

// 즐겨찾기 항목 삭제
export const removeFavoriteItem = async (uid, category, itemId) => {
  try {
    // 현재 사용자 정보 가져오기
    const userData = await getDatas("users", uid);
    if (!userData) throw new Error("사용자를 찾을 수 없습니다.");

    // 해당 항목 제거
    const favorites = userData.favorites[category].filter(
      (item) => item.id !== itemId
    );

    // Firestore 업데이트
    await updateDatas("users", uid, {
      [`favorites.${category}`]: favorites,
    });

    // 로컬 스토리지 업데이트
    const localFavorites = JSON.parse(
      localStorage.getItem(`favorites_${uid}`) || "{}"
    );
    localFavorites[category] = favorites;
    localStorage.setItem(`favorites_${uid}`, JSON.stringify(localFavorites));

    console.log(`${category} 카테고리에서 항목 삭제 완료`);
    return favorites;
  } catch (error) {
    console.error("즐겨찾기 삭제 실패:", error);
    throw error;
  }
};

// Firestore 즐겨찾기 관련 함수들
export const addFavoriteToFirestore = async (userId, favoriteData) => {
  try {
    console.log("즐겨찾기 추가 시도:", { userId, favoriteData });

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("사용자 문서가 존재하지 않음:", userId);

      // 사용자 정보를 로컬 스토리지에서 가져와서 문서 생성 시도
      const authState = JSON.parse(localStorage.getItem("authState"));
      if (authState?.user) {
        console.log("로컬 스토리지의 사용자 정보로 문서 생성 시도");
        await setDoc(userDocRef, {
          ...authState.user,
          lastLoginAt: new Date().toISOString(),
        });
      } else {
        throw new Error("사용자 문서가 존재하지 않습니다.");
      }
    }

    // 사용자 문서의 하위 컬렉션으로 favorites 추가
    const favoritesCollectionRef = collection(userDocRef, "favorites");
    const docRef = await addDoc(favoritesCollectionRef, {
      ...favoriteData,
      addedAt: new Date().toISOString(),
    });

    console.log("Firestore에 즐겨찾기 추가 완료:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Firestore 즐겨찾기 추가 중 오류:", error);
    throw error;
  }
};

export const removeFavoriteFromFirestore = async (userId, contentId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("사용자 문서가 존재하지 않습니다.");
    }

    const favoritesCollectionRef = collection(userDocRef, "favorites");
    const q = query(
      favoritesCollectionRef,
      where("contentId", "==", contentId)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(userDocRef, "favorites", document.id));
    });

    console.log("Firestore에서 즐겨찾기 삭제 완료");
  } catch (error) {
    console.error("Firestore 즐겨찾기 삭제 중 오류:", error);
    throw error;
  }
};

export const getFavoritesFromFirestore = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("사용자 문서가 존재하지 않습니다.");
    }

    const favoritesCollectionRef = collection(userDocRef, "favorites");
    const querySnapshot = await getDocs(favoritesCollectionRef);

    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push({ id: doc.id, ...doc.data() });
    });

    console.log("Firestore에서 즐겨찾기 목록 로드 완료:", favorites);
    return favorites;
  } catch (error) {
    console.error("Firestore 즐겨찾기 목록 로드 중 오류:", error);
    throw error;
  }
};
