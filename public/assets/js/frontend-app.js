
var options = {
  valueNames: [ 'name', 'city' ]
};

var hackerList = new List('hacker-list', options);
var d = new Date();
var viewModal = function(id) {
	console.log(id)
	document.getElementById(id).style.display = ''
}
var hideModal = function(id) {
	console.log("hiding modal: " + id)
	document.getElementById(id).style.display = 'none'
}

var headers, rows
var polylines = []

var populateAssetOptions = function() {
	document.getElementById('listNodeIds').options.length = 0
	Object.keys(assets).map( (asset) => {
		console.log(asset)
		var opt = document.createElement("option")
		opt.text = asset
		opt.value = asset
		document.getElementById('listNodeIds').options.add(opt)
	})
}

var removeAssetPaths = function ( id ) {
	Object.keys(assets).map( (asset) => {
		removeAssetPath(asset)
	})
}

var removeAssetPath = function ( id ) {
	mymap.removeLayer(assets[id]['path'])
}

var drawAssetPath = function( id ) {
	assets[id]['path'] = new L.Polyline( assets[id]['points'], {
			color: "rgb(" + genRandomNums() + ")",
			weight: 1,
			opacity: 0.8,
			smoothFactor: 0
	})
	assets[id]['path'].addTo(mymap);
}

var drawAssetPaths = function() {
	Object.keys(assets).map( (asset, asset_idx) => {
		drawAssetPath(asset)
	})
}

