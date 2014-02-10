class __Controller.PushCtrl extends Monocle.Controller

  pushNotification = undefined

  constructor: ->
    super
    @savePushID("APAKXI", "ANDROID")

  savePushID: (id, device) =>
    Lungo.Cache.remove "pushID"  
    Lungo.Cache.set "pushID", id
    Lungo.Cache.remove "pushDevice"  
    Lungo.Cache.set "pushDevice", device
            
  handlePush: (notification) =>
    switch notification.code
      when "801", "802" #Recibo push del cliente pidiendo un servicio
        latlong = notification.startpoint.split(",")
        lat = latlong[0]
        long = latlong[1]

        travel =
          travelID: notification.travelID
          origin: notification.origin
          startpoint: notification.startpoint
          latitude: lat
          longitude: long
          #latitude: 43.3219708000000026 
          #longitude: -2.9892685999999999
          valuation: notification.valuation
          phone: notification.phone
        Lungo.Cache.set "travel", travel
        __Controller.confirmation.loadTravel(travel)
        Lungo.Router.section "confirmation_s"
        navigator.notification.alert "Nueva solicitud", null, "Taxi Express", "Aceptar"
      when "803" #Recibo la push de confirmación de pago
        Lungo.Router.section "waiting_s"
        navigator.notification.alert "El pago se ha realizado correctamente", null, "Taxi Express", "Aceptar"
