import express, { Request, Response } from 'express';
import { ReclaimClient } from '@reclaimprotocol/zk-fetch';
import { transformForOnchain, verifyProof } from '@reclaimprotocol/js-sdk';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the ReclaimClient with the app id and app secret (you can get these from the Reclaim dashboard - https://dev.reclaimprotocol.org/) 
const reclaimClient = new ReclaimClient(process.env.APP_ID!, process.env.APP_SECRET!);
const app = express();


app.get('/', (_: Request, res: Response) => {
    res.send('gm gm! api is running');
});

app.get('/generateProof', async (_: Request, res: Response) => {
    try{
        const url = `${process.env.PROVIDER_URL}/getUserId`;
        const proof = await reclaimClient.zkFetch(url, {
          method: 'GET',
        });
      
        if(!proof) {
          return res.status(400).send('Failed to generate proof');
        }

        const isValid = await verifyProof(proof);
        if(!isValid) {
          return res.status(400).send('Proof is invalid');
        }
         const proofData = await transformForOnchain(proof);
         console.log(proofData);
        return res.status(200).json({ transformedProof: proofData, proof });
    }
    catch(e){
        console.log(e);
        return res.status(500).send(e);
    }
})



const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});