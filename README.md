# Expense Tracker

<!-- Write 1-2 sentences: what does your app do? -->
This app is designed to track expenses. It summarizes the total amount, count, and highest expense across 3 cards, while displaying all expenses in a table with full capabilities to edit or delete any item.
## How to run

<!-- Write the exact steps someone needs to run your project from scratch.
     Assume they have Node.js, PostgreSQL, and VS Code, and nothing else.
     Include: creating the database, running schema.sql, writing the .env file,
     starting the backend, and opening the frontend. -->

**Backend**

1. Open schema.sql in pgAdmin and run it to create the database and tables.
2. Create a .env file and fill in your database credentials and port.
3. Open the backend folder in the terminal (Right-click then Open in Integrated Terminal).
4. Run the backend server using the command: node server.js

**Frontend**

1. Open the project folder in VS Code.
2. Make sure you have the Live Server extension installed.
3. Open the index.html file, right-click anywhere inside it, and choose Open with Live Server.
## Features

<!-- List what your app can do. Tick what you finished. -->

- [x] Add an expense (with validation)
- [x] Delete an expense
- [x] Edit an expense
- [x] Filter by category
- [x] Summary cards (total, count, highest)
- [x] Data is saved in a PostgreSQL database

## Screenshots

<!-- Add 2-3 screenshots of your app (desktop and mobile). -->
### Desktop View (click ctrl+link)
  <img src="desktop and mobile screen/full_screen_computer.png" alt="Desktop View" width="100%">

### Mobile View
  <img src="desktop and mobile screen/full_screen_phone.png" alt="Mobile View" width="300">

### Video Link
https://drive.google.com/file/d/10s0TJ35X1hsA8ftflLASpI5oXN5jnuBm/view?usp=drive_link
### GitHub Link

## What was the hardest part?
<!-- A short paragraph: what got you stuck, and how did you solve it? -->
During development, I got stuck handling asynchronous data fetching and synchronizing the frontend UI with the backend API ports. I solved this by methodically reading the browser's console errors, tracking down the exact source of the request mismatch, and referencing the course slides and documentation to correctly configure the API endpoints and server responses.