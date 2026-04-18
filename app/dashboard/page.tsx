"use client";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useUser } from "@clerk/nextjs";

type HABIT = {
  id: number;
  title: string;
  description: string | null;
  completedToday: boolean;
};

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [habits, setHabits] = useState<HABIT[]>([]);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function getTodayLocalDate(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // "2026-04-18"
  }

  async function AddHabitLog(habitId: number, completed: boolean) {
    // 1. Update UI immediately
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, completedToday: completed } : h,
      ),
    );

    // 2. Sync with server in background
    try {
      await fetch(`/api/habits/${habitId}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed,
          date: getTodayLocalDate(),
        }),
      });
    } catch {
      // 3. If it fails, revert back
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId ? { ...h, completedToday: !completed } : h,
        ),
      );
    }
  }

  async function handleAddHabit() {
    await fetch("/api/habits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    FetchHabit();
  }

  async function FetchHabit() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/habits/today");
      if (!response.ok) throw new Error("Failed to load habits");
      const data: HABIT[] = await response.json();
      setHabits(data);
    } catch {
      setError("Could not load your habits. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  async function DeleteHabit(id: number) {
    await fetch("/api/habits", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    FetchHabit();
  }

  useEffect(() => {
    FetchHabit();
  }, []);

  return (
    <main className="max-w-xl mx-auto p-8">
      <div>Hello {user?.firstName} </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">My Habits</h1>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={handleAddHabit} label="Add Habit" />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3">Today Habits</h2>
        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading your habits...</p>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-red-500 mb-3">{error}</p>
            <button
              onClick={FetchHabit}
              className="text-sm text-blue-500 underline"
            >
              Try again
            </button>
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-lg mb-1">No habits yet!</p>
            <p className="text-sm">
              Add your first habit above to get started.
            </p>
          </div>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className={`flex items-center border rounded p-3 mb-2 ${
                habit.completedToday
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={habit.completedToday}
                onChange={(e) => AddHabitLog(habit.id, e.target.checked)}
              />
              <div className="flex flex-col flex-1">
                <span
                  className={`font-medium ${habit.completedToday ? "line-through text-gray-400" : ""}`}
                >
                  {habit.title}
                </span>

                {habit.description && (
                  <span className="text-gray-500 text-sm">
                    {habit.description}
                  </span>
                )}
              </div>
              <button
                onClick={() => DeleteHabit(habit.id)}
                className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600"
              >
                DELETE
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
