# Graph Visualizer

A hierarchical graph visualization tool built with Vue.js and D3.js. This project allows users to visualize hierarchical data structures in an interactive tree layout.

## Features

- Interactive tree visualization with D3.js
- Node selection and details sidebar
- Zoom and pan capabilities
- REST API backend for data serving
- Responsive design
- Comprehensive test coverage with Jest

## Tech Stack

- **Frontend**: Vue.js 3, D3.js
- **Backend**: Node.js, Express
- **Testing**: Jest, Vue Test Utils

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- Windows 10/11 or compatible OS
- Visual Studio Code (recommended)

## Project Structure

```
graph-visualizer/
├── client/               # Frontend Vue.js application
│   ├── src/
│   │   ├── components/   # Vue components
│   │   ├── utils/        # Utility functions
│   │   ├── App.vue      # Root component
│   │   └── main.js      # Entry point
│   └── tests/           # Frontend tests
├── server/              # Backend Node.js application
│   ├── src/
│   │   ├── data/        # Sample data
│   │   └── server.js    # Express server
│   └── tests/          # Backend tests
└── package.json        # Root package configuration
```

## Getting Started

1. Clone the repository:
```powershell
git clone https://github.com/yourusername/graph-visualizer.git
cd graph-visualizer
```

2. Open in Visual Studio Code:
```powershell
code .
```

3. Install dependencies:
```powershell
npm run install-all
```

## Running the Application

Start both server and client using a single command:
```powershell
npm start
```

Access the application at:
- Frontend: [http://localhost:8080](http://localhost:8080)
- Backend API: [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start both client and server |
| `npm test` | Run all tests |
| `npm run clean` | Remove all node_modules folders |
| `npm run install-all` | Install all dependencies |

## API Documentation

### Get Graph Data
```http
GET http://localhost:3000/api/graph
```

**Response:**
```json
{
  "data": [
    {
      "name": "Root",
      "children": [
        {
          "name": "Child 1",
          "children": []
        }
      ]
    }
  ]
}
```

## Development

### VS Code Extensions

Recommended extensions for development:
- Volar (Vue Language Features)
- ESLint
- Jest Runner
- GitLens

### Running Tests in VS Code

1. Open the test file
2. Click the "Run Test" CodeLens above the test
3. View results in the Test Explorer

Or use the integrated terminal:
```powershell
npm test
```

## Troubleshooting

### Common Issues

1. **Connection Refused Error**
   ```
   Error: Failed to fetch http://localhost:3000/api/graph
   ```
   **Solution:** Ensure the server is running (`npm run server`)

2. **Port Conflicts**
   ```
   Error: listen EADDRINUSE: address already in use :::3000
   ```
   **Solution:** Change the port in `server/src/server.js`

3. **Missing Dependencies**
   ```
   Error: Cannot find module 'd3'
   ```
   **Solution:** Run `npm run install-all`

## Contributing

1. Fork the repository
2. Create your feature branch:
   ```powershell
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```powershell
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch:
   ```powershell
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
Project Link: [https://github.com/tejaskesaria/graph-visualizer]