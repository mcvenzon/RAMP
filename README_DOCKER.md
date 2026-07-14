# 🐳 Running the Project with Docker

This project is containerized using Docker Compose, allowing you to spin up the entire application stack (Frontend, Backend, ML Service, and Database) with a single command.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows, macOS, or Linux) installed and running.
- [Git](https://git-scm.com/) installed.

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/mcvenzon/RAMP.git
cd RAMP-v1
```

### 2. Configure Environment Variables
Copy the example environment file to create your actual `.env` file:
```bash
cp .env.example .env
```

Open `.env` in your preferred text editor and update the following:
- `SUPABASE_URL`: Your Supabase Project URL.
- `SUPABASE_ANON_KEY`: Your Supabase Anon Key.

> **Note:** If you prefer using the local PostgreSQL container instead of Supabase for the database, ensure your `DATABASE_URL` in the backend is configured to point to `db:5432`.

### 3. Launch the Stack
Run the following command to build and start all services in the background:
```bash
docker-compose up --build -d
```

### 4. Access the Application

| Component | URL | Description |
| :--- | :--- | :--- |
| **Frontend** | [http://localhost:5173](http://localhost:5173) | The React User Interface |
| **Backend API** | [http://localhost:3001/api/v1](http://localhost:3001/api/v1) | Express.js API Endpoints |
| **ML Service** | [http://localhost:8000](http://localhost:8000) | FastAPI Machine Learning Service |
| **PostgreSQL** | `localhost:5432` | Local Database Container |

## Managing the Containers

**View running containers:**
```bash
docker-compose ps
```

**View logs (to debug issues):**
```bash
# View all logs
docker-compose logs -f

# View logs for a specific service (e.g., backend)
docker-compose logs -f backend
```

**Stop and remove the containers:**
```bash
docker-compose down
```

**Stop and remove containers and volumes (removes database data):**
```bash
docker-compose down -v
```

## Troubleshooting

- **Port Conflicts**: If you get an error like `Bind for 0.0.0.0:5173 failed`, it means another application is already using that port. Stop the existing application or change the port mapping in `docker-compose.yml`.
- **Database Connection**: If the backend fails to connect to the database, ensure the `db` service is healthy by running `docker-compose ps`.
- **Rebuilding**: If you make changes to the code and want to see them reflected in the containers (if not using volumes), run:
  ```bash
  docker-compose up --build
  ```
