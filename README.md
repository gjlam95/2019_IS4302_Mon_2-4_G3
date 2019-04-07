# 2019_IS4302_Mon_2-4_G3
## Project Name: EquiV
In this project, the main technology stack used are _React, MongoDB and ExpressJS, Hyperledger Fabric and Hyperledger Composer_. The steps to setup the React project for EquiV frontend and the blockchain hyperledger composer is as detailed below:

## Warning
__As we are using AWS MongoDB, please note that you need to use an alternative network to ensure the Internet connectivity to MongoDB. The school network does not allow the React Frontend Interface to connect to the AWS MongoDB.__  

## EquiV Frontend Interface (React)
1. Clone the Git repository.  
  ```git clone https://github.com/gjlam95/2019_IS4302_Mon_2-4_G3.git```  

2. Install the required modules for the dependencies for the React project strictly in this order:  
  i. Change directory into the /client directory, run the following command to install __client-side dependencies__.    
  ```npm install```  
  ii. Return to the main directory.  
  ```cd ..```   
  iii. Install the __server-side dependencies__.    
  ```npm install```  
  iv. __\*For Windows Users Only__, remove 'browserlist' & 'browserlist.cmd' in the /client directory.  
3. To start the project, return to the main directory and run this command. Please note that the *__client__* is on __port 3000__ and the *__server__* is on __port 5000__. Do change/add assigned ports used by Vagrant in order to avoid '*Bind failed: Address already in use*' error.  
  ```npm run dev```
4. Additional notes to start the server and/or client:  
  i. To run the server only, run the command:  
  ```npm run server```  
  ii. To run the client only, run the command:  
  ```npm run client```  
5. Login credentials to interact with the Frontend Interface are as follows:  

  | Role      | NRIC      | Password |  
  |-----------|-----------|----------|  
  | Buyer     | S1234567B | password |  
  | Dealer    | S1234567D | password |  
  | Evaluator | S1234567E | password |  
  | Middleman | S1234567M | password |  
  | Seller    | S1234567S | password |  

## EquiV  Reverse Proxy (REST Server)
To start the reverse proxy, the command syntax is  
```npm run start_rest-server <role>@equiv-blockchain <port>```  

Please replace the placeholders <role> and <port> respectively:  

  | \<role\>    | \<port\>    | proxy        | Full Command |  
  |-------------|-------------|--------------|--------------|
  | evaluator | 3001 | /evaluator | npm run start_rest-server evaluator@equiv-blockchain 3001 |  
  | middleman | 3002 | /middleman | npm run start_rest-server middleman@equiv-blockchain 3002 |
  | buyer     | 3003 | /buyer | npm run start_rest-server buyer@equiv-blockchain 3003     |  
  | seller    | 3004 | /seller | npm run start_rest-server seller@equiv-blockchain 3004    |   
  | dealer    | 9090 | /dealer | npm run start_rest-server dealer@equiv-blockchain 9090    |

> __How it works:__   
On the client side (in the React project), for example to access the APIs in the REST server for Evaluator:   
`fetch("evaluator/api/org.equiv.participants.assets.Evaluator")`  
The proxy `/evaluator` will replace the http://localhost:3001.

## EquiV Blockchain Hyperledger Composer Business Network
You will have to start your local environment Hyperledger Composer Playground. Then in the Playground,
1. Click on `Deploy a new business network`.
2. Click on `Drop here to upload or browse`
3. Select the BNA file - equiv-blockchain_v4.4.bna

### Sample Data
* For the participants and assets, they are created via the `Admin` identity. Please copy & paste the data directly to create via the "Create new participant" in Hyperledger Composer Playground.  
* You can either refer to 1) Demo Order.docx which we used during the presentation and 2) Refer to the README.md in the BNA file.  

### Network Cards
They are the identity/persona to use when testing/using the transactions. Please create them into Hyperledger Composer Playground in the business network.
