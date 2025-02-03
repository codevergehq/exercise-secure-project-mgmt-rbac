# Secure Project Management API with RBAC

## Learning Goals

After completing this exercise, you will be able to:

- Implement a complete Role-Based Access Control (RBAC) system from scratch
- Design and structure role and permission configurations
- Create middleware to check both single and multiple permissions
- Implement different permission checking strategies (ANY/OR vs ALL/AND)
- Handle role-based route protection in Express
- Test RBAC implementation using API clients

## Introduction

In this exercise, you'll build a Role-Based Access Control (RBAC) system for a project management application.

You'll implement different roles such as Project Manager, Team Lead, and Developer, with varying levels of permissions, and create middleware to protect your routes based on these roles and permissions.

Imagine you're tasked with building the security layer for a fast-growing startup's project management platform. The company has different teams, each with their own projects, and employees ranging from developers to project managers.

Your mission? 

Implement a robust Role-Based Access Control (RBAC) system that ensures each team member can access exactly what they need. No more, no less.

You'll build this security system from the ground up, creating a flexible and scalable solution that could protect any number of resources. 

By the end of this exercise, you'll have implemented the same type of access control system used by major tech companies to secure their applications. 

Let's go. 🚀


## Getting Started

We've provided you with some starter code that includes:

- Basic Express server setup
- Mock authentication middleware (simulating a logged-in user)
- MongoDB connection configuration

```bash
secure-project-mgmt-rbac/
├── config/
│   └── roles.js
├── middleware/
│   └── rbac.js
├── models/
├── routes/
└── app.js
```

1. [Fork this repository](https://github.com/YOUR_ORG/secure-project-mgmt-rbac)
2. Clone the repository to your computer
3. Navigate to the project directory:
   ```bash
   cd secure-project-mgmt-rbac
   ```

4.	Install dependencies:
 ```bash
npm install
```

Note: The starter code includes mock authentication in ⁠app.js that allows you to test different roles by modifying the user object. You don't need to implement actual authentication for this exercise.

## Instructions

### Task 1: Configure Roles and Permissions

1. Within the `config/` folder in `roles.js`, define the following **permissions** as constants for the following core actions:

    - **Project Operations**
        - Create new projects
        - View projects
        - Update projects
        - Delete projects
    - **Task Operations**
        - Create new tasks
        - View tasks
        - Update tasks
        - Delete tasks
    - **Team Operations**
        - View team members
        - Manage team members

2. In `roles.js`, create the following roles with specific access levels:

- **ADMIN**
    - Full access to all operations
- **PROJECT_MANAGER**
    - Can perform all project operations
    - Can perform all task operations
    - Can view team members and manage team members
- **TEAM_LEAD**
    - Can view projects
    - Can perform all task operations
    - Can view team members
    - *Cannot create or delete projects*
    - *Cannot manage team members*
- **DEVELOPER**
    - Can view projects
    - Can view and update tasks
    - Can view team members
    - *Cannot create or delete projects*
    - *Cannot create or delete tasks*
    - *Cannot manage team members*
### Task 2: Create the User Model

Create the `User` Model in `models/User.js` with the following fields:

- `username` (required, unique)
- `email` (required, unique)
- `role` (enum, make sure to include the roles you defined in the `roles.js` configuration)

### Task 3: Create the Project Model

Create the Project Model in `models/Project.js` with:

- title (required)
- description
- status (enum with values: "planning", "active", "completed")
- teamMembers (array of User references)

### Task 4: Create Project Routes

Inside `routes/project.routes.js`, define the following routes:

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Task 5: Implement Basic Permission Middleware

Create a middleware function in `middleware/rbac.js` that:

- Takes a required permission as an argument
- Verifies if the authenticated user has the required permission
- Handles cases where:
    - User is not authenticated
    - User lacks the required permission
- Returns appropriate error messages and status codes

### Task 6: Implement Role Middleware

Create a role-checking middleware that:

- Takes a required role as an argument
- Verifies if the authenticated user has the exact role

### Task 7: Basic Route Protection

Apply your middleware to protect the project routes:

1. View Projects (GET /api/projects)
    - Use permission middleware to check for `VIEW_PROJECT`
    - All roles should have access
2. Create Project (POST /api/projects)
    - Use role middleware to restrict to `PROJECT_MANAGER` and `ADMIN`
3. Update Project (PUT /api/projects/:id)
    - Use permission middleware to check for `UPDATE_PROJECT`
4. Delete Project (DELETE /api/projects/:id)
    - Use role middleware to restrict to `ADMIN` only

Test these basic protections using Bruno to ensure they work as expected!

Remember, we're mocking the user authentication in `app.js` so you can change the role accordingly to test different access scenarios.

### Task 8: Enhance Permission Middleware (ANY Strategy)

Currently, our permission middleware can only check for a single permission at a time. This becomes limiting when we want to allow access based on having any one of several valid permissions.

For example, what if we want to allow project creation by users who have either the `CREATE_PROJECT` permission OR the `MANAGE_TEAM` permission? 

Our current middleware can't handle this "OR" logic.

Create an enhanced version of your permission middleware that:

- Accepts multiple permissions
- Grants access if the user has ANY of the specified permissions
- Returns appropriate error messages when none of the required permissions are present

This enhancement allows for more flexible access control patterns, particularly useful when different types of users should be able to perform the same action.

### Task 9: Implement ALL Permission Strategy

While the ANY strategy is useful, there are scenarios where we need to ensure a user has multiple permissions simultaneously.

Our current middleware can't enforce this requirement.

Imagine if we want to ensure the user has both `UPDATE_PROJECT` permission AND `MANAGE_TEAM` permission. This requires an "AND" logic check.

Create a middleware function in `middleware/rbac.js` called `hasAllPermissions` that:

- Requires ALL specified permissions to be present
- Only grants access if the user has every required permission
- Provides clear error messages indicating which permissions are missing

This stricter permission checking is crucial for operations that require multiple capabilities to be performed safely.

### Task 10: Advanced Route Protection

Now that we have more sophisticated permission checking strategies, let's enhance our existing routes with more nuanced access control.

1. **Enhanced Project Update (PUT /api/projects/:id)**
   Your update route should handle two scenarios:

    a) Basic Project Updates
    - When updating title, description, or status (without teamMembers), 
    require only `UPDATE_PROJECT` permission
    
    b) Team Modifications
    - When the request includes `teamMembers` in the body, use **ALL strategy** to verify that the user has both permissions:
        - `UPDATE_PROJECT` permission
        - `MANAGE_TEAM` permission

