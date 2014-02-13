class __Controller.PushCtrl extends Monocle.Controller

  pushNotification = undefined

  constructor: ->
    super
    #@savePushID "pruebaPush", "ANDROID"

  savePushID: (id, device) =>
    Lungo.Cache.remove "pushID"  
    Lungo.Cache.set "pushID", id
    Lungo.Cache.remove "pushDevice"  
    Lungo.Cache.set "pushDevice", device
            
  handlePush: (notification) =>
    switch notification.code
      when "801", "802" #Recibo push del cliente pidiendo un servicio
        longlat = notification.startpoint
        pos = longlat.indexOf ","
        lat = longlat.substring 0, pos
        long = longlat.substring pos+1, longlat.length
        travel =
          travelID: notification.travelID
          origin: notification.origin
          startpoint: notification.startpoint
          latitude: lat
          longitude: long
          valuation: notification.valuation
          phone: notification.phone
        __Controller.confirmation.loadTravel(travel)
        Lungo.Router.section "confirmation_s"
        #navigator.notification.alert "Nueva solicitud", null, "Taxi Express", "Aceptar"
      when "803" #Recibo la push de confirmación de pago
        #Lungo.Router.section "waiting_s"
        Lungo.Router.section "valuation_s"
        navigator.notification.alert "El pago se ha realizado correctamente", null, "Taxi Express", "Aceptar"
