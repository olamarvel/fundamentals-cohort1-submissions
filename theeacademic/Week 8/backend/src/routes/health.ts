import { Router, Request, Response } from 'express'

const router = Router()

const startTime = Date.now()
const version = process.env.APP_VERSION || '0.1.0'

router.get('/health', (req: Request, res: Response) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000)

  res.status(200).json({
    status: 'ok',
    version,
    uptime,
    timestamp: new Date().toISOString()
  })
})

export default router
