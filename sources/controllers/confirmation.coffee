class __Controller.ConfirmationCtrl extends Monocle.Controller
  
  timer = null

  elements:
    "#confirmation_name"                  : "customerName"
    "#confirmation_valuation"             : "valuation"
    "#confirmation_image"                 : "image"
    "#confirmation_street"                : "streetField"
    "#confirmation_accept"                : "button_accept"
    "#confirmation_reject"                : "button_reject"
    
  events:
    "tap #confirmation_accept"            : "acceptConfirmation"
    "tap #confirmation_reject"            : "rejectConfirmation"


  constructor: ->
    super


  loadTravel: (travel) ->
    currentLocation = new google.maps.LatLng(travel.latitude, travel.longitude)
    @getStreet(currentLocation) 
    @button_accept[0].disabled = false
    @button_reject[0].disabled = false
    @streetField[0].innerText = "Calle desconocida"
    @customerName[0].innerText = "Usuario desconocido"
    @image[0].src = "img/user.png"
    @valuation[0].innerText = "☆☆☆☆☆"
    server = Lungo.Cache.get "server"
    data =
      customerID: travel.customerID
    $$.ajax
      type: "GET"
      url: server + "driver/getcustomerdata"
      data:  data
      success: (result) =>
        @showMap(travel)
        @customerName[0].innerText = result.name + " " + result.surname
        @image[0].src = result.image if result.image
        val = ""
        i = 0
        while i < result.valuation
          val = val + "★"
          i++
        while i < 5
          val = val + "☆"
          i++
        @valuation[0].innerText = val
      error: (xhr, type) =>
        console.log type.response
    Lungo.Cache.remove "travel"
    Lungo.Cache.set "travel", travel
    Lungo.Router.section "confirmation_s"
    timer = setTimeout((=>
      Lungo.Cache.remove "requestInProgress"  
      Lungo.Cache.set "requestInProgress", false
      Lungo.Router.section "waiting_s") 
    , 25000)


  showMap: (travel) =>
    arriveLocation = new google.maps.LatLng(travel.latitude, travel.longitude)
    mapOptions =
      center: arriveLocation
      zoom: 16
      mapTypeId: google.maps.MapTypeId.ROADMAP
      panControl: false
      streetViewControl:false
      overviewMapControl:false
      mapTypeControl:false
      zoomControl:false
      styles: [
        featureType: "poi.business"
        elementType: "labels"
        stylers: [visibility: "off"]
      ]
    map = new google.maps.Map(document.getElementById("map-canvas2"), mapOptions)

    marker = new google.maps.Marker(
      position: arriveLocation
      map: map
      title: @streetField[0].value
    )


  acceptConfirmation: (event) =>
    if !@button_accept[0].disabled
      @stopTimer()
      @button_accept[0].disabled = true
      @button_reject[0].disabled = true
      driver = Lungo.Cache.get "driver"
      travel = Lungo.Cache.get "travel"
      data = 
        email: driver.email
        travelID: travel.travelID 
        latitude: Lungo.Cache.get "latitude"
        longitude: Lungo.Cache.get "longitude"
      server = Lungo.Cache.get "server"
      $$.ajax
        type: "POST"
        url: server + "driver/accepttravel"
        data: data
        success: (result) =>
          __Controller.arrive.iniArrive()
        error: (xhr, type) =>
          navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"
          Lungo.Cache.remove "requestInProgress"  
          Lungo.Cache.set "requestInProgress", false
          Lungo.Router.section "waiting_s"



  rejectConfirmation: (event) =>
    if !@button_reject[0].disabled
      @stopTimer()
      Lungo.Cache.remove "requestInProgress"  
      Lungo.Cache.set "requestInProgress", false
      Lungo.Router.section "waiting_s"



  stopTimer: =>
    clearTimeout timer


  getStreet: (pos) =>
    geocoder = new google.maps.Geocoder()
    geocoder.geocode
      latLng: pos
    , (results, status) =>
      if status is google.maps.GeocoderStatus.OK
        if results[1]
          if results[0].address_components[1].short_name == results[0].address_components[0].short_name
            @streetField[0].innerText = results[0].address_components[1].short_name
            Lungo.Cache.remove "origin"
            Lungo.Cache.set "origin", @streetField[0].innerText
          else 
            @streetField[0].innerText = results[0].address_components[1].short_name + ", " +results[0].address_components[0].short_name
            Lungo.Cache.remove "origin"
            Lungo.Cache.set "origin", @streetField[0].innerText
        else
          console.log "falla"
          @getStreet pos
      else
        console.log "falla"
        @getStreet pos

  