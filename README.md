# Reclaim Aadhaar ZK

This project demonstrates how to use Reclaim Protocol's zk-fetch to generate zero-knowledge proofs for Aadhaar verification through Setu's DigiLocker API. It provides a secure way to verify Aadhaar data without exposing sensitive information.

The service integrates with Setu's DigiLocker API to initiate Aadhaar verification and then generates cryptographic proofs using Reclaim Protocol's zk-fetch, which can be used for on-chain verification.

## Features

- Initiate Aadhaar verification through Setu's DigiLocker API
- Generate zk-fetch proofs for Aadhaar verification responses
- Verify proof validity using Reclaim Protocol
- Transform proofs for on-chain use
- Secure handling of Aadhaar verification without exposing sensitive data

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/naman-gupta99/reclaim-aadhaar-zk
    ```

2. Navigate into the project directory:

    ```bash
    cd reclaim-aadhaar-zk
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Install the dotenv package for environment variables:

    ```bash
    npm install dotenv
    ```

5. Download the zk-circuits:

    ```bash
    npm run download:zk-circuits
    ```

6. Set up environment variables in `.env`: 

    ```bash
    APP_ID=your_app_id
    APP_SECRET=your_app_secret
    PORT=8080
    SETU_URL=https://dg-sandbox.setu.co/api
    ```

    You can get your `APP_ID` and `APP_SECRET` from [Reclaim Protocol Developer Portal](https://dev.reclaimprotocol.org).
    - Go to the [Reclaim Protocol Developer Portal](https://dev.reclaimprotocol.org)
    - Create a new public data (zkfetch) application and get the `APP_ID` and `APP_SECRET` from the application
    
    **Note**: The `SETU_URL` should point to Setu's DigiLocker API endpoint. The example above uses the sandbox environment.

## Usage

### Running the Service

This project runs a single Express.js service that handles Aadhaar verification:

1. **Start the main service**:
    ```bash
    npm start
    ```
    This will start the Aadhaar ZK verification service on `http://localhost:8080`.

Alternatively, for development with auto-reload:
    ```bash
    npm run dev
    ```

### Service Architecture

The service provides two main endpoints:
- **Verification Initiation**: Starts the Aadhaar verification process with Setu's DigiLocker
- **Proof Generation**: Generates ZK proofs for the verified Aadhaar data

## Endpoints

### Main Service (Port 8080)

#### GET /

- **Description**: Health check endpoint
- **Response**: "gm gm! api is running"

#### POST /startVerification

- **Description**: Initiates Aadhaar verification process through Setu's DigiLocker API
- **Query Parameters**: 
  - `userId` (string): Unique identifier for the user
- **Response**: Returns verification URL and success message
- **Example Response**:
```json
{
  "message": "Verification initiated successfully",
  "url": "https://dg-sandbox.setu.co/api/digilocker/verify?requestId=..."
}
```

#### POST /generateProof

- **Description**: Generates a zk-fetch proof for the completed Aadhaar verification. This endpoint should be called after the user has completed the verification process through the URL returned by `/startVerification`.
- **Query Parameters**: 
  - `userId` (string): The same user ID used in the verification initiation
- **Response**: Returns both the raw proof and the transformed proof for on-chain use.
- **Example Response**:

```json
{
  "transformedProof": {
    "claimInfo": {
      "context": "{\"extractedParameters\":{...},\"providerHash\":\"0x...\"}",
      "parameters": "{\"body\":\"\",\"method\":\"GET\",\"responseMatches\":[...],\"url\":\"https://dg-sandbox.setu.co/api/digilocker/.../aadhaar\"}",
      "provider": "http"
    },
    "signedClaim": {
      "claim": {
        "epoch": 1,
        "identifier": "0x...",
        "owner": "0x...",
        "timestampS": 1735996331
      },
      "signatures": ["0x..."]
    }
  },
  "proof": {
    "claimData": {
      "provider": "http",
      "parameters": "{\"body\":\"\",\"method\":\"GET\",\"url\":\"https://dg-sandbox.setu.co/api/digilocker/.../aadhaar\"}",
      "owner": "0x...",
      "timestampS": 1735996331,
      "context": "{\"extractedParameters\":{...},\"providerHash\":\"0x...\"}",
      "identifier": "0x...",
      "epoch": 1
    },
    "identifier": "0x...",
    "signatures": ["0x..."],
    "extractedParameterValues": {
      // Aadhaar verification data
    },
    "witnesses": [
      {
        "id": "0x244897572368eadf65bfbc5aec98d8e5443a9072",
        "url": "wss://attestor.reclaimprotocol.org/ws"
      }
    ]
  }
}
```

## How It Works

1. **Verification Initiation**: A client calls `/startVerification` with a `userId` parameter
2. The service makes a request to Setu's DigiLocker API to initiate Aadhaar verification
3. Setu returns a verification URL that the user must visit to complete the Aadhaar verification process
4. The service caches the Setu request ID associated with the user ID for later use
5. **Proof Generation**: After the user completes verification, the client calls `/generateProof` with the same `userId`
6. The service retrieves the cached Setu request ID and makes a zk-fetch request to get the verified Aadhaar data
7. The zk-fetch generates cryptographic proof of the API call and Aadhaar verification response
8. The proof is verified for validity using Reclaim Protocol's verification system
9. The proof is transformed for on-chain use and returned to the client

This demonstrates how zk-fetch can be used to create verifiable proofs of Aadhaar verification without exposing sensitive personal information, enabling privacy-preserving identity verification for blockchain applications.
