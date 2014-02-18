class __Controller.ArriveCtrl extends Monocle.Controller

  map = undefined
  
  elements:
    "#arrive_streetField"                   : "streetField"
    "#arrive_call"                          : "telephone"
    "#arrive_pickup"                        : "button_PickUp"
    "#arrive_cancel"                        : "button_cancel"
  
  events:
    "singleTap #arrive_pickup"              : "doPickUp"
    "singleTap #arrive_cancel"              : "cancelPickUp"



  constructor: ->
    super

  iniArrive: =>
    travel = Lungo.Cache.get "travel"
    @streetField[0].value = Lungo.Cache.get "origin"
    @telephone[0].href = "tel:" + travel.phone
    Lungo.Router.section "arrive_s"
    travel = Lungo.Cache.get "travel"
    @showMap(travel)


  showMap: (travel) =>
    lat = Lungo.Cache.get "latitude"
    long = Lungo.Cache.get "longitude"
    directionsService = new google.maps.DirectionsService()
    directionsDisplay = new google.maps.DirectionsRenderer()
    map = new google.maps.Map(document.getElementById("map-canvas"),
      mapTypeId: google.maps.MapTypeId.ROADMAP
      panControl: false
      streetViewControl:false
      overviewMapControl:false
      mapTypeControl:false
      zoomControl:false
      styles: [
        featureType: "all"
        elementType: "labels"
        stylers: [visibility: "off"]
      ]
    )
    directionsDisplay.setMap map
    bounds = new google.maps.LatLngBounds()
    origin = new google.maps.LatLng(lat, long)
    destination = new google.maps.LatLng(travel.latitude, travel.longitude)
    bounds.extend(origin)
    bounds.extend(destination)
    map.fitBounds(bounds)
    request = 
      origin: origin
      destination: destination
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    directionsService.route request, (response, status) ->
      directionsDisplay.setDirections response  if status is google.maps.DirectionsStatus.OK


  doPickUp: (event) =>
    if !@button_PickUp[0].disabled
      @button_PickUp[0].disabled = true
      @button_cancel[0].disabled = true
      driver = Lungo.Cache.get "driver"
      travel = Lungo.Cache.get "travel"
      server = Lungo.Cache.get "server"
      $$.ajax
        type: "POST"
        url: server + "driver/travelstarted"
        data:
          email: driver.email
          travelID: travel.travelID
          origin: ""
          latitude: ""
          longitude: ""
        success: (result) =>
          @button_PickUp[0].disabled = false
          @button_cancel[0].disabled = false
          __Controller.charge.initialize()
        error: (xhr, type) =>
          @button_PickUp[0].disabled = false
          @button_cancel[0].disabled = false
          navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"

      
    
  cancelPickUp: (event) =>
    if !@button_cancel[0].disabled
      @button_PickUp[0].disabled = true
      @button_cancel[0].disabled = true
      onConfirm = (button) =>
        switch button
          when 1
            driver = Lungo.Cache.get "driver"
            travel = Lungo.Cache.get "travel"
            server = Lungo.Cache.get "server"
            $$.ajax
              type: "POST"
              url: server + "driver/canceltravel"
              data:
                travelID: travel.travelID
                email: driver.email
              success: (result) =>
                @button_PickUp[0].disabled = false
                @button_cancel[0].disabled = false
                Lungo.Router.section "waiting_s"
                Lungo.Cache.remove "requestInProgress"  
                Lungo.Cache.set "requestInProgress", false
              error: (xhr, type) =>
                @button_PickUp[0].disabled = false
                @button_cancel[0].disabled = false
                navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"
          when 2
            @button_PickUp[0].disabled = false
            @button_cancel[0].disabled = false
        return
      navigator.notification.confirm "", onConfirm, "¿Esta seguro que desea cancelar el viaje?", "Si, No"

