# Finonest API Endpoints Documentation

## Authentication Endpoints
- `POST /api/validate` - User authentication/login

## Admin Endpoints
- `GET /api/admin/bankers` - Get all bankers
- `PUT /api/admin/bankers/{id}` - Update banker
- `PUT /api/admin/bankers/{id}/status` - Update banker status
- `GET /api/admin/contact-forms` - Get contact form submissions
- `GET /api/admin/forms` - Get all form submissions
- `PUT /api/admin/forms/{id}` - Update form status
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}` - Update user

## Loan Application Endpoints
- `POST /api/loan-application` - Submit loan application (onboarding)
- `GET /api/loan-applications` - Get all loan applications (admin)
- `GET /api/forms` - Get user's own forms
- `POST /api/forms` - Submit new form

## Content Management
- `GET /api/blogs` - Get public blogs
- `GET /api/blogs/admin` - Get admin blogs
- `GET /api/blogs/{id}` - Get blog by ID
- `GET /api/blogs/slug/{slug}` - Get blog by slug
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/{id}` - Update blog
- `DELETE /api/blogs/{id}` - Delete blog

## Branch Management
- `GET /api/branches` - Get all branches
- `GET /api/branches/admin` - Get admin branches
- `POST /api/branches` - Create branch
- `PUT /api/branches/{id}` - Update branch
- `DELETE /api/branches/{id}` - Delete branch
- `PUT /api/branches/{id}/position` - Update branch position

## Career Management
- `GET /api/careers/jobs` - Get all jobs
- `POST /api/careers/jobs` - Create job
- `PUT /api/careers/jobs/{id}` - Update job
- `DELETE /api/careers/jobs/{id}` - Delete job
- `GET /api/careers/applications` - Get job applications
- `POST /api/careers/apply` - Submit job application
- `PUT /api/careers/applications/{id}` - Update application status

## Course Management
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course
- `GET /api/enrollments` - Get enrollments
- `PUT /api/enrollments/{id}` - Update enrollment

## Settings & Configuration
- `GET /api/settings` - Get all system settings
- `PUT /api/settings/{key}` - Update specific setting
- `GET /api/settings/razorpay-key` - Get Razorpay key
- `GET /api/ai-config.php` - Get AI configuration

## Slides & Media
- `GET /api/slides.php` - Get all slides
- `POST /api/slides.php` - Create slide
- `PUT /api/slides.php?id={id}` - Update slide
- `DELETE /api/slides.php?id={id}` - Delete slide
- `POST /api/upload-image` - Upload image

## External API Integrations
- `POST /api/pan-verify.php` - PAN verification
- `POST /api/credit-report.php` - Credit report
- `POST /api/rc-surepass.php` - RC verification
- `POST /api/car-valuation.php` - Vehicle valuation
- `POST /api/policy-engine.php` - Loan eligibility engine

## Banker & Lead Management
- `GET /api/bankers/lenders` - Get lenders
- `GET /api/bankers?lender_id={id}` - Get bankers by lender
- `POST /api/leads` - Create lead
- `POST /api/contact` - Contact form submission

## Database Management
- `POST /setup-database.php` - Auto-create database tables
- `POST /process-banker-form.php` - Process banker registration

## Products
- `GET /api/products` - Get loan products

## Status Check
All endpoints return JSON responses with:
```json
{
  "success": boolean,
  "data": object|array,
  "message": string,
  "error": string (if error)
}
```

## Missing Endpoints (Need to be created)
- `GET /api/loan-applications` ✅ Created
- Admin dashboard analytics endpoints
- Bulk operations endpoints
- Export/Import endpoints