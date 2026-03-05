# Timelines

Timelines is a beautiful, client-side React application for tracking important events with precision and visual clarity.

## What I Built & Why

Although this is an assesment, I liked the idea and I built a highly-performant, single-page React application powered by Vite that visualizes countdowns dynamically. The core philosophy for me was to make the abstract concept of waiting for an event feel tangible through visual hierarchy. 

**Technical Choices:**
- **React + Vite**: Chosen for lightning-fast bundling, hot-module replacement during development, and a component-driven architecture that scales cleanly.
- **TypeScript**: Used explicitly across the domain logic (`timeUtils.ts`) and data objects (`Timer` array) to guarantee that parsing `localStorage` data remains exceptionally safe at runtime.
- **Mantine UI**: Selected to deliver a "premium" feel instantly out-of-the-box. Mantine provides stunning dark-mode defaults, highly accessible modal components, and a robust `DatePicker` that allowed me to focus on business logic rather than fighting native inputs.
- **Pure Domain Logic**: All time calculation logic (determining days remaining, total progress percentage, urgency classification) was extracted into isolated, pure functions outside of the React render loop. This makes the logic heavily testable and prevents React components from becoming bloated.

## Challenges

- **Real-time React State**: The biggest challenge was ensuring the `TimerCard` countdown updated flawlessly every second. Initially, the component held an internal interval but wasn't explicitly passing the fresh state timestamp to the pure utility functions, causing React to skip the DOM update. Refactoring to explicitly pass the reactive `now` state fixed this immediately.
- **Date Picking Complexities**: Ensuring the user couldn't accidentally pick a target date in the past required swapping native HTML inputs for the more complex `@mantine/dates` `DatePicker` popover, which required synchronizing an intermediary state before confirming the final form submission. 

## What I'd Improve with More Time

- **Authentication**: Adding authentication to allow users to save their timers to the cloud and access them from different devices.
- **Push Notifications**: Integrating the browser `Notification API` to send a system alert when a timer reaches absolutely zero, even if the user has the tab hidden.
- **Complex Sorting / Filtering**: Adding tabs to filter by "Urgency" or "Completed" events.
- **Categories**: Allowing users to tag events (e.g., "Work", "Personal") and coloring the cards or icons based on those categories.
- **Unit Testing**: Adding a test suite (like Vitest) exclusively for `src/utils/timeUtils.ts` to mathematically prove the leap-year and timezone offset math handles edge cases flawlessly.

## Time Spent
Approximately ~2.5 hours from initial Vanilla JS scoping, through the React/Mantine refactor, to the final styling polish.
