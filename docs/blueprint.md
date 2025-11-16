# **App Name**: PulsePad

## Core Features:

- Project Listing: Display a list of projects assigned to the user with key details like client name and status, fetched using GET /api/v1/projects?assigned=me&status=active.
- User Authentication: Secure user login and authentication to access the dashboard using GET /api/v1/users/me with role choice cards for admin, employee, client, and applicant on the login page.
- Context-Aware CTA: Dynamically display 'Add Update' button based on whether the user has submitted an update for the current day.
- Update Submission: Enable users to submit daily updates via a modal or bottom sheet, submitting data to POST /api/v1/projects/:projectId/updates.
- Update Status Display: Show submission timestamp or a checkmark to indicate update completion. Offer 'View/Edit' options for existing updates.

## Style Guidelines:

- Primary color: Deep Blue (#2E3192) to convey professionalism and trust, drawing from the core idea of monitoring and security.
- Background color: Light Grey (#F0F2F5) for a clean and unobtrusive backdrop.
- Accent color: Bright Teal (#00A36C) to highlight important actions and updates, an analogous color chosen for its slightly more modern associations compared to the primary color.
- Body and headline font: 'Inter' for a modern, neutral, and readable interface. This sans-serif font will ensure clarity across different screen sizes and resolutions.
- Use simple, clear icons to represent different project statuses and actions. The icons should complement the overall minimalist design.
- Mobile-first, card-based design for project listings. Prioritize key information and provide clear CTAs for quick updates.
- Subtle transitions and animations for modal/bottom sheet appearances to enhance user experience without being distracting.