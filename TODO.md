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

10/27/2025
[] DraftInfo Card, Shows upcoming draft and if draft is soonish there needs to be a way to get into the draft waiting room
[] League Settings Validation
[] League Settings > Time Selector Validation, only let the valid times to be chosen
[] League Settings Service to handle the league settings, draft settings, etc
[] Setup a pathname detection to have the Navbar not show when in the /draft portion of the app

10/29/2025
[] If the user is not the commissioner then they shouldn't see the invite link on members page
[] Create a Schedule Draft Modal to pop up when the comissioner clicks on the schedule draft btn
[] Create a modal for inviting members by email

11/3/2025
[] CountDownTimer shouldn't show zeroed values like hours or days if there is only minutes left. DraftInfoCard and Waiting Room and Teams Page
[] Draft page are you sure if you want to navigate away from this page before letting you leave the current page


11/5/2025
[] Remove Player from queue PickQueue.tsx
[] Reorder Queue PickQueue.tsx
