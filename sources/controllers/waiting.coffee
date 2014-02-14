class __Controller.WaitingCtrl extends Monocle.Controller
  driver = null
  watchId = undefined

  events:
    #"tap #waiting_logout"                  : "logOut"
    "singleTap #waiting_available"            : "changeAvailable"
    #"tap #waiting_prueba1"                 : "confirmation"
    #"tap #waiting_prueba3"                 : "charge"

  elements:
    "#waiting_driver"                      : "driver"
    "#waiting_available"                   : "valorAvailable"

  constructor: ->
    super
    @valorAvailable[0].checked = true
    driver = Lungo.Cache.get "driver"
    @driver[0].innerText = driver.last_name + ", " + driver.first_name
    #@getLocationUpdate()

  getLocationUpdate: =>
    if navigator.geolocation
      options = 
        enableHighAccuracy: true
        timeout: 3000
        maximumAge : 3000
      tt = navigator.geolocation.watchPosition updatePosition, manageError, options
      @watchId = tt

  stopWatch: =>
    if @watchId
      navigator.geolocation.clearWatch(@watchId)
      @watchId = undefined
  
  updatePosition = (position) =>
    console.log "latitude" + position.coords.latitude
    console.log "latitude" + position.coords.longitude

    Lungo.Cache.remove "latitude"  
    Lungo.Cache.set "latitude", position.coords.latitude
    Lungo.Cache.remove "longitude"  
    Lungo.Cache.set "longitude", position.coords.longitude

    currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    getStreet(currentLocation)  

    driver = Lungo.Cache.get "driver"
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/updatedriverposition"
      data:
        email: driver.email
        latitude: position.coords.latitude
        longitude: position.coords.longitude
      success: (result) =>
        @
      error: (xhr, type) =>
        @

  manageError = =>
    console.log "ERROR"

  updateAvailable: (email, available) =>
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/updatedriveravailable"
      data:
        email: email
        available: available
      success: (result) =>
        @
      error: (xhr, type) =>
        navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"

  changeAvailable: =>
    @updateAvailable(driver.email, @valorAvailable[0].checked)
    if @valorAvailable[0].checked
      @getLocationUpdate()
    else
      @stopWatch()

  getStreet = (pos) =>
    geocoder = new google.maps.Geocoder()
    geocoder.geocode
      latLng: pos
    , (results, status) =>
      if status is google.maps.GeocoderStatus.OK
        if results[1]
          if results[0].address_components[1].short_name == results[0].address_components[0].short_name
            street = results[0].address_components[1].short_name
          else 
            street = results[0].address_components[1].short_name + ", " +results[0].address_components[0].short_name
        else
          street = 'Calle desconocida'
      else
        street = 'Calle desconocida'
      Lungo.Cache.remove "street"  
      Lungo.Cache.set "street", street

  #logOut: =>
  #  @stopWatch()
    
  #  Lungo.Cache.set "pushID", undefined
  #  @updateAvailable(driver.email, false)
  #  Lungo.Cache.set "driver", ""
  #  Lungo.Router.section "login_s"
    
  
