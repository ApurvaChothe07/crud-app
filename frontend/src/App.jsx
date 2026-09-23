import { useEffect, useState } from "react";
import API from "./services/api";
import "./App.css";

function App() {

    const [users, setUsers] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "",
        salary: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await API.get("/users");
            setUsers(response.data);
        } catch (error) {
            console.error(error);
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };


    // Fetch users when page loads
    useEffect(() => {
        fetchUsers();
    }, []);


    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    // Edit user
    const handleEdit = (user) => {

        setEditingId(user.id);

        setFormData({
            name: user.name,
            email: user.email,
            department: user.department,
            salary: user.salary
        });

        setError("");
        setSuccess("");
    };


    // Delete user
    const handleDelete = async (id) => {

        try {

            await API.delete(`/users/${id}`);

            setSuccess("User deleted successfully.");
            setError("");

            fetchUsers();

        } catch (error) {

            console.error(error);
            setError("Failed to delete user.");
            setSuccess("");
        }
    };


    // Create or update user
    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            if (editingId === null) {

                // Create user
                await API.post("/users", {
                    name: formData.name,
                    email: formData.email,
                    department: formData.department,
                    salary: Number(formData.salary)
                });

                setSuccess("User added successfully.");

            } else {

                // Update user
                await API.put(`/users/${editingId}`, {
                    name: formData.name,
                    email: formData.email,
                    department: formData.department,
                    salary: Number(formData.salary)
                });

                setSuccess("User updated successfully.");

                setEditingId(null);
            }


            // Clear form
            setFormData({
                name: "",
                email: "",
                department: "",
                salary: ""
            });

            setError("");

            // Refresh users
            fetchUsers();

        } catch (error) {

            console.error(error);
            setError("Failed to save user.");
            setSuccess("");
        }
    };


    // Cancel editing
    const handleCancel = () => {

        setEditingId(null);

        setFormData({
            name: "",
            email: "",
            department: "",
            salary: ""
        });

        setError("");
    };


    if (loading) {
        return <h2>Loading users...</h2>;
    }


    return (

        <div className="container">

            <h1>User Management System</h1>


            {/* Form */}

            <div className="form-container">

                <h2>
                    {editingId === null ? "Add User" : "Edit User"}
                </h2>


                {error && (
                    <p className="error">{error}</p>
                )}

                {success && (
                    <p className="success">{success}</p>
                )}


                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Department</label>

                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Salary</label>

                        <input
                            type="number"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="submit-btn"
                    >
                        {editingId === null
                            ? "Add User"
                            : "Update User"}
                    </button>


                    {editingId !== null && (

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>

                    )}

                </form>

            </div>


            {/* Users Table */}

            <h2>Users</h2>


            {users.length === 0 ? (

                <p>No users found.</p>

            ) : (

                <table>

                    <thead>

                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Actions</th>
                    </tr>

                    </thead>


                    <tbody>

                    {users.map((user) => (

                        <tr key={user.id}>

                            <td>{user.id}</td>

                            <td>{user.name}</td>

                            <td>{user.email}</td>

                            <td>{user.department}</td>

                            <td>₹{user.salary}</td>

                            <td>

                                <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(user)}
                                >
                                    Edit
                                </button>


                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}

export default App;