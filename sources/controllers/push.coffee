class __Controller.PushCtrl extends Monocle.Controller

  pushNotification = undefined

  constructor: ->
    super
    @savePushID("APA91bHdfAsMRF1C3YXJhv0AGOSUFN8tr66zue3J6HdVtUlcZYk9OAoix2ZNzHuIKZ9khVxKvxRR25OTwnFKu9WlACi8IvnPaD4qfts8Jjih4259AoR0u52HdaMLhkBq4NCpDcOZl5a2RJYAuQaFs9Gl8FwTtrodo2jdSdoVItbYaIixV2cfKXI", "ANDROID")


  savePushID: (id, device) =>
    Lungo.Cache.remove "pushID"  
    Lungo.Cache.set "pushID", id
    Lungo.Cache.remove "pushDevice"  
    Lungo.Cache.set "pushDevice", device
            
  handlePush: (notification) =>
    #alert "travelID: " + notification.travelID
    #alert "push code: " + notification.code
    #alert "Point: " + notification.startpoint
    #alert "origin: " + notification.origin
    switch notification.code
      when "801", "802" #Recibo push del cliente pidiendo un servicio
        #alert "startpoint: " + notification.startpoint
        latlong = notification.startpoint.split(",")
        lat = latlong[0]
        long = latlong[1]

        #coords = notification.startpoint.substring 7
        #alert "coords: " + coords
        #pos = coords.indexOf " "
        #alert "pos: " + pos
        #long = coords.substring 0, pos
        #alert "long: " + long
        #lat = coords.substring pos+1, coords.indexOf ")"
        #alert "lat: " + lat

        travel =
          travelID: notification.travelID
          origin: notification.origin
          startpoint: notification.startpoint
          latitude: lat
          longitude: long
          #latitude: 55.2641160000000013
          #longitude: -5.9237662000000002
          valuation: notification.valuation
          phone: notification.phone
        Lungo.Cache.set "travel", travel
        __Controller.confirmation.loadTravel(travel)
        Lungo.Router.section "confirmation_s"
        navigator.notification.alert "Nueva solicitud", null, "Taxi Express", "Aceptar"
      when "803" #Recibo la push de confirmación de pago
        Lungo.Router.section "waiting_s"
        navigator.notification.alert "El pago se ha realizado correctamente", null, "Taxi Express", "Aceptar"
