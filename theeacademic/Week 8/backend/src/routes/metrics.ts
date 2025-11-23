import { Router, Request, Response } from 'express'
import { register } from '../utils/metrics.js'

const router = Router()

router.get('/metrics', async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType)
  const metrics = await register.metrics()
  res.send(metrics)
})

export default router
