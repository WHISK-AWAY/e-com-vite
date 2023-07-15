#! /bin/sh

docker build -t pbryan9/patty-private:e-com-server server
docker build -t pbryan9/patty-private:e-com-frontend .