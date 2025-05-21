# KioskSurvey

KioskSurvey is a web application designed for creating and conducting simple surveys, optimized for kiosk environments or standalone tablet use. It allows users to easily set up questions with multiple-choice answers and view results in real-time. The interface is multilingual, supporting English and German out of the box.

## Key Features

*   **Easy Survey Creation:** Quickly create new surveys with a single question and multiple customizable answer options.
*   **Simple Participation:** Users can take surveys with a clean, touch-friendly interface.
*   **Real-time Results:** View aggregated survey results dynamically.
*   **Customizable Appearance:** Adjust background and button colors for each survey to match branding or preference.
*   **Multilingual Support:** Currently supports English and German, with the ability to switch languages on the fly.
*   **Persistent Storage:** Survey configurations and results are saved in the browser's local storage.
*   **Responsive Design:** Adapts to various screen sizes, suitable for tablets and desktops.

## Tech Stack

*   **SvelteKit:** Frontend framework for building the application.
*   **Svelte 5 (Runes):** Utilizes the latest Svelte features for reactivity and state management.
*   **TypeScript:** For type safety and improved developer experience.
*   **Tailwind CSS:** For styling the user interface.
*   **Paraglide JS:** For internationalization (i18n) and managing translations.
*   **Vite:** Build tool for fast development and optimized production builds.
*   **Bun:** Used as the runtime and package manager (implied by `bun.lockb`).
*   **Playwright:** For End-to-End testing.
*   **Vitest:** For unit and component testing.

## Getting Started

### Prerequisites

*   [Bun](https://bun.sh/) (latest version recommended)
*   Node.js (if not using Bun exclusively for all Node-related tasks)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd kiosk-survey
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Run the development server:**
    ```bash
    bun run dev
    ```
    This will start the application, typically on `http://localhost:5173`.

4.  **Build for production (static site):**
    The project is configured with `@sveltejs/adapter-static`.
    ```bash
    bun run build
    ```
    The static files will be generated in the `build` directory.

### Testing

*   **Run unit and component tests:**
    ```bash
    bun run test:unit
    ```
*   **Run End-to-End tests (requires a running dev server or build):**
    ```bash
    bun run test:e2e
    ```

## Project Structure Highlights

*   `src/routes/`: Contains the SvelteKit page and layout components.
    *   `+page.svelte`: Main page for managing surveys.
    *   `survey/+page.svelte`: Page for taking a survey.
    *   `results/+page.svelte`: Page for viewing survey results.
    *   `+layout.svelte`: Root layout, handles language switching and global styles.
*   `src/lib/stores.ts`: Manages the state of surveys (creation, results, persistence to local storage).
*   `src/lib/components/`: Reusable Svelte components (e.g., dialogs, buttons).
*   `src/lib/paraglide/`: Configuration and message files for Paraglide JS i18n.
*   `messages/`: Source JSON files for translations (e.g., `en.json`, `de.json`).
*   `project.inlang/`: Inlang project configuration for managing translations.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these general guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/your-feature-name` or `bugfix/issue-number`).
3.  Make your changes.
4.  Ensure tests pass (`bun run test:unit`, `bun run test:e2e`).
5.  Commit your changes with clear and descriptive messages.
6.  Push to your forked repository.
7.  Open a pull request to the main repository.

Please ensure your code adheres to the existing coding style and linting rules (`bun run lint`).

## License

This project is licensed under the [MIT License](LICENSE).
