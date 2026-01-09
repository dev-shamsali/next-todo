"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  async function loadTodos() {
    const res = await axios.get("/api/todos");
    setTodos(res.data);
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    await axios.post("/api/todos", { title });
    setTitle("");
    setLoading(false);
    loadTodos();
  }

  async function toggleTodo(id, completed) {
    await axios.patch(`/api/todos/${id}`, { completed });
    loadTodos();
  }

  async function deleteTodo(id) {
    await axios.delete(`/api/todos/${id}`);
    loadTodos();
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  }

  async function saveEdit(id) {
    if (!editTitle.trim()) return;
    await axios.patch(`/api/todos/${id}`, { title: editTitle });
    setEditingId(null);
    setEditTitle("");
    loadTodos();
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
  }

  useEffect(() => {
    loadTodos();
  }, []);

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            My Tasks
          </h1>
          <p className="text-gray-600 text-lg">
            {totalCount === 0
              ? "Start your productive day ✨"
              : `${completedCount} of ${totalCount} completed`}
          </p>
        </div>

        {/* Add Todo Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-6 mb-6 border border-white/20">
          <form onSubmit={addTodo} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 bg-white/80 text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind?"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </span>
              ) : (
                "Add Task"
              )}
            </button>
          </form>
        </div>

        {/* Todo List */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 overflow-hidden">
          {todos.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-400 text-lg">No tasks yet</p>
              <p className="text-gray-300 text-sm mt-2">
                Add your first task above to get started
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {todos.map((todo, index) => {
                const isEditing = editingId === todo.id;

                return (
                  <li
                    key={todo.id}
                    className="group hover:bg-indigo-50/50 transition-all duration-200"
                    style={{
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`,
                    }}
                  >
                    <div className="flex items-center gap-4 px-6 py-5">
                      {/* Checkbox */}
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={(e) =>
                            toggleTodo(todo.id, e.target.checked)
                          }
                          className="w-6 h-6 rounded-full border-2 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer transition-all"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full border-2 border-indigo-300 rounded-xl px-4 py-2 text-gray-900 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                            autoFocus
                          />
                        ) : (
                          <span
                            className={`text-base block transition-all duration-200 ${todo.completed
                                ? "line-through text-gray-400"
                                : "text-gray-800 font-medium"
                              }`}
                          >
                            {todo.title}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(todo.id)}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(todo)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteTodo(todo.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg
                                className="w-5 h-5 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Progress Bar (optional) */}
        {totalCount > 0 && (
          <div className="mt-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-5 border border-white/20">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span className="font-semibold">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(completedCount / totalCount) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
