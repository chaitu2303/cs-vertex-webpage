# Admin User Guide

The CS Vertex Admin Command Center allows you to manage all aspects of the public website dynamically.

## Accessing the Portal
1. Navigate to `https://yourdomain.com/admin/login`
2. Enter your secure administrator credentials.
3. You will be redirected to the Command Center dashboard.

## Dashboard Overview
The dashboard provides a high-level overview of live analytics, quote conversions, academy metrics, and system security logs. 
Metrics are fetched dynamically from the database.

## Managing Website Content
All public sections are driven by the CMS database. When you Create, Update, or Delete items, the changes reflect instantly on the live site.

- **Team**: Add leadership or executive members. Note: `priority` determines the sort order.
- **Projects**: Showcase portfolio items. Use the Cloudinary integration to upload high-quality thumbnails.
- **Announcements & Brochures**: Add banners to the Notice Board. Set them as "Featured" or "Priority" to adjust ordering.
- **FAQs**: Manage Frequently Asked Questions for the main site and portal.
- **Careers & Learning**: Add Job Openings, Courses, and Workshops.

## Leads and CRM
- **Notify Me**: View and track user leads captured from the contact forms. Use the side-drawer to leave internal notes and update status workflows.
- **Quotes**: Track multi-step project quotes. Update the status to `Approved` or `Rejected`.

## Security Features
- Your session automatically expires (default is 8 hours).
- Access to backend mutations (`/api/admin/*`) is strictly guarded by Middleware.
- All actions (Updates, Deletes, Creates) are tracked in the **Security Log** (Audit Log) on the Dashboard.
