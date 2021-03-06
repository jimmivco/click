// Range beacons screen.
;(function(app)
{
	// app.controller('buscarBeaconController',function(){
	// 	console.log('nothingController');
	// });
	// 'F1:A5:A6:CF:98:BC'
	beaconsIdsList = ['F4:94:CD:6F:4C:77'];
	beaconDistance = 2;

	app.startRangingBeacons = function()
	{
		function onRange(beaconInfo)
		{
			displayBeconInfo(beaconInfo);
		}

		function onError(errorMessage)
		{
			console.log('Range error: ' + errorMessage);
		}

		function displayBeconInfo(beaconInfo)
		{
			// Clear beacon HTML items.
			$('#id-screen-range-beacons .style-item-list').empty();

			// Sort beacons by distance.
			beaconInfo.beacons.sort(function(beacon1, beacon2) {
				return beacon1.distance > beacon2.distance; });

			// Generate HTML for beacons.
			$.each(beaconInfo.beacons, function(key, beacon)
			{
				var element = $(createBeaconHTML(beacon));
				$('#id-screen-range-beacons .style-item-list').append(element);
			});
		};

		function createBeaconHTML(beacon)
		{
			var colorClasses = app.beaconColorStyle(beacon.color);
			// var htm = '<div class="' + colorClasses + '">'
			// 	+ '<table><tr><td>Major</td><td>' + beacon.major
			// 	+ '</td></tr><tr><td>Minor</td><td>' + beacon.minor
			// 	+ '</td></tr><tr><td>RSSI</td><td>' + beacon.rssi
			if (beacon.proximity)
			{
				// htm += '</td></tr><tr><td>Proximity</td><td>'
				// 	+ app.formatProximity(beacon.proximity)
			}
			if (beacon.distance)
			{
				// htm += '</td></tr><tr><td>Distance</td><td>'
					// + app.formatDistance(beacon.distance);					
				if(isClose(beacon.distance,beaconDistance)){
					callMedia(beacon);

				}
			}
			// htm += '</td></tr></table></div>';
			return '';
		};

		// Show screen.
		app.showScreen('id-screen-range-beacons');
		$('#id-screen-range-beacons .style-item-list').empty();

		// Request authorisation.
		estimote.beacons.requestAlwaysAuthorization();

		// Start ranging.
		estimote.beacons.startRangingBeaconsInRegion(
			{}, // Empty region matches all beacons.
			onRange,
			onError);
	};

	function callMedia(beacon){

		if(!findByMacAddress(beacon.macAddress)){

		 	$.post( "http://clicker.tech/back-end/index.php/app/saveEvent", {id_channel:"null",channel_name:"null",event_name:"null",id_rule:"null",rule_name:"null",id_object:beacon.macAddress})
			  .done(function( data ) {
			    $('#beacon-media').append('<p>datos registrados</p>');
			});

			var beacons = JSON.parse(localStorage.getItem('beacons'));
			beacons.push(beacon.macAddress);
			$('#beacons-history').append('<p>'+beacon.macAddress+'</p>')
			localStorage.setItem('beacons',JSON.stringify(beacons));
			
		}
	}

	function findByMacAddress(macAddress){

		beaconInList = false;

		//find in list...
		for (var i = 0; i < beaconsIdsList.length; i++) {
			if(beaconsIdsList[i]==macAddress){
				beaconInList = true;
			}
		}

		//avoid calling method more than one time
		if (beaconInList) {
			var beacons = JSON.parse(localStorage.getItem('beacons'));

			for (var i = 0; i < beacons.length; i++) {
				if(beacons[i]==macAddress){
					return true;
				}
			}
		}else{
			return true;
		}

		return false;
	}
	
	function isClose(meters, limit){
		if(meters<=limit){
			return true;
		}else{
			return false;
		}
	}

	app.stopRangingBeacons = function()
	{
		estimote.beacons.stopRangingBeaconsInRegion({});
		app.showHomeScreen();
	};

})(app);
