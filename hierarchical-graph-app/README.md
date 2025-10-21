# Hierarchical Graph Visualization Project

This project is a hierarchical graph visualization application built using Express.js for the backend and Vue.js with D3.js for the frontend. The application serves hierarchical data and visualizes it in an interactive format.

## Project Structure

```
hierarchical-graph-app
├── server
│   ├── src
│   │   ├── index.js          # Entry point for the Express server
│   │   ├── routes
│   │   │   └── data.js       # GET endpoint to serve hierarchical data
│   │   └── data
│   │       └── sample.json   # Sample hierarchical data in JSON format
│   ├── package.json          # Server dependencies and scripts
│   └── .env                  # Environment variables for the server
├── client
│   ├── index.html            # Main HTML file for the Vue.js application
│   ├── package.json          # Client dependencies and scripts
│   ├── vite.config.js        # Vite configuration for the Vue.js app
│   └── src
│       ├── main.js           # Entry point for the Vue.js application
│       ├── App.vue           # Root Vue component
│       └── components
│           └── HierarchyGraph.vue # Component for visualizing the hierarchical graph
├── package.json              # Root configuration for the entire project
├── .gitignore                # Files and directories to ignore by Git
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd hierarchical-graph-app
   ```

2. Install server dependencies:

   ```
   cd server
   npm install
   ```

3. Install client dependencies:

   ```
   cd client
   npm install
   ```

### Configuration

1. Create a `.env` file in the `server` directory and set the desired port:

   ```
   PORT=5000
   ```

### Running the Application

1. Start the server:

   ```
   cd server
   npm start
   ```

2. In a new terminal, start the client:

   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

### Usage

The application will fetch hierarchical data from the server and visualize it using D3.js. You can interact with the graph to explore the hierarchy.