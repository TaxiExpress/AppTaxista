class __Controller.AppCtrl extends Monocle.Controller

  constructor: ->
    super
    
    Lungo.Cache.set "phone", "669338946"
    #Lungo.Cache.set "server", "http://192.168.43.137:8000/"
    Lungo.Cache.set "server", "http://TaxiLoadBalancer-638315338.us-east-1.elb.amazonaws.com/"
    __Controller.login = new __Controller.LoginCtrl "section#login_s"
   
$$ ->
  Lungo.init({})
  __Controller.push = new __Controller.PushCtrl
  __Controller.App = new __Controller.AppCtrl "section#init_s"
