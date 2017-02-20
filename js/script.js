$(window).load(function(){
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		$('body').addClass('ios');
	};
	$('body').removeClass('loading'); 
});
$(document).ready(function() {

	$('.cart img[title=delete]').css('display', 'none');

// Фильтрация

	function currentManufacturers(){
		selectionManuf = '';
		a = $('.currentManuf').length;
    		for ( var i = -a;  -a <= i <= a  ; ) {
				selectionManuf = selectionManuf + '.' + $('.currentManuf').eq(i).attr("rel");
				i++;
				if ( ( i > a ) || ( i < -a ) ) break;
				selectionManuf = selectionManuf + ', ' + newSelection;
    		};
	    return selectionManuf;
	};

	var newSelection = "";
	var selectionManuf = "";
	var selectionTotal = '';

	$("#flavor-nav a, #manufacturers a").on('click', function(){

		var typeFilter = $("#flavor-nav a");
		var manufacturerFilter = $("#manufacturers a");

		var metod = $('#metod').prop('value');
		var speed = $('#speed').prop('value');
		var a;
		if((speed !== 'slow') && (speed !== 'fast')){speed = parseInt(speed);};

	    $("#all-flavors").fadeTo(300, 0.10);

	    if ($(this).is(typeFilter)){

	    	$(typeFilter).removeClass("current");
			$(this).addClass("current");
			newSelection = "." + $(this).attr("rel");
			currentManufacturers();

	    } else if( $(this).is(manufacturerFilter) ){
	    	
	    	if( $(this).is(manufacturerFilter[0])){
	    		$(manufacturerFilter).removeClass("currentManuf");
				$(this).addClass("currentManuf");
				selectionManuf = '.' + $(this).attr("rel");
	    	} else {
		    	$(manufacturerFilter[0]).removeClass("currentManuf");
		    	$(this).toggleClass("currentManuf");

		    	if( $(this).is(".currentManuf") ){
		    		currentManufacturers();
		    	} else {
		    		a = $('.currentManuf').length;
		    		if( a == 0 ){
		    			$(manufacturerFilter[0]).addClass("currentManuf");
		    			selectionManuf = '.' + $(manufacturerFilter[0]).attr("rel");
		    		} else {
		    			currentManufacturers();
		    		};
		    	};
	    	};
	    };

	    if (metod=='slide'){
			$("#all-flavors div").not(newSelection + selectionManuf).slideUp( speed );
			$(newSelection + selectionManuf).slideDown( speed );
		} else if (metod=='hide'){
			$("#all-flavors div").not(newSelection + selectionManuf).hide( speed );
			$(newSelection + selectionManuf).show( speed );
		} else if (metod=='fade'){
			$("#all-flavors div").not(newSelection + selectionManuf).fadeOut( speed );
			$(newSelection + selectionManuf).fadeIn( speed );
		};	

			$("#all-flavors").fadeTo(600, 1);
			
	});

//ПЕРЕТАСКИВАНИЕ В КОРЗИНУ

	var total_items = 0;
	var total_price = 0;
	var price = 0;
	
    $( ".cart" ).draggable({
      helper: "clone",
      scroll: false
    });
    $( "#basket" ).accordion({
    	heightStyle: "content",
    	active: false,
    	collapsible: true,
    	beforeActivate: function(event, ui){
			if( $(this).width() < 250 ){
				$(this).animate({
					'width': '300px',
					'background-color': 'rgba(255,255,255, 1)',
					'z-index': '4443'
				}, 400);
			} else {
				$(this).animate({
					'width': '14%',
					'background-color': 'rgba(255,255,255, 0.8)',
					'z-index': ''
				}, 400);
			}
    	}
    }).droppable({
      activeClass: "ui-state-default",
      hoverClass: "ui-state-hover",
      accept: ":not(.ui-sortable-helper)",
      tolerance: 'pointer',
      drop: function( event, ui ) {
        $( this ).find( ".placeholder" ).remove();
      
        $( "<li></li>" ).text( ui.draggable.find('h4').text() )
        	.append( $("#all-flavors div:first img[title=delete]").clone(true).addClass('basket_elements').css('display', 'inline') )
        	.append('<span class="basket_elements"> ' + ui.draggable.find('b').text() + '</span> ' )
        	.append('<span class="basket_elements"> ' +ui.draggable.find('h5').text() + '</span> ' )
        .appendTo( '#basket div ol' );
    
    // Обновление общего количества
		total_items++;
		$("#citem").html(total_items);

    // Обновление общей цены
        price = parseInt(ui.draggable.find('b').text().replace(" $", ""));
		total_price = total_price + price;
		$("#order_price b").html(total_price + " $");

      }
    }).sortable({
      items: "li:not(.placeholder)",
      sort: function() {
        // gets added unintentionally by droppable interacting with sortable
        // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
        $( this ).removeClass( "ui-state-default" );
      }
    });

// Удаление карточки

	$("img[title='delete']").attr({
			"src": function() {return "images/" + this.title + ".png";},
		})
		.on('click',
			function(){

				if($(this).is("#basket div ol li img")){

				// Обновление количества товаров 
					total_items--;
					$("#citem").html(total_items);

				// Обновление общей цены ПРИ УДАЛЕНИИ ТОВАРА ИЗ КОРЗИНЫ
					price = parseInt( $(this).siblings('span').text().replace(" $", "") );
					total_price = total_price - price;
					$("#order_price b").html(total_price + " $");
					$(this).parent().fadeOut(function(){$(this).remove()});
				} else if ($(this).is("#all-flavors .cart img")){$(this).parent('div').hide(function(){$(this).remove()});}
			});

//КОРЗИНА

	var $basket = $("#basket");
    $(window).on('scroll', function(){
        if ( $(this).scrollTop() > 350 && ( $basket.hasClass("default") || $basket.hasClass("default_adm") ) ){
            $basket.removeClass("default default_adm").addClass("fixed");
        } else if( $(this).scrollTop() <= 350 && $basket.hasClass("fixed") && ( $('#admin').css('display') == 'block' ) ){
        	$basket.removeClass("fixed").addClass("default_adm");
        }

        else if( $(this).scrollTop() <= 350 && $basket.hasClass("fixed")) {
            $basket.removeClass("fixed").addClass("default");
        }
    });//scroll

	
// КАРТИНКИ СЛАЙДЕРА
	function slider_block_bg(){
		return '<img src="images/' + $(this).attr('id') + '">';
	};
	$('.slider-block').append(slider_block_bg);

//модальное окно

	var new_slide;
	
	var review;

	function modal(review){
		var winH = $(window).height();
		var winW = $(window).width();
		
		$('#overlay').prepend( review.addClass('cart_review').css('display', 'block'));
		$('body').css('overflow', 'hidden');
    	$('#overlay').fadeIn(400);
    	
    	$('.cart_review').css({
    				left: winW/2-$(review).width()/2});
    	$(review).css({opacity: 1, top: function(){
    					   	if( $(review).height() >= winH ){
    					   		return "0px";
    					   	} else {
    					   		return winH/2-$(review).height()/2;}
    					   	}, margin: '20px auto'
    					});  
	};

    $('.cart_img_prev, #add_cart_button, #add_slide_button, #enter_button, #order').on('click', function() {
    	
		if( $(this).is(".cart_img_prev") ){
			review = $(this).parent('div').clone(true).removeClass('ui-draggable ui-draggable-handle').removeData('draggable').unbind();
			review.find('p').removeClass('short_description');
			review.find('img:first').removeClass('cart_img_prev');
		
	//	ПОЯВЛЯЕТСЯ МОДАЛЬНОЕ ОКНО С ФОРМОЙ ДОБАВЛЕНИЯ СЛАЙДА
		} else if( $(this).is("#add_slide_button") ) {
			review = $('#slide_create').clone(true);
		} else if( $(this).is("#enter_button") ) {
			review = $('#enter_form').clone(true); 	//	ПОЯВЛЯЕТСЯ МОДАЛЬНОЕ ОКНО С ФОРМОЙ АВТОРИЗАЦИИ
		
	// Создание карточки
		} else if( $(this).is('#add_cart_button') ){
			review = $('#cart_create').clone(true);
	// ЗАКАЗ		
    	} else if( $(this).is("#order") ){
    		review = $('#mail').clone(true);
    		review.find(' input[name="email"] ').on('change', function() {
    			review.find('#send_mail').attr('href', "mailto:" + $(this).val() );
    		});
    	};
	
	   modal(review);  
    });

// ДОБАВЛЕНИЕ ТОВАРА

    $('#add_cart').on('click', function(){
    	var origin = $('#all-flavors div:last');
    	var new_cart = origin.draggable('destroy').clone(true).attr( 'class', 'cart all all_manufacturers' ).draggable({
			      helper: "clone",
			      scroll: false
			    });;
    	origin.draggable({
	      helper: "clone",
	      scroll: false
	    });
    	new_cart.addClass( review.find( 'select[name="product_group"]' ).val() );
    	new_cart.find('.cart_img_prev').attr({'src': 'images/' + review.find(' input[name="product_image"] ').val() });
    	new_cart.find('h4').text( review.find( 'input[name="product_name"]' ).val() );
    	new_cart.addClass( review.find('input[name="product_manufacturer"]' ).val() ).find('h5').text( review.find( 'input[name="product_manufacturer"]').val() );
    	new_cart.find('.short_description').text( review.find(' textarea[name="product_description"] ').val() );
    	new_cart.find('.price b').text( review.find( 'input[name="product_price"]' ).val() + ' $');
		
    	$("#all-flavors").prepend(new_cart);
    });

/* Зaкрытие мoдaльнoгo oкнa */
	function modal_close(){
	    $('.cart_review').animate({opacity: 0, top: '5%'}, 400,  // плaвнoе изменение прoзрaчнoсти
            function(){
                $(this).remove();
                $('#overlay').fadeOut(200); // скрывaем пoдлoжку
                $('body').css('overflow', 'auto');
            });
	};
	    $('#overlay_bg, img[title="delete"]').on('click', modal_close);

	// СЛАЙДЕР

		var sliderWrapperW = $('.slider-wrapper').width();
		$('.slider-block').width(sliderWrapperW);
		$('.slider-block').each(function(){
			$('#pag').prepend('<span class="pag"></span>');
		});

		function slide_move(){
			pag_active++;
			if(pag_active == slider_blocks_length){ pag_active = 0; };

			$(".slider-blocks-container .slider-block").eq(0).clone(true).appendTo(".slider-blocks-container");
			$(".slider-blocks-container").animate({"left": '-' + sliderWrapperW + 'px'}, 400);
			
			$('.pag').css('background-color', '' );
			$('.pag').eq(pag_active).css('background-color', 'rgba(255,255,255,0.3)' );
			
			setTimeout(function () {
		        $(".slider-blocks-container .slider-block").eq(0).remove();
				$(".slider-blocks-container").css({"left":"0px"});
	    	}, 500);
		};

		var slider_blocks_length = $(".slider-block").length;
		var pag_active = 0;
		$('.pag').eq(0).css('background-color', 'rgba(255,255,255,0.3)' );

		var slide_go = setInterval(slide_move, 300000);


	// ОСТАНОВКА СЛАЙДЕРА ПРИ НАВИДЕНИИ КУРСОРА
		$(".slider-block").on({mouseenter: function(){clearInterval(slide_go)},
							   mouseleave: function(){slide_go = setInterval(slide_move, 300000)}
							});

	    $(".button-right").click(slide_move);
	    $(".button-left").click(function(){
	    	
	    	pag_active--;
			if(pag_active == -1){ pag_active = slider_blocks_length-1; };

	    	$(".slider-blocks-container").css({"left":'-' + sliderWrapperW + 'px'});
	    	$(".slider-blocks-container .slider-block").eq(-1).clone(true).prependTo(".slider-blocks-container");
	        $(".slider-blocks-container .slider-block").eq(-1).remove();   
	        $(".slider-blocks-container").animate({"left":"0px"}, 400);

	        $('.pag').css('background-color', '' );
			$('.pag').eq(pag_active).css('background-color', 'rgba(255,255,255,0.3)' );
	    });

// ДОБАВЛЕНИЕ СЛАЙДА

    $('#add_slide').on('click', function(){
		var value = review.find('#file').val();
		if(value){
			new_slide = $('.slider-block:last').clone(true)
				.attr("id", function(){
    				return value;})
				.css({'background-image': slider_block_bg});
    		$('#pag').append('<span class="pag"></span>');
    		$(".slider-blocks-container").append(new_slide);
    	slider_blocks_length = $(".slider-block").length;	
		}	
    });

// ФОРМА
	var inp_length = $(".js-form-control").length;
	for (var i = 0; i < inp_length; i++){		
		if($( ".js-form-control" ).eq(i).val() != ""){
			$( ".js-form-control" ).eq(i).css( "box-shadow", "none" );
	 		$( ".js-form-control" ).eq(i).parent('.js-input-container').find('label').animate({"top":"4px"}, 400);
	 		$( ".js-form-control" ).eq(i).animate({"padding-left":"5px"}, 400);
		};
	}
	
	$( ".js-form-control" ).on( "focusin", function(event) {
 		$( this ).css( "box-shadow", "none" );
 		$(this).parent('.js-input-container').find('label').animate({"top":"4px"}, 400);
 		$(this).animate({"padding-left":"5px"}, 400);
	});

	$( ".js-form-control" ).on( "focusout", function() {
		if( $(this).val() ){} else {
	 		$( this ).css( "box-shadow", "" );
	 		$(this).parent('.js-input-container').find('label').animate({"top":"23px"}, 400);
	 		if( $(this).is('form textarea') ){
	 			$(this).animate({"padding-left":"85px"}, 400);
	 		};
 		};
 	});

// ПРОВЕРКА ФОРМЫ

	$('form').on('submit', function(e){
		e.preventDefault();
		if( $(this).is('#enter_form') ){
			
			var l = $('#login').val();
			var p = $('#password').val();
			//var c = $('#code').val();

			$.getJSON('js/users.json', {}, function (json) {
				var users = json.user.length;
				for(var i = 0; i < users; i++ ){
					if( l != json.user[i].username ) continue;
					if( p == json.user[i].password ){
						if( json.user[i].username == 'admin'){
							$('#admin, .cart img[title="delete"]').css('display', 'block');
						};
						modal_close();
						break;
					} else {
							alert ( 'Не правильно введен логин или пароль. Повторите попытку.');
							break;
					};
				};

				if( i == users ) {
						alert ( 'Не правильно введен логин. Повторите попытку.');
					};				
			});
		} else {
			modal_close();
		};
		
	});

// ВХОД БЕЗ РЕГИСТРАЦИИ
	$('#enter_quick').on('click', function(){


		$('#admin, .cart img[title="delete"]').css('display', 'block');
		$basket.removeClass("default").addClass("default_adm");
		modal_close();
	});

});