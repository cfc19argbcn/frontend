var assets = {};
var commonElementIds = {
	files: "files",
	mapId: "mapid",
	timeSlider: "timeSlider",
	timeView: "timeView"
};
var rows;
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
];

var modalModule = (
	function() {
		var elementVisibleDisplay = "";
		var elementNotVisibleDisplay = "none";
		var addNodeForm = "addNodeFormContainer";
		var selectColumnsForm = "selectFileColumns";
		var updateNodeForm = 'updateNodeFormContainer';
		var nodeIdSelectElementId = 'listNodeIds';
		/** @param {string} elementId */
		var viewModal = function(elementId) {
			console.log("Showing modal: " + elementId);
			document.getElementById(elementId).style.display = elementVisibleDisplay;
		};
		/** @param {string} elementId */
		var hideModal = function(elementId) {
			console.log("Hiding modal: " + elementId);
			document.getElementById(elementId).style.display = elementNotVisibleDisplay;
		};
		var populateAssetOptions = function() {
			document.getElementById(nodeIdSelectElementId).options.length = 0;
			Object.keys(assets).map(assetKey => {
				console.log(assetKey)
				var assetKeyOption = document.createElement("option");
				assetKeyOption.text = assetKey;
				assetKeyOption.value = assetKey;
				document.getElementById(nodeIdSelectElementId)
					.options
					.add(assetKeyOption);
			});
		};
		var hideAddNodeForm = function() {
			hideModal(addNodeForm);
		};
		var showAddNodeForm = function() {
			viewModal(addNodeForm);
		};
		var hideSelectColumnsForm = function() {
			hideModal(selectColumnsForm);
		};
		var showSelectColumnsForm = function() {
			viewModal(selectColumnsForm);
		};
		var hideUpdateForm = function() {
			hideModal(updateNodeForm);
		};
		var showUpdateForm = function() {
			viewModal(updateNodeForm);
			populateAssetOptions();
		};
		return {
			hideAddNodeForm,
			showAddNodeForm,
			hideSelectColumnsForm,
			showSelectColumnsForm,
			hideUpdateForm,
			showUpdateForm
		};
	}
)();

