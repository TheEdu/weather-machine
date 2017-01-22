

	var app = angular.module('myApp', [])

	app.config(function($sceDelegateProvider) {
	    $sceDelegateProvider.resourceUrlWhitelist([
	        'https://api.apixu.com/**'
	    ]);
	});

	app.controller('myCtrl', function($scope, $http) {

		/*
		$scope.timer = setTimeout(
		 	function(){
		 		$("#nubeLoading").addClass("hide");
		 		$("#clima-container").addClass("hide");
		 		$("#problemaConsultarClima").addClass("hide");
				$("#noAccessToGeoLocation").removeClass("hide");
		 	}, 10000);
		*/

		navigator.geolocation.getCurrentPosition(
			function success(position){
				//clearTimeout($scope.timer);
				$scope.lat = position.coords.latitude;
				$scope.lng = position.coords.longitude;
				$scope.geolocationSuccess = "latlng=" + $scope.lat + "," + $scope.lng;
				$scope.googleMapsKey = "&key=AIzaSyBGhvrQh2edYQi7AXdDYCA71Lb_YehPXTk";
				$scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/geocode/json?" + $scope.geolocationSuccess + $scope.googleMapsKey;

				$http({method: "GET", url: $scope.googleMapsUrl})
			        .then(function successCallback(response) {
			          $scope.googleData = response.data;
			          $scope.addressToConsul = $scope.googleData.results[1].formatted_address
			          console.log($scope.addressToConsul);

			          $scope.weatherUrl = "https://api.apixu.com/v1/current.json?key=ebe2ef6d64304fbabb5182645171801&q=" + $scope.addressToConsul;
			          console.log($scope.weatherUrl);

			          $http({method: "GET", url: $scope.weatherUrl})
				        .then(function successCallback(response) {
				          $scope.status = response.status;
				          $scope.data = response.data;
				          $scope.temperatura = Math.trunc($scope.data.current.temp_c);
				          if($scope.data.error == undefined){
					        $("#nubeLoading").addClass("hide");
					        $("#clima-container").removeClass("hide");
					        $("#noAccessToGeoLocation").addClass("hide");
				          } else {
				          	$("#nubeLoading").addClass("hide");
				          	//"#problemaConsultarClima").append(": " + $scope.data.error.message);
				          	$("#problemaConsultarClima").removeClass("hide");
				          }

				        }, function errorCallback(response) {
				          $("#nubeLoading").addClass("hide");
				          $("#noAccessToGeoLocation").removeClass("hide");
				          $("#problemaConsultarClima").removeClass("hide");
				      });


			        }, function errorCallback(response) {
						$("#nubeLoading").addClass("hide");
						$("#noAccessToGeoLocation").removeClass("hide");
						$("#problemaConsultarClima").removeClass("hide");
			    });
				console.log($scope.googleMapsUrl);
			},function error(positionError){					    
	        	//clearTimeout($scope.timer);
				$scope.geolocationError = "Uppss";
				console.log($scope.geolocationError);
				$("#nubeLoading").addClass("hide");
				$("#noAccessToGeoLocation").removeClass("hide");
			});


		$scope.weatherConsult = function(){
			console.log($scope.inputLocation);
			$scope.inputUrl = "https://api.apixu.com/v1/current.json?key=ebe2ef6d64304fbabb5182645171801&q=" + $scope.inputLocation;
			$("#noAccessToGeoLocation").addClass("hide");
			$("#problemaConsultarClima").addClass("hide");
			$("#nubeLoading").removeClass("hide");
			$http({method: "GET", url: $scope.inputUrl})
				.then(function successCallback(response) {
				  $scope.status = response.status;
				  $scope.data = response.data;
				  console.log($scope.data);
				  $("#nubeLoading").addClass("hide");
				  if($scope.data.error == undefined){
				  	$scope.temperatura = Math.trunc($scope.data.current.temp_c);
				    $("#clima-container").removeClass("hide");
				  } else {
				  	$("#noAccessToGeoLocation").removeClass("hide");
				  	//$("#problemaConsultarClima").append(": " + $scope.data.error.message);
				  	$("#problemaConsultarClima").removeClass("hide");
				  }

				}, function errorCallback(response) {
				  $scope.data = response.data || 'Request failed';
				  $scope.status = response.status;
				  $("#nubeLoading").addClass("hide");
				  $("#noAccessToGeoLocation").removeClass("hide");
				  $("#problemaConsultarClima").removeClass("hide");
			});
		};


		$scope.mostrarCOcultarK = true;
		$scope.cambiarAFahrenheit  = function(){

			$scope.temperatura = Math.trunc($scope.data.current.temp_f);
			$scope.mostrarCOcultarK = !($scope.mostrarCOcultarK);
		};
		$scope.cambiarACelsius = function(){
			$scope.temperatura = Math.trunc($scope.data.current.temp_c);
			$scope.mostrarCOcultarK = !($scope.mostrarCOcultarK);
		};

		$scope.cambiarCiudad = function(){
			$scope.weatherUrl = "https://api.apixu.com/v1/current.json?key=ebe2ef6d64304fbabb5182645171801&q=" + $scope.data.location.name;
			console.log($scope.weatherUrl);
		};

		$scope.inputShow = function(){
			$("#clima-container").addClass("hide");
			$("#nubeLoading").addClass("hide");
			$("#problemaConsultarClima").addClass("hide");
			$("#noAccessToGeoLocation").removeClass("hide");
		}

	});
