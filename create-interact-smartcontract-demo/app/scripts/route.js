(function() {
    var app = angular.module("contract-demo", ["ngRoute"]);

    app.config(function($routeProvider){
        $routeProvider
            .when("/home", {
                templateUrl: "/home.html",
                controller: "HomeController"
            })
            .when("/create-contract", {
                templateUrl: "/create-contract.html",
                controller: "CreateContractController"
            })
            .otherwise({redirectTo: "/home"});
    })
}())