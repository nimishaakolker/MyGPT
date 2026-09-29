import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParse from 'cookie-parser';
import chatRoutes from './routes/chat.js';
import authRoutes from './routes/auth.js'
import helmet from 'helmet'
import errorHandler from './middleware/errorHandler.js';
import morgan from 'morgan'

const app = express();
app.use(morgan('dev'));
app.use(express.json());-
app.use(cookieParse());
app.use(helmet());
app.use('/api', chatRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);



app.use(cors({
  origin: process.env.CLIENT_URL, // e.g. 'http://localhost:5173' in dev, your real domain in prod
  credentials: true // allows cookies (your refreshToken cookie!) to be sent cross-origin
}))

app.listen(8080, () => {
    console.log('Server running on port 8080');
    connectDB();
});

const connectDB = async => {
    try{
        mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected with database!")
    }catch(e){
       console.log("Failed to connect with db",err.message)
    }
}

// app.post("/test-groq", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
//         },
//         body: JSON.stringify({
//             model:  "openai/gpt-oss-20b",
//             messages: [{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
//         const data = await response.json();
//         console.log(JSON.stringify(data, null, 2));   
//         res.send(data.choices[0].message.content);
//     } catch(err) {
//         console.log(err);
//         res.status(500).send("error");
//     }
// });

