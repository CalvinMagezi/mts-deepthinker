# Deep Thinker

Deep Thinker is an AI-powered thought exploration tool that helps users visualize and expand their ideas using a canvas-based interface. It leverages OpenAI's GPT models to generate related thoughts and facilitate interactive conversations.

## Features

- Interactive canvas for visualizing thoughts
- AI-powered thought generation
- Drag-and-drop thought bubbles
- Zoom and pan functionality
- Chat interface for conversing with the AI assistant
- Token usage tracking and management

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)
- An OpenAI API key

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/CalvinMagezi/mts-deepthinker.git
   cd deep-thinker
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

## Running the Project

To run the project in development mode:

```
npm run dev
```

This will start the development server. Open your browser and navigate to `http://localhost:5173` to view the application.

To build the project for production:

```
npm run build
```

To preview the production build:

```
npm run preview
```

## Project Structure

- `src/`: Contains the main source code
  - `components/`: React components
  - `utils/`: Utility functions and AI-related code
  - `types.ts`: TypeScript type definitions
  - `App.tsx`: Main application component
  - `main.tsx`: Entry point of the application
- `public/`: Static assets
- `vite.config.ts`: Vite configuration file
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration

## Key Components

1. `App.tsx`: The main component that orchestrates the entire application.
2. `Canvas.tsx`: Renders the thought canvas and manages connections between thoughts.
3. `ThoughtBubble.tsx`: Represents individual thoughts on the canvas.
4. `ChatWindow.tsx`: Provides an interface for conversing with the AI assistant.
5. `TokenDisplay.tsx`: Shows token usage statistics.

## Utility Functions

1. `ai.ts`: Contains functions for interacting with the OpenAI API.
2. `tokenCalculator.ts`: Handles token calculations and cost estimations.
3. `tokenManager.ts`: Manages token usage and storage.

## Contributing

We welcome contributions to the Deep Thinker project. Here are some guidelines to get you started:

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. Ensure your code lints and passes all tests.
4. Issue a pull request with a comprehensive description of changes.

### Development Guidelines

- Follow the existing code style and use TypeScript for type safety.
- Use functional components and React hooks.
- Leverage Tailwind CSS for styling components.
- Write meaningful commit messages and keep pull requests focused on a single feature or bug fix.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

If you have any questions or feedback, please open an issue on the GitHub repository.

Happy thinking with Deep Thinker!
