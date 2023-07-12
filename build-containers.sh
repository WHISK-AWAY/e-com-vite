#! /bin/sh

echo 'Building docker containers for e-com project.'

docker build -t e-com_server:latest server
docker build -t e-com_frontend:latest .

echo 'Done'