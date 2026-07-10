#!/bin/bash 

#kill all tmux sessions 
tmux kill-server 2>/dev/null

#cd into my project folder
cd ~/MLH-Portfolio-Droplet

#Fetch changes 
git fetch && git reset --hard origin/main

#Activate the virtual environment
source python3-virtualenv/bin/activate

#install dependencies
pip install -r requirements.txt

#start tmux session
tmux new-session -d -s flask \
'cd ~/MLH-Portfolio-Droplet && source python3-virtualenv/bin/activate && flask run --host=0.0.0.0'

