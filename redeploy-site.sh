#!/bin/bash 

#cd into my project folder
cd ~/MLH-Portfolio-Droplet

#Fetch changes 
git fetch && git reset --hard origin/main

#Activate the virtual environment
source python3-virtualenv/bin/activate

#install dependencies
pip install -r requirements.txt

#restart service
systemctl restart myportfolio
