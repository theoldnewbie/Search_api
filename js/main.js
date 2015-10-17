$(function() {

	var $searchForm = $('#search_form');

	var $searchInput = $('#search');

	var successLocations = JSON.parse(localStorage.getItem('successLocations'));
	if(!successLocations){
		successLocations = [];
	}
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


	var saveLocalStorage = function(arg) {
		if(successLocations.indexOf(arg) != 0){
			successLocations.push(arg);
		};
		localStorage.setItem('successLocations', JSON.stringify(successLocations));
	};

	var addPageLocalStorageItems = function () {
		var $ulResult = $('<ul>');
		var $result = $('#result');
		var resultItems = JSON.parse(localStorage.getItem('successLocations'));
		if(!resultItems){
			resultItems = [];
		}
		console.log(resultItems);
		for (var i = 0; i < resultItems.length; i++) {
			$ulResult.append('<li><a href ="#">'+resultItems[i]+'</a></li>');
			$result.append($ulResult);
		};
	};

	

	var onSubmitHandler = function(event) {
		var existingUl = document.getElementById('result');
		existingUl.innerHTML = '';
		queryText.set($searchInput.val());
		event.preventDefault();
	};


	//ЭТО РЕАЛИЗАЦИ НА JQUERY!!!

	// var showBuildingsList = function (response) {
	// 	console.log(response);
	// 	var elements = response.listings;
	// 	var $divTemp = $('<div>');
	// 	var $result = $('#result');
	// 	var addHtml = function(element){
	// 		$divTemp.append('<form> <img src ="' + element.img_url + '">');
	// 		$divTemp.append('<br>'+element.price_formatted);
	// 		$divTemp.append('<br>'+element.title);
	// 		$divTemp.append('<br>'+element.summary+'</form>');
	// 	};
	// 	elements.forEach(addHtml);

	// 	$result.html($divTemp);
	// };

	//ЭТО РЕАЛИЗАЦИЯ НА Vanilla

	var showBuildingsList = function (response) {
		var elements = response.listings;
		var fragment = document.createDocumentFragment();
		var existingUl = document.getElementById('result');

		function someFunc (element) {
			var li = document.createElement('li');
			var img = document.createElement('img');
			var h2 = document.createElement('h2');
			var p1 = document.createElement('p');
			var p2 = document.createElement('p');

			img.src = element.img_url;
			li.appendChild(img);

			h2.innerHTML = element.price_formatted;
			li.appendChild(h2);

			p1.innerHTML = element.title;
			li.appendChild(p1);

			p2.innerHTML = element.summary;
			li.appendChild(p2);

			fragment.appendChild(li);
		}
		
		elements.forEach(someFunc);
		existingUl.appendChild(fragment);
	};

	//ЭТО РЕАЛИЗАЦИ НА JQUERY!!!

	var showLocationsList = function (response) {
		console.log(response);
		var elements = response.locations;
		var $ulResult = $('<ul>');
		var $result = $('#result');
		var addHtml = function(element){
			$ulResult.append('<li><a href ="#">'+element.place_name+'</a></li>');
		};
		elements.forEach(addHtml);

		$result.html('Возможно вы имели ввиду:').append($ulResult);
		
	};

		var render = function(event){
		var link = event.target;
		queryText.set(link.text);
		};

	//ЭТО РЕАЛИЗАЦИЯ НА Vanilla

	// var showLocationsList = function (response){
	// 	var elements = response.locations;
	// 	var fragment = document.createDocumentFragment();
	// 	var existingUl = document.getElementById('result');
	// 	function someFunc (element) {
	// 		var li = document.createElement('li');
	// 		var p = document.createElement('p');
	// 		p.innerHTML = element.long_title;
	// 		li.appendChild(p);

	// 		fragment.appendChild(li);
	// 	}
	// 	elements.forEach(someFunc);
	// 	existingUl.innerHTML = '<h2> Возможно вы имели ввиду: </h2>';
	// 	existingUl.appendChild(fragment);
	// };

	//ЭТО РЕАЛИЗАЦИ НА JQUERY!!!

	// var showErrorList = function () {
	// 	$('#result').html('<h1> <span style="color:#FF0000"> Оуу, что то пошло не так! </h1>');

	// };

	//ЭТО РЕАЛИЗАЦИЯ НА Vanilla

	var showErrorList = function () {
		var existingUl = document.getElementById('result');
		var text = '<h1> <span style="color:#FF0000"> Оуу, что то пошло не так! </h1>';
		existingUl.innerHTML = text;
	}

	var onChangeQueryText = function (event, text) {
		$searchInput.val('');
		$('#result').html('');
		var callbackSuccess = function (data){
			//console.info(data);
			switch(data.response.application_response_code) {
				case '100':
				case '101':
				case '110':
					showBuildingsList(data.response);
					saveLocalStorage(queryText.get());
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

	addPageLocalStorageItems();

	$searchForm.on('submit', onSubmitHandler);

	$searchInput.on('searchText:change', onChangeQueryText);

	$('ul').on('click', render);
});
