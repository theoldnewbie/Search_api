$(function() {

	var $searchForm = $('#search_form');

	var $searchInput = $('#search');

	var queryText = (function(){
		var _value = '';
		return {
				get: function(){
					return _value;
				},
				set: function(val){
					_value=val;
					$searchInput.trigger('searchText:change', val);
				}
		};

	})();
	

	var onSubmitHandler = function(event) {
		queryText.set($searchInput.val());
		event.preventDefault();
	};

	var showBuildingsList = function (response) {
		console.log(response);
		var elements = response.listings;
		var $divTemp = $('<div>');
		var $result = $('#result');
		var addHtml = function(element){
			$divTemp.append('<form> <img src =' + element.img_url + '>');
			$divTemp.append('<br>'+element.price_formatted);
			$divTemp.append('<br>'+element.title);
			$divTemp.append('<br>'+element.summary+'</form>');
		};
		elements.forEach(addHtml);

		$result.html($divTemp);
	};
	var showLocationsList = function (response) {
		console.log(response);
		var elements = response.locations;
		var $ulResult = $('<ul>');
		var $result = $('#result');
		var addHtml = function(element){
			$ulResult.append('<li>'+element.long_title+'</li>');
		};
		elements.forEach(addHtml);

		$result.html('Возможно вы имелли ввиду:').append($ulResult);

	};
	var showErrorList = function () {
		$('#result').html('<h1> <span style="color:#FF0000"> Оуу, что то пошло не так! </h1>')

	};

	var onChangeQueryText = function (event, text) {
		$searchInput.val('');
		var callbackSuccess = function (data){
			//console.info(data);
			switch(data.response.application_response_code) {
				case '100':
				case '101':
				case '110':
					showBuildingsList(data.response);
				break;
				case '200':
				case '202':
					showLocationsList(data.response);
				break;
				default:
					showErrorList(data.response);
			}
		};
		var callbackError = function (data) {
			console.error(data);
			showErrorList(data);
		};
		nestoriaApi.getLocations(text, callbackSuccess, callbackError);
	};

	$searchForm.on('submit', onSubmitHandler);

	$searchInput.on('searchText:change', onChangeQueryText);
});