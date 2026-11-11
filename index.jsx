
import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function App() {

  const [menu, setMenu] = useState([
    { id: 1, name: "Veg Biryani", price: 150 },
    { id: 2, name: "Chicken Biryani", price: 200 },
    { id: 3, name: "Pizza", price: 180 },
    { id: 4, name: "Masala Dosa", price: 80 }
  ]);

  const [orders, setOrders] = useState([]);
  const [food, setFood] = useState("");
  const [price, setPrice] = useState("");
  const [customer, setCustomer] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [page, setPage] = useState("Home");

  function addFood() {
    if (!food || !price) {
      alert("Enter food details");
      return;
    }

    setMenu([...menu, {
      id: Date.now(),
      name: food,
      price: Number(price)
    }]);

    setFood("");
    setPrice("");
  }

  function deleteFood(id) {
    setMenu(menu.filter(item => item.id !== id));
  }

  function placeOrder() {
    const item = menu.find(
      item => item.name === selectedFood
    );

    if (!customer || !item) {
      alert("Enter customer name and select food");
      return;
    }

    setOrders([...orders, {
      id: Date.now(),
      customer: customer,
      item: item.name,
      price: item.price,
      status: "Preparing"
    }]);

    setCustomer("");
    setSelectedFood("");
    alert("Order placed successfully!");
  }

  function completeOrder(id) {
    setOrders(orders.map(order =>
      order.id === id
        ? { ...order, status: "Completed" }
        : order
    ));
  }

  const sales = orders.reduce(
    (total, order) => total + order.price, 0
  );

  return (
    <div style={{
      fontFamily: "Arial",
      background: "#f4f1e9",
      minHeight: "100vh"
    }}>

      <header style={{
        background: "#263d32",
        color: "white",
        textAlign: "center",
        padding: "25px"
      }}>
        <h1>🍽️ Fork & Fable</h1>
        <p>Restaurant Management System</p>
      </header>

      <nav style={{
        background: "#354f40",
        padding: "15px",
        textAlign: "center"
      }}>
        {["Home", "Menu", "Order", "Orders"].map(item => (
          <button
            key={item}
            onClick={() => setPage(item)}
            style={{
              padding: "12px 22px",
              margin: "5px",
              background: "#e6aa72",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      <main style={{
        maxWidth: "850px",
        margin: "30px auto",
        padding: "15px"
      }}>

        {page === "Home" && (
          <>
            <h2>Welcome to Our Restaurant!</h2>

            <div className="card">
              <h3>Total Food Items</h3>
              <h1>{menu.length}</h1>
            </div>

            <div className="card">
              <h3>Total Orders</h3>
              <h1>{orders.length}</h1>
            </div>

            <div className="card">
              <h3>Total Sales</h3>
              <h1>₹{sales}</h1>
            </div>
          </>
        )}

        {page === "Menu" && (
          <>
            <h2>Food Menu Management</h2>

            <div className="card">
              <h3>Add New Food</h3>

              <input
                placeholder="Food Name"
                value={food}
                onChange={e => setFood(e.target.value)}
              />

              <input
                type="number"
                placeholder="Food Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />

              <button onClick={addFood}>
                Add Food
              </button>
            </div>

            <div className="card">
              {menu.map(item => (
                <p key={item.id}>
                  {item.name} - ₹{item.price}

                  <button onClick={() => deleteFood(item.id)}>
                    Delete
                  </button>
                </p>
              ))}
            </div>
          </>
        )}

        {page === "Order" && (
          <div className="card">
            <h2>Place New Order</h2>

            <input
              placeholder="Customer Name"
              value={customer}
              onChange={e => setCustomer(e.target.value)}
            />

            <select
              value={selectedFood}
              onChange={e => setSelectedFood(e.target.value)}
            >
              <option value="">Select Food</option>

              {menu.map(item => (
                <option key={item.id} value={item.name}>
                  {item.name} - ₹{item.price}
                </option>
              ))}
            </select>

            <button onClick={placeOrder}>
              Place Order
            </button>
          </div>
        )}

        {page === "Orders" && (
          <div className="card">
            <h2>Customer Orders</h2>

            {orders.length === 0 && (
              <p>No orders available</p>
            )}

            {orders.map(order => (
              <div key={order.id}>
                <h3>{order.customer}</h3>
                <p>{order.item} - ₹{order.price}</p>
                <p>Status: {order.status}</p>

                {order.status === "Preparing" && (
                  <button onClick={() => completeOrder(order.id)}>
                    Complete Order
                  </button>
                )}

                <hr />
              </div>
            ))}
          </div>
        )}

      </main>

      <footer style={{
        background: "#263d32",
        color: "white",
        textAlign: "center",
        padding: "20px"
      }}>
        <h3>Fork & Fable Restaurant</h3>
        <p>Thank You for Visiting!</p>
        <p>© 2026 Restaurant Management System</p>
      </footer>

      <style>{`
        .card {
          background: white;
          padding: 20px;
          margin: 15px 0;
          border-radius: 10px;
          box-shadow: 0 3px 10px #ddd;
        }

        input, select {
          display: block;
          width: 95%;
          padding: 12px;
          margin: 12px 0;
        }

        button {
          padding: 10px 15px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
          background: #304c3b;
          color: white;
          margin: 5px;
        }
      `}</style>

    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
