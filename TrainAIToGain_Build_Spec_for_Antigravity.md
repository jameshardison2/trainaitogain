<USER_REQUEST>
make these update to the sandbox: TrainAIToGain Website Flow Redesign
Oct 7, 2026 · @James Hardison 
The site keeps its current look exactly. Visitors go Home → ATS Resume Scan → Mock Interview → Active Roles → Apply on Mercor or micro1. The Mock Interview is a real step in the path, but anyone ready to apply can skip it. Only links, labels and page order change.
The flow
Step
Page
What the visitor does
Why it sits here (GA4, last 90 days)
Start
Home /
Clicks Scan My Resume
Most visited page (1,257 views)
1
ATS Resume Scan /resume-ats-guide
Uploads resume, gets ATS score and matched roles
Most engaged page: 337 scans, 119 role matches, longest time on page, lowest bounce
2 (optional)
Mock Interview /ai-interview
Practices the AI interview
The AI interview is the real roadblock. Only 1 mock started so far, so it must be easy to find but never forced
3
Active Roles /apply
Picks a role, clicks Apply
Where you get paid: 73 apply clicks
Finish
Mercor or micro1
Applies through your referral link
All 433 Apply buttons already carry your referral links
Return visits
My Pipeline Dashboard
Tracks saved, scanned and applied roles
Keeps people coming back
Anyone ready to apply goes straight from Step 1 to Step 3. The Get Free Blueprint popup feeds into Step 2.
Ground rules
Stays exactly as is
• Logo and wordmark, colors (black and white with the green accent), fonts, button shapes, card styles, spacing
• Every icon in the header, cards, buttons and section headings
• Top banner, navigation bar style, footer, Ask AI Recruiter chat bubble, cookie banner
• Role card options on Active Roles: Apply, Check, Save, the copy-title icon, category tags, HOT ROLE badge, rate and the How to apply box
• My Pipeline Dashboard and all its functionality: Pipeline Volume, Avg Potential Pay, the Saved → ATS Scanned → Applied funnel, Clear All, Status dropdown, Set Reminder, Check Match vs This Role, Prep for This Role, Apply Now and remove (×)
• Google Analytics: the GA4 tag on every page and every existing event name
• The Internal Team Hub (CRM / Outreach and Partner Dashboard). This plan does not touch it.
What changes
• Header order, with ATS Resume Scan added and The Playbook removed
• Where buttons point, plus a next-step button at the bottom of each step page
• A short Step line at the top of each step page
• The Playbook page is removed and redirected
Header (identical on every page)
Logo · ATS Resume Scan · Mock Interview · Active Roles · Dashboard · [Get Free Blueprint]
Header item
Goes to
Change
Logo
/
none
ATS Resume Scan
/resume-ats-guide
new, first position
Mock Interview
/ai-interview
moved to second, matching the step order
Active Roles
/apply
moved to third
Dashboard
My Pipeline Dashboard
none
Get Free Blueprint (green button)
existing email popup
none
The Playbook
removed
page redirected to /resume-ats-guide
• Use the same order in the mobile menu, and highlight the current page with your existing green accent.
• The Mock Interview page currently has its own separate nav. Swap it for this header.
• The top banner stays: See roles open this week → /apply.
Page by page (links and labels only)
Page
Line at the top
Main button
Secondary link
Home /
no change
Scan My Resume ➔ /resume-ats-guide
No resume? Browse all roles → /apply
ATS Resume Scan /resume-ats-guide
Step 1: Make your resume pass the AI screen
See My Matching Roles ➔ /apply
Practice the AI interview first → /ai-interview
Mock Interview /ai-interview
Step 2 (optional): Practice before your AI interview
You're ready. Apply to your matched roles ➔ /apply (already there)
none
Active Roles /apply
Step 3: Apply to roles you fit
Each role's Apply → referral link (no change)
Not ready? Practice the interview → /ai-interview
Blueprint email popup
no change
After submit, go to /ai-interview (was the Playbook)
none
My Pipeline Dashboard
no change
no change
Check that Prep for This Role goes to /ai-interview, not the Playbook
Homepage: hide the resume match box you added, so there is one upload on the ATS page. Optional: a How it works strip with three cards in your existing card style (Scan → Practice → Apply), each linking to its page.
Playbook: delete /hiring-pipeline and redirect it to /resume-ats-guide (it had 267 views, so old links must still work). Search every page for hiring-pipeline and repoint each link: prep links → /ai-interview, everything else → /resume-ats-guide.
Fix before going live
[ ] Active Roles: code showing in all role titles. Run fix_copy_icons.py in the site folder.
[ ] Homepage: Apply Now and Prep First buttons do nothing (broken quote marks). Not needed if the match box is hidden.
[ ] Homepage Blueprint block: remove the words exact fill-in-the-blank
[ ] Homepage: remove Most people who get hired practice the AI interview first, until the debrief backs it up
[ ] Playbook redirect works, and no links still point to hiring-pipeline
Tracking
Keep every existing GA4 event. These measure each step of the new flow:
Step
Event
Last 90 days
1. Resume scanned
clicked_scan_button
337
1. Roles matched
auto_matched_role
119
2. Mock started
mock_started
1
2. Interview scored
interview_scored
4
3. Applied out
apply_click
73
Email captured
generate_lead
1
Compare these 30 days after launch. apply_click matters most. mock_started shows whether making the Mock Interview a visible step worked.
Build order
1. Run fix_copy_icons.py so Active Roles titles display clean.
2. Update the header on every page, including the Mock Interview page.
3. Repoint the homepage hero button and hide the homepage match box.
4. Add the Step lines and next-step buttons on the ATS, Mock Interview and Active Roles pages.
5. Change the Blueprint popup redirect to /ai-interview.
6. Remove the Playbook, set the redirect, repoint every hiring-pipeline link.
7. Clean up the homepage copy.
8. Click through the whole flow on localhost, then publish.
Loose ends to resolve
These are not solved by this plan. Each needs a decision or work from you.
[ ] The real drop-off is finishing the application, which includes the AI interview. Mercor: 12 signed up, 25 applications started, 5 completed, 3 hired, 2 paid. micro1: 2 valid referrals (Rhealyn Arriola and Ariel Moncure, both referred Oct 6 and still applying), 0 AI interviews completed so far. Run the debrief with your 3 Mercor hires (Cory Tillman, Nzhada Harris, Saraswati Raut): what got them through the AI interview, and what almost stopped them. Their answers decide what the Mock Interview teaches. Send your 2 micro1 referrals to the Mock Interview now, before their AI interview.
[ ] Stale roles. Use your Sync Mercor Jobs bookmark to refresh the roles every Monday and whenever a Mercor wave email arrives. Check that it updates both waves.json and the 52 cards typed directly into apply.html. If it only updates one, move those cards into waves.json so there is one list.
[ ] Two dashboard pages. Both /dashboard and /saved-roles get traffic. Confirm which file is My Pipeline Dashboard and point every dashboard link to it.
[ ] Mock Interview barely used. 1 start in 90 days. After launch, check whether the Step 2 placement raises mock_started. If not, the page content needs work, not the flow.
[ ] Email capture is weak. The Blueprint popup produced 1 lead in 90 days, while 75 forms were started on the homepage. Find out which form people start and abandon.
[ ] Homepage match box does not read the resume. It shows roles from waves.json no matter what is uploaded. It is hidden in this plan. If you ever bring it back, it needs real matching first.
[ ] Resume privacy line. The homepage box says the resume is not stored, which is true there. Confirm the ATS page says what happens to uploaded resumes, and that it is accurate.
[ ] Unsourced claims. Remove or back up any number on the site you cannot source, such as the stats removed from the homepage earlier.
Next actions outside the site
[ ] Send the mock interview nudge to Rhealyn Arriola and Ariel Moncure (micro1, both still applying). Draft below, review before sending.
[ ] After they finish, check the micro1 dashboard: did AI interview completed move from 0?
[ ] Run the debrief with Cory Tillman, Nzhada Harris and Saraswati Raut.
[ ] Check the Mock Interview page content. It currently explains the Mercor AI interview. micro1 referrals need micro1-specific notes, or a line saying the practice applies to both.
Draft: mock interview nudge (micro1 referrals)
Hi Rhealyn,
Glad to see your micro1 application is underway. The next step is the AI interview, and that's where most people get stuck.
Before you take it, try our free mock interview so the real one feels familiar: trainaitogain.com/ai-interview
A few quick tips: pick a quiet spot with good lighting, test your camera and mic first, and keep your resume handy.
If anything comes up during the process, just reply here. Happy to help.
James, TrainAIToGain
Same message for Ariel, with the name swapped.
Debrief questions (for your 3 hires)
1. What almost made you stop before finishing the application?
2. What was the AI interview like? What surprised you?
3. What did you do to prepare, if anything?
4. What would you tell someone about to take it?
5. Is there anything we could have sent you that would have helped?
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-07T09:13:41-04:00.
</ADDITIONAL_METADATA>