const express= require("express")
// const { MongoClient, ServerApiVersion } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
// var MongoClient = require('mongodb').MongoClient;

const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app=express();
const port = process.env.PORT || 5000;
const SSLCommerzPayment = require('sslcommerz')
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json())

 
//  oahiduzzaman267
// // 3IDIq3Hn6I65Jusw
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcndbqa.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const uri = `mongodb+srv://oahiduzzaman267:3IDIq3Hn6I65Jusw@cluster0.2m2tmgj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// var uri = "mongodb://oahiduzzaman267:3IDIq3Hn6I65Jusw@ac-qpqtjt6-shard-00-00.2m2tmgj.mongodb.net:27017,ac-qpqtjt6-shard-00-01.2m2tmgj.mongodb.net:27017,ac-qpqtjt6-shard-00-02.2m2tmgj.mongodb.net:27017/?ssl=true&replicaSet=atlas-r654r5-shard-0&authSource=admin&retryWrites=true&w=majority";

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    try{
        await client.connect();
        console.log("connected to database");
        const database = client.db('showHumanity');

        const userCollection = database.collection('users');
        const shisuVirdhaCollection = database.collection('shisuVirdha');
        const userCollectedCollection = database.collection('userCollected');
        const contactCollection = database.collection('contact');
        const institutionCollection = database.collection('institution');
        const donateInfoCollection = database.collection('donateInfo');
        const donatePaymentCollection = database.collection('donatePayment');



         // add database user collection 
         app.post('/users', async(req,res)=>{
            const user=req.body;
            console.log(user)
            const result=await userCollection.insertOne(user);
            // console.log(body)
            res.json(result);
           
        });
         app.post('/donateinfo', async(req,res)=>{
            const user=req.body;
            console.log(user)
            const result=await donateInfoCollection.insertOne(user);
            // console.log(body)
            res.json(result);
           
        });

        app.get('/donatePayment', async(req,res)=>{
            const result=await donateInfoCollection.find({}).toArray()
            res.json(result)
        });
        app.get('/instutionpayment', async(req,res)=>{
            const result=await donatePaymentCollection.find({}).toArray()
            res.json(result)
        });
    

        app.put('/users', async(req,res) =>{
            const user=req.body;
            console.log(user)
            const filter= {email:user.email}
            const option = {upsert:true}
            const updateDoc= {$set : user}
            const result= await userCollection.updateOne(filter,updateDoc,option)
            res.json(result)
        });


        // database searching check buyer
    app.get('/users/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email}
        const user=await userCollection.findOne(query)
        let ispolice=false;
        if(user?.client==='police'){
          ispolice=true;
        }
        res.json({police:ispolice})
    });

    // institution data check 

    app.get('/userIns/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email}
        const user=await userCollection.findOne(query)
        let isinstitution=false;
        if(user?.client==='institution'){
            isinstitution=true;
        }
        res.json({institution:isinstitution})
    });
       
    // database admin role 
    app.put('/userLogin/admin', async(req,res)=>{
        const user=req.body;
        console.log('put',user)
        const filter={email:user.email}
        const updateDoc={$set:{role:'admin'}}
        const result=await userCollection.updateOne(filter,updateDoc)
        res.json(result)
    });

       // database searching check admin 
       app.get('/userLogin/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email}
        const user=await userCollection.findOne(query)
        let isAdmin=false;
        if(user?.role==='admin'){
          isAdmin=true;
        }
        res.json({admin:isAdmin})
    });


     //    post product shisu and virdha ashrom
     app.post('/PostAdmin', async(req,res) =>{
        const user=req.body;
      console.log(user);
      
        const result=await shisuVirdhaCollection.insertOne(user);
        res.json(result)
    });

    // post institution 
     app.post('/postins', async(req,res) =>{
        const user=req.body;
      console.log(user);
      
        const result=await donateInfoCollection.insertOne(user);
        res.json(result)
    });
    // post institution donet
     app.post('/serviceIns', async(req,res) =>{
        const user=req.body;
      console.log(user);
      
        const result=await institutionCollection.insertOne(user);
        res.json(result)
    });

    app.get('/getAdmin', async(req,res)=>{
        const result=await shisuVirdhaCollection.find({}).toArray()
        res.json(result)
    });

    app.get('/details/:id', async(req,res)=>{
        const id=req.params.id
        const query={_id:ObjectId(id)}
        const result=await shisuVirdhaCollection.findOne(query)
        res.json(result)
      });


    //   user shisu and old people collected 
     // add database user collection 
     app.post('/userCollected', async(req,res)=>{
        const user=req.body;
        console.log(user)
        const result=await userCollectedCollection.insertOne(user);
        // console.log(body)
        res.json(result);
       
    });

    app.get('/getuserCollected', async(req,res)=>{
        const result=await userCollectedCollection.find({}).toArray()
        res.json(result)
    });

    // get myorder 
    app.get("/getuserCollected/:email", async (req, res) => {
        console.log(req.params.email);
        const result = await userCollectedCollection.find({ email: req.params.email }).toArray();
        res.send(result);
      });

     // book status update 
     app.put('/updateBook/:id',async(req,res)=>{
        const filter={_id:ObjectId(req.params.id)}
        const result=await userCollectedCollection.updateOne(filter,{
            $set:{
                status:req.body.status
            }
        });
        res.json(result)
    });

    app.get("/products", async (req, res) => {
        const page = req.query.page;
        const size = parseInt(req.query.size);
        const query = req.query;
        delete query.page
        delete query.size
        Object.keys(query).forEach(key => {
            if (!query[key])
                delete query[key]
        });
    
        if (Object.keys(query).length) {
            const cursor = shisuVirdhaCollection.find(query, status = "approved");
            const count = await cursor.count()
            const allData = await cursor.skip(page * size).limit(size).toArray()
            res.json({
                allData, count
            });
        } else {
            const cursor = shisuVirdhaCollection.find({
                // status: "approved"
            });
            const count = await cursor.count()
            const allData = await cursor.skip(page * size).limit(size).toArray()
    
            res.json({
              allData, count
            });

              

        }
    
    });


    // institution data get 
    app.get("/institutions", async (req, res) => {
        const page = req.query.page;
        const size = parseInt(req.query.size);
        const query = req.query;
        delete query.page
        delete query.size
        Object.keys(query).forEach(key => {
            if (!query[key])
                delete query[key]
        });
    
        if (Object.keys(query).length) {
            const cursor = institutionCollection.find(query, status = "approved");
            const count = await cursor.count()
            const allData = await cursor.skip(page * size).limit(size).toArray()
            res.json({
                allData, count
            });
        } else {
            const cursor = institutionCollection.find({
                // status: "approved"
            });
            const count = await cursor.count()
            const allData = await cursor.skip(page * size).limit(size).toArray()
    
            res.json({
              allData, count
            });

              

        }
    
    });


    // contact 
    app.post('/contact', async(req,res)=>{
        const data=req.body;
        const result=await contactCollection.insertOne(data);
        res.json(result)
    });

    // show institutionCollection 
     app.get("/showinstitution/:email", async (req, res) => {
        // const buyeremail=req.body.cartProducts.map((data)=>data.buyerEmail)
        console.log(req.params.email);
        const email = req.params.email;
        const result = await institutionCollection
          .find({ donetEmail: email })
          .toArray();
          console.log(result)
        res.send(result);
      });



       // ssl commerce init 

       app.post('/init', async(req, res) => {
        // console.log(req.body)
        const email=req.body.cartProducts.map((data)=>data.buyerEmail)
        const schedule=req.body.cartProducts.map((data)=>data.schedule)
        const adminemail=req.body.cartProducts.map((data)=>data.adminEmail)
        console.log(email)
        console.log(schedule)
        const data = {
            emails:email,
            admindata:adminemail,
            total_amount: req.body.total_amount,
            currency: req.body.currency,
            tran_id: uuidv4(),
            success_url: 'https://show-backend-data.onrender.com/success',
            fail_url: 'https://show-backend-data.onrender.com/fail',
            cancel_url: 'https://show-backend-data.onrender.com/cancel',
            ipn_url: 'http://yoursite.com/ipn',
            shipping_method: 'Courier',
            product_name: "req.body.product_name",
            product_category: 'Electronic',
            product_profile: "req.body.product_profile",
            cus_name: req.body.cus_name,
            cus_email: req.body.cus_email,
            date: req.body.date,
            // data update 
            status: req.body.status,
            cartProducts: req.body.cartProducts,
            // buyerDetails: req.body.email,
            // buyerDetails: req.body.console.log(cartProducts),
            product_image: "https://i.ibb.co/t8Xfymf/logo-277198595eafeb31fb5a.png",
            cus_add1: req.body.cus_add1,
            cus_add2: 'Dhaka',
            cus_city: req.body.cus_city,
            date: req.body.date,
            code: req.body.code, 
            item: req.body.item,
           
            mobile: req.body.mobile,
            cus_state:  req.body.cus_state,
            cus_postcode: req.body.cus_postcode,
            cus_country: req.body.cus_country,
            cus_phone: req.body.cus_phone,
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
            multi_card_name: 'mastercard',
            value_a: 'ref001_A',
            value_b: 'ref002_B',
            value_c: 'ref003_C',
            value_d: 'ref004_D'
        };
        // insert order data into database 
        const order=await donatePaymentCollection.insertOne(data)
        console.log(data)
        const sslcommer = new SSLCommerzPayment(process.env.STORE_ID,process.env.STORE_PASSWORD,false) //true for live default false for sandbox
        sslcommer.init(data).then(data => {
            //process the response that got from sslcommerz 
            //https://developer.sslcommerz.com/doc/v4/#returned-parameters
            // console.log(data);
            // res.redirect(data.GatewayPageURL)
            if(data.GatewayPageURL){
                res.json(data.GatewayPageURL)
              }
              else{
                return res.status(400).json({
                  message:'payment session failed'
                })
              }
        });
    });

    app.post('/success',async(req,res)=>{
        // console.log(req.body)
        const order = await donatePaymentCollection.updateOne({tran_id:req.body.tran_id},{
            $set:{
              val_id:req.body.val_id
            }
        
          })
        res.status(200).redirect(`https://show-humanity.web.app/success/${req.body.tran_id}`)
        // res.status(200).json(req.body)
    })
    
    app.post ('/fail', async(req,res)=>{
        // console.log(req.body);
      const order=await donatePaymentCollection.deleteOne({tran_id:req.body.tran_id})
        res.status(400).redirect('https://show-humanity.web.app')
      });
      app.post ('/cancel', async(req,res)=>{
        // console.log(req.body);
        const order=await donatePaymentCollection.deleteOne({tran_id:req.body.tran_id})
        res.status(200).redirect('https://show-humanity.web.app')
      })
    // store data 
    // gg 
    
      app.get('/orders/:tran_id', async(req,res)=>{
        const id=req.params.tran_id;
        const order =await donatePaymentCollection.findOne({tran_id:id});
        console.log(order)
        res.json(order)
      });




    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir)




   app.get('/', (req,res)=>{
    res.send("show humanity");
   });
  
  app.listen(port, ()=>{
    console.log("runnning online on port", port);
  }); 
