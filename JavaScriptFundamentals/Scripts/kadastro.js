$(function () {
    console.log("yüklendi");
    $("#btnkonum").click(function () {
        navigator.geolocation.getCurrentPosition(getposition);
    });
});

function getposition(position) {
    var konum = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapdiv = document.getElementById("map");
    var settings = {
        center: konum,
        zoom: 15,
        mapTypeId: 'terrain',
        mapTypeControl: true,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        }
    }
    var map = new google.maps.Map(mapdiv, settings);
    var marker = new google.maps.Marker({
        position: konum,
        map: map,
        title: 'Şu an buradasınız',
        animation: google.maps.Animation.DROP
    });

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
    var kutsaltopraklar = new google.maps.LatLng(42.0198555, 35.1276581);

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [konum],
            destinations: [kutsaltopraklar],
            travelMode: 'DRIVING',
            drivingOptions: {
                departureTime: new Date(),
                trafficModel: 'bestguess' // pessimistic ve ya optimistic
            },
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: true,
            avoidTolls: true,
        }, distance);

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    directionsService.route({
        origin: konum,
        destination: kutsaltopraklar,
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
        console.log(response);
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            alert("Rota çizilemedi" + status);
        }
        });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("panel"));
}

function distance(response, status) {
    console.log(response);
    if (status != 'OK') {
        alert('Mesafe ölçülemedi');
    } else {
        $("#bilgi").html("Gidilecek: " + response.destinationAddresses[0] + "<br/>Uzaklık: " + response.rows[0].elements[0].distance.text + "<br/>" + response.rows[0].elements[0].duration.text + "<br/>Trafik ile: " + response.rows[0].elements[0].duration_in_traffic.text);
    }
}