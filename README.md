# 📚Library_Management_system
A web-based Library Management System designed to manage books, users, memberships, reservations, borrowing, and returns with clear role-based access for Admin, Librarian, and Users.

# 🌐 Live Application
  Link:
🔗 https://mylibraryportal.netlify.app

This URL provides access to the complete Library Management System user interface for Admin, Librarian, and User roles.

# 🛠️ Tech Stack

 # Frontend:
       React JS, React Router, Axios, HTML/CSS/JS
  
  # Backend: 
        Java Spring Boot, Spring Security (JWT), JPA/Hibernate, REST APIs
  
 # Database:
        MySQL
  
 # Deployment: Frontend: Netlify, Backend: Render, MySQL :Railway

# Project Overview

This system digitalizes common library operations such as:

        Role-based access control
        
        Book browsing and management
        
        Borrowing and reservation workflows
        
        Membership-based borrowing limits
        
        Fine and penalty handling
        
        The application focuses on real-world library logic with clear separation of responsibilities.

# 👥 User Roles
# 🔑 Admin/Librarian

Admins have full control over the system.

# Admin/Librarian Operations

      Admin can add other Admins ,add / delete Librarians,users
      
      Librarian can add / delete users only
      
      View and manage all users
      
      Add, update, and delete books
      
      View and manage all borrow requests
      
      View and manage all reservations
      
      Inspect returned books (chaeck for damage of book and add fine)
      
      Apply fines and penalties(due data penalty is auto-calculated)
      
      Manage memberships 
      
      View membership & penalty transactions
      
      Receive low-stock and damaged book notifications


# 👤 User

      Users can browse, borrow, reserve, and return books based on their membership plan.
      
      User Operations
      
      Register and login
      
      View available and unavailable books
      
      Search books by title or category
      
      Upgrade membership plans
      
      Request to borrow available books
      
      Reserve unavailable books
      
      View borrowed books
      
      Submit return requests
      
      Pay fines (if applicable)
      
      Notifications of book operations

# 💳 Membership Plans & Borrow Limits
       
| Membership Type | Monthly Fee | Max Books / Month |
|-----------------|------------|------------------|
| Normal          | Free       | 1                |
| Standard        | ₹100       | 3                |
| Premium         | ₹200       | 5                |
| Gold            | ₹300       | 10               |
  
  Borrow limits are strictly enforced
  
  Multiple Membership upgrades are supported
  
  Users cannot borrow more than their plan limit
  
  Higher plans provide higher borrowing capacity

# 🔄 Book Borrowing & Reservation Flow
  Borrowing Available Books
  
  User requests to borrow an available book.
  
  Admin/Librarian reviews the request.
  
  On approval, the book is issued to the user.
  
  Due date is assigned based on system rules.
  
  Reserving Unavailable Books
  
  User places a reservation request for an unavailable book.
  
  Requests are stored in a reservation queue.
  
  When the book becomes available:
  
  The first reserved user is prioritized.
  
  Admin/Librarian approves the reservation.
  
  Book is issued to the user.

# 🔁 Book Return & Fine Process

  User submits a return request.
  
  Admin/Librarian inspects:
  
  Book condition (normal / damaged)
  
  Due date and return date
  
  If returned late or damaged:
  
  Fine or penalty is calculated.
  
  User completes return after paying applicable fines.
  
  Book becomes:
  
  Available for other users, or
  
  Issued to the next reserved user.


# ⚠️ Fine & Penalty Management

Late returns generate fines

Damaged books generate penalties

Fine amount depends on:

Number of overdue days

Book condition

All transactions are recorded and visible to Admin

# 🛠️ Key Features

Role-based access control

Reservation queue handling

Membership-based borrowing limits

Realistic return inspection workflow

Fine and penalty tracking

Clean and user-friendly interface


# 📄 Conclusion

This Library Management System effectively simulates real-world library workflows with clearly defined roles, structured processes, and scalable design suitable for academic and practical use.
