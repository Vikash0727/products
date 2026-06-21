import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel, // New: TanStack Sorting Engine
  getFilteredRowModel, // New: TanStack Filtering Engine
  getPaginationRowModel, // New: TanStack Pagination Engine
  flexRender,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

export default function ProductTable({ products, loading, onDelete, onEdit }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const data = useMemo(() => products, [products]);

  // Columns remain matched with your database schema
  const columns = useMemo(
    () => [
      {
        header: "Category",
        accessorKey: "category",
      },
      {
        header: "Brand",
        accessorKey: "brand",
      },
      {
        header: "Model",
        accessorKey: "model",
      },
      {
        header: "Price",
        accessorKey: "price",
        cell: (info) => (
          <span className="text-emerald-400 font-medium">
            ${Number(info.getValue()).toLocaleString()}
          </span>
        ),
      },
      {
        header: "Quantity",
        accessorKey: "quantity",
        cell: (info) => (
          <span className="text-slate-300">{info.getValue()} units</span>
        ),
      },
      {
        header: "Actions",
        id: "actions", // Explicitly tells TanStack to create a new dedicated column track
        cell: ({ row }) => {
          const product = row.original;
          const productId = product._id || product.id;

          const handleConfirm = (e) => {
            e.stopPropagation(); // Prevents row sorting triggers when clicking delete

            const msg = `⚠️ Delete this item permanently?\n\nBrand: ${product.brand || "N/A"}\nModel: ${product.model || "N/A"}`;
            if (window.confirm(msg)) {
              onDelete(productId);
            }
          };

          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-600 text-indigo-400 hover:text-white transition-all text-xs font-semibold cursor-pointer"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-600 text-rose-400 hover:text-white transition-all text-xs font-semibold cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [onDelete],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Hook up sorting calculations
    getFilteredRowModel: getFilteredRowModel(), // Hook up search matchers
    getPaginationRowModel: getPaginationRowModel(), // Hook up chunk-splitting engine
    initialState: {
      pagination: {
        pageSize: 5, // Shows 5 items per index page natively
      },
    },
  });

  if (loading) {
    return (
      <div className="text-center text-slate-400 py-12 font-medium">
        Loading schema data...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* 🔍 TOP INTERACTIVE CONTROLS PANEL */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all records..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
          <span>
            Showing {table.getRowModel().rows.length} of {data.length} total
            entries
          </span>
        </div>
      </div>

      {/* 📊 THE CORE DATA TABLE */}
      <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-slate-950/60 border-b border-slate-800"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 select-none"
                  >
                    {/* Make header clickable to perform ascending / descending sorting shifts */}
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-800/30 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm text-slate-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center text-slate-500 py-12 bg-slate-900">
            No database items matched your query terms.
          </div>
        )}
      </div>

      {/* 📟 BOTTOM PAGINATION NAVIGATION BAR */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Rows per page:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">
            Page{" "}
            <span className="font-semibold text-slate-200">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-200">
              {table.getPageCount()}
            </span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
