import { Router } from 'express';
import {
  addListing,
  deleteListing,
  getById,
  listAll,
  listByBuyer,
  listBySeller,
  listOnSaleBySpecies,
  markSold,
} from '../data/marketListings.js';
import { findById } from '../data/users.js';
import { getLatestQuote, getSeries } from '../data/priceHistory.js';
import { addRating, getByListing, summary } from '../data/ratings.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

// 고정 더미. 실제 판매량 집계 대신 "있어 보이는" 랭킹만 노출한다.
const POPULAR = [
  { speciesId: 'mackerel', speciesName: '고등어', soldCount: 128 },
  { speciesId: 'hairtail', speciesName: '갈치', soldCount: 96 },
  { speciesId: 'bluecrab', speciesName: '꽃게', soldCount: 74 },
  { speciesId: 'blackporgy', speciesName: '감성돔', soldCount: 51 },
  { speciesId: 'octopus', speciesName: '참문어', soldCount: 43 },
];

const IN_SEASON = [
  { speciesId: 'gizzardshad', speciesName: '전어', note: '가을 제철, 지금이 가장 고소해요' },
  { speciesId: 'mackerel', speciesName: '고등어', note: '기름이 오르는 시기' },
  { speciesId: 'blackporgy', speciesName: '감성돔', note: '살이 단단하게 차오를 때' },
];

// 판매자 별점을 한 번씩만 조회하도록 묶어둔다.
async function withSellerRatings(listings) {
  const sellerIds = [...new Set(listings.map((l) => l.sellerId))];
  const entries = await Promise.all(
    sellerIds.map(async (id) => [id, await summary(id)]),
  );
  const bySeller = new Map(entries);

  return listings.map((l) => ({
    ...l,
    quote: getLatestQuote(l.speciesId),
    sellerRating: bySeller.get(l.sellerId) ?? { avg: null, count: 0 },
  }));
}

router.get('/meta/rankings', (_req, res) => {
  res.json({
    popular: POPULAR.map((item) => ({ ...item, quote: getLatestQuote(item.speciesId) })),
    inSeason: IN_SEASON.map((item) => ({ ...item, quote: getLatestQuote(item.speciesId) })),
  });
});

router.get(
  '/quotes/:speciesId',
  asyncHandler(async (req, res) => {
    const { speciesId } = req.params;
    const period = req.query.period ?? '3m';

    const onSale = await listOnSaleBySpecies(speciesId);
    const sellers = onSale.map((l) => ({
      id: l.id,
      sellerName: l.sellerName,
      totalKg: l.totalKg,
      price: l.price,
      unitPrice: l.totalKg > 0 ? Math.round(l.price / l.totalKg) : 0,
    }));

    const avgUnitPrice = sellers.length
      ? Math.round(sellers.reduce((sum, s) => sum + s.unitPrice, 0) / sellers.length)
      : null;

    res.json({
      speciesId,
      period,
      series: getSeries(speciesId, period),
      quote: getLatestQuote(speciesId),
      sellers,
      avgUnitPrice,
    });
  }),
);

// '/:id'보다 위에 있어야 param 라우트에 먹히지 않는다.
router.get(
  '/purchases',
  requireAuth,
  asyncHandler(async (req, res) => {
    const listings = await listByBuyer(req.uid);
    const items = await Promise.all(
      listings.map(async (l) => ({
        ...l,
        quote: getLatestQuote(l.speciesId),
        myRating: (await getByListing(l.id))?.score ?? null,
      })),
    );
    items.sort((a, b) => (a.purchasedAt < b.purchasedAt ? 1 : -1));
    res.json(items);
  }),
);

router.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await listBySeller(req.uid));
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await withSellerRatings(await listAll(req.query.speciesId)));
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const listing = await getById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    // 판매자 프로필로 넘어갈 수 있게 아바타까지 함께 내려준다.
    const seller = await findById(listing.sellerId);
    res.json({
      ...listing,
      quote: getLatestQuote(listing.speciesId),
      sellerRating: await summary(listing.sellerId),
      sellerAvatar: seller?.avatar ?? null,
      sellerShipType: seller?.shipType ?? null,
    });
  }),
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { speciesId, speciesName, count, kgPerFish, price, regionId } = req.body;

    if (!speciesId || !speciesName || !count || !kgPerFish || !price || !regionId) {
      return res
        .status(400)
        .json({ message: '어종, 마리 수, 마리당 중량, 가격, 해역을 모두 입력해주세요.' });
    }

    const seller = await findById(req.uid);
    if (!seller || seller.accountType !== 'fisher') {
      return res.status(403).json({ message: '어부 계정만 판매글을 올릴 수 있습니다.' });
    }

    const numericCount = Number(count);
    const numericKgPerFish = Number(kgPerFish);

    const listing = await addListing({
      sellerId: req.uid,
      sellerName: seller.nickname || seller.email?.split('@')[0] || '어부바 판매자',
      speciesId,
      speciesName,
      count: numericCount,
      kgPerFish: numericKgPerFish,
      totalKg: Math.round(numericCount * numericKgPerFish * 10) / 10,
      price: Number(price),
      regionId,
      createdAt: new Date().toISOString().slice(0, 10),
    });

    res.status(201).json(listing);
  }),
);

router.post(
  '/:id/purchase',
  requireAuth,
  asyncHandler(async (req, res) => {
    const listing = await getById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    if (listing.sellerId === req.uid) {
      return res.status(403).json({ message: '자신의 상품은 구매할 수 없습니다.' });
    }

    const sold = await markSold(req.params.id, req.uid);
    if (!sold) {
      return res.status(409).json({ message: '이미 판매된 상품입니다.' });
    }

    res.status(201).json({ orderNo: sold.orderNo, listing: sold });
  }),
);

// 별점은 "내가 구매한 그 거래"에만 남길 수 있고, 거래당 한 번뿐이다.
router.post(
  '/:id/rating',
  requireAuth,
  asyncHandler(async (req, res) => {
    const score = Number(req.body.score);

    if (!Number.isInteger(score) || score < 1 || score > 5) {
      return res.status(400).json({ message: '별점은 1~5 사이여야 합니다.' });
    }

    const listing = await getById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    if (listing.status !== 'sold' || listing.buyerId !== req.uid) {
      return res
        .status(403)
        .json({ message: '구매하신 상품에만 별점을 남길 수 있습니다.' });
    }
    if (await getByListing(req.params.id)) {
      return res.status(409).json({ message: '이미 별점을 남긴 거래입니다.' });
    }

    const rating = await addRating({
      listingId: req.params.id,
      fisherId: listing.sellerId,
      consumerId: req.uid,
      score,
    });

    res.status(201).json({ rating, fisherRating: await summary(listing.sellerId) });
  }),
);

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const deleted = await deleteListing(req.params.id, req.uid);
    if (!deleted) {
      return res.status(404).json({ message: '판매글을 찾을 수 없습니다.' });
    }
    res.status(204).end();
  }),
);

export default router;
