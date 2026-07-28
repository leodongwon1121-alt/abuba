import { Router } from 'express';
import { findById, listByAccountType } from '../data/users.js';
import { listBySeller } from '../data/marketListings.js';
import {
  countFollowers,
  follow,
  isFollowing,
  listFollowing,
  unfollow,
} from '../data/follows.js';
import { summary } from '../data/ratings.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

export function fisherDisplayName(user) {
  return user.nickname || user.email?.split('@')[0] || '어부바 판매자';
}

// 그 어부가 올린 판매글에서 최빈 어종을 뽑는다. 없으면 null.
async function topSpecies(fisherId) {
  const counts = new Map();
  (await listBySeller(fisherId)).forEach((l) => {
    counts.set(l.speciesName, (counts.get(l.speciesName) ?? 0) + 1);
  });

  let best = null;
  let bestCount = 0;
  counts.forEach((count, name) => {
    if (count > bestCount) {
      best = name;
      bestCount = count;
    }
  });
  return best;
}

async function toFisherProfile(user, viewerId) {
  const [top, rating, followerCount, following] = await Promise.all([
    topSpecies(user.id),
    summary(user.id),
    countFollowers(user.id),
    viewerId ? isFollowing(viewerId, user.id) : Promise.resolve(false),
  ]);

  return {
    id: user.id,
    name: fisherDisplayName(user),
    avatar: user.avatar ?? null,
    bio: user.bio ?? '',
    shipType: user.shipType ?? null,
    topSpecies: top,
    rating,
    followerCount,
    isFollowing: following,
  };
}

// '/following'은 '/:id'보다 먼저 선언해야 param 라우트에 먹히지 않는다.
router.get(
  '/following',
  requireAuth,
  asyncHandler(async (req, res) => {
    const ids = await listFollowing(req.uid);
    const users = (await Promise.all(ids.map((id) => findById(id)))).filter(Boolean);
    res.json(await Promise.all(users.map((u) => toFisherProfile(u, req.uid))));
  }),
);

router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const q = (req.query.q ?? '').trim();

    let fishers = await listByAccountType('fisher');
    if (q) {
      fishers = fishers.filter((u) => fisherDisplayName(u).includes(q));
    }

    res.json(await Promise.all(fishers.map((u) => toFisherProfile(u, req.uid))));
  }),
);

router.get(
  '/:id',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const user = await findById(req.params.id);
    if (!user || user.accountType !== 'fisher') {
      return res.status(404).json({ message: '어부를 찾을 수 없습니다.' });
    }
    res.json(await toFisherProfile(user, req.uid));
  }),
);

router.post(
  '/:id/follow',
  requireAuth,
  asyncHandler(async (req, res) => {
    const fisher = await findById(req.params.id);
    if (!fisher || fisher.accountType !== 'fisher') {
      return res.status(404).json({ message: '어부를 찾을 수 없습니다.' });
    }
    if (fisher.id === req.uid) {
      return res.status(400).json({ message: '자기 자신은 팔로우할 수 없습니다.' });
    }

    await follow(req.uid, fisher.id);
    res.status(201).json(await toFisherProfile(fisher, req.uid));
  }),
);

router.delete(
  '/:id/follow',
  requireAuth,
  asyncHandler(async (req, res) => {
    const fisher = await findById(req.params.id);
    if (!fisher || fisher.accountType !== 'fisher') {
      return res.status(404).json({ message: '어부를 찾을 수 없습니다.' });
    }

    await unfollow(req.uid, fisher.id);
    res.json(await toFisherProfile(fisher, req.uid));
  }),
);

export default router;
