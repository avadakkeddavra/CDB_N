$(document).ready(function(){
  chrome.runtime.sendMessage({options:'give_balance'},function(response){
     $('#balance').text(response.balance);
    });   
})
function showAuth(showMessage, title = null){
    $('.hidden').hide();
    $('.check_subscription').show();
    if(showMessage == true){
        notify('info',title);
    }
}
$(document).ready(function(){
    if(localStorage.getItem('access') == 'true'){
          var cookie = new Object;
                cookie.url = 'https://ru.cs.deals/';
                cookie.name = 'sessionID';
                chrome.cookies.get(cookie, function( Cookie ){
                       if(localStorage.getItem('token') == Cookie.value){
                            afterLoad();
                       }else{
                           showAuth(true,'Вы сменили аккаунт');
                       }
                });
    }else{
        var cookie = new Object;
                cookie.url = 'https://ru.cs.deals/';
                cookie.name = 'sessionID';
                chrome.cookies.get(cookie, function( Cookie ){
                    localStorage.setItem('token',Cookie.value)
                        $.ajax({
                            url:'http://localhost:3000/getSteamId',
                            data:{sessionID:Cookie.value},
                            type:'POST',
                            success:function(response){
                                if(response.indexOf('ull;') == -1){
                                     localStorage.setItem('steamID',response)
                                }else{
                                    notify('error','None authorized action','Авторизируйтесь на csdeals')
                                }
                               
                            }
                        })
                });
    }
      $('#check_sub').click(function(e){
                e.preventDefault();
                var token = $(this).prev().val();
                    $.ajax({
                        url:'http://shark.tools/api/?type=bot&com=csdeals&action=getSubscription',
                        data:{id:localStorage.getItem('steamID'),service:'csdeals'},
                        type:'POST',
                        success: function(response){
                            if(token == response){
                                localStorage.setItem('access',true);
                                afterLoad();
                            }else{
                                localStorage.setItem('access',false);
                                notify('error','Неверный токен доступа','Проверте правильность ввода или обратитесь в тех поддержку на сайте SHARK.TOOLS. Или же проверте авторизацию на csdeals');
                            }
                        }
                    })
            })
})
function notify(type,title,content){
    $('.notify').addClass(type);
    $('.notufy .title').text(title);
    $('.notify .content').text(content);
    
    $('.notify').show();
    
    $('.notify').animate({
        right:0,
    },200);
}
function onClick(options) {
	chrome.runtime.sendMessage({options:options},function(response){
        $('#balance').text(response.balance);
        console.log(response);
    }); // отправка сообщения на background.js
}

  

