# ft_transcendence

This project is about creating a website for the mighty Pong contest in nestJs for the backend and Angular for the frontend using a postgres database.

## 42 OAuth API setup

Create an api on 42's intranet with the following data:

- website: `http://localhost:3000`
- redirect URI: `http://localhost:4200/auth/oauth42/callback`

Then, run locally `make set_local_env`. You will be prompted for your API client id (UID) and secret.

## Building ft_transcendence - dev 

```
~ git clone git@github.com:luweglarz/ft_transcendence.git
~ cd ft_transcendence
~ make set_local_env
OAUTH client ID: your 42 OAUTH credentials
OAUTH client secret (hidden): your 42 OAUTH credentials
~ make
```
Then you can access to the frontend throught:
``` http://localhost:4200/```
## Chat - commands

Admin commands:
```
/admin [username] - Grant admin priviledge to an user.
/deadmin [username] - Revoke the admin priviledge of an admin.
/ban [username] ![chrono] - Ban an user from the chat room.
/kick [username] - Kick an user from the chat room.
/mute [username] ![chrono] -  Mute an user of the chat room.
/invite [username] - Invite an user into the chat room.
/password [password] - Change the password of a protected room.
```
User commands:
```
/leave - Leave the chat room.
/challenge [username] - Challenge to a private game an user of the chat room.
/whisper [username] [message] - Whisper to an user in the chat room.
```
