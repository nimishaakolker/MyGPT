import express from 'express'
import Thread from '../models/Thread.js';
import getGroqAPIResponse from '../utils/groq.js';
import protect from '../middleware/auth.js';

const router = express.Router();


//test
router.post('/test',protect, async(req, res) => {
    try{
         const thread = new Thread({
            threadId :5,
            title : 'Test route',
         }) 

         const response = await thread.save();
         res.send(response)

    }catch(err){
          console.log('Failed to save to db',err.message);
          res.status(500).json({ error : 'Failed to save to db'});
    }
})



router.get('/thread',protect, async(req,res) => {
    try{
        const threads = await Thread.find({}).sort({updatedAt : -1});
        res.json(threads);
        
    }catch(err){
        console.log(err);

        // res.status(500).json({error : 'Failed to fetch threads'})
        next(err);
    }
})

router.get('/thread/:threadId', protect ,async(req,res) => {
    const {threadId} = req.params;
    try {
        const thread = await Thread.findOne({threadId});
        if(!thread){
            res.status(404).json({error : 'Chat not found'});
        }
        res.json(thread.messages);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error : 'Failed to fetch chat'});
    }
});

router.delete('/thread/:threadId', protect ,async(req, res) => {
    const {threadId} = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete(threadId);

        if(!deletedThread){
            res.status(400).json({error : 'Chat not found'});
        }

        res.status(200).json({success : 'Chat deleted successfully'});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error : 'Failed to delete thread'}); 
    }
})

router.post('/thread',protect, async(req,res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message){
        res.status(400).json({error : 'missing required fields'});
    }
    try {
        let thread = await Thread.findOne({threadId});
        if(!thread){
            const titleResponse = await getGroqAPIResponse(
    `Generate a short 3-5 word title for this conversation, no quotes, no punctuation: "${message}"`
  );
            thread = new Thread({
                threadId,
                title : titleResponse,
                messages : [{role : "user", content : message}]
            })
        }else{
            thread.messages.push({role : 'user', content : message
            })
        }


        const assistantReply = await getGroqAPIResponse(message);

        thread.messages.push({role : 'assistant', content : assistantReply});
        thread.updatedAt = new Date();
        await thread.save();
        res.json({reply : assistantReply});
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error : 'Something went wrong'})
       
    }
})

export default router;