var submitFileColumnsForm = function() {
	var nodeIdSelect = document.getElementById('nodeIdSelect')
	var nodeLongitudeSelect = document.getElementById('nodeLongitudeSelect')
	var nodeLatitudeSelect = document.getElementById('nodeLatitudeSelect')
	var nodeTimeSelect = document.getElementById('nodeTimeSelect')
	hideModal('selectFileColumns')
	for (i in rows) {
		var row = rows[i].replace(/\r?\n|\r/g, " ").split(',')
		if (! assets[row[nodeIdSelect.selectedIndex]]) {
			console.log("initializing new asset: " + row[nodeIdSelect.selectedIndex])
			initTrackableAsset( row[nodeIdSelect.selectedIndex], row[nodeLatitudeSelect.selectedIndex], row[nodeLongitudeSelect.selectedIndex], row[nodeTimeSelect.selectedIndex])
		} else {
			assets[row[nodeIdSelect.selectedIndex]]['points'].push([ row[nodeLatitudeSelect.selectedIndex], row[nodeLongitudeSelect.selectedIndex] ])
			assets[row[nodeIdSelect.selectedIndex]]['timestamps'].push(row[nodeTimeSelect.selectedIndex])
		}
		if (i == (rows.length - 1 )) {
			console.log("all rows imported")
			var pointLens = []
			var assetKeys = Object.keys(assets)
			console.log(assetKeys)
			assetKeys.map( (key, idx) => {
				pointLens.push(assets[key]['points'].length)
				if (idx == assetKeys.length - 1) {
					var maxLen = Math.max.apply( Math, pointLens)
					slider.setAttribute("max", maxLen )
				}
			})
		}
	}
	var timeView  = document.getElementById("timeView")
	timeView.onload = function () {
		timeView.innerHTML = (new Date()).toISOString()
	}
	slider.oninput = function() {
		for (id in assets) {
			if (assets[id]['points'][this.value]) {
				updateTrackableAsset( id, assets[id]['points'][this.value][0], assets[id]['points'][this.value][1], id)
			}
			if (assets[id]['timestamps'][this.value]) {
				document.getElementById("timeView").innerHTML = assets[id]['timestamps'][this.value]
			}
		}
	}
}
function handleFileSelect(evt) {
	var files = evt.target.files;
	for (var i = 0, f; f = files[i]; i++) {
		console.log(evt)
		var reader = new FileReader();
		reader.readAsText(f)
		reader.onload = (function(event) {
			console.log("file loaded")
			console.log(event)
				console.log("parsing as csv")
				var csv = event.target.result.split('\n')
				console.log("extracting headers")
				headers = csv[0].split(',')
				console.log(headers)
				rows = csv.slice(1, csv.length - 1)
				var selects = document.getElementsByTagName('select');
				viewModal('selectFileColumns')
				for (var i = 0; i < selects.length; i++) {
					for (var j = 0; j < headers.length; j++) {
						console.log("appending header: " + headers[j] )
						var opt = document.createElement("option");
						opt.text = headers[j]
						opt.value = headers[j]
						if (opt.text) {
							selects[i].options.add(opt)
						}
				}}
		});
	}
}
function createOptionsList(headers) {
	var options = []
	for (var i = 0; i < headers.length; i++) {
		console.log("appending header: " + headers )
		var option = document.createElement("option");
		option.text = headers[i]
		option.value = headers[i]
		if (option.text) {
			options.push(option)
		}
	}
	if (options.length == headers.length) {
		return options
	}
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);
var renderList = function() {
	var nodeList = document.getElementById("nodeList");
	nodeList.innerHTML = null
	var assetKeys = Object.keys(assets)
	for (idx in assetKeys) {
		nodeList.innerHTML += `
			<div class="nodeCard">
		     <h2>
	         ${assetKeys[idx]}
		     </h2>
		     <p >Location: ${assets[assetKeys[idx]]['points'].slice(-1)[0]}</p>
				 <p >Last Update: ${assets[assetKeys[idx]]['timestamps'].slice(-1)[0]}</p>
		  </div>
		`
	}
}
function loadJSON(callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', '/mqtt_creds', true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}
var animal_data
loadJSON(function(response) {
  console.log("Loading MQTT credentials")
  initMQTTClient(JSON.parse(response))
})

var initMQTTClient = function(mqttCreds) {
	var watson_channel = 'iot-2/type/' + mqttCreds.IOT_DEVICE_TYPE + '/id/' + mqttCreds.IOT_DEVICE_ID + '/evt/'+  mqttCreds.IOT_EVENT_TYPE + '/fmt/json'
	var cleanSession = true;
	var subscribeOptions = {
		onSuccess: function() {
			console.log("subscription set")
			mqttClient.onMessageArrived = function (messageObj) {
				var message = JSON.parse(messageObj.payloadString).d
				console.log( message)
				if ( ! assets[message['node_id']] ) {
					initTrackableAsset(message['node_id'], message['long'], message['lat'] )
				}
				if (message['sensor']) {
					updateTrackableAsset(message['node_id'], message['long'], message['lat'], Object.keys(message['sensor'])[0], message['sensor'][Object.keys(message['sensor'])[0]] ) // TODO, clean this up, it's hacky
				} else {
					updateTrackableAsset(message['node_id'], message['long'], message['lat'])
				}
			}
		}
	}

	var options = {
    timeout: 40,
    cleanSession: cleanSession,
    useSSL: false,
    userName: mqttCreds.IOT_API_KEY,
    password: mqttCreds.IOT_AUTH_TOKEN,
		onSuccess: function () {
			console.log("mqtt client connected")
			mqttClient.subscribe( watson_channel, subscribeOptions )
		},
		onFailure: function (err) {
			console.log("mqtt client failed to connect")
			console.log(options)
			console.log(err)
		}
	}
	var mqtt_host = mqttCreds.IOT_ORG_ID + '.messaging.internetofthings.ibmcloud.com'
	var mqtt_port = 1883
	var mqttClient = new Messaging.Client(mqtt_host, mqtt_port, "a:" + mqttCreds.IOT_ORG_ID + ":" + "client" + parseInt(Math.random() * 100, 10));
	mqttClient.connect(options)
}
var loadData = function() { }
var mymap = L.map("mapid").setView([34.000037, -118.317471], 100);
L.esri.basemapLayer("Topographic").addTo(mymap);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 100,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(mymap);

var nodes = {}
var assets = {}
var assetPoints = {}

var initTrackableAsset = function(id, long, lat, time, type = undefined, val = undefined) {
	console.log("initializing asset: " + id)
	var node = {
		marker: L.marker([long, lat]).addTo(mymap).bindPopup("<b>" + id +"</b>").openPopup(),
		points: [ new L.LatLng(long, lat) ],
		timestamps: [ time ]
	}
	if (type) {
		var node1 = Object.assign ({
			circle: L.circle([long, lat], val, {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.1
			}).addTo(mymap).bindPopup("LoRA Node: " + id)
		}, node)
		assets[id] = node1
		renderList()
		return node1
	} else {
		assets[id] = node
		renderList()
		return node
	}
}

var updateTrackableAsset = function (id, long, lat, time, type = undefined, val = undefined) {
	console.log("updating asset: " + id)
	if ( ! assets[id] ) {
		console.log("asset doesn't exist, creating: " + id)
		var asset = initTrackableAsset(id, long, lat, time, type, val)
	} else {
		console.log("loading asset: " + id)
		var asset = assets[id]
	}
	var newLatLng = new L.LatLng(long, lat);
	asset['marker'].setLatLng(newLatLng).update();
	asset['points'].push(newLatLng)
	asset['timestamps'].push(time)
	if (asset['circle']) {
			asset['circle'].setRadius( val )
			asset['circle'].setLatLng( newLatLng )
	}
	console.log("asset location updated")
}

var genRandomNums = function() {
	return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)].join(',')
}

