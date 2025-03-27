import axios from "axios";

const API_KEY =
  "VbAFxad7/XYabkBZSFAosb4Z2yLoBcEYqM5YXpIaYOF2Ve1FLQwuiSnhWx5yy8rxIIKaWDiAMQMhuOmUaXDBiA==";
const BASE_URL = "https://apis.data.go.kr/B551011/KorService1";

// 캐시 설정
const CACHE_DURATION = 5 * 60 * 1000; // 5분
const cache = new Map();

// XML을 파싱하는 함수
const parseXML = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // 에러 메시지 확인
  const errMsg = xmlDoc.querySelector("errMsg")?.textContent;
  const returnReasonCode =
    xmlDoc.querySelector("returnReasonCode")?.textContent;

  if (errMsg && errMsg !== "OK") {
    const errorMessage = `${errMsg} (코드: ${returnReasonCode})`;
    console.error("API 에러:", errorMessage);
    throw new Error(errorMessage);
  }

  // items 배열 추출
  const items = xmlDoc.querySelectorAll("item");
  return Array.from(items).map((item) => ({
    contentId: item.querySelector("contentid")?.textContent,
    title: item.querySelector("title")?.textContent,
    addr1: item.querySelector("addr1")?.textContent,
    firstimage: item.querySelector("firstimage")?.textContent,
    tel: item.querySelector("tel")?.textContent,
  }));
};

const makeApiCall = async (endpoint, params) => {
  try {
    console.log("API 요청 파라미터:", params);

    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      params: {
        serviceKey: API_KEY,
        numOfRows: "50",
        pageNo: "1",
        MobileOS: "ETC",
        MobileApp: "travelMate",
        _type: "xml",
        listYN: "Y",
        arrange: "A",
        ...params,
      },
    });

    console.log("API 응답:", response.data);

    // XML 응답 처리
    if (response.data && typeof response.data === "string") {
      return parseXML(response.data);
    }

    // JSON 응답 처리
    if (response.data?.response?.body?.items?.item) {
      const items = response.data.response.body.items.item;
      return Array.isArray(items) ? items : [items];
    }

    throw new Error("API 응답 구조가 올바르지 않습니다.");
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    if (error.response) {
      console.error("에러 응답 데이터:", error.response.data);
    }
    throw error;
  }
};

// 위치 기반 관광지 검색
export const searchLocationBased = async (params) => {
  return makeApiCall("locationBasedList1", params);
};
