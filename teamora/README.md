# Teamora - Team Task Management System (Backend)

Spring Boot 3 · Java 17 · Spring Data JPA · Spring Security (JWT) · MySQL (or H2)

## Run
```bash
# MySQL (edit DB_USER / DB_PASSWORD or application.properties)
mvn spring-boot:run

# or without MySQL (in-memory H2)
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
Default admin (auto-created): `admin@teamora.com` / `admin123`

## Roles & responsibilities
| User | Main responsibility |
|---|---|
| Admin | Members, teams, team leaders, projects, overall monitoring, receives evaluation notifications |
| Team Leader | Team tasks, progress, completed tasks, daily feedback, ratings & performance |
| Member | Assigned tasks, task status, completion, daily feedback |

Admin never rates members. Team Leader submits an evaluation -> backend saves it in `MemberPerformance`
and creates a `Notification` for every Admin.

## API (send `Authorization: Bearer <token>`)
**Auth** `POST /api/auth/login` · `GET /api/auth/me`

**Admin** `/api/admin`
- `POST/GET /users`, `GET/PUT/DELETE /users/{id}` (`?role=MEMBER|TEAM_LEADER`)
- `POST/GET /teams`, `PUT /teams/{id}`, `POST|DELETE /teams/{teamId}/members/{userId}`
- `POST/GET /projects`, `PATCH /projects/{id}/status`, `GET /projects/{id}/progress`, `GET /projects/progress`
- `GET /tasks`, `GET /performances?memberId=`, `GET /performances/{id}`, `GET /dashboard`

**Team Leader** `/api/leader`
- `GET /teams`, `GET /teams/{id}/members`
- `POST/GET /projects`, `PATCH /projects/{id}/status`, `GET /projects/{id}/progress`, `GET /projects/{id}/tasks`
- `POST /tasks`, `PUT /tasks/{id}`, `GET /tasks?status=`, `GET /tasks/completed`
- `GET /feedback?date=2026-10-05`
- `POST /evaluations`, `GET /evaluations`

**Member** `/api/member`
- `GET /teams`, `GET /tasks`, `PATCH /tasks/{id}/status`, `POST/GET /feedback`

**Notifications (any role)** `GET /api/notifications`, `GET /unread-count`, `PATCH /{id}/read`, `PATCH /read-all`

## Example flow
```jsonc
// 1. Admin creates a Team Leader and a Member
POST /api/admin/users  {"name":"Haris","email":"haris@x.com","password":"secret1","role":"TEAM_LEADER"}
POST /api/admin/users  {"name":"Dhamu","email":"dhamu@x.com","password":"secret1","role":"MEMBER"}

// 2. Admin creates a team and a project
POST /api/admin/teams    {"name":"Team A","teamLeaderId":2,"memberIds":[3]}
POST /api/admin/projects {"name":"Website","teamId":1}

// 3. Team Leader assigns a task
POST /api/leader/tasks {"title":"Login page","projectId":1,"assignedToId":3,"priority":"HIGH"}

// 4. Member updates status and sends daily feedback
PATCH /api/member/tasks/1/status {"status":"COMPLETED"}
POST  /api/member/feedback {"teamId":1,"taskId":1,"message":"Finished login page"}

// 5. Team Leader evaluates -> Admin gets a notification
POST /api/leader/evaluations
{"memberId":3,"teamId":1,"taskCompletion":5,"quality":4,"teamwork":5,
 "performance":"GOOD","comment":"Completed assigned tasks on time."}
// overall rating = average of the three scores (5,4,5 -> 4.7)
```

## Data model
User · Team (leader + members, many-to-many) · Project · Task · DailyFeedback ·
**MemberPerformance** (member, team, teamLeader, rating, performance, comment, evaluatedDate) · Notification