function drawAnimalPaths( ) {
	slider.oninput = function() {
		for (id in assets) {
			console.log(id)
			console.log(this.value)
			if (assets[id]['points'][this.value]) {
				assets[id]['marker'].setLatLng( assets[id]['points'][this.value] ).update();
				console.log("updating " +  id + " to " + assets[id]['points'][this.value].toString())
			}
		}
	}

	for (id in animal_data) {
		initTrackableAsset(animal_data[id][0]['location-lat'], animal_data[id][0]['location-long'], id)
		animal_data[id].map( (row, row_idx) => {
			var newLatLng = [ animal_data[id][row_idx]['location-lat'], animal_data[id][row_idx]['location-long'] ]
			assets[id]['points'].push(newLatLng)
			if (row_idx == Object.keys(row).length ) {
				console.log("added all points, draw line")
				drawAssetPath(id)
			}
		})
	}
}

var popup = L.popup();

function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(mymap);
}

mymap.on('click', onMapClick);

var slider = document.getElementById("timeSlider");

slider.oninput = function() {
	Object.keys(assets).map( (id, idx) => {
		if (assets[id]['points'][this.value]) {
			assets[id]['marker'].setLatLng( assets[id]['points'][this.value] ).update();
			console.log("updating " +  id + " to " + assets[id]['points'][this.value].toString())
		}
	})
	document.getElementById("timeView").innerHTML = assets[id]['timestamps'][this.value]
}
var sampleSensorData = [
	{"d":{"sound":65,"timestamp":"2018-06-30T06:49:55.174Z"}},
	{"d":{"sound":81,"timestamp":"2018-06-30T06:50:55.174Z"}},
	{"d":{"sound":69,"timestamp":"2018-06-30T06:51:55.174Z"}},
	{"d":{"sound":66,"timestamp":"2018-06-30T06:52:55.174Z"}},
	{"d":{"sound":65,"timestamp":"2018-06-30T06:53:55.174Z"}},
	{"d":{"sound":81,"timestamp":"2018-06-30T06:54:55.174Z"}},
	{"d":{"sound":69,"timestamp":"2018-06-30T06:55:55.174Z"}},
	{"d":{"sound":66,"timestamp":"2018-06-30T06:56:55.174Z"}},
	{"d":{"sound":65,"timestamp":"2018-06-30T06:57:55.174Z"}},
	{"d":{"sound":81,"timestamp":"2018-06-30T06:58:55.174Z"}},
	{"d":{"sound":69,"timestamp":"2018-06-30T06:59:55.174Z"}},
	{"d":{"sound":66,"timestamp":"2018-06-30T07:00:55.174Z"}},
	{"d":{"sound":69,"timestamp":"2018-06-30T07:01:55.174Z"}},
	{"d":{"sound":82,"timestamp":"2018-06-30T07:02:55.174Z"}},
	{"d":{"sound":69,"timestamp":"2018-06-30T07:03:55.174Z"}},
	{"d":{"sound":66,"timestamp":"2018-06-30T07:04:55.174Z"}},
	{"d":{"sound":65,"timestamp":"2018-06-30T07:05:55.174Z"}},
	{"d":{"sound":81,"timestamp":"2018-06-30T07:06:55.174Z"}},
	{"d":{"sound":69,"timestamp":"2018-06-30T07:07:55.174Z"}},
	{"d":{"sound":66,"timestamp":"2018-06-30T07:08:55.174Z"}},
	{"d":{"sound":65,"timestamp":"2018-06-30T07:09:55.174Z"}},
	{"d":{"sound":82,"timestamp":"2018-06-30T07:10:55.174Z"}},
	{"d":{"sound":68,"timestamp":"2018-06-30T07:11:55.174Z"}},
	{"d":{"sound":120,"timestamp":"2018-06-30T07:12:55.174Z"}},
	{"d":{"sound":69,"timestamp":"2018-06-30T07:13:55.174Z"}},
	{"d":{"sound":82,"timestamp":"2018-06-30T07:14:55.174Z"}},
	{"d":{"sound":69,"timestamp":"2018-06-30T07:15:55.174Z"}},
	{"d":{"sound":82,"timestamp":"2018-06-30T07:16:55.174Z"}},
	{"d":{"sound":69,"timestamp":"2018-06-30T07:17:55.174Z"}},
	{"d":{"sound":61,"timestamp":"2018-06-30T07:18:55.174Z"}}
]
slider.setAttribute("max", sampleSensorData.length - 1)