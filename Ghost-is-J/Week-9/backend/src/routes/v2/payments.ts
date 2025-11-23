import { Router } from 'express';
import { fetchLegacyPayments } from '../../services/legacyClient';
import { transformPayments } from '../../services/transform';
import { getCached, setCached } from '../../services/cache';
import { CACHE_TTL } from '../../config';


const router = Router();


// GET /v2/payments
router.get('/', async (req, res, next) => {
try {
const cacheKey = 'payments:v2';
const cached = getCached<any[]>(cacheKey);
if (cached) return res.json({ data: cached, cached: true });


const legacy = await fetchLegacyPayments();
const transformed = transformPayments(Array.isArray(legacy) ? legacy : []);
setCached(cacheKey, transformed, Number(CACHE_TTL || 60));
res.json({ data: transformed, cached: false });
} catch (err) {
next(err);
}
});


export default router;