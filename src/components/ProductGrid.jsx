import React from "react";
import {
  Layers,
  Tag,
  ShieldCheck,
  DollarSign,
  Archive,
  Edit3,
  Trash2,
} from "lucide-react";

export default function ProductGrid({ products, loading, onDelete, onEdit }) {
  if (loading) {
    return (
      <div className="text-center text-slate-400 py-12 font-medium">
        Loading schema data...
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-slate-500 py-12">
        No products found in Atlas database.
      </div>
    );
  }

  // 👇 MOVED: Dedicated handler function outside the loop for correct scoping bounds
  const triggerDelete = (product) => {
    const productId = product._id || product.id;
    const msg = `⚠️ Delete this item permanently?\n\nBrand: ${product.brand || "N/A"}\nModel: ${product.model || "N/A"}`;

    if (window.confirm(msg)) {
      onDelete(productId);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => {
        const productId = product._id || product.id;

        return (
          <div
            key={productId}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-slate-800 text-indigo-400 text-xs px-2.5 py-1 rounded-full font-semibold uppercase flex items-center gap-1">
                  <Layers className="h-3 w-3" /> {product.category}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
                    product.quantity > 5
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  <Archive className="h-3 w-3" /> Stock: {product.quantity}
                </span>
              </div>

              <h3 className="text-white font-bold text-lg tracking-tight flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-slate-500" /> {product.brand}
              </h3>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-slate-500" />{" "}
                {product.model}
              </p>
            </div>

            <div className="border-t border-slate-800/80 mt-5 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-xs font-medium uppercase">
                  Retail Price
                </span>
                <span className="text-xl font-extrabold text-emerald-400 flex items-center">
                  <DollarSign className="h-5 w-5" />
                  {Number(product.price).toLocaleString()}
                </span>
              </div>

              {/* Grid Interactive Action Row */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/40">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-600 text-indigo-400 hover:text-white transition-all text-xs font-semibold cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => triggerDelete(product)} // 👈 Maps cleanly to the defined handler
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-600 text-rose-400 hover:text-white transition-all text-xs font-semibold cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
