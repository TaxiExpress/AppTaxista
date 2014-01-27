class __Controller.PushCtrl extends Monocle.Controller

  pushNotification = undefined

  constructor: ->
    super

  savePushID: (id) =>
    Lungo.Cache.set "pushID", id

  handlePush: (notification) =>
    switch notification.code
      when "801", "802" #Recibo push del cliente pidiendo un servicio
        travel = new Object()
        travel.id = notification.travelID
        travel.origin = notification.origin
        travel.startpoint = notification.startpoint
        coords = travel.startpoint.substring 7
        pos = coords.indexOf " "
        long = coords.substring 0, pos
        lat = coords.substring pos+1, coords.indexOf ")"
        travel.latitude = lat
        travel.longitude = long
        travel.valuation = notification.valuation
        travel.phone = notification.phone

        Lungo.Cache.set "travel", travel

        Lungo.Router.section "confirmation_s"
        navigator.notification.alert "El taxista ha aceptado su solicitud", null, "Taxi Express", "Aceptar"
      when "803" #Recibo la push de confirmación de pago
        Lungo.Router.section "waiting_s"
        navigator.notification.alert "El pago se ha realizado correctamente", null, "Taxi Express", "Aceptar"