function stop(opt)
{
    chrome.runtime.sendMessage({options:opt}); // отправка сообщения на background.js
}
function validate(data)
{
   if( $('.success').length >=  7)
   {
       return 1;
   }
}
/*

    FUNCTIONS WHICH VALIDATE THE FORM DATA

*/
$(document).ready(function(){
    $('#close_notify').click(function(){
        $('.notify').animate({
            right:'-100%',
        },200,function(){
            $(this).fadeOut(100);
        })
    })
    $('#percentage_form input').not("[type='checkbox']").unbind().on('blur',function(){
      var type = $(this).attr('type');
      var value = $(this).val();
      var id = $(this).attr('id');

      switch (type)
      {
          case 'number':
            if($.isNumeric(value) && value.length > 0)
            {
                $(this).addClass('success');
                $(this).removeClass('error');
                $(this).parent().find('span').remove();
                $('#start').removeAttr('disabled');
                $('#start').removeClass('disabled');
            }else{
                 $('#start').attr('disabled','disabled');
                $('#start').addClass('disabled');
                $(this).addClass('error');
                $(this).parent().append('<span style="color:red">Это поле обязательно для заполнения</span>');
            }
          break;
      }
    

    })
})
/*

    FUNCTION WHICH CONTROLS THE INPUT[TYPE="CHECKBOX"]

*/
$(document).ready(function(){
    $('#toggle_exists').on('click',function(e){  
       if($(this).hasClass('active_check'))
        {
            $(this).removeClass('active_check');  
            $(this).children('.icon').html('<i class="fa fa-toggle-off"></i>')
        }else{
            $(this).addClass('active_check');  
            $(this).children('.icon').html('<i class="fa fa-toggle-on"></i>');
        }
    })
    $('#toggle_float').click(function(){
        console.log($(this).find('input').val())
        if($(this).hasClass('active_check'))
        {
            $(this).removeClass('active_check');  
            $('.float_choose').slideUp(100);
             $(this).children('.icon').html('<i class="fa fa-toggle-off"></i>')
        }else{
            $(this).addClass('active_check');  
            $('.float_choose').slideDown(100);
            $(this).children('.icon').html('<i class="fa fa-toggle-on"></i>');
        }
    });
    $('#toggle_white').on('click',function(){
        if($(this).hasClass('active_check'))
        {
            $(this).removeClass('active_check');  
            $('.white_list').slideUp(100);
             $(this).children('.icon').html('<i class="fa fa-toggle-off"></i>')
        }else{
            $(this).addClass('active_check');  
            $('.white_list').slideDown(100);
            $(this).children('.icon').html('<i class="fa fa-toggle-on"></i>');
        }
    });
    $('#toggle_black').on('click',function(){
        if($(this).hasClass('active_check'))
        {
            $(this).removeClass('active_check');  
            $('.black_list').slideUp(100);
             $(this).children('.icon').html('<i class="fa fa-toggle-off"></i>')
        }else{
            $(this).addClass('active_check');  
            $('.black_list').slideDown(100);
            $(this).children('.icon').html('<i class="fa fa-toggle-on"></i>');
        }
    })
})

