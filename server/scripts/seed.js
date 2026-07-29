// 데모용 예시 데이터를 Firestore + Firebase Auth에 넣는 1회성 스크립트.
//   실행:  npm run seed --prefix server
//
// 여러 번 실행해도 안전하다(이미 있으면 건너뜀). 서버 기동 시 자동 실행되지 않으므로
// 실제 사용자 데이터가 쌓이기 시작한 뒤에도 함부로 중복 생성되지 않는다.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { adminAuth, db, firebaseReady, COLLECTIONS } from "../firebase.js";
import { createUser, findById } from "../data/users.js";
import { addListing, markSold } from "../data/marketListings.js";
import { getLatestQuote } from "../data/priceHistory.js";
import { follow } from "../data/follows.js";
import { addRating } from "../data/ratings.js";

const DEFAULT_PASSWORD = "abuba1234";

const AVATAR_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "avatars",
);

// scripts/avatars/<key>.jpg 를 base64로 읽어 프로필 사진으로 쓴다.
// 파일이 없으면 사진 없이(이니셜 표시) 넘어간다.
async function loadAvatar(key) {
  try {
    const bytes = await readFile(path.join(AVATAR_DIR, `${key}.jpg`));
    return `data:image/jpeg;base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

const FISHERS = [
  {
    key: "daeseong",
    email: "daeseong@abuba.kr",
    nickname: "김대성",
    shipType: "중형 어선",
    shipPurchaseDate: "2019-04-12",
    bio: "기장 앞바다에서 30년째 조업합니다. 새벽에 잡은 것만 올립니다.",
  },
  {
    key: "namhae",
    email: "namhae@abuba.kr",
    nickname: "박정호",
    shipType: "대형 어선",
    shipPurchaseDate: "2021-08-03",
    bio: "가족이 함께 운영하는 배입니다. 손질까지 깔끔하게 해서 보냅니다.",
  },
  {
    key: "badapum",
    email: "badapum@abuba.kr",
    nickname: "이상철",
    shipType: "소형 어선",
    shipPurchaseDate: "2020-11-20",
    bio: "소량만 정성껏. 그날 잡은 만큼만 판매합니다.",
  },
  {
    key: "hangsusan",
    email: "hangsusan@abuba.kr",
    nickname: "최영수",
    shipType: "중형 어선",
    shipPurchaseDate: "2018-02-15",
    bio: "영도 남항 기반. 문어·갑각류가 주력입니다.",
  },
  {
    key: "badaiyagi",
    email: "badaiyagi@abuba.kr",
    nickname: "정민석",
    shipType: "소형 어선",
    shipPurchaseDate: "2022-06-01",
    bio: "낙동강 하구에서 잡은 제철 수산물을 소개합니다.",
  },
  {
    key: "cheonseong",
    email: "cheonseong@abuba.kr",
    nickname: "강성호",
    shipType: "중형 어선",
    shipPurchaseDate: "2017-09-30",
    bio: "가덕도 천성 앞바다. 크고 좋은 놈만 골라 올립니다.",
  },
];

const CONSUMER = {
  email: "sonnim@abuba.kr",
  nickname: "윤지혜",
  bio: "",
};

const LISTINGS = [
  {
    fisher: "daeseong",
    speciesId: "mackerel",
    speciesName: "고등어",
    count: 20,
    kgPerFish: 0.45,
    regionId: "gijang",
  },
  {
    fisher: "namhae",
    speciesId: "hairtail",
    speciesName: "갈치",
    count: 12,
    kgPerFish: 0.6,
    regionId: "songjeong",
  },
  {
    fisher: "badapum",
    speciesId: "blackporgy",
    speciesName: "감성돔",
    count: 6,
    kgPerFish: 1.2,
    regionId: "suyeong",
  },
  {
    fisher: "daeseong",
    speciesId: "spanishmackerel",
    speciesName: "삼치",
    count: 8,
    kgPerFish: 1.5,
    regionId: "gijang",
  },
  {
    fisher: "hangsusan",
    speciesId: "octopus",
    speciesName: "참문어",
    count: 10,
    kgPerFish: 0.8,
    regionId: "yeongdo",
  },
  {
    fisher: "badaiyagi",
    speciesId: "bluecrab",
    speciesName: "꽃게",
    count: 25,
    kgPerFish: 0.25,
    regionId: "dadaepo",
  },
  {
    fisher: "namhae",
    speciesId: "mackerel",
    speciesName: "고등어",
    count: 30,
    kgPerFish: 0.4,
    regionId: "songjeong",
  },
  {
    fisher: "cheonseong",
    speciesId: "redseabream",
    speciesName: "참돔",
    count: 5,
    kgPerFish: 1.8,
    regionId: "gadeokdo",
  },
  {
    fisher: "badapum",
    speciesId: "gizzardshad",
    speciesName: "전어",
    count: 40,
    kgPerFish: 0.15,
    regionId: "suyeong",
  },
  {
    fisher: "badaiyagi",
    speciesId: "hairtail",
    speciesName: "갈치",
    count: 9,
    kgPerFish: 0.55,
    regionId: "dadaepo",
  },
];

// 지난 거래 + 별점(프로필이 비어 보이지 않게). listing 인덱스와 점수.
const RATED = [
  { index: 0, score: 5 },
  { index: 1, score: 4 },
  { index: 2, score: 5 },
  { index: 4, score: 4 },
];

const FOLLOWED = ["daeseong", "badapum"];

function daysAgoISO(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

// Auth 계정이 이미 있으면 그 uid를 재사용한다.
async function ensureAuthUser(email) {
  try {
    return (await adminAuth.getUserByEmail(email)).uid;
  } catch {
    const created = await adminAuth.createUser({
      email,
      password: DEFAULT_PASSWORD,
    });
    return created.uid;
  }
}

async function ensureProfile(uid, profile) {
  const existing = await findById(uid);
  if (existing) return existing;
  return createUser(uid, profile);
}

async function main() {
  if (!firebaseReady) {
    console.error(
      "server/.env 설정이 없습니다. server/.env.example을 참고해 채워주세요.",
    );
    process.exit(1);
  }

  const existing = await db.collection(COLLECTIONS.listings).limit(1).get();
  if (!existing.empty) {
    console.log("이미 판매글이 존재합니다. 시드를 건너뜁니다.");
    console.log("다시 넣으려면 Firestore에서 기존 컬렉션을 비우고 실행하세요.");
    return;
  }

  const uidByKey = {};
  for (const fisher of FISHERS) {
    const uid = await ensureAuthUser(fisher.email);
    await ensureProfile(uid, {
      email: fisher.email,
      accountType: "fisher",
      nickname: fisher.nickname,
      bio: fisher.bio,
      avatar: await loadAvatar(fisher.key),
      shipType: fisher.shipType,
      shipPurchaseDate: fisher.shipPurchaseDate,
      license: { hasLicense: true },
      maintenance: { hasMaintenance: false },
    });
    uidByKey[fisher.key] = uid;
    console.log(`어부 준비 완료: ${fisher.nickname}`);
  }

  const consumerUid = await ensureAuthUser(CONSUMER.email);
  await ensureProfile(consumerUid, {
    email: CONSUMER.email,
    accountType: "consumer",
    nickname: CONSUMER.nickname,
    bio: CONSUMER.bio,
    avatar: await loadAvatar("sonnim"),
  });
  console.log(`소비자 준비 완료: ${CONSUMER.nickname}`);

  const priceOf = (item, discount) => {
    const totalKg = Math.round(item.count * item.kgPerFish * 10) / 10;
    const unitPrice = getLatestQuote(item.speciesId).current;
    return {
      totalKg,
      price: Math.round((totalKg * unitPrice * discount) / 100) * 100,
    };
  };

  for (const [index, item] of LISTINGS.entries()) {
    const { totalKg, price } = priceOf(item, 0.9);
    await addListing({
      sellerId: uidByKey[item.fisher],
      sellerName: FISHERS.find((f) => f.key === item.fisher).nickname,
      speciesId: item.speciesId,
      speciesName: item.speciesName,
      count: item.count,
      kgPerFish: item.kgPerFish,
      totalKg,
      price,
      regionId: item.regionId,
      createdAt: daysAgoISO(index % 5),
    });
  }
  console.log(`판매글 ${LISTINGS.length}건 생성`);

  for (const { index, score } of RATED) {
    const item = LISTINGS[index];
    const { totalKg, price } = priceOf(item, 0.88);
    const sellerId = uidByKey[item.fisher];

    const past = await addListing({
      sellerId,
      sellerName: FISHERS.find((f) => f.key === item.fisher).nickname,
      speciesId: item.speciesId,
      speciesName: item.speciesName,
      count: item.count,
      kgPerFish: item.kgPerFish,
      totalKg,
      price,
      regionId: item.regionId,
      createdAt: daysAgoISO(20 + index),
    });

    await markSold(past.id, consumerUid);
    await addRating({
      listingId: past.id,
      fisherId: sellerId,
      consumerId: consumerUid,
      score,
    });
  }
  console.log(`지난 거래 + 별점 ${RATED.length}건 생성`);

  for (const key of FOLLOWED) {
    await follow(consumerUid, uidByKey[key]);
  }
  console.log(`팔로우 ${FOLLOWED.length}건 생성`);

  console.log("\n시드 완료. 데모 계정 비밀번호는 모두 " + DEFAULT_PASSWORD);
  console.log(`  어부:   ${FISHERS[0].email}`);
  console.log(`  소비자: ${CONSUMER.email}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
