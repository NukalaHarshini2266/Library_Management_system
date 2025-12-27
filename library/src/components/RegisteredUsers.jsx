
import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("ALL");
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentRole = currentUser?.role || "USER";

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, nameSearch, emailSearch, roleSearch]);

  const fetchUsers = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    api.get("/api/users", {
      headers: { 'Authorization': token }
    })
    .then((res) => {
      setUsers(res.data);
      setFilteredUsers(res.data);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
      alert("Failed to fetch users");
    });
  };

  const filterUsers = () => {
    let filtered = [...users];
    if (nameSearch) filtered = filtered.filter(user => 
      user.name?.toLowerCase().includes(nameSearch.toLowerCase())
    );
    if (emailSearch) filtered = filtered.filter(user => 
      user.email?.toLowerCase().includes(emailSearch.toLowerCase())
    );
    if (roleSearch !== "ALL") filtered = filtered.filter(user => user.role === roleSearch);
    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setNameSearch("");
    setEmailSearch("");
    setRoleSearch("ALL");
    setNewUser({ name: "", email: "", password: "", role: "USER" });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    api.post("/api/users/register", newUser, {
      headers: { 'Authorization': token, 'role': currentRole }
    })
    .then(() => {
      alert("User added successfully");
      setNewUser({ name: "", email: "", password: "", role: "USER" });
      fetchUsers();
    })
    .catch(() => alert("Failed to add user"));
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Delete user ${user.name}?`)) {
      const token = localStorage.getItem("token");
      api.delete(`/api/users/${user.id}`, {
        headers: { 'Authorization': token, 'role': currentRole }
      })
      .then(() => {
        alert("User deleted successfully");
        fetchUsers();
      })
      .catch(() => alert("Failed to delete user"));
    }
  };

  const canAddUser = () => {
    return currentRole === "ADMIN" || currentRole === "LIBRARIAN";
  };

  const canDeleteUser = (user) => {
    if (user.role === "ADMIN") return false;
    if (currentRole === "USER") return false;
    if (currentRole === "LIBRARIAN" && user.role !== "USER") return false;
    return true;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
      padding: "20px 0"
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-dark fw-bold mb-0">Registered Users</h2>
          <div className="text-muted">
            <small>Total: {users.length} | Filtered: {filteredUsers.length}</small>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="row mb-3">
          <div className="col-md-3 mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{
                background: "linear-gradient(45deg, #cbb279, #8c6239)",
                color: "white",
                border: "none"
              }}>👤</span>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                style={{
                  border: "none",
                  background: "rgba(255, 255, 255, 0.9)"
                }}
              />
            </div>
          </div>
          
          <div className="col-md-3 mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{
                background: "linear-gradient(45deg, #cbb279, #8c6239)",
                color: "white",
                border: "none"
              }}>✉️</span>
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
                style={{
                  border: "none",
                  background: "rgba(255, 255, 255, 0.9)"
                }}
              />
            </div>
          </div>
          
          <div className="col-md-3 mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{
                background: "linear-gradient(45deg, #cbb279, #8c6239)",
                color: "white",
                border: "none"
              }}>🏷️</span>
              <select
                className="form-control"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                style={{
                  border: "none",
                  background: "rgba(255, 255, 255, 0.9)",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%238c6239' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "16px 12px",
                  paddingRight: "2.5rem"
                }}
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="LIBRARIAN">Librarian</option>
                <option value="USER">User</option>
              </select>
            </div>
          </div>
          
          <div className="col-md-3 mb-2 d-flex justify-content-end">
            <button 
              className="btn btn-light me-2"
              onClick={clearFilters}
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "none",
                color: "#8c6239",
                fontWeight: "bold"
              }}
            >
              Clear
            </button>
            <button 
              className="btn"
              onClick={fetchUsers}
              style={{
                background: "linear-gradient(45deg, #cbb279, #8c6239)",
                border: "none",
                color: "white",
                fontWeight: "bold"
              }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Add User Form */}
        {canAddUser() && (
          <div className="row mb-4" style={{
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "10px",
            padding: "15px",
            border: "1px solid rgba(203, 178, 121, 0.5)"
          }}>
            <h5 className="mb-3" style={{ color: "#8c6239" }}>Add New User</h5>
            <form onSubmit={handleAddUser} className="row">
              <div className="col-md-3 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                  style={{
                    border: "1px solid #cbb279",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.9)"
                  }}
                />
              </div>
              
              <div className="col-md-3 mb-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                  style={{
                    border: "1px solid #cbb279",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.9)"
                  }}
                />
              </div>
              
              <div className="col-md-2 mb-2">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                  style={{
                    border: "1px solid #cbb279",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.9)"
                  }}
                />
              </div>
              
              <div className="col-md-2 mb-2">
                <select
                  className="form-control"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  style={{
                    border: "1px solid #cbb279",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.9)",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%238c6239' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "16px 12px",
                    paddingRight: "2.5rem"
                  }}
                >
                  {currentRole === "ADMIN" ? (
                    <>
                      <option value="USER">User</option>
                      <option value="LIBRARIAN">Librarian</option>
                      <option value="ADMIN">Admin</option>
                    </>
                  ) : (
                    <option value="USER">User</option>
                  )}
                </select>
              </div>
              
              <div className="col-md-2 mb-2">
                <button 
                  type="submit"
                  className="btn w-100"
                  style={{
                    background: "linear-gradient(45deg, #cbb279, #8c6239)",
                    border: "none",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "8px"
                  }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-dark">Loading users...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="table-responsive rounded-3" style={{
            background: "rgba(255, 255, 255, 0.9)",
            border: "2px solid rgba(203, 178, 121, 0.3)"
          }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th style={{ padding: "12px", color: "brown" }}>ID</th>
                  <th style={{ padding: "12px", color: "brown" }}>Name</th>
                  <th style={{ padding: "12px", color: "brown" }}>Email</th>
                  <th style={{ padding: "12px", color: "brown" }}>Role</th>
                  <th style={{ padding: "12px", color: "brown" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} style={{
                    background: index % 2 === 0 ? "rgba(255, 255, 255, 0.7)" : "rgba(245, 230, 202, 0.5)"
                  }}>
                    <td style={{ padding: "10px" }}>{user.id}</td>
                    <td style={{ padding: "10px" }}>{user.name}</td>
                    <td style={{ padding: "10px" }}>{user.email}</td>
                    <td style={{ padding: "10px" }}>
                      <span style={{
                        background: user.role === "ADMIN" ? "linear-gradient(45deg, #dc3545, #c82333)" :
                                   user.role === "LIBRARIAN" ? "linear-gradient(45deg, #0d6efd, #0b5ed7)" :
                                   "linear-gradient(45deg, #cbb279, #8c6239)",
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: "15px",
                        fontSize: "0.8rem"
                      }}>
                        {user.role || "USER"}
                      </span>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <button
                        className="btn btn-sm"
                        onClick={() => canDeleteUser(user) && handleDeleteUser(user)}
                        disabled={!canDeleteUser(user)}
                        style={{
                          borderRadius: "15px",
                          padding: "4px 12px",
                          fontSize: "0.8rem",
                          border: !canDeleteUser(user) ? "1px solid #999" : "1px solid #dc3545",
                          color: !canDeleteUser(user) ? "#999" : "#dc3545",
                          background: "transparent",
                          opacity: !canDeleteUser(user) ? 0.5 : 1
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5" style={{
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "15px",
            border: "2px dashed rgba(203, 178, 121, 0.5)"
          }}>
            <div style={{ fontSize: "3rem", color: "#cbb279" }}>👥</div>
            <h5 className="text-dark my-3">No users found</h5>
            <button 
              className="btn"
              onClick={clearFilters}
              style={{
                border: "1px solid #cbb279",
                color: "#8c6239",
                background: "rgba(255, 255, 255, 0.7)"
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredUsers;