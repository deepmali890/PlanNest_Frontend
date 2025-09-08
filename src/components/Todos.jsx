import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { CheckCircle, Edit, Plus, Trash2, Save, X, User } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const Todos = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const fetchTasks = async () => {
        try {
            const res = await axiosInstance.get("/api/todo/getAllTodos");
            setTasks(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch tasks");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return toast.error("Title is required");
        if (!description.trim()) return toast.error("Description is required");

        try {
            const res = await axiosInstance.post("/api/todo/createTodo", {
                title,
                description,
                completed: false,
            });
            setTasks([...tasks, res.data]);
            toast.success("Task added successfully");
            setTitle("");
            setDescription("");
        } catch (err) {
            console.error(err);
            toast.error("Error adding task");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete this task?")) return;
        try {
            await axiosInstance.delete(`/api/todo/deleteTodo/${id}`);
            setTasks(tasks.filter((t) => t._id !== id));
            toast.success("Task deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Error deleting task");
        }
    };

    const handleIsCompleteTask = async (id) => {
        const task = tasks.find((t) => t._id === id);
        try {
            await axiosInstance.put(`/api/todo/updateTodo/${id}`, {
                title: task.title,
                description: task.description,
                completed: !task.completed,
            });

            if (!task.completed) {
                const audio = new Audio("/new-notification-025-380251.mp3");
                audio.play();
            }

            fetchTasks();
        } catch (err) {
            console.error(err);
            toast.error("Error updating task");
        }
    };

    const startEditing = (task) => {
        setEditingTask(task._id);
        setEditTitle(task.title);
        setEditDescription(task.description);
    };

    const saveEdit = async (id) => {
        try {
            await axiosInstance.put(`/api/todo/updateTodo/${id}`, {
                title: editTitle,
                description: editDescription,
            });
            setEditingTask(null);
            fetchTasks();
            toast.success("Task updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Error updating task");
        }
    };

    const incompleteTasks = tasks.filter((t) => !t.completed);
    const completedTasks = tasks.filter((t) => t.completed);

    return (
        <div className="min-h-screen relative p-6 overflow-x-hidden">
            {/* Background Blur + Animated Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 via-pink-200 animate-gradientBlur"></div>
            <div className="absolute inset-0 backdrop-blur-md"></div>

            {/* Header */}
            <header className="relative z-20 flex justify-center text-center shadow-xl px-10 rounded-b-md md:flex-row  items-start md:items-center mb-6 gap-4 md:gap-0">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="logo" className="w-20 h-20" />
                   
                </div>
              
            </header>

            {/* Add Task */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-3xl mx-auto bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-200"
            >
                <form onSubmit={handleTask} className="flex flex-col md:flex-row gap-4">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task title..."
                        className="flex-1 rounded-xl"
                    />
                    <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Task description..."
                        className="flex-1 rounded-xl"
                    />
                    <Button
                        type="submit"
                        className="bg-gradient-to-r from-[#113d6a] to-[#5e60ce] hover:opacity-90 text-white rounded-xl px-6"
                    >
                        <Plus size={18} className="mr-1" /> Add
                    </Button>
                </form>
            </motion.div>

            {/* Pending Tasks */}
            {incompleteTasks.length > 0 && (
                <div className="relative z-10 mt-10 max-w-6xl mx-auto">
                    <h2 className="text-xl font-bold text-white mb-4 drop-shadow-md">
                        Pending Tasks ⏳
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {incompleteTasks.map((task) => (
                            <motion.div
                                key={task._id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/30 backdrop-blur-lg rounded-2xl p-5 shadow-md border border-gray-200"
                            >
                                <div className="flex items-start gap-3">
                                    <CheckCircle
                                        size={28}
                                        className="cursor-pointer text-black transition-all"
                                        onClick={() => handleIsCompleteTask(task._id)}
                                    />
                                    <div className="flex-1">
                                        {editingTask === task._id ? (
                                            <>
                                                <Input
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className="mb-2"
                                                />
                                                <Input
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <h2 className="font-semibold text-lg text-white drop-shadow-md">
                                                    {task.title}
                                                </h2>
                                                <p className="text-sm text-white/90 drop-shadow-sm">
                                                    {task.description}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end items-center gap-4 mt-4">
                                    {editingTask === task._id ? (
                                        <>
                                            <Save
                                                size={22}
                                                className="text-green-500 cursor-pointer hover:text-green-600"
                                                onClick={() => saveEdit(task._id)}
                                            />
                                            <X
                                                size={22}
                                                className="text-gray-500 cursor-pointer hover:text-gray-600"
                                                onClick={() => setEditingTask(null)}
                                            />
                                        </>
                                    ) : (
                                        <Edit
                                            size={22}
                                            className="text-blue-500 cursor-pointer hover:text-blue-600"
                                            onClick={() => startEditing(task)}
                                        />
                                    )}
                                    <Trash2
                                        onClick={() => handleDelete(task._id)}
                                        size={22}
                                        className="text-red-500 cursor-pointer hover:text-red-600"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
                <div className="relative z-10 mt-14 max-w-6xl mx-auto">
                    <h2 className="text-xl font-bold text-white mb-4 drop-shadow-md">
                        Completed Tasks 🎉
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {completedTasks.map((task) => (
                            <motion.div
                                key={task._id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-green-100/40 backdrop-blur-lg border border-green-200 rounded-2xl p-5 shadow-md"
                            >
                                <div className="flex items-start gap-3">
                                    <CheckCircle
                                        size={28}
                                        className="cursor-pointer text-green-500"
                                        onClick={() => handleIsCompleteTask(task._id)}
                                    />
                                    <div className="flex-1">
                                        <h2 className="font-semibold text-lg line-through text-gray-700">
                                            {task.title}
                                        </h2>
                                        <p className="text-sm line-through text-gray-600">
                                            {task.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Todos;
