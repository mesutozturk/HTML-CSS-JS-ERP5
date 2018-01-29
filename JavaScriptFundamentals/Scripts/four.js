var apiurl = "https://api.foursquare.com/v2/venues/search";
var clientid = "W5SVVWFXISFW0UL1SA2RZ14ONK05PKUZWCT3N4O0X5J54X2G";
var clientsecret = "JV1BXFE1EZNMUCHJP0UCB0CVJ2GXIYBSX20S31PCOSZ3CZ4Z";
var categoriid = "4d4b7105d754a06374d81259";
$("#txtara").keyup(function () {
    //console.log(this.value);
    var arama = this.value;
    var query = apiurl;
    query += "?client_id=" + clientid;
    query += "&client_secret=" + clientsecret;
    query += "&v=20180126";
    query += "&categoryId=" + categoriid;
    query += "&near=Istanbul,TR";
    query += "&query=" + arama;
    $.ajax({
        url: query,
        dataType: 'JSON',
        type: 'get'
    }).done(function (data) {
        console.log(data.response.venues);
        $("#mekanlar").empty();
        $.each(data.response.venues, function (key, value) {
            kartolustur(value);
        });
        $(".firmakarti").click(function () {
            console.log(this.id);
            mekandetay(this.id);
        });
    });
});
function kartolustur(venue) {
    var kartdiv = document.createElement("div");
    $(kartdiv).addClass("firmakarti");
    $(kartdiv).attr("id", venue.id);
    var h3 = document.createElement("h3");
    //h3.innerHTML(venue.name);
    $(h3).html(venue.name);
    var adresdiv = document.createElement("div");
    $(adresdiv).addClass("adres").html(venue.location.address);
    var buradadiv = document.createElement("div");
    $(buradadiv).addClass("burada").html(venue.hereNow.summary);
    $(kartdiv).append(h3).append(adresdiv).append(buradadiv).appendTo($("#mekanlar"));
}
function mekandetay(id) {
    var query = "https://api.foursquare.com/v2/venues/"
    query += id;
    query += "?client_id=" + clientid;
    query += "&client_secret=" + clientsecret;
    query += "&v=20180129";
    $.ajax({
        url: query,
        dataType: 'JSON',
        type: 'get'
    }).done(function (data) {
        console.log(data.response.venue);
        var venue = data.response.venue;
        if (venue.bestPhoto === undefined) {
            $("#"+id).html("<b>Foto yok</b>");
            return null;
        }
        var fotourl = venue.bestPhoto.prefix;
        fotourl += venue.bestPhoto.width + "x" + venue.bestPhoto.height;
        fotourl += venue.bestPhoto.suffix;
        var img = document.createElement("img");
        $(img).attr("src", fotourl);
        $(img).attr("height", 200);
        $(img).attr("width", 200);
        $("#" + id).empty();
        $("#" + id).append(img);
        return fotourl;
    });
}
