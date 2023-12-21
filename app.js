const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

const port = process.env.PORT;
const app = express();

//creating instance of db to perform CRUD operations
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//api endpoint to get all blogs from blogs database
app.get('/getALL',(req,res)=>{

    //mysql query to select all blogs from db
    let query = "SELECT * FROM blogs;";
    try{

        pool.execute(query,function(err,result){
            if(err){
                throw err;
            }
            res.send(result);
        });
    }catch(err){
        res.status(404).send({error:err});
    }
});

//api endpoint to get a single blog by id
app.get("/blogs/:id",(req,res)=>{
    try{
    //fetching id from parameters of api call
    const id = req.params.id;
    //mysql query for selecting query with given id
    let query = `SELECT * FROM blogs WHERE id = ${id};`;

        pool.execute(query,function(err,result){
            if(err){
                throw err;
            }
            res.status(200).send(result);
        });
    }catch(err){
        res.status(404).send({error:err});
    }
});

/*API endpoint to post a new blog
    We will send details of every details of post in body,
    if there is some detail missing then it will be counted as 
    Undefined.
*/
app.post('/create',(req,res)=>{

    try{
        //fetching details from body of request
        const title = String(req.body.title);
        const content = String(req.body.content);
        const author = String(req.body.author);
        const date = new Date();
        //mysql query for inserting a new blog
        let query = 'INSERT INTO blogs (title, content, author, Date) VALUES (?, ?, ?, ?)';
        let values = [title, content, author, date];
        
        
        pool.execute(query,values,function(err,result){
            if(err){
                throw err;
            }
            
            //redirecting to all blogs endpoint after inerting a new blog
            res.redirect('/getAll');
            
            
        });
    }catch(err){
        res.status(404).send({error:err});
    }
});

/*APi endpoint to update an existing blog by id
    We will send all details of blog, if not changed then we will Send
    previous details.
    if there is some detail missing then it will be counted as 
    Undefined.  
*/
app.put('/update/:id',(req,res)=>{
    try{

        //fetching id from the parameters of API call
        const id = req.params.id;
        //fetching details from body of the request
        const title = String(req.body.title);
        const content = String(req.body.content);
        const author = String(req.body.author);
        const date = new Date();
        
        let query = `UPDATE blogs SET title = ? ,content = ?, author = ?, Date = ? WHERE id = ?`;
        
        let values = [title,content,author,date,id];
        pool.execute(query,values,function(err,result){
            if(err){
                throw err;
            }
            //redirecting to all blogs endpoint after updating current blog
            res.redirect('/getAll');
        });
    }catch(err){
        res.status(404).send({error:err});
    }
});

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})