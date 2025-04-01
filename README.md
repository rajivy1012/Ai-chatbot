# Finastra AI Finance Chatbot 🤖

An AI-powered financial assistant that helps users manage investments and provides personalized financial advice. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Google's Gemini AI and Alpha Vantage API integration.

## Features ✨

- **User Profile Management** 
  - Create and manage investment profiles
  - Set risk tolerance and investment goals
  - Track monthly income and savings

- **Investment Dashboard**
  - Real-time portfolio tracking
  - Performance visualization
  - Asset allocation charts
  - Holdings table with gain/loss tracking

- **AI-Powered Chat Assistant**
  - Get personalized investment advice
  - Real-time stock price information
  - Market analysis and insights
  - Financial planning guidance

## Prerequisites 📋

Before running this project, make sure you have:
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- Google Gemini API key
- Alpha Vantage API key

## Installation 🚀

1. **Clone the repository**
   ```bash
   git clone https://github.com/Satyesh7/AI-Chatbot.git
   cd finastra-chatbot
   ```

2. **Set up environment variables**

   Create `.env` file in backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ALPHA_VANTAGE_API_KEY=your_alphavantage_api_key
   ```

   Create `.env` file in frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Install Dependencies**

   Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

   Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application 🏃‍♂️

1. **Start the backend server**
   ```bash
   cd backend
   node server.js
   ```
   Server will run on http://localhost:5000

2. **Start the frontend application**
   ```bash
   cd frontend
   npm start
   ```
   Application will open in your browser at http://localhost:3000

## Usage Guide 📖

1. **Create Profile**
   - Click "Get Started" on the home page
   - Fill in your financial details
   - Set your investment preferences

2. **View Dashboard**
   - Add investments using the "Add Investment" button
   - Monitor portfolio performance
   - Track investment gains/losses

3. **Chat with AI Assistant**
   - Navigate to the Chat section
   - Ask questions about:
     - Stock prices
     - Investment advice
     - Market analysis
     - Financial planning

## API Keys Setup 🔑

1. **Google Gemini API**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key
   - Add to backend `.env` file

2. **Alpha Vantage API**
   - Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - Get your free API key
   - Add to backend `.env` file

## Tech Stack 💻

- **Frontend**
  - React.js
  - Tailwind CSS
  - Recharts for data visualization
  - Axios for API requests

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - Google Gemini AI
  - Alpha Vantage API

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting 🔧

Common issues and solutions:

1. **MongoDB Connection Issues**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure network connectivity

2. **API Key Errors**
   - Verify API keys are correctly set in `.env`
   - Check API key permissions and quotas

3. **Node Module Issues**
   - Try deleting node_modules and package-lock.json
   - Run `npm install` again

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Screenshots of Working Chatbot:
![finastra1](https://github.com/user-attachments/assets/ae8ad3cd-6c5c-45e1-9f43-9b87524eedeb)
![finastra2](https://github.com/user-attachments/assets/5eac7116-a54a-4ae0-9226-9204214511b9)
![finastra3](https://github.com/user-attachments/assets/4e51d7c1-ee30-49dd-985b-ab8374e74946)

