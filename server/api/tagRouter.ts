import { Router } from 'express';
import { Tag } from '../database/index';
import z from 'zod';
import { requireAdmin } from './authMiddleware';

const zodTag = z.object({
  tagName: z.string()
})

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
});

router.put('/:tagId', requireAdmin, async(req, res, next) => {
  try{
    const {tagId} = req.params;
    const parsedBody = zodTag.parse(req.body);

    if(!parsedBody) return res.status(404).json({message: 'Tag name is required'});
    
    const tagToUpdate = await Tag.findOneAndUpdate({_id: tagId}, parsedBody);

    res.status(200).json(tagToUpdate)
  }catch(err) {
    next(err);
  }
})

router.delete('/:tagId', requireAdmin, async(req, res, next) => {
  try{
    const {tagId} = req.params;
    const tagToDelete = await Tag.findByIdAndDelete({_id: tagId});

    if(!tagToDelete) return res.status(404).json({message: 'Tag you are trying to delete does not exist'});

    res.sendStatus(204);
  }catch(err) {
    next(err);
  }
})

export default router;
