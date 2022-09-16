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
