# DesiMart — E-Commerce Platform

Welcome to **DesiMart**, a modern, multi-framework microservices-based e-commerce platform. This project leverages a polyglot architecture, combining a **Node.js/Express** ecosystem for user management and cataloging with a reactive **Java Spring Boot** service for high-performance order processing.

---

## 🏗️ Project Architecture Overview

The codebase is split into an ecosystem of decoupled services to handle scale and distinct business domains effectively:

```text
📁 desimart-root
├── 📁 backend/
│   ├── 📁 backend1/         # Node.js + MongoDB (Auth, Products, Cart)
│   └── 📁 backend2/         # Spring Boot + PostgreSQL (Orders)
└── 📁 frontend/
    └── 📁 DesiMart/         # React.js Client Application
