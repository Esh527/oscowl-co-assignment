import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';

import { useNavigate } from "react-router-dom";
import "./index.css";

const TodoElements = ({ eachTodo, callBackFn }) => {


  const { id, todo, status } = eachTodo;

//   const onClickDelete = async () => {
//     const options = {
//       method: "DELETE",
//     };
//     await fetch(`/delete/${id}`, options);
//     callBackFn();
//   };

const onClickDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (isConfirmed) {
      const options = {
        method: "DELETE",
      };
      await fetch(`/delete/${id}`, options);
      callBackFn();
    }
  };
  

  const onClickUpdate = async () => {
    const updatedTask = prompt("Edit your task:", todo);
    const updatedStatus = prompt("Edit status (e.g., pending, completed):", status);
    if (updatedTask && updatedStatus) {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: updatedTask, status: updatedStatus }),
      };
      await fetch(`/update/${id}`, options);
      callBackFn();
    }
  };

  return (
    <div className="todo-con">
      <div>
        <p className="para"><span className="todo">Task: </span>{todo}</p>
        <p className="para"><span className="todo-status">Status: </span>{status}</p>
      </div>
      <div>
        <button onClick={onClickUpdate} className="button btn-a " id="inner-edit">Edit</button>
        <button onClick={onClickDelete} className="button btn-a" id="inner-delete">Delete</button>
      </div>
    </div>
  );
};

const Todo = () => {
    const navigate = useNavigate()
  const [task, setTask] = useState("");
  const [data, setData] = useState([]);

  const getData = async () => {
    const response = await fetch("/getTodosList");
    const result = await response.json();
    setData(result);
  };

  useEffect(() => {
    getData();
  }, []);

  const onClickBtn = async () => {
    if (task !== "") {
      const tasktodo = { task, statusA: "pending" };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tasktodo),
      };
      await fetch("/addtask", options);
      getData();
      setTask("");
    }
  };

  const onLogout =()=>{
    Cookies.remove('token');
    navigate("/login")
  }
  return (
    
    <div className="todos-bg-container">
        <marquee width="100%" direction="right" height="50%" >Please refresh your page after <span className='adding'>Adding/<span className='editing'>Editing/</span><span className='deleting'>Deleting</span></span> your Todo:-)</marquee>
   
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="todos-heading">Todos</h1> <div className="logout-button-container">
            <button onClick={onLogout} className="logout-button">Logout</button>
            </div>
            <h1 className="create-task-heading" id="task-heading">
              Create <span className="create-task-heading-subpart"> your Task Buddy</span>
            </h1>
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              type="text"
              className="todo-user-input"
              placeholder="What is your task?"
            />
            <button onClick={onClickBtn} className="button">Add</button>
            <h1 className="todo-items-heading">
              My <span className="todo-items-heading-subpart">Tasks</span>
            </h1>
            <ul className="todo-items-container">
              {data.map((each) => (
                <TodoElements key={each.id} eachTodo={each} callBackFn={getData} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;