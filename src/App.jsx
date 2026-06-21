import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Navbar from "./components/Navbar";
import ProductGrid from "./components/ProductGrid";
import ProductTable from "./components/ProductTable";
import AddProductModal from "./components/AddProductModal";
import EditProductModal from "./components/EditProductModal";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // Toggles between 'grid' and 'table'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Fetch product dataset from local Express instances
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/products");
      // console.log("Backend Response Object:", response.data);
      setProducts(response.data.data);
      toast.success("Inventory state successfully loaded from MongoDB Atlas");
    } catch (error) {
      console.error("API Fetch Error: ", error);
      toast.error(
        "Network pipeline failed. Ensure localhost:5000 server is online.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (newProductData) => {
    try {
      // Send POST request with data matching fields: category, brand, model, price, quantity
      const response = await axios.post(
        "http://localhost:5000/products",
        newProductData,
      );

      // Check if your backend wraps response in an envelope like { success: true, data: ... }
      const newlyCreatedItem = response.data.data || response.data;

      // Append the newly created item directly into state so the UI updates automatically
      setProducts((prevProducts) => [...prevProducts, newlyCreatedItem]);

      toast.success("Product successfully added to MongoDB Atlas!");
      return true; // Returns true to tell the modal it can close safely
    } catch (error) {
      console.error("Create Product Error:", error);
      toast.error(
        "Failed to add product. Verify data payloads or server state.",
      );
      return false;
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      // Fire DELETE request to your express endpoint
      await axios.delete(`http://localhost:5000/products/${id}`);

      // Optimistically update frontend state immediately so it disappears from the table
      setProducts((prevProducts) =>
        prevProducts.filter((item) => (item._id || item.id) !== id),
      );

      toast.success("Product successfully erased from MongoDB Atlas");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete product. Server might be unreachable.");
    }
  };

  const handleUpdateProduct = async (id, updatedData) => {
    try {
      // Fires client update call straight to Express routing tracks
      // Using PUT here (change to axios.patch if your route demands PATCH)
      const response = await axios.put(
        `http://localhost:5000/products/${id}`,
        updatedData,
      );

      const payload = response.data.data || response.data;

      // Swap out the old tracking index matching modifications seamlessly
      setProducts((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id ? { ...item, ...payload } : item,
        ),
      );

      toast.success("Product entry modified successfully on Atlas");
      return true;
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Could not modify entry records on server.");
      return false;
    }
  };
  const triggerEditFlow = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Dynamic Toast Frame container */}
      <Toaster position="top-right" theme="dark" closeButton richColors />

      {/* Shared Modular Navigation Control Element */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddClick={() => {
          setIsModalOpen(true);
        }}
      />
      {/* Conditionally managed layout wrapper panels */}
      <main className="max-w-7xl mx-auto py-4">
        {viewMode === "grid" ? (
          // 👇 CONNECT GRID CONTROLS HERE
          <ProductGrid
            products={products}
            loading={loading}
            onDelete={handleDeleteProduct}
            onEdit={triggerEditFlow}
          />
        ) : (
          // 👇 CONNECT TABLE CONTROLS HERE
          <ProductTable
            products={products}
            loading={loading}
            onDelete={handleDeleteProduct}
            onEdit={triggerEditFlow}
          />
        )}
      </main>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onUpdate={handleUpdateProduct}
      />
    </div>
  );
}
