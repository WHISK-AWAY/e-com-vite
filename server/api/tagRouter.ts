import { Router } from 'express';
import { Tag } from '../database/index';
import z from 'zod';
import { requireAdmin } from './authMiddleware';

const zodTag = z.object({
  tagName: z.string()
}).strict();

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const tags = await Tag.find({});
    res.status(200).json(tags);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAdmin,  async(req, res, next) => {
  try{
     const parsedBody = zodTag.parse(req.body);
     if(!parsedBody) return res.status(404).json({message: 'Tag name is required'});

     const tagToCreate = await Tag.create(parsedBody);

     res.status(201).json(tagToCreate);
  }catch(err) {
    next(err);
  }
})

export default router;
