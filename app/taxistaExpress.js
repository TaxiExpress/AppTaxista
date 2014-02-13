(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.AppCtrl = (function(_super) {
    __extends(AppCtrl, _super);

    function AppCtrl() {
      AppCtrl.__super__.constructor.apply(this, arguments);
      Lungo.Cache.set("phone", "669338946");
      Lungo.Cache.set("server", "http://TaxiLoadBalancer-638315338.us-east-1.elb.amazonaws.com/");
      __Controller.login = new __Controller.LoginCtrl("section#login_s");
    }

    return AppCtrl;

  })(Monocle.Controller);

  $$(function() {
    Lungo.init({});
    __Controller.push = new __Controller.PushCtrl;
    return __Controller.App = new __Controller.AppCtrl("section#init_s");
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.ArriveCtrl = (function(_super) {
    var getStreet, iniLocation, manageErrors, map;

    __extends(ArriveCtrl, _super);

    map = void 0;

    ArriveCtrl.prototype.elements = {
      "#arrive_streetField": "streetField",
      "#arrive_pickup": "button_PickUp",
      "#arrive_cancel": "button_cancel"
    };

    ArriveCtrl.prototype.events = {
      "tap #arrive_pickup": "doPickUp",
      "tap #arrive_cancel": "cancelPickUp",
      "tap #arrive_call": "doCall"
    };

    function ArriveCtrl() {
      this.doCall = __bind(this.doCall, this);
      this.canceltravel = __bind(this.canceltravel, this);
      this.cancelPickUp = __bind(this.cancelPickUp, this);
      this.doPickUp = __bind(this.doPickUp, this);
      ArriveCtrl.__super__.constructor.apply(this, arguments);
    }

    ArriveCtrl.prototype.iniArrive = function() {
      var arriveLocation, mapOptions, marker, travel;
      travel = Lungo.Cache.get("travel");
      this.streetField[0].value = travel.origin;
      if (navigator.geolocation) {
        travel = Lungo.Cache.get("travel");
        arriveLocation = new google.maps.LatLng(travel.latitude, travel.longitude);
        mapOptions = {
          center: arriveLocation,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          panControl: false,
          streetViewControl: false,
          overviewMapControl: false,
          mapTypeControl: false,
          zoomControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            }
          ]
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        return marker = new google.maps.Marker({
          position: arriveLocation,
          map: map,
          title: travel.origin
        });
      }
    };

    manageErrors = function(err) {
      return console.log("error gps arrive");
    };

    iniLocation = function(location) {
      var currentLocation, travel;
      travel = Lungo.Cache.get("travel");
      currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
      travel.latitude = location.coords.latitude;
      travel.longitude = location.coords.longitude;
      getStreet(currentLocation);
      return Lungo.Cache.set("travel", travel);
    };

    ArriveCtrl.prototype.doPickUp = function(event) {
      var options;
      this.button_PickUp[0].disabled = true;
      this.button_cancel[0].disabled = true;
      if (navigator.geolocation) {
        options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(iniLocation, manageErrors);
      }
      return setTimeout(((function(_this) {
        return function() {
          var driver, server, travel;
          driver = Lungo.Cache.get("driver");
          travel = Lungo.Cache.get("travel");
          server = Lungo.Cache.get("server");
          travel.origin = Lungo.Cache.get("origin");
          if (travel.origin === 'undefined') {
            travel.origin = "";
          }
          Lungo.Cache.set("travel", travel);
          return $$.ajax({
            type: "POST",
            url: server + "driver/travelstarted",
            data: {
              email: driver.email,
              travelID: travel.travelID,
              origin: travel.origin,
              latitude: travel.latitude,
              longitude: travel.longitude
            },
            success: function(result) {
              _this.button_PickUp[0].disabled = false;
              _this.button_cancel[0].disabled = false;
              __Controller.charge.initialize();
              return Lungo.Router.section("charge_s");
            },
            error: function(xhr, type) {
              _this.button_PickUp[0].disabled = false;
              _this.button_cancel[0].disabled = false;
              return navigator.notification.alert(type.response, null, "Taxi Express", "Aceptar");
            }
          });
        };
      })(this)), 5000);
    };

    ArriveCtrl.prototype.cancelPickUp = function(event) {
      this.button_PickUp[0].disabled = true;
      this.button_cancel[0].disabled = true;
      return Lungo.Notification.confirm({
        title: "¿Esta seguro que desea cancelar el viaje?",
        description: "",
        accept: {
          label: "Si",
          callback: (function(_this) {
            return function() {
              return _this.canceltravel();
            };
          })(this)
        },
        cancel: {
          label: "No",
          callback: (function(_this) {
            return function() {
              _this.button_PickUp[0].disabled = false;
              return _this.button_cancel[0].disabled = false;
            };
          })(this)
        }
      });
    };

    ArriveCtrl.prototype.canceltravel = function() {
      var driver, server, travel;
      driver = Lungo.Cache.get("driver");
      travel = Lungo.Cache.get("travel");
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/canceltravel",
        data: {
          travelID: travel.travelID,
          email: driver.email
        },
        success: (function(_this) {
          return function(result) {
            _this.button_PickUp[0].disabled = false;
            _this.button_cancel[0].disabled = false;
            return Lungo.Router.section("waiting_s");
          };
        })(this),
        error: (function(_this) {
          return function(xhr, type) {
            _this.button_PickUp[0].disabled = false;
            _this.button_cancel[0].disabled = false;
            return navigator.notification.alert(type.response, null, "Taxi Express", "Aceptar");
          };
        })(this)
      });
    };

    ArriveCtrl.prototype.doCall = function(event) {
      return document.getElementById("fdw").onclick();
    };

    getStreet = function(pos) {
      var geocoder;
      geocoder = new google.maps.Geocoder();
      return geocoder.geocode({
        latLng: pos
      }, function(results, status) {
        var street;
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            if (results[0].address_components[1].short_name === results[0].address_components[0].short_name) {
              street = results[0].address_components[1].short_name;
            } else {
              street = results[0].address_components[1].short_name + ", " + results[0].address_components[0].short_name;
            }
          } else {
            street = 'Calle desconocida';
          }
        } else {
          street = 'Calle desconocida';
        }
        Lungo.Cache.remove("origin");
        return Lungo.Cache.set("origin", street);
      });
    };

    return ArriveCtrl;

  })(Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.ChargeCtrl = (function(_super) {
    var getStreet, iniLocation, manageErrors;

    __extends(ChargeCtrl, _super);

    ChargeCtrl.prototype.elements = {
      "#charge_amount": "amount",
      "#charge_cash": "optionCash",
      "#charge_app_fieldset": "fieldset_charge_app",
      "#charge_app": "optionApp",
      "#charge_livote": "li_vote",
      "#charge_votebox": "fieldset_vote",
      "#charge_positiveVote": "button_Positive",
      "#charge_negativeVote": "button_Negative",
      "#charge_charge": "button_charge"
    };

    ChargeCtrl.prototype.events = {
      "tap #charge_charge": "doCharge",
      "singleTap #charge_app": "changeCash",
      "singleTap #charge_cash": "changeApp",
      "tap #charge_positiveVote": "votePositive",
      "tap #charge_negativeVote": "voteNegative"
    };

    function ChargeCtrl() {
      this.vote = __bind(this.vote, this);
      this.voteNegative = __bind(this.voteNegative, this);
      this.votePositive = __bind(this.votePositive, this);
      this.valideAmount = __bind(this.valideAmount, this);
      this.travelCompleted = __bind(this.travelCompleted, this);
      this.doCharge = __bind(this.doCharge, this);
      this.changeApp = __bind(this.changeApp, this);
      this.changeCash = __bind(this.changeCash, this);
      this.initialize = __bind(this.initialize, this);
      ChargeCtrl.__super__.constructor.apply(this, arguments);
    }

    ChargeCtrl.prototype.initialize = function() {
      var driver, fieldset, padre;
      this.optionCash[0].checked = true;
      this.button_charge[0].disabled = false;
      driver = Lungo.Cache.get("driver");
      if (driver.appPayment === false) {
        this.optionCash[0].disabled = true;
        if (document.getElementById("charge_app_fieldset")) {
          fieldset = document.getElementById("charge_app_fieldset");
          alert(fieldset);
          padre = fieldset.parentNode;
          padre.removeChild(fieldset);
        } else {
          this.optionApp[0].checked = false;
        }
      }
      this.li_vote[0].style.visibility = "hidden";
      return this.fieldset_vote[0].style.visibility = "hidden";
    };

    ChargeCtrl.prototype.changeCash = function() {
      var driver;
      driver = Lungo.Cache.get("driver");
      if (driver.appPayment === true) {
        if (this.optionApp[0].checked === true) {
          return this.optionCash[0].checked = false;
        } else {
          return this.optionCash[0].checked = true;
        }
      }
    };

    ChargeCtrl.prototype.changeApp = function() {
      var driver;
      driver = Lungo.Cache.get("driver");
      if (driver.appPayment === true) {
        if (this.optionCash[0].checked === true) {
          return this.optionApp[0].checked = false;
        } else {
          return this.optionApp[0].checked = true;
        }
      }
    };

    iniLocation = function(location) {
      var currentLocation, travel;
      travel = Lungo.Cache.get("travel");
      currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
      travel.latitude = location.coords.latitude;
      travel.longitude = location.coords.longitude;
      getStreet(currentLocation);
      return Lungo.Cache.set("travel", travel);
    };

    manageErrors = function() {
      return console.log("ERROR CHARGE");
    };

    ChargeCtrl.prototype.doCharge = function(event) {
      var correcto, options, travel;
      correcto = this.valideAmount(this.amount[0].value);
      if (correcto) {
        travel = Lungo.Cache.get("travel");
        if (navigator.geolocation) {
          options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };
          navigator.geolocation.getCurrentPosition(iniLocation, manageErrors);
        }
        this.button_charge[0].disabled = true;
        return setTimeout(((function(_this) {
          return function() {
            return _this.travelCompleted();
          };
        })(this)), 5000);
      }
    };

    ChargeCtrl.prototype.travelCompleted = function() {
      var driver, server, travel;
      driver = Lungo.Cache.get("driver");
      server = Lungo.Cache.get("server");
      travel = Lungo.Cache.get("travel");
      travel.destination = Lungo.Cache.get("destination");
      if (travel.destination === 'undefined') {
        travel.destination = "";
      }
      return $$.ajax({
        type: "POST",
        url: server + "driver/travelcompleted",
        data: {
          travelID: travel.travelID,
          email: driver.email,
          destination: travel.destination,
          latitude: travel.latitude,
          longitude: travel.longitude,
          appPayment: this.optionApp[0].checked,
          cost: this.amount[0].value
        },
        success: (function(_this) {
          return function(result) {
            _this.amount[0].value = "";
            if (_this.optionCash[0].checked) {
              _this.li_vote[0].style.visibility = "visible";
              return _this.fieldset_vote[0].style.visibility = "visible";
            }
          };
        })(this),
        error: (function(_this) {
          return function(xhr, type) {
            navigator.notification.alert(type.response, null, "Taxi Express", "Aceptar");
            return Lungo.Router.section("charge_s");
          };
        })(this)
      });
    };

    getStreet = function(pos) {
      var geocoder;
      geocoder = new google.maps.Geocoder();
      return geocoder.geocode({
        latLng: pos
      }, function(results, status) {
        var street;
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            if (results[0].address_components[1].short_name === results[0].address_components[0].short_name) {
              street = results[0].address_components[1].short_name;
            } else {
              street = results[0].address_components[1].short_name + ", " + results[0].address_components[0].short_name;
            }
          } else {
            street = 'Calle desconocida';
          }
        } else {
          street = 'Calle desconocida';
        }
        Lungo.Cache.remove("destination");
        return Lungo.Cache.set("destination", street);
      });
    };

    ChargeCtrl.prototype.valideAmount = function(amount) {
      var decallowed, dectext;
      decallowed = 2;
      if (isNaN(amount)) {
        navigator.notification.alert("El importe introducido no es correcto", null, "Taxi Express", "Aceptar");
        return false;
      } else if (amount === "") {
        navigator.notification.alert("El importe no puede estar vacío", null, "Taxi Express", "Aceptar");
        return false;
      } else {
        if (amount.indexOf(".") === -1) {
          amount += ".";
        }
        dectext = amount.substring(amount.indexOf(".") + 1, amount.length);
        if (dectext.length > decallowed) {
          navigator.notification.alert("Por favor, entra un número con " + decallowed + " números decimales.", null, "Taxi Express", "Aceptar");
          return false;
        } else {
          return true;
        }
      }
    };

    ChargeCtrl.prototype.votePositive = function(event) {
      return this.vote("positive");
    };

    ChargeCtrl.prototype.voteNegative = function(event) {
      return this.vote("negative");
    };

    ChargeCtrl.prototype.vote = function(vote) {
      var data, driver, server, travel;
      driver = Lungo.Cache.get("driver");
      travel = Lungo.Cache.get("travel");
      server = Lungo.Cache.get("server");
      data = {
        email: driver.email,
        vote: vote,
        travelID: travel.travelID
      };
      return $$.ajax({
        type: "POST",
        url: server + "driver/votecustomer",
        data: data,
        success: (function(_this) {
          return function(result) {
            navigator.notification.alert("Cliente valorado", null, "Taxi Express", "Aceptar");
            return Lungo.Router.section("waiting_s");
          };
        })(this),
        error: (function(_this) {
          return function(xhr, type) {
            console.log(type.response);
            navigator.notification.alert("Error al valorar al cliente", null, "Taxi Express", "Aceptar");
            return Lungo.Router.section("waiting_s");
          };
        })(this)
      });
    };

    return ChargeCtrl;

  })(Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.ConfirmationCtrl = (function(_super) {
    var timer;

    __extends(ConfirmationCtrl, _super);

    timer = null;

    ConfirmationCtrl.prototype.elements = {
      "#confirmation_name": "customerName",
      "#confirmation_valuation": "valuation",
      "#confirmation_street": "streetField",
      "#confirmation_accept": "button_accept",
      "#confirmation_reject": "button_reject"
    };

    ConfirmationCtrl.prototype.events = {
      "tap #confirmation_accept": "acceptConfirmation",
      "tap #confirmation_reject": "rejectConfirmation"
    };

    function ConfirmationCtrl() {
      this.stopTimer = __bind(this.stopTimer, this);
      this.rejectConfirmation = __bind(this.rejectConfirmation, this);
      this.acceptConfirmation = __bind(this.acceptConfirmation, this);
      ConfirmationCtrl.__super__.constructor.apply(this, arguments);
    }

    ConfirmationCtrl.prototype.loadTravel = function(travel) {
      var i, val;
      this.button_accept[0].disabled = false;
      this.button_reject[0].disabled = false;
      this.customerName[0].innerText = "Nombre y Apellidos";
      this.streetField[0].innerText = travel.origin;
      val = "";
      i = 0;
      while (i < travel.valuation) {
        val = val + "★";
        i++;
      }
      while (i < 5) {
        val = val + "☆";
        i++;
      }
      this.valuation[0].innerText = val;
      Lungo.Cache.remove("travel");
      Lungo.Cache.set("travel", travel);
      return timer = setTimeout(((function(_this) {
        return function() {
          return Lungo.Router.section("waiting_s");
        };
      })(this)), 25000);
    };

    ConfirmationCtrl.prototype.acceptConfirmation = function(event) {
      var data, driver, server, travel;
      this.stopTimer();
      this.button_accept[0].disabled = true;
      this.button_reject[0].disabled = true;
      driver = Lungo.Cache.get("driver");
      travel = Lungo.Cache.get("travel");
      data = {
        email: driver.email,
        travelID: travel.travelID,
        latitude: travel.latitude,
        longitude: travel.longitude
      };
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/accepttravel",
        data: data,
        success: (function(_this) {
          return function(result) {
            __Controller.arrive.iniArrive();
            return Lungo.Router.section("arrive_s");
          };
        })(this),
        error: (function(_this) {
          return function(xhr, type) {
            _this.button_accept[0].disabled = false;
            _this.button_reject[0].disabled = false;
            navigator.notification.alert(type.response, null, "Taxi Express", "Aceptar");
            return Lungo.Router.section("waiting_s");
          };
        })(this)
      });
    };

    ConfirmationCtrl.prototype.rejectConfirmation = function(event) {
      this.stopTimer();
      return Lungo.Router.section("waiting_s");
    };

    ConfirmationCtrl.prototype.stopTimer = function() {
      return clearTimeout(timer);
    };

    return ConfirmationCtrl;

  })(Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.LoginCtrl = (function(_super) {
    var credentials, db;

    __extends(LoginCtrl, _super);

    db = void 0;

    credentials = void 0;

    LoginCtrl.prototype.elements = {
      "#login_username": "username",
      "#login_password": "password"
    };

    LoginCtrl.prototype.events = {
      "tap #login_login_b": "doLogin"
    };

    function LoginCtrl() {
      this.read = __bind(this.read, this);
      this.drop = __bind(this.drop, this);
      this.valideCredentials = __bind(this.valideCredentials, this);
      this.doLogin = __bind(this.doLogin, this);
      LoginCtrl.__super__.constructor.apply(this, arguments);
      this.db = window.openDatabase("TaxiExpressDriver", "1.0", "description", 2 * 1024 * 1024);
      this.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("CREATE TABLE IF NOT EXISTS accessDataDriver (email STRING NOT NULL PRIMARY KEY, pass STRING NOT NULL)");
        };
      })(this));
      this.read();
    }

    LoginCtrl.prototype.doLogin = function(event) {
      if (this.username[0].value && this.password[0].value) {
        this.drop();
        return this.valideCredentials(this.username[0].value, this.password[0].value);
      } else {
        return navigator.notification.alert("Debe rellenar el email y la contraseña", null, "Taxi Express", "Aceptar");
      }
    };

    LoginCtrl.prototype.valideCredentials = function(email, pass) {
      var data, device, pushID, server;
      pushID = Lungo.Cache.get("pushID");
      if (pushID === void 0) {
        return setTimeout(((function(_this) {
          return function() {
            pushID = Lungo.Cache.get("pushID");
            return _this.valideCredentials(email, pass);
          };
        })(this)), 500);
      } else {
        device = Lungo.Cache.get("pushDevice");
        server = Lungo.Cache.get("server");
        data = {
          email: email,
          password: pass,
          pushID: pushID,
          pushDevice: device
        };
        server = Lungo.Cache.get("server");
        return $$.ajax({
          type: "POST",
          url: server + "driver/login",
          data: data,
          success: (function(_this) {
            return function(result) {
              return _this.parseResponse(result);
            };
          })(this),
          error: (function(_this) {
            return function(xhr, type) {
              setTimeout((function() {
                return Lungo.Router.section("login_s");
              }), 500);
              _this.password[0].value = "";
              return navigator.notification.alert(type.response, null, "Taxi Express", "Aceptar");
            };
          })(this)
        });
      }
    };

    LoginCtrl.prototype.parseResponse = function(result) {
      var driver, email, pass;
      if (this.username[0].value === "") {
        email = credentials.email;
        pass = credentials.pass;
      } else {
        email = this.username[0].value;
        pass = this.password[0].value;
      }
      this.db.transaction((function(_this) {
        return function(tx) {
          var sql;
          sql = "INSERT INTO accessDataDriver (email, pass) VALUES ('" + email + "','" + pass + "');";
          return tx.executeSql(sql);
        };
      })(this));
      driver = {
        email: email,
        first_name: result.first_name,
        last_name: result.last_name,
        appPayment: result.appPayment
      };
      Lungo.Cache.set("driver", driver);
      __Controller.confirmation = new __Controller.ConfirmationCtrl("section#confirmation_s");
      __Controller.charge = new __Controller.ChargeCtrl("section#charge_s");
      __Controller.arrive = new __Controller.ArriveCtrl("section#arrive_s");
      __Controller.waiting = new __Controller.WaitingCtrl("section#waiting_s");
      __Controller.waiting.getLocationUpdate();
      return Lungo.Router.section("waiting_s");
    };

    LoginCtrl.prototype.drop = function() {
      return this.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("DELETE FROM accessDataDriver");
        };
      })(this));
    };

    LoginCtrl.prototype.read = function() {
      return this.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("SELECT * FROM accessDataDriver", [], (function(tx, results) {
            if (results.rows.length > 0) {
              credentials = results.rows.item(0);
              return _this.valideCredentials(credentials.email, credentials.pass);
            } else {
              return Lungo.Router.section("login_s");
            }
          }), null);
        };
      })(this));
    };

    return LoginCtrl;

  })(Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.PushCtrl = (function(_super) {
    var pushNotification;

    __extends(PushCtrl, _super);

    pushNotification = void 0;

    function PushCtrl() {
      this.handlePush = __bind(this.handlePush, this);
      this.savePushID = __bind(this.savePushID, this);
      PushCtrl.__super__.constructor.apply(this, arguments);
    }

    PushCtrl.prototype.savePushID = function(id, device) {
      Lungo.Cache.remove("pushID");
      Lungo.Cache.set("pushID", id);
      Lungo.Cache.remove("pushDevice");
      return Lungo.Cache.set("pushDevice", device);
    };

    PushCtrl.prototype.handlePush = function(notification) {
      var lat, long, longlat, pos, travel;
      switch (notification.code) {
        case "801":
        case "802":
          longlat = notification.startpoint;
          pos = longlat.indexOf(",");
          lat = longlat.substring(0, pos);
          long = longlat.substring(pos + 1, longlat.length);
          travel = {
            travelID: notification.travelID,
            origin: notification.origin,
            startpoint: notification.startpoint,
            latitude: lat,
            longitude: long,
            valuation: notification.valuation,
            phone: notification.phone
          };
          __Controller.confirmation.loadTravel(travel);
          return Lungo.Router.section("confirmation_s");
        case "803":
          Lungo.Router.section("valuation_s");
          return navigator.notification.alert("El pago se ha realizado correctamente", null, "Taxi Express", "Aceptar");
      }
    };

    return PushCtrl;

  })(Monocle.Controller);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.WaitingCtrl = (function(_super) {
    var driver, manageError, updatePosition, watchId;

    __extends(WaitingCtrl, _super);

    driver = null;

    watchId = void 0;

    WaitingCtrl.prototype.events = {
      "singleTap #waiting_available": "changeAvailable"
    };

    WaitingCtrl.prototype.elements = {
      "#waiting_driver": "driver",
      "#waiting_available": "valorAvailable"
    };

    function WaitingCtrl() {
      this.changeAvailable = __bind(this.changeAvailable, this);
      this.updateAvailable = __bind(this.updateAvailable, this);
      this.stopWatch = __bind(this.stopWatch, this);
      this.getLocationUpdate = __bind(this.getLocationUpdate, this);
      WaitingCtrl.__super__.constructor.apply(this, arguments);
      this.valorAvailable[0].checked = true;
      driver = Lungo.Cache.get("driver");
      this.driver[0].innerText = driver.last_name + ", " + driver.first_name;
    }

    WaitingCtrl.prototype.getLocationUpdate = function() {
      var options, tt;
      if (navigator.geolocation) {
        options = {
          enableHighAccuracy: true,
          timeout: 3000,
          maximumAge: 3000
        };
        tt = navigator.geolocation.watchPosition(updatePosition, manageError, options);
        return this.watchId = tt;
      }
    };

    WaitingCtrl.prototype.stopWatch = function() {
      if (this.watchId) {
        navigator.geolocation.clearWatch(this.watchId);
        return this.watchId = void 0;
      }
    };

    updatePosition = function(position) {
      var server;
      driver = Lungo.Cache.get("driver");
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/updatedriverposition",
        data: {
          email: driver.email,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        success: function(result) {
          return WaitingCtrl;
        },
        error: function(xhr, type) {
          return WaitingCtrl;
        }
      });
    };

    manageError = function() {
      return console.log("ERROR");
    };

    WaitingCtrl.prototype.updateAvailable = function(email, available) {
      var server;
      server = Lungo.Cache.get("server");
      return $$.ajax({
        type: "POST",
        url: server + "driver/updatedriveravailable",
        data: {
          email: email,
          available: available
        },
        success: (function(_this) {
          return function(result) {
            return _this;
          };
        })(this),
        error: (function(_this) {
          return function(xhr, type) {
            return navigator.notification.alert(type.response, null, "Taxi Express", "Aceptar");
          };
        })(this)
      });
    };

    WaitingCtrl.prototype.changeAvailable = function() {
      this.updateAvailable(driver.email, this.valorAvailable[0].checked);
      if (this.valorAvailable[0].checked) {
        return this.getLocationUpdate();
      } else {
        return this.stopWatch();
      }
    };

    return WaitingCtrl;

  })(Monocle.Controller);

}).call(this);
