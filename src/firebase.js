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
      naverLogin.getLoginStatus((status) => {
        if (status) {
          const user = {
            uid: `naver:${naverLogin.user.id}`,
            displayName: naverLogin.user.name,
            email: naverLogin.user.email,
            photoURL: naverLogin.user.profile_image,
            provider: "naver",
          };
          resolve(user);
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
export const addDatas = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding data:", error);
    throw error;
  }
};

// 데이터 조회
export const getDatas = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
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
export const deleteDatas = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
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

    // Kakao SDK 초기화 확인 (동일한 키 사용)
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("c24eaf7be166a89019002f13c5e19778"); // JavaScript 키 통일
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

    // Firebase Custom Token을 발급받아야 하지만, 현재는 임시로 사용자 객체 반환
    const user = {
      uid: `kakao:${profile.id}`,
      displayName: profile.properties.nickname,
      photoURL: profile.properties.profile_image,
      email: profile.kakao_account?.email,
      provider: "kakao",
    };

    return user;
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
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: user.provider,
      lastLoginAt: new Date().toISOString(),
      favorites: {
        attractions: [], // 관광지
        culture: [], // 문화시설
        festivals: [], // 축제/공연/행사
        courses: [], // 여행코스
        leisure: [], // 레포츠
        accommodation: [], // 숙박
        shopping: [], // 쇼핑
        restaurants: [], // 음식점
      },
    };

    await addDatas("users", user.uid, userData);
    console.log("사용자 정보 저장 완료");

    // 로컬 스토리지에도 favorites 정보 저장
    localStorage.setItem(
      `favorites_${user.uid}`,
      JSON.stringify(userData.favorites)
    );

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
