# Resume-Chesuko 📝

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://resume-chesuko.vercel.app/)

Resume-Chesuko is a modern, AI-powered resume builder designed to help you craft the perfect ATS-friendly resume. Forget the hassle of formatting and thinking of the right words—just focus on your experiences and let the AI polish them into impactful, quantifiable bullets.

## Key Features ✨
- **AI-Powered Polishing**: Instantly transform your rough bullet points into professional, action-oriented statements using the HuggingFace Qwen AI model.
- **Cloud Profile Sync**: Sign in to securely save and retrieve your master profile data. Never lose your resume details again!
- **Multiple Templates**: Choose from different professional templates that best suit your style.
- **Print/Download Ready**: Generate clean, perfectly-sized A4 PDFs right from your browser.
- **Markdown Support**: Fine-tune your content with bold and italic text formatting.

## Tech Stack 🛠
- **Frontend**: React, Vite
- **Authentication**: Clerk
- **Database**: PostgreSQL (via Prisma)
- **AI Integration**: HuggingFace Inference API (`Qwen/Qwen2.5-72B-Instruct`)
- **Backend**: Vercel Serverless Functions

## Getting Started 🚀

To run this project locally, follow these steps:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up your environment variables**:
   Create a `.env` or `.env.local` file in the root directory and add your keys:
   ```env
   VITE_HF_TOKEN="your_huggingface_token"
   DATABASE_URL="your_postgresql_database_url"
   VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to see the application in action.

## Contributing 🤝
Feel free to open issues or submit pull requests if you have suggestions for new features, better templates, or bug fixes. Let's make resume building stress-free!
