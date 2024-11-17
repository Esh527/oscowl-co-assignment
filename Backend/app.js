const express = require("express");
const {open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const jwt = require('jsonwebtoken');
const uuid = require("uuid")

const app = express();

const dbPath = path.join(__dirname,"todoData.db");

app.use(express.json());

let db = null;

const intializeServer = async()=>{
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(3005,()=>{
            console.log("Server Started")
        })
    }catch(e){
        console.log(`Db error:${e.message}`);
        process.exit(1);
    }
}

app.get("/users", async(req,res)=>{
    const getUserQuery  = `SELECT * FROM user;`;
    const result = await db.all(getUserQuery);
    res.send(result)
})

app.post("/addtask",async(req,res)=>{
    const {task,statusA} = req.body
    const query = `INSERT INTO todo(todo,status)
    VALUES("${task}","${statusA}");`;
    const setQuery = await db.run(query)
    res.send("sucess")
})
app.get("/getTodosList",async(req,res)=>{
    const getTodoQuery = `SELECT * FROM todo;`;
    const data= await db.all(getTodoQuery)

    res.send(data)
})

app.post("/login",async(req,res)=>{
    const {userName,password} = req.body
    const loginQuery = `
    SELECT *
    FROM user
    WHERE username = '${userName}';
    `;
    const response = await db.get(loginQuery);
    if (response === undefined){
        res.status(400)
        res.send("Invalid")
    }else{
        if (response.password === password){
            const SECRET_KEY = 'your-secret-key';
            const payload = {
               userName,password
             }
            const token = jwt.sign(payload,SECRET_KEY,{ expiresIn: '1h' })
            res.json({token});
        }else{
            res.status(400)
            res.send("invalid")
        }
    }
})

app.post("/register",async(req,res)=>{
    try {
        const {userName,password} = req.body
    const check_userName = `SELECT *
    FROM user
    WHERE username = '${userName}';`;
    const queryResult =await db.get(check_userName)
    if (queryResult===undefined){
        const register_query = `
        INSERT INTO user(username,password)
        VALUES ('${userName}','${password}');`;
        const result = await db.run(register_query)
        res.status(200)
        res.send("sucess")
    }else{
        res.status(400)
        res.send("invalid")
    }
    } catch (error) {
        res.send(error.message)
    }

})

app.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id
    const deleteQuery = `DELETE FROM todo WHERE id = "${id}";`;
    const deleteRes = await db.run(deleteQuery);
    res.status(200)
})

app.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { task, status } = req.body;
    const updateQuery = `
        UPDATE todo
        SET todo = "${task}", status = "${status}"
        WHERE id = ${id};
    `;
    try {
        await db.run(updateQuery);
        res.status(200).send("Update successful");
    } catch (e) {
        res.status(500).send(`Error: ${e.message}`);
    }
});


intializeServer();

module.exports = app;