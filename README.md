# termux-discord-activity
a small tool using using nodejs and bash to give you a discord playing status about termux and its sessions
### Setup
follow these steps to get the tool up and running
- clone the repo
```sh
git clone https://github.com/NoobJsPerson/termux-discord-activity
```
- cd to the clone folder, give the setup script execution permissions and run it
```sh
cd termux-discord-activity && chmod +x setup.sh && ./setup.sh
```
- stop termux by pressing exit on the notification bar and open it again
- replace `yourtokenhere` by your discord token in the `.env` file
- install the dependencies
```sh
npm install
```
- run the nodejs server
```sh
node index.js
```
- wait about 10 seconds
- taadaa! it should've worked by now if you did all the steps correctly.
### Note
Always use the `exit` command to close all your sessions if you want to exit from termux or itll break

please make an issue if you faced a problem or want to give a suggestion
