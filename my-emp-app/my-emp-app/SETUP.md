# HRFlow — Setup Notes

## Running the frontend

```bash
npm install
npm run dev
```

The app expects the backend at `http://localhost:8080` (see `.env` /
`VITE_API_BASE_URL`). Change that value if your Spring Boot app runs
elsewhere.

## ⚠️ You need to add CORS to the backend

Your Spring Boot project has no CORS configuration, so browser requests
from the Vite dev server (`http://localhost:5173`) will be blocked by
default. Per the brief, this frontend build doesn't touch the backend —
add one small config class yourself:

```java
package com.example.employee_management.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            }
        };
    }
}
```

## Login is a demo gate, not real security

The backend has no auth endpoint, Spring Security, or JWT. The Login
page checks the entered username/password against your existing
`GET /api/users` list on the client side. It lets the SPA have a
login/logout flow, but it does **not** protect your REST APIs — anyone
can still call them directly. See `src/context/AuthContext.jsx` for
details, and add real backend authentication before using this beyond
local development.

## What was built

- `src/api/` — one Axios module per resource (employees, departments,
  attendance, leaves, salaries, users), all pointed at your exact
  existing endpoints.
- `src/components/` — reusable UI: DataTable, Modal, ConfirmDialog,
  Toasts, form modals per entity, Sidebar/Navbar, etc.
- `src/pages/` — Login, Dashboard, Employees (+ details), Departments,
  Attendance, Leave Management, Salary Management, Users.
- Every list page has loading skeletons, empty states, error states with
  retry, and delete confirmation dialogs.
- Net salary is always the value returned by the backend — the frontend
  never recomputes it.
- Fully responsive: collapsible sidebar on mobile/tablet, responsive
  tables and forms.
