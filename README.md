# SmartGrocer Cloud

A comprehensive cloud-powered grocery management application built with modern technologies.

## 🚀 Technology Stack

| Layer              | Technology                                       | Purpose                              |
| ------------------ | ------------------------------------------------ | ------------------------------------ |
| **Frontend**       | React + Vite + ShadCN UI                         | Interactive UI, modern design system |
| **Backend**        | Python (FastAPI)                                 | REST API for products, users, orders |
| **Database**       | MongoDB Atlas                                     | Product data & user records          |
| **Cloud Storage**  | AWS S3                                           | Product images, invoices uploads     |
| **Authentication** | JWT + OAuth (Google Login optional)              | Secure login/signup                  |
| **Hosting**        | AWS EC2 / Elastic Beanstalk or Vercel + Render   | Deploy frontend and backend          |
| **Notifications**  | AWS SES                                          | Email & SMS order notifications      |
| **Payment**        | Stripe / Razorpay Integration                    | Checkout & billing management        |

## 📋 Features

- 🔐 **User Authentication**: Secure JWT-based auth with OAuth integration
- 🛒 **Product Management**: Comprehensive catalog with search and filtering
- 🛍️ **Shopping Cart**: Real-time cart management and checkout
- 📊 **Seller Dashboard**: Analytics and inventory management
- ☁️ **Cloud Storage**: Scalable image and document storage
- 💳 **Payment Gateway**: Integrated Stripe/Razorpay payments
- 📧 **Notifications**: Email and SMS alerts for orders
- 📱 **Responsive Design**: Modern UI with ShadCN components

## 🏗️ Project Structure

```
smartgrocer-cloud/
├── frontend/          # React + Vite + ShadCN UI
├── backend/           # Python FastAPI server
├── cloud/             # Infrastructure setup
├── docs/              # Documentation
└── docker-compose.yml # Container orchestration
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartgrocer-cloud
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

5. **Run with Docker (recommended)**
   ```bash
   docker-compose up -d
   ```

   Or run separately:
   
   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   
   **Backend:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

## 🌐 API Documentation

Once the backend is running, visit:
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## 📚 Documentation

- [System Design](docs/system_design.md)
- [API Reference](docs/api_reference.md)
- [Deployment Guide](docs/deployment_instructions.md)
- [Contributing](docs/contribution_guide.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

See [team_roles.md](docs/team_roles.md) for team structure and responsibilities.

## 🆘 Support

For support, email support@smartgrocer.cloud or create an issue on GitHub.