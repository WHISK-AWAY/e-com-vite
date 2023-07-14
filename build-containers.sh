#! /bin/sh

echo 'Building docker containers for e-com project.'

docker build -t patty-private:e-com-server server
docker build -t patty-private:e-com-frontend .

echo 'Done'
