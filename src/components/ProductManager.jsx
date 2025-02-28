import { useState, useEffect } from "react";
import "./ProductManager.css"; // Import the CSS file

export default function ProductManager() {
  const API_URL = "https://appsail-50024000807.development.catalystappsail.in/";

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    keyword: "",
    image_url1: "",
    image_url2: "",
    image_url3: "",
    image_url4: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for CRUD operations

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(API_URL + "products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Add or update product
  const handleSubmit = async () => {
    setLoading(true); // Start loading
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `https://jasandyas-backend.onrender.com/products/${editingId}`
      : "https://jasandyas-backend.onrender.com/products";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        fetchProducts(); // Refresh the product list
        setNewProduct({
          name: "",
          brand: "",
          price: "",
          category: "",
          keyword: "",
          image_url1: "",
          image_url2: "",
          image_url3: "",
          image_url4: "",
        });
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Edit a product
  const handleEdit = (product) => {
    setNewProduct(product);
    setEditingId(product.id);
  };

  // Delete a product
  const handleDelete = async (id) => {
    setLoading(true); // Start loading
    try {
      await fetch(`https://jasandyas-backend.onrender.com/products/${id}`, {
        method: "DELETE",
      });
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container">
      <h2>Product Management</h2>
      <br />
      <br />
      <div className="form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleInputChange}
        />{" "}
        <br />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={newProduct.brand}
          onChange={handleInputChange}
        />{" "}
        <br />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
        />{" "}
        <br />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleInputChange}
        />{" "}
        <br />
        <input
          type="text"
          name="keyword"
          placeholder="Keywords"
          value={newProduct.keyword}
          onChange={handleInputChange}
        />{" "}
        <br />
        <input
          type="text"
          name="image_url1"
          placeholder="Image URL 1"
          value={newProduct.image_url1}
          onChange={handleInputChange}
        />{" "}
        <br />
        <input
          type="text"
          name="image_url2"
          placeholder="Image URL 2"
          value={newProduct.image_url2}
          onChange={handleInputChange}
        />{" "}
        <br />
        <input
          type="text"
          name="image_url3"
          placeholder="Image URL 3"
          value={newProduct.image_url3}
          onChange={handleInputChange}
        />{" "}
        <br />
        <input
          type="text"
          name="image_url4"
          placeholder="Image URL 4"
          value={newProduct.image_url4}
          onChange={handleInputChange}
        />{" "}
        <br />
        <br />
        <button onClick={handleSubmit} disabled={loading}>
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      {loading && <div className="loader">Loading...</div>} {/* Show loader during CRUD operations */}

      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image_url1} alt={product.name} />
            <div>
              <h3>{product.name}</h3>
              <p>
                <b>Brand:</b> {product.brand}
              </p>
              <p>
                <b>Price:</b> ₹{product.price}
              </p>
              <p>
                <b>Category:</b> {product.category}
              </p>
              <p>
                <b>Keywords:</b> {product.keyword}
              </p>
            </div>
            <div className="buttons">
              <button
                className="edit"
                onClick={() => handleEdit(product)}
                disabled={loading}
              >
                Edit
              </button>
              <button
                className="delete"
                onClick={() => handleDelete(product.id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}