# Authentication Flow Scenarios - Todo List

## Current Scenarios
- [x] Invite Flow - LoginForm → LoginSuccess/LoginFail
- [x] Invite Flow - RegisterForm → RegisterSuccess/RegisterInvalidForm/RegisterError
- [x] Navbar Flow - LoginForm → LoginSuccess/LoginFail
- [x] Navbar Flow - RegisterForm → RegisterSuccess/RegisterInvalidForm/RegisterError

## Missing Critical Scenarios

### 1. Invite-Specific Scenarios
- [ ] TokenInvalid - Invalid token format/doesn't exist
- [ ] TokenExpired - Token past expiration date
- [ ] TokenMaxUsesReached - League is full
- [ ] TokenAlreadyUsed - User already joined this league
- [ ] TokenValidationError - Server error during validation
- [ ] LoginSuccess + ValidToken → Join league flow
- [ ] LoginSuccess + InvalidToken → Show error, redirect to home
- [ ] RegisterSuccess + ValidToken → Join league flow
- [ ] RegisterSuccess + InvalidToken → Show error, redirect to home

### 2. Form Validation Scenarios

#### LoginForm Missing:
- [ ] EmptyFields - Email/password empty
- [ ] InvalidEmailFormat - Malformed email
- [ ] PasswordTooShort - Password validation
- [ ] AccountLocked - Too many failed attempts
- [ ] EmailNotVerified - User needs to verify email

#### RegisterForm Missing:
- [ ] EmptyFields - Username/email/password empty
- [ ] InvalidEmailFormat - Malformed email
- [ ] UsernameTaken - Username already exists
- [ ] EmailAlreadyExists - Email already registered
- [ ] PasswordTooWeak - Password doesn't meet requirements
- [ ] PasswordMismatch - Confirm password doesn't match
- [ ] EmailVerificationRequired - User needs to verify email

### 3. Authentication State Scenarios
- [ ] UserAlreadyLoggedIn - User tries to access login/register while logged in
- [ ] SessionExpired - User's session expired during form submission
- [ ] InvalidSession - Corrupted session data

### 4. Network/Server Scenarios
- [ ] NetworkError - No internet connection
- [ ] ServerUnavailable - Server down/maintenance
- [ ] TimeoutError - Request timed out
- [ ] RateLimitExceeded - Too many requests

### 5. Email Verification Flow
- [ ] EmailVerificationPending - User registered but needs to verify
- [ ] EmailVerificationExpired - Verification link expired
- [ ] EmailVerificationInvalid - Invalid verification token
- [ ] EmailVerificationSuccess - Successfully verified

### 6. Password Recovery Flow
- [ ] ForgotPasswordForm → EmailSent
- [ ] ForgotPasswordForm → EmailNotFound
- [ ] ForgotPasswordForm → EmailError
- [ ] ResetPasswordForm → PasswordResetSuccess
- [ ] ResetPasswordForm → TokenExpired
- [ ] ResetPasswordForm → TokenInvalid

### 7. Modal/UI State Scenarios
- [ ] ModalClosed - User closes modal without completing action
- [ ] ModalEscaped - User presses Escape key
- [ ] ModalBackdropClicked - User clicks outside modal
- [ ] ViewSwitched - User switches between login/register/forgot-password

### 8. Redirect Scenarios
- [ ] RedirectToLeagueCreate - After login with temp league data
- [ ] RedirectToInvite - After login with invite token
- [ ] RedirectToHome - Default redirect
- [ ] RedirectToPreviousPage - Return to where user came from

## Implementation Priority

### High Priority
- [ ] Form validation (EmptyFields, InvalidEmailFormat, etc.)
- [ ] Error handling improvements
- [ ] Email verification flow
- [ ] Invite token validation states

### Medium Priority
- [ ] Password recovery flow
- [ ] Session management
- [ ] Network error handling

### Low Priority
- [ ] Advanced redirects
- [ ] Rate limiting
- [ ] Modal behavior enhancements

## Notes
- Current auth actions redirect to `/error` on failure - consider more specific error handling
- RegisterForm missing confirm password field
- LoginForm and RegisterForm need better error message display
- AuthModalContext has `forgot-password` view but no implementation
- Consider adding loading states during authentication
- Add proper form validation before submission
