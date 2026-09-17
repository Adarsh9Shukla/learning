import { NextResponse } from "next/server";

const tasks = [
  {
    id: 1,
    title: "Learn TanStack Query",
    completed: false,
  },
  {
    id: 2,
    title: "Build a project",
    completed: false,
  },
  {
    id: 3,
    title: "Understand caching",
    completed: false,
  },
];

export async function GET() {
  return NextResponse.json({
    tasks,
    tasksLength: tasks.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newTask = {
      id: tasks.length + 1,
      title: body.title,
      completed: false,
    };

    tasks.push(newTask);

    return NextResponse.json({
      task: newTask,
      tasksLength: tasks.length,
    });
  } catch {
    return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = body.id;

    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const [deletedTask] = tasks.splice(index, 1);

    return NextResponse.json({
      task: deletedTask,
      tasks,
      tasksLength: tasks.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = body.id;

    const task = tasks.find((task) => task.id === id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    task.completed = !task.completed;

    return NextResponse.json({
      task,
      tasksLength: tasks.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to mark task as completed" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const id = body.id;
    const newTitle = body.title;

    const task = tasks.find((task) => task.id === id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    task.title = newTitle;

    return NextResponse.json({
      task,
      tasksLength: tasks.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update task title" },
      { status: 500 },
    );
  }
}
