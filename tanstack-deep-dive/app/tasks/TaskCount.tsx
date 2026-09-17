"use client";

import { useQuery } from "@tanstack/react-query";

async function getTasks() {
  const response = await fetch("/api/tasks");

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

export function TaskCount() {
  const { data, isPending } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  if (isPending) return <p>Loading count...</p>;

  return <p>Total tasks: {data.tasks.length}</p>;
}
