const express = require('express');
const cors = require("cors");
const pool = require("./db");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes//

//create todos
app.post("/todos", async(req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *", [description]
        );

        res.json(newTodo.rows[0]);
         
    } catch (err) {
        console.error(err.message);
    }
});

//get all todos
app.get("/todos", async(req, res) => {
    try {
        const allTodo = await pool.query(
            "SELECT * FROM todo"
        );

        res.json(allTodo.rows);

    } catch (err) {
        console.error(err.message);
    }
});

//get a todo
app.get("/todos/:id", async(req, res) => {
    try {
        const search_id = req.params.id
        const oneTodo = await pool.query(
            "SELECT * FROM todo WHERE todo_id = " + search_id
        );

        res.json(oneTodo.rows);

    } catch (err) {
        console.error(err.message);
    }
});

//update a todo
app.put("/todos/:id", async(req, res) => {
    try {
        const update_id = req.params.id;
        const updated_desc = req.body.description;

        const update_todo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2", [updated_desc, update_id] 
        );

        res.json("done");

    } catch (err) {
        console.error(err.message);
    }
});

//delete a todo
app.delete("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const delete_todo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1", [id]
        );

        res.json("delted todo number " + id);
        
    } catch (err) {
        console.error(err.message);
        
    }
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000");
});
