class __Controller.WaitingCtrl extends Monocle.Controller
  
  driver = undefined
  watchId = undefined

  events:
    "change #waiting_available"            : "changeAvailable"

  elements:
    "#waiting_driver"                         : "driver"
    "#waiting_available"                      : "valorAvailable"
    "#waiting_car"                            : "car"
    "#waiting_plate"                          : "plate"
    "#waiting_license"                        : "license"



  constructor: ->
    super
    driver = Lungo.Cache.get "driver"
    @valorAvailable[0].checked = driver.available
    @driver[0].innerText = driver.first_name+ " "+driver.last_name
    @car[0].innerText = driver.company + " " + driver.model
    @plate[0].innerText = driver.plate
    @license[0].innerText = driver.license
    @getLocationUpdate() if driver.available


  
  updatePosition = (position) =>
    Lungo.Cache.remove "latitude"  
    Lungo.Cache.set "latitude", position.coords.latitude
    Lungo.Cache.remove "longitude"  
    Lungo.Cache.set "longitude", position.coords.longitude
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



  changeAvailable: =>
    setTimeout((=> 
      @updateAvailable(driver.email, @valorAvailable[0].checked)
    ) , 700)


  updateAvailable: (email, available) =>
    server = Lungo.Cache.get "server"
    $$.ajax
      type: "POST"
      url: server + "driver/updatedriveravailable"
      data:
        email: email
        available: available
      success: (result) =>
        @valorAvailable[0].checked = available
        if available
          @getLocationUpdate()
        else
          @stopWatch()
      error: (xhr, type) =>
        @valorAvailable[0].checked = !available
        navigator.notification.alert type.response, null, "Taxi Express", "Aceptar"


  getLocationUpdate: =>
    if navigator.geolocation
      options =
        frequency: 30000
      tt = navigator.geolocation.watchPosition updatePosition, null, options
      @watchId = tt


  stopWatch: =>
    if @watchId
      navigator.geolocation.clearWatch(@watchId)
      @watchId = undefined


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