var assetPathsModule = (function() {
	var removeAssetPaths = function () {
		Object.keys(assets).map((asset) => {
			removeAssetPath(asset)
		});
	}

	var removeAssetPath = function (id) {
		mymap.removeLayer(trackableAssetNodeModule.getAssetByKey(id).path)
	}

	var genRandomNums = function() {
		return [
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255)
		].join(',')
	}

	var drawAssetPath = function(id) {
		var asset = trackableAssetNodeModule.getAssetByKey(id);
		asset.path = new L.Polyline(asset.points, {
				color: "rgb(" + genRandomNums() + ")",
				weight: 1,
				opacity: 0.8,
				smoothFactor: 0
		});
		asset.path.addTo(mymap);
	}

	var drawAssetPaths = function() {
		Object.keys(assets).map((asset) => {
			drawAssetPath(asset)
		})
	};

	return {
		drawAssetPaths,
		removeAssetPaths
	};
})();
function handleFileSelect(evt) {
	var headers;
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
document.getElementById(commonElementIds.files)
	.addEventListener(
		'change',
		handleFileSelect,
		false
	);

var qmsModule = (function() {
	function loadJSON(callback) {
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', '/api/mqtt_creds', true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				callback(xobj.responseText);
			}
		};
		xobj.send(null);
	}

	var qmsMessageArrivedHandler = function (messageObj) {
		/**
		 * @type {{
		 *	node_id: string,
		*	long: number,
		*	lat: number,
		*	sensor?: {}
		* }}
		*/
		var message = JSON.parse(messageObj.payloadString).d;
		console.log(message)
		var nodeId = message.node_id;
		var baseNode = {
			id: nodeId,
			long: message.long,
			lat: message.lat,
			time: Date.now()
		}
		if (!trackableAssetNodeModule.getAssetByKey(nodeId)) {
			trackableAssetNodeModule.initTrackableAsset(baseNode)
		} else if (message.sensor) {
			var sensorType = Object.keys(message.sensor)[0];
			trackableAssetNodeModule.updateTrackableAsset({
				...baseNode,
				sensorType,
				sensorVal: message.sensor[sensorType]
			});
		} else {
			trackableAssetNodeModule.updateTrackableAsset(baseNode);
		}
	}		

	var initMQTTClient = function(mqttCreds) {
		var watson_channel = 'iot-2/type/' + mqttCreds.IOT_DEVICE_TYPE + '/id/' + mqttCreds.IOT_DEVICE_ID + '/evt/'+  mqttCreds.IOT_EVENT_TYPE + '/fmt/json'
		var cleanSession = true;
		var subscribeOptions = {
			onSuccess: function() {
				console.log("subscription set")
				mqttClient.onMessageArrived = qmsMessageArrivedHandler;
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
				mqttClient.subscribe(watson_channel, subscribeOptions)
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
	return {
		initMQTTClient,
		loadJSON
	};
})();

qmsModule.loadJSON(function(response) {
  console.log("Loading MQTT credentials")
  qmsModule.initMQTTClient(JSON.parse(response))
});

var mymap = (function() {
	var leafletMap = L.map(commonElementIds.mapId).setView([34.000037, -118.317471], 100);
	L.esri.basemapLayer("Topographic").addTo(leafletMap);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 100,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(leafletMap);

	var popup = L.popup();

	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("You clicked the map at " + e.latlng.toString())
			.openOn(leafletMap);
	}

	leafletMap.on('click', onMapClick);

	return leafletMap;
})();

var trackableAssetNodeModule = (function () {

	var renderList = function() {
		var nodeList = document.getElementById("nodeList");
		nodeList.innerHTML = null
		var assetKeys = Object.keys(assets)
		assetKeys.forEach(assetKey => {
			var selectedAsset = getAssetByKey(assetKey);
			nodeList.innerHTML += `
				<div class="nodeCard">
					<h2>
						${assetKey}
					</h2>
					<p >Location: ${selectedAsset.points.slice(-1)[0]}</p>
					<p >Last Update: ${selectedAsset.timestamps.slice(-1)[0]}</p>
				</div>
			`
		});
	}

	/**
	 * @param {{
	 * 	id: string,
	 * 	long: string,
	 * 	lat: string,
	 * 	time: Date,
	 * 	sensorType: string=,
	 * 	sensorVal: string=
	 * }} param0
	 * @returns {{
	 * 	marker: L.Marker,
	 * 	points: L.LatLng[],
	 * 	timestamps: Date[],
	 * 	circle?: L.Circle
	 * }}
	 */
	var createTrackableAssetNode = function({
		id,
		long,
		lat,
		time,
		sensorType = undefined,
		sensorVal = undefined
	}) {
		var trackableAssetNode = {
			marker: L
				.marker([long, lat])
				.addTo(mymap)
				.bindPopup("<b>" + id + "</b>")
				.openPopup(),
			points: [new L.LatLng(lat, long)],
			timestamps: [time]
		};
		if (sensorType) {
			var circleConfig = {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.1
			};
			trackableAssetNode.circle = L
					.circle([long, lat], sensorVal, circleConfig)
					.addTo(mymap)
					.bindPopup("LoRA Node: " + id);

			return trackableAssetNode;
		}
		return trackableAssetNode;
	}

	/**
	 * @param {{
	 * 	id: string,
	 * 	long: string,
	 * 	lat: string,
	 * 	time: Date,
	 * 	sensorType: string=,
	 * 	sensorVal: string=
	 * }} opts 
	 */
	var initTrackableAsset = function(opts) {
		const {id} = opts;
		console.log("initializing asset: " + id);
		const newTrackableAssetNode = createTrackableAssetNode(opts);
		assets[id] = newTrackableAssetNode;
		renderList();
		return newTrackableAssetNode;
	}

	/**
	 * @param {{
	 * 	id: string
	 * }} opts 
	 * @returns {ReturnType<initTrackableAsset>}
	 */
	var getAssetByIdOrCreateNewOne = function(opts) {
		var {id} = opts;
		if (!getAssetByKey(id)) {
			console.log("asset doesn't exist, creating: " + id)
			return initTrackableAsset(opts);
		} else {
			console.log("loading asset: " + id);
			return getAssetByKey(id);
		}
	}

	/**
	 * @param {{
	 * 	id: string,
	 * 	long: string,
	 * 	lat: string,
	 * 	time: Date,
	 * 	sensorType: string=,
	 * 	sensorVal: string=
	 * }} opts 
	 */
	var updateTrackableAsset = function (opts) {
		var {
			id,
			long,
			lat,
			time,
			sensorVal = undefined
		} = opts;
		console.log("updating asset: " + id)
		var asset = getAssetByIdOrCreateNewOne(opts);
		var newLatLng = new L.LatLng(lat, long);
		asset.marker
			.setLatLng(newLatLng)
			.update();
		asset.points.push(newLatLng);
		asset.timestamps.push(time);
		if (asset.circle) {
			asset.circle.setRadius(sensorVal);
			asset.circle.setLatLng(newLatLng);
		}
		console.log("asset location updated");
	}

	/**
	 * @param {string} assetKey 
	 * @returns {ReturnType<getAssetByIdOrCreateNewOne>}
	 */
	var getAssetByKey = function (assetKey) {
		return assets[assetKey];
	}

	return {
		getAssetByKey,
		initTrackableAsset,
		updateTrackableAsset
	}
})();

var formModule = (
	function() {
		const nodeIdElementId = 'nodeId';
		const nodeLongitudeElementId = 'nodeLongitude';
		const nodeLatitudeElementId = 'nodeLatitude';
		const nodeSensorTypeElementId = 'nodeSensorType';
		const nodeSensorValueElementId = 'nodeSensorValue';
		var getInputValue = function($, elementId) {
			const elementIdCssSelector = `#${elementId}`;
			return $(elementIdCssSelector).val();
		};
		/**
		 * @param {*} $ 
		 * @param {"hideAddNodeForm" | "hideUpdateForm"} hideModalFnName 
		 */
		var updateTrackableAssetBasedOnForm = function($, hideModalFnName) {
			trackableAssetNodeModule.updateTrackableAsset({
				id: getInputValue($, nodeIdElementId),
				lat: getInputValue($, nodeLatitudeElementId),
				long: getInputValue($, nodeLongitudeElementId),
				time: Date.now(),
				sensorType: getInputValue($, nodeSensorTypeElementId),
				sensorVal: getInputValue($, nodeSensorValueElementId)
			});
			modalModule[hideModalFnName]();
			return false;
		}

		var lineBreaks = /\r?\n|\r/g;
		/** @param {string} unparsedRow */
		var parseRow = function(unparsedRow) {
			return unparsedRow.replace(lineBreaks, " ").split(',');
		};
		var isLastIndexOfArray = function(arr, index) {
			return index == (arr.length - 1);
		}
		var handleOnSubmitFileColumnsForm = function() {
			var elementIds = {
				nodeIdSelect: 'nodeIdSelect',
				nodeLongitudeSelect: 'nodeLongitudeSelect',
				nodeLatitudeSelect: 'nodeLatitudeSelect',
				nodeTimeSelect: 'nodeTimeSelect',
				timeView: "timeView"
			};
			var nodeIdSelect = document.getElementById(elementIds.nodeIdSelect);
			var nodeLongitudeSelect = document.getElementById(elementIds.nodeLongitudeSelect);
			var nodeLatitudeSelect = document.getElementById(elementIds.nodeLatitudeSelect);
			var nodeTimeSelect = document.getElementById(elementIds.nodeTimeSelect);
			modalModule.hideSelectColumnsForm();
			for (i in rows) {
				var row = parseRow(rows[i])
				var selectedNodeId = row[nodeIdSelect.selectedIndex];
				
				/**
				 * @type {{
				 * 	points: number[][],
				 * 	timestamps: Date[]
				 * }}
				 */
				var registeredAsset = trackableAssetNodeModule
					.getAssetByKey(selectedNodeId);
				var selectedTimestamp = row[nodeTimeSelect.selectedIndex];
				var selectedLatitude = row[nodeLatitudeSelect.selectedIndex];
				var selectedLongitude = row[nodeLongitudeSelect.selectedIndex];
				if (!registeredAsset) {
					console.log("initializing new asset: " + selectedNodeId)
					initTrackableAsset(
						selectedNodeId,
						selectedLatitude,
						selectedLongitude,
						selectedTimestamp
					);
				} else {
					registeredAsset.points.push([selectedLatitude, selectedLongitude]);
					registeredAsset.timestamps.push(selectedTimestamp);
				}
				if (isLastIndexOfArray(rows, i)) {
					console.log("all rows imported");
					var pointLens = [];
					var assetKeys = Object.keys(assets);
					console.log(assetKeys);
					/**
					 * @param {string} key 
					 * @param {number} index 
					 */
					var setSliderMaxValue = function (assetKey, index) {
						/** @type {{ points: number[][] }} */
						const selectedAsset = trackableAssetNodeModule
							.getAssetByKey(assetKey);
						const selectedAssetCoordinatesLength =
							selectedAsset.points.length;
						pointLens.push(selectedAssetCoordinatesLength);
						if (isLastIndexOfArray(assetKeys, index)) {
							var maxLen = Math.max.apply(Math, pointLens);
							setSliderMaxAttribute(maxLen);
						}
					};
					assetKeys.forEach(setSliderMaxValue);
				}
			}
			var timeView  = document.getElementById(elementIds.timeView);
			timeView.onload = function () {
				timeView.innerHTML = (new Date()).toISOString()
			}
			slider.oninput = function() {
				for (id in assets) {
					const selectedAsset = trackableAssetNodeModule.getAssetByKey(id);
					if (selectedAsset.points[this.value]) {
						trackableAssetNodeModule.updateTrackableAsset({
							id,
							lat: selectedAsset.points[this.value][0],
							long: selectedAsset.points[this.value][1],
							time: new Date()
						});
					}
					if (selectedAsset.timestamps[this.value]) {
						document.getElementById(elementIds.timeView).innerHTML = selectedAsset.timestamps[this.value]
					}
				}
			}
		}

		var handleOnSubmitAddNodeForm = function($) {
			return updateTrackableAssetBasedOnForm($, "hideAddNodeForm");
		}

		var handleOnSubmitUpdateNodeForm = function($) {
			return updateTrackableAssetBasedOnForm($, "hideUpdateForm");
		};

		return {
			handleOnSubmitAddNodeForm,
			handleOnSubmitUpdateNodeForm,
			handleOnSubmitFileColumnsForm
		};
	}
)();

var {setSliderMaxAttribute, slider} = (function() {
	const timeSlider = document.getElementById(commonElementIds.timeSlider);

	timeSlider.oninput = function() {
		Object.keys(assets)
			.map((assetKey) => {
				const selectedAsset = trackableAssetNodeModule.getAssetByKey(assetKey);
				if (selectedAsset.points[this.value]) {
					selectedAsset.marker.setLatLng(selectedAsset.points[this.value]).update();
					console.log("updating " +  assetKey + " to " + selectedAsset.points[this.value].toString())
				}
			})
		document.getElementById(commonElementIds.timeView).innerHTML =
			trackableAssetNodeModule.getAssetByKey(assetKey).timestamps[this.value];
	}
	var setSliderMaxAttribute = function(maxValue) {
		timeSlider.setAttribute("max", maxValue);
	}
	setSliderMaxAttribute(sampleSensorData.length - 1);

	return {
		slider: timeSlider,
		setSliderMaxAttribute
	};
})();