- **Project: Contact Manager API (Mini-CRM)** — *real-world problem: sales/networking contact tracking*
    - Auth: signup/login with JWT, bcrypt passwords
    - CRUD contacts: name, email, phone, company, job title, tags (e.g., "lead", "client", "friend")
    - Search contacts by name, company, or tag
    - Zod validation on all inputs
    - Protected routes (only view your own contacts)

| Route                            | Auth         | What it does                              |
| -------------------------------- | ------------ | ----------------------------------------- |
| `POST /api/auth/signup`          | 🟢 Public    | Create user, hash password with bcrypt    |
| `POST /api/auth/signin`          | 🟢 Public    | Verify password, return JWT               |
| `POST /api/contacts`             | 🔒 Protected | Create contact (linked to logged-in user) |
| `GET /api/contacts`              | 🔒 Protected | List **only your** contacts               |
| `GET /api/contacts/search?q=...` | 🔒 Protected | Search by name, company, or tag           |
| `PUT /api/contacts/:id`          | 🔒 Protected | Update your contact                       |
| `DELETE /api/contacts/:id`       | 🔒 Protected | Delete your contact                       |
