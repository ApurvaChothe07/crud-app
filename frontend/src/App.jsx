import { useEffect, useState, useMemo } from "react";
import API from "./services/api";
import "./App.css";

// Helper for department badge color theme
const getDeptTheme = (dept = "") => {
  const d = dept.toLowerCase();
  if (d.includes("eng") || d.includes("dev")) return "dept-indigo";
  if (d.includes("product") || d.includes("pm")) return "dept-amber";
  if (d.includes("cloud") || d.includes("ops") || d.includes("sys")) return "dept-purple";
  if (d.includes("hr") || d.includes("human") || d.includes("people")) return "dept-rose";
  if (d.includes("fin") || d.includes("account") || d.includes("pay")) return "dept-emerald";
  return "dept-cyan";
};

// Helper for initials
const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (name.slice(0, 2) || "U").toUpperCase();
};

// Currency formatter
const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(num);
};

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    salary: ""
  });

  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 4500);
  };

  // Fetch users from API
  const fetchUsers = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const response = await API.get("/users");
      setUsers(Array.isArray(response.data) ? response.data : []);
      if (isManual) showToast("Database records synced successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch records from backend. Render service might be waking up.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set();
    users.forEach((u) => {
      if (u.department && u.department.trim()) {
        set.add(u.department.trim());
      }
    });
    return Array.from(set);
  }, [users]);

  // Filtered users based on search & department
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.department || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === "ALL" || u.department === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [users, searchTerm, selectedDept]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalPayroll = users.reduce((sum, u) => sum + (Number(u.salary) || 0), 0);
    const avgSalary = totalUsers > 0 ? Math.round(totalPayroll / totalUsers) : 0;
    const totalDepts = departments.length;
    return { totalUsers, totalPayroll, avgSalary, totalDepts };
  }, [users, departments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Form for Create
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", department: "", salary: "" });
    setShowForm(true);
  };

  // Open Form for Edit
  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      department: user.department || "",
      salary: user.salary || ""
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel Form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", email: "", department: "", salary: "" });
  };

  // Submit Form (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast("Name and email are required fields.", "error");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      salary: Number(formData.salary) || 0
    };

    try {
      if (editingId === null) {
        await API.post("/users", payload);
        showToast(`Employee "${payload.name}" added successfully!`, "success");
      } else {
        await API.put(`/users/${editingId}`, payload);
        showToast(`Record for "${payload.name}" updated successfully!`, "success");
      }
      handleCancelForm();
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("Failed to save employee. Ensure email is unique.", "error");
    }
  };

  // Trigger Delete Confirmation
  const confirmDelete = (user) => {
    setDeleteTarget(user);
  };

  // Execute Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/users/${deleteTarget.id}`);
      showToast(`User "${deleteTarget.name}" deleted successfully.`, "success");
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete user record.", "error");
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {toast.message && (
        <div className={`toast-banner toast-${toast.type}`}>
          <span className="toast-icon">{toast.type === "success" ? "✓" : "!"}</span>
          <span className="toast-text">{toast.message}</span>
          <button className="toast-close" onClick={() => setToast({ message: "", type: "" })}>
            ✕
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
              </svg>
            </div>
            <h3>Delete Employee?</h3>
            <p>
              Are you sure you want to remove <strong>{deleteTarget.name}</strong> ({deleteTarget.email})? This action will permanently remove the record from TiDB Cloud.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="navbar">
        <div className="nav-container">
          <div className="brand">
            <div className="brand-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div>
              <span className="brand-title">StaffPulse</span>
              <span className="brand-sub">Full-Stack Enterprise CRUD Engine</span>
            </div>
          </div>

          <div className="nav-actions">
            <div className="status-indicator">
              <span className="pulse-dot"></span>
              <span className="status-label">Production Live</span>
            </div>
            <button
              className={`btn btn-icon ${refreshing ? "spinning" : ""}`}
              onClick={() => fetchUsers(true)}
              title="Sync with TiDB Cloud database"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              <span>Sync</span>
            </button>
            <button className="btn btn-primary" onClick={handleAddNew}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>Add Employee</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Metric Cards Row */}
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Total Staff</span>
              <span className="metric-icon-wrap icon-indigo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </span>
            </div>
            <div className="metric-val">{stats.totalUsers}</div>
            <div className="metric-sub">Active registered records</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Departments</span>
              <span className="metric-icon-wrap icon-cyan">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
                </svg>
              </span>
            </div>
            <div className="metric-val">{stats.totalDepts}</div>
            <div className="metric-sub">Functional divisions</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Total Payroll</span>
              <span className="metric-icon-wrap icon-emerald">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </span>
            </div>
            <div className="metric-val">{formatCurrency(stats.totalPayroll)}</div>
            <div className="metric-sub">Monthly allocated budget</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Avg. Compensation</span>
              <span className="metric-icon-wrap icon-purple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </span>
            </div>
            <div className="metric-val">{formatCurrency(stats.avgSalary)}</div>
            <div className="metric-sub">Per employee average</div>
          </div>
        </section>

        {/* Collapsible Form Section */}
        {showForm && (
          <section className="form-section">
            <div className="card form-card">
              <div className="form-card-header">
                <div>
                  <h2>{editingId === null ? "Add New Employee" : "Edit Employee Details"}</h2>
                  <p className="form-subtext">
                    {editingId === null
                      ? "Create a new employee profile to store in TiDB Cloud."
                      : `Updating existing record (ID: #${editingId}).`}
                  </p>
                </div>
                <button className="btn-close" onClick={handleCancelForm} title="Close form">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="form-grid">
                <div className="input-group">
                  <label htmlFor="name">Full Name *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="e.g. Apurva Chothe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="email">Work Email *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">✉️</span>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="e.g. apurva@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="department">Department</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🏢</span>
                    <input
                      id="department"
                      type="text"
                      name="department"
                      placeholder="e.g. Engineering, DevOps, HR"
                      value={formData.department}
                      onChange={handleInputChange}
                      list="dept-options"
                      required
                    />
                    <datalist id="dept-options">
                      <option value="Engineering" />
                      <option value="DevOps & Cloud" />
                      <option value="Product Management" />
                      <option value="Human Resources" />
                      <option value="Finance & Analytics" />
                    </datalist>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="salary">Annual Salary (INR ₹) *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">₹</span>
                    <input
                      id="salary"
                      type="number"
                      name="salary"
                      placeholder="e.g. 95000"
                      value={formData.salary}
                      onChange={handleInputChange}
                      min="0"
                      step="1000"
                      required
                    />
                  </div>
                </div>

                <div className="form-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCancelForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId === null ? "Save Employee" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Directory Controls (Search & Filter) */}
        <section className="directory-header">
          <div className="search-filter-bar">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search staff by name, email, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}>
                  ✕
                </button>
              )}
            </div>

            <div className="filter-box">
              <label htmlFor="dept-select">Department:</label>
              <select
                id="dept-select"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="ALL">All Departments ({users.length})</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Directory Table Card */}
        <section className="card table-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <h3>Connecting to Cloud Backend...</h3>
              <p>Fetching records from Spring Boot & TiDB Cloud. Free-tier servers may take a moment to wake up.</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <h3>No matching employees found</h3>
              <p>
                {searchTerm || selectedDept !== "ALL"
                  ? "Try adjusting your search criteria or filter options."
                  : "No employee records exist in the database yet. Click 'Add Employee' to create one."}
              </p>
              {(searchTerm || selectedDept !== "ALL") && (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDept("ALL");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email Address</th>
                    <th>Department</th>
                    <th>Compensation</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="table-row">
                      <td className="cell-employee">
                        <div className="avatar">{getInitials(user.name)}</div>
                        <div className="employee-info">
                          <span className="employee-name">{user.name}</span>
                          <span className="employee-id">ID: #{user.id}</span>
                        </div>
                      </td>
                      <td className="cell-email">
                        <span className="email-link">{user.email}</span>
                      </td>
                      <td>
                        <span className={`dept-badge ${getDeptTheme(user.department)}`}>
                          {user.department || "General"}
                        </span>
                      </td>
                      <td className="cell-salary">
                        <strong>{formatCurrency(user.salary)}</strong>
                      </td>
                      <td className="cell-actions">
                        <button
                          className="btn-action btn-action-edit"
                          onClick={() => handleEdit(user)}
                          title="Edit employee"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          className="btn-action btn-action-delete"
                          onClick={() => confirmDelete(user)}
                          title="Delete employee"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 StaffPulse • Full-Stack CRUD Application by Apurva Chothe</p>
          <div className="tech-pills">
            <span className="tech-pill">React 19</span>
            <span className="tech-pill">Vite</span>
            <span className="tech-pill">Spring Boot 3</span>
            <span className="tech-pill">Docker</span>
            <span className="tech-pill">TiDB Cloud MySQL</span>
            <span className="tech-pill">Render</span>
            <span className="tech-pill">Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
