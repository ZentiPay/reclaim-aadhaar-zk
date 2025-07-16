# zkfetch-express-example

This is an example project that demonstrates how to use zk-fetch on an Express.js server. The project consists of two services:

1. **Main service** (port 8080): Generates zk-fetch proofs by calling a backend provider API
2. **Backend provider service** (port 8081): Simulates a data provider API that returns user data

The main service fetches user data from the backend provider and generates cryptographic proofs using zk-fetch, which can then be used for on-chain verification.

## Features

- Generate zk-fetch proofs for API responses
- Verify proof validity
- Transform proofs for on-chain use
- Dual-service architecture demonstrating real-world usage patterns

## Installation

1. Clone the repository:

    ```bash
    git clone https://gitlab.reclaimprotocol.org/starterpacks/zkfetch-express-example
    ```

2. Navigate into the project directory:

    ```bash
    cd zkfetch-express-example
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Download the zk-circuits:

    ```bash
    npm run download:zk-circuits
    ```

5. Set up environment variables in `.env`: 

    ```bash
    APP_ID=your_app_id
    APP_SECRET=your_app_secret
    PORT=8080
    PROVIDER_URL=http://localhost:8081
    ```

    You can get your `APP_ID` and `APP_SECRET` from [Reclaim Protocol Developer Portal](https://dev.reclaimprotocol.org).
    - go to the [Reclaim Protocol Developer Portal](https://dev.reclaimprotocol.org)
    - create a new public data (zkfetch) application and get the `APP_ID` and `APP_SECRET` from the application
    
    **Note**: The `PROVIDER_URL` should point to your backend provider service. In this example, it points to the local backend service running on port 8081.

## Usage

### Running the Services

This project requires both services to be running:

1. **Start the backend provider service** (in a separate terminal):
    ```bash
    npm run start-backend
    ```
    This will start the provider API on `http://localhost:8081`.

    You'll need to host the provider service on a publicly accessible URL if you want to test it with the main service. You can use tools like [ngrok](https://ngrok.com/) to expose your local server to the internet. For example:

    ```bash
    ngrok http 8081
    ```

2. **Start the main service**:
    ```bash
    npm start
    ```
    This will start the main zk-fetch service on `http://localhost:8080`.

Alternatively, for development with auto-reload:
    ```bash
    npm run dev
    ```

### Service Architecture

- **Main Service** (`index.ts`): Handles zk-fetch proof generation by calling the provider service
- **Provider Service** (`backend/index.ts`): Simulates a data provider API that returns user information

## Endpoints

### Main Service (Port 8080)

#### GET /

- **Description**: Health check endpoint
- **Response**: "gm gm! api is running"

### GET /generateProof

- **Description**: Generates a zk-fetch proof by calling the provider service's `/getUserId` endpoint. The proof verifies that the API call was made and captures the response data cryptographically.
- **Response**: Returns both the raw proof and the transformed proof for on-chain use.

### Provider Service (Port 8081)

#### GET /

- **Description**: Health check endpoint for the provider service
- **Response**: "gm gm! api is running"

#### GET /getUserId

- **Description**: Returns a simulated user ID. This endpoint is called by the main service to generate proofs.
- **Response**: 
```json
{
  "userId": "12345"
}
```

Example response from `/generateProof`:

```json
{
  "transformedProof": {
    "claimInfo": {
      "context": "{\"extractedParameters\":{\"userId\":\"12345\"},\"providerHash\":\"0x...\"}",
      "parameters": "{\"body\":\"\",\"method\":\"GET\",\"responseMatches\":[...],\"url\":\"http://localhost:8081/getUserId\"}",
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
      "parameters": "{\"body\":\"\",\"method\":\"GET\",\"url\":\"http://localhost:8081/getUserId\"}",
      "owner": "0x...",
      "timestampS": 1735996331,
      "context": "{\"extractedParameters\":{\"userId\":\"12345\"},\"providerHash\":\"0x...\"}",
      "identifier": "0x...",
      "epoch": 1
    },
    "identifier": "0x...",
    "signatures": ["0x..."],
    "extractedParameterValues": {
      "userId": "12345"
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

1. The main service receives a request to `/generateProof`
2. It uses the Reclaim zk-fetch client to make a verifiable request to the provider service
3. The provider service returns user data (simulated as userId: "12345")
4. The zk-fetch generates cryptographic proof of the API call and response
5. The proof is verified for validity
6. The proof is transformed for on-chain use and returned

This demonstrates how zk-fetch can be used to create verifiable proofs of API responses, which can then be used in blockchain applications or other systems requiring cryptographic verification of off-chain data.
