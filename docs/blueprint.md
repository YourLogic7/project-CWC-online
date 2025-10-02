# **App Name**: NextJS Troubleshooting Assistant

## Core Features:

- Log Analyzer: Allows the user to input raw server logs from NextJS.
- Problem Identifier: Analyzes the provided server logs using AI to identify potential issues preventing the NextJS server from starting. LLM may incorporate external information from search as a tool.
- Suggested Solutions: Provides a list of potential solutions based on the identified problems, incorporating possible resolutions and links to relevant documentation if available.
- Error Explanation: Offers detailed explanations for each error identified in the server logs, breaking down the technical jargon into simpler terms.
- Copy to Clipboard: Allows users to copy error messages and suggested fixes to the clipboard.

## Style Guidelines:

- Primary color: Soft sky blue (#87CEEB) to convey a sense of calmness and clarity.
- Background color: Light gray (#F0F0F0) to reduce eye strain during log reading.
- Accent color: Muted orange (#D2691E) for CTAs to attract attention without being too distracting.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines, and 'Inter' (sans-serif) for body text.
- Code font: 'Source Code Pro' (monospace) for displaying server logs and code snippets.
- Use simple, monochrome icons to represent different types of issues (e.g., a wrench for configuration issues, a plug for connectivity issues).
- Implement a clean, well-spaced layout for easy readability of error logs and solutions.
- Subtle loading animations while the AI is processing the logs.