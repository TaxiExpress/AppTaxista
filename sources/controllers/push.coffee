class __Controller.PushCtrl extends Monocle.Controller

  pushNotification = undefined


  constructor: ->
    super
    #@savePushID "pruebaPush"



  savePushID: (id) =>
    Lungo.Cache.remove "pushID"  
    Lungo.Cache.set "pushID", id



  handlePush: (notification) =>
    switch notification.message
      when "801", "802" #Recibo push del cliente pidiendo un servicio
        if !Lungo.Cache.get "requestInProgress"
          Lungo.Cache.remove "requestInProgress"
          Lungo.Cache.set "requestInProgress", true
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
            customerID: notification.customerID
            phone: notification.phone
          __Controller.confirmation.loadTravel(travel)

      when "803" #Recibo la push de confirmación de pago
        navigator.notification.alert "El pago se ha realizado correctamente", null, "Taxi Express", "Aceptar"
