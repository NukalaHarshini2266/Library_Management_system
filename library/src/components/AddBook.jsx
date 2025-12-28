import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [availableCopies, setAvailableCopies] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [publisher, setPublisher] = useState("");

  const bookId = `${title.replace(/\s+/g, "")}${author.replace(/\s+/g, "")}`;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    api
      .get("/api/categories/all")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    api
      .post("/api/categories/add", { name: newCategoryName.trim().toUpperCase() })
      .then((res) => {
        setCategories([...categories, res.data]);
        setSelectedCategories([...selectedCategories, res.data.id]);
        setNewCategoryName("");
      })
      .catch((err) => console.error(err));
  };

  const handleCategorySelect = (e) => {
    const selectedId = parseInt(e.target.value);
    if (!selectedCategories.includes(selectedId)) {
      setSelectedCategories([...selectedCategories, selectedId]);
    }
  };

  const removeCategory = (id) => {
    setSelectedCategories(selectedCategories.filter((catId) => catId !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || selectedCategories.length === 0) {
      alert("Please fill Title, Author, and select at least one category.");
      return;
    }

    const payload = {
      title: title.trim(),
      author: author.trim(),
      publisher: publisher.trim(),
      price: parseFloat(price),
      imageUrl: imageUrl.trim(),
      availableCopies: parseInt(availableCopies),
      categoryIds: selectedCategories,
    };

    api
      .post("/api/books/add", payload)
      .then((res) => {
        alert("Book added successfully!");
        setTitle("");
        setAuthor("");
        setPublisher("");
        setPrice("");
        setImageUrl("");
        setAvailableCopies(1);
        setSelectedCategories([]);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add book.");
      });
  };

  return (
    <div 
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
        backgroundAttachment: "fixed",
        padding: "20px 0"
      }}
    >
      {/* Custom Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animated-card {
            animation: fadeInUp 0.8s ease-out;
          }
          .animated-left {
            animation: slideInLeft 0.6s ease-out;
          }
          .animated-right {
            animation: slideInRight 0.6s ease-out;
          }
        `}
      </style>

      <div className="container animated-card" style={{ maxWidth: "50%" }}>
        <div 
          className="card p-4 border-0 shadow-lg"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(203, 178, 121, 0.3)",
            borderRadius: "20px"
          }}
        >
          <h2 className="text-dark mb-3">Add Book</h2>
          <p className="text-dark"><strong>Book ID:</strong> {bookId || "Auto-generated from Title+Author"}</p>
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Left column: Book details + selected categories */}
              <div className="col-md-6 animated-left">
                <div className="mb-3">
                  <label className="form-label text-dark fw-medium">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{
                      border: "1px solid #cbb279",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8c6239";
                      e.target.style.boxShadow = "0 0 0 2px rgba(139, 69, 19, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#cbb279";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-dark fw-medium">Author</label>
                  <input
                    type="text"
                    className="form-control"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    style={{
                      border: "1px solid #cbb279",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8c6239";
                      e.target.style.boxShadow = "0 0 0 2px rgba(139, 69, 19, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#cbb279";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-dark fw-medium">Publisher</label>
                  <input
                    type="text"
                    className="form-control"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="Enter publisher name"
                    style={{
                      border: "1px solid #cbb279",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8c6239";
                      e.target.style.boxShadow = "0 0 0 2px rgba(139, 69, 19, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#cbb279";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-dark fw-medium">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      border: "1px solid #cbb279",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8c6239";
                      e.target.style.boxShadow = "0 0 0 2px rgba(139, 69, 19, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#cbb279";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-dark fw-medium">Available Copies</label>
                  <input
                    type="number"
                    className="form-control"
                    value={availableCopies}
                    onChange={(e) => setAvailableCopies(e.target.value)}
                    style={{
                      border: "1px solid #cbb279",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8c6239";
                      e.target.style.boxShadow = "0 0 0 2px rgba(139, 69, 19, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#cbb279";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-dark fw-medium">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{
                      border: "1px solid #cbb279",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8c6239";
                      e.target.style.boxShadow = "0 0 0 2px rgba(139, 69, 19, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#cbb279";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-dark fw-medium">Selected Categories</label>
                  <div className="d-flex flex-wrap">
                    {selectedCategories.map((id) => {
                      const cat = categories.find((c) => c.id === id);
                      if (!cat) return null;
                      return (
                        <span
                          key={id}
                          className="badge me-2 mb-2"
                          style={{ 
                            cursor: "pointer",
                            background: "linear-gradient(45deg, #cbb279, #8c6239)",
                            color: "#fff",
                            padding: "8px 12px",
                            borderRadius: "15px",
                            transition: "all 0.3s ease"
                          }}
                          onClick={() => removeCategory(id)}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          {cat.name} &times;
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right column: Category dropdown + add new */}
              <div className="col-md-6 animated-right">
                <div className="mb-3">
                  <label className="form-label text-dark fw-medium">Select Categories</label>
                  <select
                    className="form-select"
                    onChange={handleCategorySelect}
                    style={{
                      border: "1px solid #cbb279",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8c6239";
                      e.target.style.boxShadow = "0 0 0 2px rgba(139, 69, 19, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#cbb279";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="">-- Select category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-dark fw-medium">Add New Category</label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="New category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      style={{
                        border: "1px solid #cbb279",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#8c6239";
                        e.target.style.boxShadow = "0 0 0 2px rgba(139, 69, 19, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#cbb279";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      className="btn"
                      onClick={handleAddCategory}
                      style={{
                        background: "linear-gradient(45deg, #cbb279, #8c6239)",
                        border: "none",
                        color: "#fff",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 5px 15px rgba(139, 69, 19, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn mt-3 w-100"
              style={{
                background: "linear-gradient(45deg, #cbb279, #8c6239)",
                border: "none",
                color: "#fff",
                fontWeight: "600",
                padding: "12px",
                borderRadius: "12px",
                fontSize: "1.1rem",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 20px rgba(139, 69, 19, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Add Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;