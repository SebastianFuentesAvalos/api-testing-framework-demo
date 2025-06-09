# 🧪 API Testing Framework Demo

A comprehensive demonstration of API testing using Postman and Newman with GitHub Actions automation.

## 🌟 Features

- ✅ RESTful API with CRUD operations
- ✅ Automated testing with Postman/Newman
- ✅ CI/CD pipeline with GitHub Actions
- ✅ HTML test reports
- ✅ Performance testing
- ✅ Security validations
- ✅ Multiple environments support

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm
- Newman (for CLI testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/SebastianFuentesAvalos/api-testing-framework-demo.git
cd api-testing-framework-demo

# Install dependencies
npm install

# Install Newman globally
npm install -g newman newman-reporter-html
```

### Running the API

```bash
# Start the server
npm start

# The API will be available at http://localhost:3000
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| POST | `/users` | Create a new user |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user by ID |
| DELETE | `/users/:id` | Delete user by ID |
| GET | `/health` | Health check |

### Running Tests

```bash
# Run tests with Newman
newman run collections/user-api-tests.postman_collection.json \
  -e environments/dev.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export reports/test-report.html

# Run performance tests
npm run test:performance

# Run all tests
npm test
```

## 📁 Project Structure

```
api-testing-framework-demo/
├── .github/workflows/
│   └── api-tests.yml          # GitHub Actions workflow
├── collections/
│   ├── user-api-tests.postman_collection.json
│   └── security-tests.postman_collection.json
├── environments/
│   ├── dev.postman_environment.json
│   └── prod.postman_environment.json
├── reports/                   # Test reports directory
├── scripts/
│   └── analyze-results.js     # Results analysis script
├── src/
│   └── server.js             # Main API server
├── tests/
│   └── integration/          # Additional test files
├── package.json
├── README.md
└── .gitignore
```

## 🤖 CI/CD Pipeline

The project includes a GitHub Actions workflow that:

- Runs on every push and pull request
- Tests across multiple Node.js versions
- Executes automated API tests
- Generates HTML reports
- Performs performance testing
- Uploads test artifacts
- Comments on PRs with test results

## 📊 Test Reports

After running tests, check the `reports/` directory for:

- HTML test reports
- Performance metrics
- Security scan results

## 🔗 Related Article

📖 Read the complete guide: [Mastering API Testing: Practical Guide with Postman and Newman for Automation](https://dev.to/sebastianfuentesavalos/mastering-api-testing-practical-guide-with-postman-and-newman-for-automation-5bm4)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Author

**Sebastian Fuentes Avalos**

- GitHub: [@SebastianFuentesAvalos](https://github.com/SebastianFuentesAvalos)
- LinkedIn: [Sebastian Fuentes Avalos](https://linkedin.com/in/sebastian-fuentes-avalos)

---

⭐ If this project helped you, please give it a star!

---

Esta es la estructura completa del repositorio. Puedes crear cada archivo con el código correspondiente y seguir las instrucciones para implementar el framework de testing completo.