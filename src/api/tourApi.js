import axios from "axios";

const SERVICE_KEY =
  "VbAFxad7/XYabkBZSFAosb4Z2yLoBcEYqM5YXpIaYOF2Ve1FLQwuiSnhWx5yy8rxIIKaWDiAMQMhuOmUaXDBiA==";
const BASE_URL = "https://apis.data.go.kr/B551011/KorService1";

// XML을 파싱하는 함수
const parseXML = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const items = xmlDoc.getElementsByTagName("item");

  return Array.from(items).map((item) => {
    const getElementValue = (tagName) =>
      item.getElementsByTagName(tagName)[0]?.textContent || "";

    return {
      contentId: getElementValue("contentid"),
      contentTypeId: getElementValue("contenttypeid"),
      title: getElementValue("title"),
      addr1: getElementValue("addr1"),
      addr2: getElementValue("addr2"),
      firstimage: getElementValue("firstimage"),
      tel: getElementValue("tel"),
    };
  });
};

export const searchLocationBased = async ({
  numOfRows = 30,
  pageNo = 1,
  contentTypeId,
  areaCode,
}) => {
  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    numOfRows: String(numOfRows),
    pageNo: String(pageNo),
    MobileOS: "ETC",
    MobileApp: "TravelMate",
    _type: "xml",
    listYN: "Y",
    arrange: "A",
  });

  if (contentTypeId) {
    params.append("contentTypeId", contentTypeId);
  }

  if (areaCode) {
    params.append("areaCode", areaCode);
  }

  try {
    const response = await fetch(
      `${BASE_URL}/areaBasedList1?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("API 요청 실패");
    }

    const xmlText = await response.text();
    return parseXML(xmlText);
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};
