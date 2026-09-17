"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

async function getTasks() {
  const response = await fetch("/api/tasks");

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

async function addTask(title: string) {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("Failed to add task");
  }

  return response.json();
}

async function deleteTask(id: number) {
  const response = await fetch("/api/tasks", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }

  return response.json();
}

async function editTask({ id, title }: { id: number; title: string }) {
  const response = await fetch("/api/tasks", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, title }),
  });

  if (!response.ok) {
    throw new Error("Failed to edit task");
  }

  return response.json();
}

async function markTaskAsCompleted(id: number) {
  const response = await fetch("/api/tasks", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Failed to mark task as completed");
  }

  return response.json();
}

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<number>(0);

  const resetForm = () => {
    setNewTaskTitle("");
    setEditingTask(false);
    setEditingTaskId(0);
  };

  const addMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      console.log("Task added successfully");
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: (error) => {
      console.error("Failed to add task", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      console.log("Task deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: (error) => {
      console.error("Failed to delete task", error);
    },
  });

  const markCompletedMutation = useMutation({
    mutationFn: markTaskAsCompleted,
    onSuccess: () => {
      console.log("Task marked as completed successfully");
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: (error) => {
      console.error("Failed to mark task as completed", error);
    },
  });

  const editMutation = useMutation({
    mutationFn: editTask,
    onSuccess: () => {
      console.log("Task edited successfully");
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: (error) => {
      console.error("Failed to edit task", error);
    },
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  const isSubmitting = addMutation.isPending || editMutation.isPending;

  return (
    <div>
      <h1 className="text-center mx-auto">Tasks</h1>
      <div className="flex flex-col gap-4">
        {data.tasks.map((task: any) => (
          <div key={task.id}>
            <li
              className={`text-center justify-between ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.title}
            </li>
            <button
              className="border border-white mx-6"
              onClick={() => deleteMutation.mutate(task.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
            <button
              className="border border-white mx-6"
              onClick={() => {
                setNewTaskTitle(task.title);
                setEditingTask(true);
                setEditingTaskId(task.id);
              }}
            >
              Edit
            </button>
            <button
              className="border border-white mx-6"
              onClick={() => markCompletedMutation.mutate(task.id)}
              disabled={markCompletedMutation.isPending}
            >
              Mark as Completed
            </button>
          </div>
        ))}
      </div>
      <div>
        <input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          type="text"
          placeholder="Task title"
        />
        <button
          onClick={() => {
            editingTask
              ? editMutation.mutate({ id: editingTaskId, title: newTaskTitle })
              : addMutation.mutate(newTaskTitle);
          }}
          disabled={!newTaskTitle || isSubmitting}
        >
          {editingTask
            ? editMutation.isPending
              ? "Updating..."
              : "Update"
            : addMutation.isPending
              ? "Adding..."
              : "Add Task"}
        </button>
        {editingTask && (
          <button onClick={resetForm} className="ml-2">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
