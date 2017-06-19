# Replay

## Install and Run

1. Edit `docker-compose.yml`, and change configuration as needed.
1. Set the following environment variables for `wowza` service:
  - `WSE_MGR_USER` - pick user name
  - `WSE_MGR_PASS` - choose password
  - `WSE_LIC` - insert license code
1. Run `docker-compose up -d`
1. Open a browser at port 8088, and finish initialization of Wowza.

Once Wowza is initialized successfully, and all docker processes are running, Open a browser at the port specified in the `PORT` env of `server` service, and start using the app.
