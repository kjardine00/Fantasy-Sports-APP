10/8/2025
[] AuthModal - CSS and Styling
[x] AuthModal - When clicking outside the window page reloads because it is 
    supposed to dissmiss the pop-up but when a user shouldn't be allowed to move on, needs to be accounted for
[] LoginForm/RegisterForm - The routes and each case needs to be tested from a website flow perspective
[] LoginForm - Style the Error for failed login
[] RegisterForm - Confirm Password Field
[] Database>Queries - check all DB queries are updating the updated_at fields
[] Supabase - Setup Email
[] Supabase - Invite Email Migration from Resend I think? :shrug:


10/23/2025
[] Create an Error page where the UserContext can throw the user to when it errors


10/24/2025
[] Create updateLeagueSettingsAction in leagues_actions.ts that fetches current settings, merges with new values using spread operator ({ ...currentSettings, ...updates }), and saves back to database.
[] Add permission checking to ensure only commissioners/owners can update settings.
[] Wire up the action to the Settings page by uncommenting the handleSave implementation and importing the new action.

10/26/2025
[] Invites when the league is full -1 the invite doesn't work. Need to fix this bug so the league can actually become full

