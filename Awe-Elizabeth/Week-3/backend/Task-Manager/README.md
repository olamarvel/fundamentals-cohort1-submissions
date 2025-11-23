### Task-Manager-Backend

## Getting Started
1. Clone repository: https://github.com/Awe-Elizabeth/Task-Manager-Backend.git
2. Run npm install
3. Populate a .env file using the sample below
4. Run app with "npm run dev"

# Sample ENV
`MONGOURL=mongodb+srv://<username>:<password>@cluster0.gtqhq.mongodb.net/<dbName>?retryWrites=true&w=majority&appName=Cluster0
PORT=3037
JWT_SECRET=supersecretencryptonkey
NODE_ENV=development
ENC_KEY=supersecretencryptonkey
`

## Frontend Link
1. Clone repository: https://github.com/Awe-Elizabeth/Task-Manager_Frontend.git
2. Run "npm install"
3. Run app with "npm run dev"

## JWT flow
Once a user is registered and logs in, a short lived access token and long lived refresh token is provided. After Registering, the user is expected to login. The access token can be used to access all protected routes and the refresh token can be used to get a new access token.

## Token Rotation Strategy
Once a new refresh token is generated on login, the token is encrypted and stored on the User's table and also the RefreshToken table. On refresh, a new access token and refresh token is generated. The new encrypted refresh token is updated on the User table.

## The secure token method used
1. RefreshToken: Encrypted and stored on the user's table and also on the RefreshToken table. Unencrypted token is stored on server's cookie
2. AccessToken: Access token is stored on the in-memory of the application

## Broken Access Mitigation and Injection
All inputs are sanitized using the npm mongo-sanitize package

