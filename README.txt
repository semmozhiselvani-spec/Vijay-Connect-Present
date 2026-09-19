VIJAY CONNECT — PREMIUM CUSTOMER ACCOUNT + OTP

CUSTOMER ACCOUNT
- First website visit: premium center sign-in/register popup.
- Register: Full Name + Indian mobile number -> OTP -> cloud customer account.
- Sign in: Mobile number -> OTP.
- Skip: popup closes for that visit; next fresh visit can show it again.
- Successful login: popup stays hidden on future visits and header Sign in hides.
- Customer profile is stored in Supabase, not browser-only storage.
- Booking history can be stored against the same customer account.
- Reinstalling an APK/app does not delete the cloud account. The customer can enter the same phone number and OTP to restore the account.

SUPABASE OTP SETUP
1. Supabase Dashboard -> Authentication -> Providers -> Phone: enable Phone provider.
2. Configure a supported SMS provider in Supabase Auth (for example Twilio/MessageBird/Vonage depending on your Supabase plan/provider options).
3. Make sure your SMS provider is configured for India (+91) and production sending limits.
4. Run customer-account.sql once in Supabase SQL Editor.
5. Keep only the publishable/anon key in vc-supabase.js. Never put service_role/secret keys in the website.

CUSTOMER DATA TABLES
- customer_profiles: one profile per Supabase Auth user.
- customer_bookings: booking history linked to the customer Auth user.
- RLS policies in customer-account.sql restrict profile/booking access to the signed-in customer.

APK / INSTALLABLE APP
- manifest.webmanifest is included for a browser-installable PWA experience.
- A signed native Android APK still needs an Android wrapper/build step (Capacitor/WebView/Trusted Web Activity) and release signing. The cloud account is independent of the APK, so uninstall/reinstall does not remove customer data.

EXISTING OWNER CONTROL
The existing owner dashboard, offers/posters, festival banner, schedules, live cab tracking, booking flow and Supabase owner settings remain in place.
