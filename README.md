# IFS4302-EquiV
Equiv blockchain hyperledger (Frontend & Backend)

### When first cloning project
1. At the IFS4302-EQUIV directory, do a "npm install" to install server-side dependencies
2. Then, at the same directory, do a "npm run client-install" to install client side dependencies
3. (For Windows) Remove 'browserslist' & 'browserslist.cmd' in client directory. Then do "npm run dev" in the IFS4302-EQUIV directory to run both server(port 5000) and client(port 3000) at the same time
4. To run just the server do "npm run server"
5. To run just the client do "npm run client"

### Login credentials
For no2 all log in credentials are as follows
1. Middleman -> NRIC: S1234567M, Password: password
2. Buyer -> NRIC: S1234567B, Password: password
3. Dealer -> NRIC: S1234567D, Password: password
4. Seller -> NRIC: S1234567S, Password: password
5. Evaluator -> NRIC: S1234567E, Password: password

### reverse proxy (rest server)
To start the reverse proxy, do 'npm run start_rest-server evaluator@equiv-blockchain 3001'
1. evaluator: proxy: /evaluator, port: 3001
-> Meaning to say in for your playground, make sure you use port 3001 for the evaluator.
-> On the client side, use e.g. fetch("evaluator/api/org.equiv.participants.assets.Evaluator") to access the APIs, /evaluator will replace http://localhost:3001

2. middleman: proxy: /middleman, port:3002
3. buyer: proxy: /buyer, port:3003
4. dealer: proxy: /dealer, port:9090


## equiv-bna
Equiv blockchain hyperledger composer network
### Sample Data
1. For the participants and company, they are created via the admin identity. Please copy & paste the data directly to create via the "Create new participant".

2. Not sure how we want to create the new participants, for now the rating needs to be created manually to match the id.
  a. Moving forward: Maybe the admin will create the new identity for new participants via transactions to help automate certain creation of the relevant assets

### Network Cards
They are the identity/persona to use when testing/using the transactions. Please import them into your network.
