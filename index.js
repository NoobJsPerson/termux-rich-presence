require("dotenv").config();
const ws = require("ws"),
	os = require ("os"),
	fetch = require("node-fetch"),
	{ token } = process.env;
let dws = new ws('wss://gateway.discord.gg/?v=7&encoding=json'), interval, session_id, seq=0, isPonged, isResume, mfn, efn, activity = require("./activity.json");
function validateAssetId(id){
	if(!isNaN(id)){
		let result;
		fetch(`https://discord.com/api/v8/oauth2/applications/${id}/assets`)
		.then(x => x.json())
		.then(y => result = y[id]);
		while(!result);
		return result;
	}
	return id;
}
[activity.assets.large_image, activity.assets.small_image] = [validateAssetId(activity.assets.large_image), validateAssetId(activity.assets.small_image)];
if(!activity.timestamps){
	activity.timestamps = (Date.now() / 1000) >>> 0;
}
mfn = dws.onmessage = ({data}) => {
const json = JSON.parse(data);
if(json.s) seq = json.s;
switch(json.op){
		case 10:
		console.log("Debug: 10 Hello");
		reconnect = true;
		interval = setInterval(()=> {
					console.log("Debug: 1 Ping");
					dws.send(JSON.stringify({op:1,d: seq}));
					isPonged = false;
			},json.d.heartbeat_interval);
		
		if(!isResume){
			console.log("Debug: 2 IDENTIFY");
			dws.send(JSON.stringify({
	  op: 2,
	 d: {
    token: token,
    intents: 0,
    properties: {
      $os: process.platform,
      $browser: "Discord Android",
      $device: os.type()
    		},
    		presence: {
    			activities: [activity],
    			status:"online",
    			afk:false
    		},
    		compress:false
			}
		}));
			isResume = true;
		} else {
			console.log("Debug: (6) started RESUME");
			dws.send(JSON.stringify({
	 		op:6,
	 		d:{
				token,
				session_id,
				seq
			}
			}));
		}
		break;
		case 1:
			if(!isPonged) dws.close(4001);
			console.log("Debug: (1) Pinged");
			dws.send(pingstr);
			isPonged = false;
			break;
		case 9:
			console.log("Error: (9) Invalid session");
			dws.close(4001);
			break;
		case 7:
			console.log("Debug: (7) Reconnection");
			dws.close(4001);
			break;
		case 11:
			console.log("Debug: (11) Ponged");
			seq = json.d;
			isPonged = true;
	}
	if(!json.t) return;
	switch(json.t){
	case "READY":
	session_id = json.d.session_id;
	console.log(`client ready on ${json.d.user.username}#${json.d.user.discriminator}`);
	break;
	case "RESUMED":
		console.log("Debug: (6) ended RESUME");
}
	
};
efn = dws.onclose = dws.onerror = ({code, reason, error}) => {
	console.log(`Closed: ${error||code+' '+reason}`);
	clearInterval(interval);
	dws = new ws('wss://gateway.discord.gg/?v=7&encoding=json');
	dws.onclose = dws.onerror = efn;
	dws.onmessage = mfn;
};
