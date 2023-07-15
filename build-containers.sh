#! /bin/sh

docker build -t patty-private:e-com-server server
docker build -t patty-private:e-com-frontend .