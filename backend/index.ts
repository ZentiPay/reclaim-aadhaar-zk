import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();


app.get('/', (_: Request, res: Response) => {
    res.send('gm gm! api is running');
});

app.get('/getUserId', async (_: Request, res: Response) => {
    try{
        const userId = '12345'; // Simulated user ID
        return res.status(200).json({ userId });
    }
    catch(e){
        console.log(e);
        return res.status(500).send(e);
    }
})



const PORT = 8081;

// Start server
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});