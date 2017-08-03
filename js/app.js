// Initialize Firebase
var config = {
apiKey: "AIzaSyDMuGS3tvjG_COMrhkVdaN6K85_cbAOYDo",
authDomain: "train-scheduler-d769a.firebaseapp.com",
databaseURL: "https://train-scheduler-d769a.firebaseio.com",
projectId: "train-scheduler-d769a",
storageBucket: "",
messagingSenderId: "35351332743"
};

firebase.initializeApp(config);

var database = firebase.database();

// Global variables for train input and display
var trainName = '';
var destination = '';
var startTime = 0;
var freq = 0;
var arriv = 0;
var minAway = 0;

// On submit button click
$('.btn').on('click', function() {

	// Grab static user inputs
	trainName = $('#train-name').val().trim();
	destination = $('#destination').val().trim();
	freq = $('#frequency').val().trim();
	startTime = $('#start-time').val().trim();

	// Clear input boxes
	$('#train-name, #destination, #frequency, #start-time').val('');

	// Ask if there are any empty input boxes
	if (trainName && destination && freq && startTime) {
		// Run calcTime to find the arrival time and the number of minutes remaining
		calcTime(freq, startTime);

		// Push all displayed values to firebase
		database.ref().push({
			nameFB: trainName,
			destinationFB: destination,
			freqFB: freq,
			arrivFB: arriv,
			minAwayFB: minAway
		})
	} else {alert('Please Enter All Required Fields');}
});

// Call database on child added and init
database.ref().on("child_added", function(childSnapshot) {

	// Call function to append new row with firebase data
	appendRowToTable(childSnapshot.val().nameFB, childSnapshot.val().destinationFB, childSnapshot.val().freqFB, childSnapshot.val().arrivFB, childSnapshot.val().minAwayFB);

}, function(errorObject) {
	console.log('Errors handled: ' + errorObject.code);
});

// Function to append a new row to the current trains table
function appendRowToTable(trainName, destination, freq, arriv, minAway) {
    var $row = $("<tr>").append($("<td>").text(trainName)).append($("<td>").text(destination)).append($("<td>").text(freq))
        .append($("<td>").text(arriv)).append($("<td>").text(minAway));
    $("table.table tbody").append($row);
}

// Function to calculate the arrival time and time remaining
function calcTime(freq, startTime) {
	// Set start time to 1 year ago at the same time
	var startTimeConvert = moment(startTime, "HH:mm").subtract(1, "years");
	// Grabs the current browser time
	var currentTime = moment();
	// Convert the difference between the start time and current time to minutes
	var diffTime = moment().diff(moment(startTimeConvert), "minutes");
	// Find the remainder of the total difference in minutes to the frequency and set to global var
	minAway = diffTime % freq;
	// Adds the remainder to current time to find arrival time
	var nextTrain = moment().add(minAway, "minutes");
	// Display arrival time in correct format and set to global var
	arriv = moment(nextTrain).format("HH:mm A");
}