# Trivia Scoresheet

Work in progress. Using Docker, Next, and Mongoose with Mongo DB.

Todo:
 v1
    - Form validation / error feedback
    - Chat:
        - Player to host
        - Host to player
    - manually alter score on sheet
    - User row to scoresheet fails on 2nd time
    - Make 10 Q game work
    - It would be nice to have some form of custom event trigger via chat. Like a class change or something to make shit go whoosh.

 v2
    - Video
    - Game creator / editor - for templates, custom questions, custom structure
    - Some API for multimedia questions
    - Multiple players on a team (figure out how to manage controls)
    - Add "buzzer" for lightning round (would be a fun finisher and a way to actually award prizes)
    - Could also do this through chat rather than video - fire text questions at players and show their answers in real time to audience.

    CHAT

    When client and host join, they emit game id.
    When client joins, their team id is also broadcast
    host: join, game id
    client: join, game id, team id
    App creates an entity called gameid and adds players to it