function afterLoad(){
    $('.check_subscription').hide();
    $('.hidden').show();
        $.ajax({
                    url:'http://localhost:3000/balance',
                    type:"POST",
                    data:{sessionID:localStorage.getItem('token')},
                    success: function(response)
                    {
                        if(String(response).indexOf('va') == -1){
                            localStorage.setItem('balance',response);
                            $('#balance').text(response);
                        }else{
                            
                            showAuth(false);
                            notify('error','None authorized action','Авторизируйтесь на csdeals');
                        }
                       
                    }
        });
     chrome.runtime.sendMessage({options:'give_balance',checkbot:true},function(response){     $('#balance').text(localStorage.getItem('balance'));
       
     if(response.bot_in_work == true)
     {
        $('#start').removeClass('start');
         $('#start').addClass('stop');
         $('#start').text('Stop');
          start_timer();
     }
   });
   
    var timer_value = localStorage.getItem('bg_timer');
    var min = parseInt(timer_value/60);
    var sec = timer_value%60;
    if(sec >= 10){
        $('#time number').eq(1).hide();
    }else{
        $('#time number').eq(1).show();
    }
   $('#time span').eq(0).text(parseInt(timer_value/60));
   $('#time span').eq(1).text(timer_value%60);  
    if(localStorage.getItem('token')){
        $('#token').val(localStorage.getItem('token'))
    }
    $('#output').text(localStorage.getItem('output'));
    $('#output_speed').text(localStorage.getItem('output_speed'));
    
    var options = JSON.parse(localStorage.getItem('options'));
    console.log(options);
    if(options){
        $('input[name="black_list"]').val(options.black_list);
        $('input[name="max_percent"]').val(options.max_percent);
        $('input[name="max_price"]').val(options.max_price);
        $('input[name="min_percent"]').val(options.min_percent);
        $('input[name="min_price]').val(options.min_price);
        $('input[name="quantity_per_week"]').val(options.quantity_per_week);
        $('input[name="quantity_sales_per_week"]').val(options.quantity_sales_per_week);
        $('input[name="rate"]').val(options.rate);
        if(options.compare){
            $('input[name="compare"]').val(options.compare);
            $('label#toggle_exists').addClass('active_check'); 
            $('label#toggle_exists').children('.icon').html("<i class='fa fa-toggle-on'></i>")
        }
        $('select[name="service"]').val(options.service);
        if($('#service').val() == 'opskins.com')
        {
            $('.service_check').show();
        }else{
            $('.service_check').hide();
        }
           
    }
}
/*
    
    STARTS THE COMMON.JS TIMER

*/
function start_timer(){
    var val;
    var current_val = localStorage.getItem('bg_timer');
    var min = $('#time span').eq(0).html();
    if(current_val){
        val = current_val;
    }else{
        val = 0;
    }
    var custom_timer = setInterval(function(){
        var balance = Number(localStorage.getItem('start_balance'));
    
        $('#output').text(localStorage.getItem('output'));
        var output_speed = localStorage.getItem('output_speed');
        $('#output_speed').text(output_speed);
        //localStorage.setItem('output_speed',output_speed);
        $('#balance').text(localStorage.getItem('balance'));
        if(val >= 60){
            var min = parseInt(val/60);
            var sec = val%60;
            if(min >= 10){
               $('#time number').eq(0).hide(); 
            }
            if(sec >= 10){
                $('#time number').eq(1).hide();
            }else{
                $('#time number').eq(1).show();
            }
            $('#time span').eq(0).text(min);
            $('#time span').eq(1).text(sec);    
        }
        else{
            if(val >= 10){
                $('#time number').eq(1).hide();
            }else{
                $('#time number').eq(1).show();
            }
            $('#time span').eq(1).text(val);
        }
       
        val++;
        
    },1000);
    localStorage.setItem('custom_timer',custom_timer);
}
function stop_timer(timerID){
    clearInterval(timerID)
}
$(document).ready(function(){
    $('#backup').click(function(){
            $('#time span').eq(0).text(0);
            $('#time span').eq(1).text(0);    
            $('#time number').eq(1).show();
            localStorage.removeItem('bg_timer');
            stop_timer(localStorage.getItem('custom_timer'));
            start_timer();
            $('#output_speed').text('');
            localStorage.removeItem('output_speed')
            //start_timer();
    });
    $('#service').change(function(){
        var service = $(this).val();
        if(service == 'opskins.com'){
            $('.service_check').show();
        }else{
            $('.service_check').hide();
        }
    })
})
//MAIN BUTTON TRIGGER
$(document).ready(function(){
    $('#start').on('click',function(e){
        e.preventDefault();

        var check = $(this).hasClass('start');
        
        if($(this).hasClass('start'))
        {
            start_timer();
            $(this).addClass('stop');
            $(this).removeClass('start');
            $(this).text('Stop');
            
            var data = $('#percentage_form').serializeArray();

                
                var options = new Object;			
                jQuery.each(data, function(i, item){
                    options[item.name] = item.value;

                });
                
               options['opskins_url'] = "http://csgoback.net/api/extension?extension=csgoroll-bot&type=subscription&subType=loadPrice&service="+options.service+"&updateTime=360&opskinsMinSales="+options.quantity_per_week+"&opskinsOnSales="+options.quantity_sales_per_week+"";
    
  console.log(options);
              var response = validate(options);
        
                if(response == 1)
                {
                    //console.log(options);
                    localStorage.setItem('token',options.token);
                    localStorage.setItem('options',JSON.stringify(options));
                    onClick(options);
                    
                }
            
            console.log(chrome.extension.getBackgroundPage().status)
            if(localStorage.getItem('not_found')){
                
                $(this).removeClass('stop');
                $(this).addClass('start');
                $(this).text('Start')
                alert(localStorage.getItem('not_found') );
            }
            
        }else{
            console.log('stop');
            var st = 1;
            var options = new Object;			
            options.rate = 0;
            options.stop = 1;
            stop(options);
            stop_timer(localStorage.getItem('custom_timer'));
            $(this).removeClass('stop');
            $(this).addClass('start');
            $(this).text('Start')
        }

    })
    $(".stop").click(function(){
        
    })
})

