import React from "react";
import { LayoutGrid, TableProperties, Package, Plus } from "lucide-react"; // Added Plus icon

export default function Navbar({ viewMode, setViewMode, onAddClick }) {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-indigo-400" />
        <span className="text-xl font-bold text-white tracking-wide">
          AdminDashboard
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* 👇 NEW TRIGGER ACTION BUTTON FOR CORE CREATION */}
        <button
          onClick={onAddClick}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>

        <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === "grid"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Grid View
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === "table"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TableProperties className="h-4 w-4" />
            Table View
          </button>
        </div>
      </div>
    </nav>
  );
}
