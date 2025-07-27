import express, { Request, Response } from "express";
import { ReclaimClient } from "@reclaimprotocol/zk-fetch";
import { transformForOnchain, verifyProof } from "@reclaimprotocol/js-sdk";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();


console.log("APP_ID:", process.env.APP_ID);
console.log("APP_SECRET:", process.env.APP_SECRET);
console.log("SETU_URL:", process.env.SETU_URL);


const reclaimClient = new ReclaimClient(
  process.env.APP_ID!,
  process.env.APP_SECRET!
);
const app = express();
app.use(cors());

app.get("/", (_: Request, res: Response) => {
  res.send("gm gm! api is running");
});

app.post("/startVerification", async (req: Request, res: Response) => {
  try {
    const url = `${process.env.SETU_URL}/digilocker`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-client-id": "292c6e76-dabf-49c4-8e48-90fba2916673",
        "x-client-secret": "7IZMe9zvoBBuBukLiCP7n4KLwSOy11oP",
        "x-product-instance-id": "a1104ec4-7be7-4c70-af78-f5fa72183c6a",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ redirectUrl: "https://setu.co" }),
    });
    console.log("response:", response);

    if (!response.ok) {
      return res.status(400).send("Failed to start verification");
    }

    const data = await response.json();
    const setuUrl = data.url;

    return res.status(200).json({
      message: "Verification initiated successfully",
      url: setuUrl,
    });
  } catch (error) {
    console.error("Error initiating verification:", error);
    return res.status(500).send("Failed to initiate verification");
  }
});

app.post("/generateProof", async (req: Request, res: Response) => {
  try {
    const setuRequestId = req.query.setuRequestId as string;

    const url = `${process.env.SETU_URL}/digilocker/${setuRequestId}/aadhaar`;
    const proof = await reclaimClient.zkFetch(url, {
      method: "GET",
      headers: {
        "x-client-id": "292c6e76-dabf-49c4-8e48-90fba2916673",
        "x-client-secret": "7IZMe9zvoBBuBukLiCP7n4KLwSOy11oP",
        "x-product-instance-id": "a1104ec4-7be7-4c70-af78-f5fa72183c6a",
      },
    });

    if (!proof) {
      return res.status(400).send("Failed to generate proof");
    }

    const isValid = await verifyProof(proof);
    if (!isValid) {
      return res.status(400).send("Proof is invalid");
    }
    const proofData = await transformForOnchain(proof);
    console.log(proofData);
    return res.status(200).json({ transformedProof: proofData, proof });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
