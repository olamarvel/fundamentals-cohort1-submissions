import { Router } from 'express';
import { fetchLegacyCustomers } from '../../services/legacyClient';
import { transformCustomers } from '../../services/transform';
import { getCached, setCached } from '../../services/cache';
import { CACHE_TTL } from '../../config';


const router = Router();


router.get('/', async (req, res, next) => {
try {
const cacheKey = 'customers:v2';
const cached = getCached<any[]>(cacheKey);
if (cached) return res.json({ data: cached, cached: true });


const legacy = await fetchLegacyCustomers();
const transformed = transformCustomers(Array.isArray(legacy) ? legacy : []);
setCached(cacheKey, transformed, Number(CACHE_TTL || 60));
res.json({ data: transformed, cached: false });
} catch (err) {
next(err);
}
});


export default router;