2. **Enhanced Project Creation (POST /api/projects)**
   Use **ANY strategy** to allow access if user has either:
    - `PROJECT_MANAGER` role
    - `CREATE_PROJECT` and `MANAGE_TEAM` permissions

### Task 11: Testing with Bruno

Test the following scenarios to verify your enhanced RBAC implementation:

1. Test ALL Permission Strategy (Team Modification):
    - Try updating team members as `ADMIN`
    - Try updating team members as `PROJECT_MANAGER`
    - Try updating team members as `TEAM_LEAD`
    - Try updating team members as `DEVELOPER`

2. Test ANY Permission Strategy (Project Creation):
    - Try creating project with `PROJECT_MANAGER` role
    - Try creating project with `CREATE_PROJECT` permission only
    - Try creating project with `MANAGE_TEAM` permission only
    - Try creating project with `DEVELOPER` role

3. Test Regular Updates vs Team Updates:

```javascript
// Test 1: Regular Update (needs only UPDATE_PROJECT)
PUT /api/projects/:id
{
    "title": "Updated Title",
    "status": "active"
}

// Test 2: Team Update (needs both permissions)
PUT /api/projects/:id
{
    "title": "Updated Title",
    "teamMembers": ["userId1", "userId2"]
}
```


## Submission

When you've completed the exercise:

```bash
git add .
git commit -m "Completed Secure Project Management API with RBAC"
git push origin main
```

Submit your GitHub repository URL below:

_________


## Frequently Asked Questions (FAQs)

<details>
<summary>What's the difference between role-based and permission-based checks?</summary>

```javascript
// Role-based: Checks the user's role directly
hasRole('ADMIN')

// Permission-based: Checks specific permissions
hasPermission('CREATE_PROJECT')
```

</details>

<details>
<summary>How do I test different roles with the mock authentication?</summary>

```javascript
// In your request, modify the mock user:
req.user = {
    _id: 'someId',
    role: 'PROJECT_MANAGER',
    // The middleware will check permissions based on this role
};
```
</details>

<details>
<summary>What's the difference between ANY and ALL permission strategies?</summary>

```javascript
// ANY (OR logic) - Grants access if user has any of these
hasAnyPermission(['CREATE_PROJECT', 'MANAGE_TEAM'])
// ALL (AND logic) - Requires all permissions
hasAllPermissions(['UPDATE_PROJECT', 'MANAGE_TEAM'])
```
</details>

<details>
<summary>How do I handle the check for multiple permissions?</summary>

```javascript
const hasAnyPermission = (requiredPermissions) => {
    // Convert input to array even if single permission
    let permissions; 
    if (Array.isArray(requiredPermissions)) {
        permissions = requiredPermissions;
    } else {
        permissions = [requiredPermissions];
    }
    return (req, res, next) => {
        // Method 1: Using for loop
        for (let permission of permissions) {
            if (userRole.permissions.includes(permission)) {
                return next(); // User has at least one permission
            }
        }
        return res.status(403).json({ message: 'Insufficient permissions' });
    };
};
```
</details>
<details>
<summary>How do I handle team member updates correctly?</summary>

```javascript
// Check if request includes team members
if (req.body.teamMembers) {
    // Need both permissions
    hasAllPermissions([
        'UPDATE_PROJECT',
        'MANAGE_TEAM'
    ])(req, res, next);
} else {
    // Just need basic update permission
    hasPermission('UPDATE_PROJECT')(req, res, next);
}
```
</details>

<details>
<summary>How should I structure my roles and permissions?</summary>

```javascript
// Example structure
const PERMISSIONS = {
    CREATE_PROJECT: 'create:project',
    UPDATE_PROJECT: 'update:project'
};

const ROLES = {
    ADMIN: {
        name: 'ADMIN',
        permissions: [/* all permissions */]
    }
};
```
</details>

</section>

