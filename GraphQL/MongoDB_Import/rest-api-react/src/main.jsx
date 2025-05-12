import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '' });

  const loadItems = async () => {
    const response = await axios.get("http://localhost:3000/api/items");
    console.log('loadItems', response.data);
    setItems(response.data);
  };

  const addItem = async () => {
    console.log('newItem', newItem);
    const response = await axios.post("http://localhost:3000/api/items", newItem);
    setItems(prevItems => [...prevItems, response.data]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevState) => ({ ...prevState, [name]: value}));
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={loadItems}>Load Items</button>
      <div>
        <h2>Add New Item</h2>
        <input type="text"
               name="name"
               value={newItem.name}
               onChange={handleChange}
               placeholder='Item Name'
        />
        <input type="text"
               name="description"
               value={newItem.description}
               onChange={handleChange}
               placeholder='Item description'
         />
         <button onClick={addItem}>Add Item</button>
      </div>
      <div>
        <h2>Items List</h2>
        <ul>
          {
            items.map((item)=>
              <li key={item._id}>
                {item.name} - {item.description}
              </li>
            )
          }
        </ul>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AdminDashboard />);