import { useEffect, useState } from "react";
import "./styles/App.css";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
  useDroppable,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import SortableTask from "./components/SortableTask";
import Task from "./components/task";
import DroppableColumn from "./components/DroppableColumns";

import { auth, provider, db } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

function App() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [alert, setAlert] = useState({ open: false, message: "" });
  const [user, setUser] = useState(null);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadTasks(currentUser.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      loadTasks(result.user.uid);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setTasks([]);
    setCompletedTasks([]);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewTask("");
  };

  const loadTasks = async (uid) => {
    const snapshot = await getDocs(collection(db, "users", uid, "tasks"));
    const loaded = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(loaded);
    setCompletedTasks([]);
  };

  const handleAddTask = async () => {
    if (newTask.trim() && user) {
      const taskObject = { title: newTask.trim() };
      const docRef = await addDoc(
        collection(db, "users", user.uid, "tasks"),
        taskObject
      );
      setTasks([...tasks, { id: docRef.id, ...taskObject }]);
      handleClose();
    }
  };

  const handleDeleteTask = async (id) => {
    if (user) {
      await deleteDoc(doc(db, "users", user.uid, "tasks", id));
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setCompletedTasks((prev) => prev.filter((task) => task.id !== id));
      setAlert({ open: true, message: "Task deleted" });
    }
  };

  const handleCompleteTask = async (id) => {
    if (user) {
      const completedTask = tasks.find((task) => task.id === id);
      if (completedTask) {
        await deleteDoc(doc(db, "users", user.uid, "tasks", id));
        setTasks((prev) => prev.filter((task) => task.id !== id));
        setCompletedTasks((prev) => [...prev, completedTask]);
        setAlert({ open: true, message: "Task completed" });
      }
    }
  };

  const handleAlertClose = () => setAlert({ open: false, message: "" });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (overId === "completed") {
      handleCompleteTask(activeId);
    } else if (overId === "incomplete") {
    } else {
      const oldIndex = tasks.findIndex((task) => task.id === activeId);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setTasks(arrayMove(tasks, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className="white mt-3 px-4">
      <div className="flex justify-between items-center">
        <img src="/logo.svg" alt="Logo" className="w-24 sm:w-32" />
        {user ? (
          <div className="flex gap-3 items-center">
            <span className="text-sm">{user.displayName}</span>
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleOpen}
              sx={{
                minWidth: { xs: "auto", sm: "auto" },
                px: { xs: 1, sm: 2 },
              }}
            >
              <AddIcon />
              <span className="hidden sm:inline ml-2">Add Task</span>
            </Button>
          </div>
        ) : (
          <Button variant="contained" onClick={handleLogin}>
            Login with Google
          </Button>
        )}
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Add New Task
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Task Title"
            variant="outlined"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddTask} sx={{ mt: 2 }}>
            Add
          </Button>
        </Box>
      </Modal>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <DroppableColumn id="incomplete">
            {tasks.map((task) => (
              <SortableTask
                key={task.id}
                id={task.id}
                title={task.title}
                onDelete={handleDeleteTask}
                onComplete={handleCompleteTask}
              />
            ))}
          </DroppableColumn>

          <DroppableColumn id="completed">
            {completedTasks.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                title={task.title}
                onDelete={handleDeleteTask}
                onComplete={() => {}}
                isCompleted={true}
              />
            ))}
          </DroppableColumn>
        </div>
      </DndContext>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.message === "Task deleted" ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
