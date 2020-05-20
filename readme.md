# Trivia Scoresheet

Work in progress. For scoring online trivia matches.

Dependencies:
- Nodejs
- Docker
- NPM
- Gulp
- Yarn

To Install:

1. Add .env, appserver/dist/env.js (sample files in root)
2. yarn install
3. yarn startserver-dev to build and launch dev environment, or yarn startserver-prod

Wishlist
- Video
- Audio
- Game creator / editor - for templates, custom questions, custom structure
- Some API for multimedia questions
- Multiple players on a team (figure out how to manage controls)
- Add "buzzer" for lightning round (would be a fun finisher and a way to actually award prizes)
- Could also do this through chat rather than video - fire questions at specific players / teams and show their answers in real time to audience or prize individually.

Adding https and Certs.

Currently Adding audio:
- Add team functionality
- Add audio to client first.
- Make it so one team member calls another team member on join when audio is enabled