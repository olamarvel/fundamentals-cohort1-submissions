import { Router } from "express";
import { createPost, getPosts } from "../controller/posts.controller";

const router = Router()

router.get('/', getPosts);
router.post('/', createPost);

export default router