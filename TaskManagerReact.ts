import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

// Create array to store tasks and deadlines
let taskList = [];

// Retrieve tasks from local storage
function getTasks() {
    if(localStorage.getItem('taskList')) {
        taskList = JSON.parse(localStorage.getItem('taskList'));
    }
}

// Add task and deadline to array
function addTask(task, deadline) {
    taskList.push({task, deadline});
    updateList();
}

// Update list of tasks
function updateList() {
    localStorage.setItem('taskList', JSON.stringify(taskList));
}

// Mark task as complete
function checkTask(index) {
    taskList[index].status = 'Complete';
    updateList();
}

// Edit task
function editTask(index, task, deadline) {
    taskList[index].task = task;
    taskList[index].deadline = deadline;
    updateList();
}

// Delete task
function deleteTask(index) {
    taskList.splice(index, 1);
    updateList();
}

const App = () => {
    const [tasks, setTasks] = useState([]);
    
    useEffect(() => {
        getTasks();
        setTasks(taskList);
    }, []);

    function handleAddTask(task, deadline) {
        addTask(task, deadline);
        setTasks([...taskList]);
    }

    function handleCheckTask(index) {
        checkTask(index);
        setTasks([...taskList]);
    }

    function handleEditTask(index, task, deadline) {
        editTask(index, task, deadline);
        setTasks([...taskList]);
    }

    function handleDeleteTask(index) {
        deleteTask(index);
        setTasks([...taskList]);
    }

    return (
        <div>
            <h1>Task Manager</h1>
            <TaskForm onTaskAdd={handleAddTask} />
            <TaskList tasks={tasks} onTaskCheck={handleCheckTask} onTaskEdit={handleEditTask} onTaskDelete={handleDeleteTask} />
        </div>
    );
};

const TaskForm = ({onTaskAdd}) => {
    let taskInput, deadlineInput;
    const handleSubmit = (e) => {
        e.preventDefault();
        if(taskInput.value.trim() && deadlineInput.value.trim()) {
            onTaskAdd(taskInput.value, deadlineInput.value);
            taskInput.value = '';
            deadlineInput.value = '';
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Task" ref={node => taskInput = node} required />
            <input type="text" placeholder="Deadline" ref={node => deadlineInput = node} required />
            <input type="submit" value="Add Task" />
        </form>
    );
};

const TaskList = ({tasks, onTaskCheck, onTaskEdit, onTaskDelete}) => {
    return (
        <div id="list">
            {tasks.map((task, index) => 
                <div key={index}>
                    <span>{task.task} - {task.deadline}</span>
                    <button onClick={() => onTaskCheck(index)}>Complete</button>
                    <button onClick={() => onTaskEdit(index, prompt('Edit task:', task.task), prompt('Edit deadline:', task.deadline))}>Edit</button>
                    <button onClick={() => onTaskDelete(index)}>Delete</button>
                </div>
            )}
        </div>
    );
};

render(<App />, document.getElementById('root'));