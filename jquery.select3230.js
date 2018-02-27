/*
for ajax

$('select').on('change', function(){
	//... обработчик смены значения
});

$('select').trigger('edit'); // обновит все псевдо option от радного select

*/

// todo: при повторной инициализации пересаберать селект и добавить метод destroy;

// todo: добавить опционально при mouseout закрытие выподающего списка (полезно для товаров)
(function($) {
	var $document = $(document),
		$currentSelect = false,
		$currentDropdown;

	// init функция прячит селект и создают разметку для
	// псевдо селекта начиная с радителя селекта (он не создается а используется старый) 
	// при этом значения value каждой options копируется в аттрибут data-value. 
	// Текст первого элемента option поподает в label (нужна ли проверка ?)
	function init($select, subClass) {
		$select.css('display', 'none');
		var $listOptions = $select.find('option'),
			indexSelectedOptions = $listOptions.filter(':selected').index() || 0;

		subClass = subClass || '';

		if(subClass) {
			subClass = 'select3230_' + subClass;
		}

		var $pseudo = $select.wrap('<div class="select3230 ' + subClass + '">').closest('.select3230');
		$pseudo.append('<span class="select3230__label">'+ $listOptions.eq(indexSelectedOptions).text() +'</span><span class="select3230__btn"></span>');


		var list = '<div class="select3230__list ' + subClass + '"><ul>';
		$listOptions.each(function() {
			var $this = $(this);
			list += '<li class="select3230__item">	<a href="#" data-value="'+ $this.val() + '">' +	 $this.text() +	'</a></li>';
		});
		list += '</ul></div>';
		list = $(list);


		// при клике по пункту выподающего списка текст этого пункта копируется в
		// label этого select и заносится значение input после чего список сворачивается(selectClose()).
		$pseudo.on('click', function () {
			var $tmpSelect = $(this).closest('.select3230');
			if(!$tmpSelect.hasClass('open')){
				selectClose();
				selectOpen($pseudo, list);
			} else {
				selectClose();
			}
		});

		list.find('a').on('click', function () {
			var $item = $(this),
				$select = $pseudo,
				$label = $select.find('.select3230__label'),
				text = $item.text(),
				val = $item.data('value');

			// устанавливаем значение в дефолтный селект
			//$select.find('select').get(0).selectedIndex = $item.index();
			// onchange событие срабатывает на родном select когда миняется значение можно вешать разные обработчики
			$select.find('select').val(val).change();
			$label.text(text);

			selectClose();
			return false;
		});

		$select.on('edit', function(){
			$listOptions = $select.find('option');
			editDropdownList($listOptions, $pseudo.find('.select3230__label'), list.find('ul'));
		});

		// перестроить псевдоселект
		function editDropdownList($options, $label, $ddUl) {
			$ddUl.empty();
			var list = '';

			$options.each(function() {
				var $this = $(this);
				list += '<li class="select3230__item">	<a href="#	" data-value="'+ $this.val() + '">' +	 $this.text() +	'</a></li>';
			});

			list = $(list);

			list.find('a').on('click', function () {
				var $item = $(this),
					$select = $pseudo,
					$label = $select.find('.select3230__label'),
					text = $item.text(),
					val = $item.data('value');

				// устанавливаем значение в дефолтный селект
				//$select.find('select').get(0).selectedIndex = $item.index();
				// onchange событие срабатыва когда миняется значение можно вешать разные обработчики
				$select.find('select').val(val).change();
				$label.text(text);

				selectClose();
				return false;
			});

			$ddUl.append(list);
			$options.closest('select').val($options.eq(0).val()).change()
			$label.text($options.eq(0).text());
		}

		// read data-width and align for select3230__list
		if($select.data('width')){

			if($select.data('position')){
				$pseudo.data('position',$select.data('position'));
			}

			$pseudo.data('width',$select.data('width'));
		}

		if(!$select.data('location') != "outer") {
			$pseudo.addClass('select3230_inner').append(list);
			$pseudo.isInnerLocation = true;
		} else {			
			$('body').append(list);
		}
	}	

	// document.onclick если e.target не пренадлежит активному селекту то
	// сворачиваем его также по клику по еsc сворачиваем выподающий список оба обработчика
	// вещаются в момент раскрытия(selectOpen()) select и снимаются в момент его закрытия (selectClose())
	function hClickClose (e) {
		var activeSelect = $(e.target).closest('.select3230.open');

		if(!activeSelect.length) {
			selectClose();
		}
	}

	//обработчик клавиши клавиши для закрытия
	function hEscClose (e) {
		if(e.keyCode == 27){
			selectClose();
		}
	}

	function selectOpen ($select, $droplist) {
		var top,
			left,
			width,
			rest = 0;

		$currentSelect = $select;
		$currentDropdown = $droplist;
		$select.addClass('open');

		if(!$select.isInnerLocation) {

			top = $select.offset().top + $select.outerHeight();

			if($select.data('width')){
				width = parseFloat($select.data('width'));

				// todo: перенести вычисление ширины в init, но потеряем автоадаптацию при открытии. посмотреть сколько времени занимает проверка ?
				
				if( width[width.length-1]=='%' ){
					width = Math.round( $select.width() / 100 * parseFloat($select.data('width') ) );
				}

				if($select.data('position')){
					switch ($select.data('position')){
						case 'center':
							rest = - ( (width - Math.round($select.width()) ) / 2 );
							break;

						case 'right':
							rest = - ( width - $select.width() );
							break;
					}
				}				

			} else {
				width = $select.width();
			}

			left = $select.offset().left + rest;

		}

		$currentDropdown.css({
			top: top,
			left: left,
			width: width
		}).slideDown(200);

		$document.on('click', hClickClose);
		$document.on('keydown', hEscClose);
	}

	function selectClose () {

		if($currentSelect){
			$currentDropdown.hide();

			$currentSelect.removeClass('open');				
			$currentSelect = null;

			$document.off('click', hClickClose);
			$document.off('keydown', hEscClose);
		}

	}
	

	$.fn.select3230 = function(options){
		//todo: сделать опции
		//options = $.extend({
		//	width: "auto"
		//},options);		

		this.find('select').each(function(){
			var $select = $(this);
			init($select, $select.attr('class'));
		});
	};

})(jQuery);