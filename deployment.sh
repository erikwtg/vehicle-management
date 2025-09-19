#!/bin/bash

if docker network inspect vehicle_management_network &>/dev/null; then
  echo "Network vehicle_management_network already exists."
else
  docker network create vehicle_management_network
  echo "Network vehicle_management_network created."
fi

docker-compose -f docker-compose.yml up -d --build

echo "Containers started successfully."

if docker ps --filter "network=vehicle_management_network" | grep -q "server"; then
  echo "Container is running and connected to the network."
else
  echo "Container is not running or not connected to the network."
fi