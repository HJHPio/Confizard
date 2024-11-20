# Contributing to this project

Thank you for your interest in contributing! Here are some guidelines to help you get started.

## How to Contribute
- **Developing and testing**
  - Clone repository
  - Change dir into frontend folder:
  ```sh
  cd frontend
  ```
  - Install node packages (preferably using bun - https://bun.sh/):
  ```sh
  bun i
  ```
  - Start local development:
    - manually:
    ```sh
    bun run dev --host
    ```
    - OR use docker:
    ```sh
    docker compose up --build
    ```
  - Test, make changes, and explore improvements:
    - Intentionally break components to identify edge cases or areas for enhancement.
    - Document your findings and potential fixes.

- **Reporting Bugs**
  - Check if the issue has already been reported.
  - Open a new issue with detailed information.

- **Suggesting Enhancements**
  - Discuss your ideas on the issues page.
  - Be clear and concise in your suggestions.

- **Submitting Pull/Merge Requests**
  - Fork the repository.
  - Create a new branch for your feature or fix (preferably with name close to feature/[issue-number]-shortDescriptionOfIssue if possible).
  - Ensure your code follows the project's coding standards.
  - Submit a pull/merge request with a clear description.

## Code Style

- Use meaningful variable and function names.
- Write comments where necessary.
- Follow the existing code formatting.

## Communication

- Be respectful and professional.
- Provide constructive feedback.
- Be open to discussions and suggestions.
