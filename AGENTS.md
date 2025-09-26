# Claritude.ai Development Guide

Claritude is an LLM-driven mind mapping tool built with modern web technologies.

## Architecture

- **Backend**: Node.js + Fastify server serving static files
- **Frontend**: Vanilla HTML/CSS/JS with Alpine.js reactivity
- **Canvas**: Fabric.js for interactive mind map rendering
- **Styling**: TailwindCSS for responsive design

## Engineering Principles

### 1. Simplicity First
- Keep components small and focused
- Prefer vanilla JavaScript over frameworks when possible
- Use Alpine.js only for reactive UI elements

### 2. Performance Matters
- Canvas-based rendering for smooth mind map interactions
- Efficient DOM updates with Alpine.js reactivity
- Lazy loading and minimal bundle size

### 3. Event-Driven Design
- Use Alpine.js for component-level events
- Fabric.js events for canvas interactions
- Clean separation between UI events and business logic

### 4. Modular Code Structure
- Separate concerns: HTML for structure, JS for behavior, CSS for styling
- Keep functions small and testable
- Use ES6 modules for code organization

### 5. User-Centric Development
- Responsive design with TailwindCSS
- Intuitive interactions (drag, zoom, pan)
- Real-time mind map updates

### 6. Extensibility
- Plugin architecture ready for LLM integration
- Canvas abstraction allows for future enhancements
- API-first backend design for scalability
