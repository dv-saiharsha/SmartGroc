<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## SmartGrocer Cloud - Project Instructions

This is a full-stack grocery management application with the following architecture:

### Technology Stack
- **Frontend**: React + Vite + ShadCN UI + Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: MongoDB Atlas
- **Cloud Storage**: AWS S3
- **Authentication**: JWT + OAuth
- **Payment**: Stripe/Razorpay
- **Hosting**: AWS EC2/Vercel + Render
- **Notifications**: AWS SES

### Project Structure
- `frontend/` - React application with ShadCN UI components
- `backend/` - Python FastAPI server with routes, controllers, models
- `cloud/` - Infrastructure setup scripts for AWS/GCP
- `docs/` - Comprehensive project documentation

### Development Guidelines
- Use TypeScript for frontend when possible
- Follow REST API conventions for backend routes
- Implement proper error handling and validation
- Use environment variables for sensitive configuration
- Write unit tests for critical functionality
- Follow security best practices for authentication and data handling

### Key Features
- User authentication and authorization
- Product catalog with search and filtering
- Shopping cart and checkout process
- Seller dashboard with analytics
- Real-time inventory tracking
- Cloud-based image and document storage
- Payment gateway integration
- Email/SMS notifications