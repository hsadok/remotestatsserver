# RemoteStats - Server
RemoteStats makes possible to inspect realtime information about a remote machine using a browser. This is what runs in the server.

## Deploying to Heroku
RemoteStats runs on Sinatra, which makes it really easy to deploy to Heroku.
First clone the repo:

    $ git clone https://github.com/hugombarreto/remotestatsserver.git
    $ cd remotestatsserver

Assuming you have Heroku setup. Create an app on Heroku:

    $ heroku create

And deploy:

    $ git push heroku master

## Client
For information about the client see [RemoteStatsClient](https://github.com/hugombarreto/remotestatsclient).
