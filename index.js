const express= require("express")
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require("cors");
const app=express();
const port = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json())

 
//  oahiduzzaman267
// // 3IDIq3Hn6I65Jusw
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcndbqa.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2m2tmgj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {

    try{
        await client.connect();
        console.log("connected to database");
        const database = client.db('showHumanity');

        const userCollection = database.collection('users');
        const shisuVirdhaCollection = database.collection('shisuVirdha');
        const userCollectedCollection = database.collection('userCollected');
        const contactCollection = database.collection('contact');



         // add database user collection 
         app.post('/users', async(req,res)=>{
            const user=req.body;
            console.log(user)
            const result=await userCollection.insertOne(user);
            // console.log(body)
            res.json(result);
           
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


    // contact 
    app.post('/contact', async(req,res)=>{
        const data=req.body;
        const result=await contactCollection.insertOne(data);
        res.json(result)
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
