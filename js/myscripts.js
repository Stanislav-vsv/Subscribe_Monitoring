

function select_load(){  // функия выводит селект с системами в форме подписки
    
        $.ajax(
            {
                url: 'server.php',
                type: 'get',
                data: {'select_load': 1},
                success: function(server_data){
                    
                    var data = JSON.parse(server_data);
                    
                    var html_select = "<option value='' disabled selected>Выберите систему</option>"; // переменная в которую помещаем весь html селекта                   
                                        
                    for (i = 0; i < data.length; i++){  
                            
                         html_select += "<option value='"+ data[i][0] +"'>"+ data[i][0] +"</option>";                          
                    }
                    
                    $('#select_system').html(html_select);	
                }
            }
         );
         
        //console.log(select_value);
}

function subscribe(email, select_system){  // функция подписки, выполняет insert в таблицу адресов
    
           $.ajax({
                    url: 'server.php',
                    type: 'get',
                    data: {  
                            'input_email': email,
                            'select_system': select_system
                          },
                    success: function(server_data){
                            
                            if(server_data){
                                var html_output = "<p>Адрес <b>" + email + "</b> <br>успешно подписан на рассылку <br> системы <b>" + select_system + "</b></p>";
                            }else{
                                var html_output = "<p>Ошибка на сервере БД</p>";
                            }                            
                            
                            $('#message_user').html(html_output);  
							$('#message_user').show('slow');
							setTimeout(function() { $('#message_user').hide('slow'); }, 7000);
                            
                            jQuery('form').get(0).reset(); // строка сброса содержимого формы после нажатия Submit
                           
                        }
                    });  
}


$(document).ready(function(){ 
   
    $('#form_subscrib').submit(function(event){ // обработка нажатия кнопки формы
        
        event.preventDefault();        
        
        var form_param = $(this).serializeArray(); // массив объектов, каждый из которых описывает параметр формы.
                                                   // у каждого объекта два свойства name - название параметра и value - значение
                
        var arr_form_param = [];  // пустой массив для записи всех параметров формы      
        for (var index in form_param){ // пробегаем по массиву с объектами        
            for (var field in form_param[index]){ // пробегаем по полям объекта                    
                    if(field == 'name'){                         
                        arr_form_param[form_param[index][field]] = 0  //создаем елемент массива с ключом равным значению поля 'name' обекта                       
                    }
                    else if(field == 'value'){ arr_form_param[form_param[index]['name']] = form_param[index][field] } // присваиваем элементу массива с ключом 'name' значение поля 'value'
                }
        }        
        
        //console.log(form_param); 
         
        
        var input_email = arr_form_param['input_email'];        
        var select_system = arr_form_param['select_system'];
        
        //var check_result = ajaxRequest(input_email, select_system);
        
        $.ajax({
                url: 'server.php',
                type: 'get',
                data: {  
                        'check_email': input_email,
                        'check_system': select_system
                      },
                success: function(server_data){
                    
                    if(server_data == 1){
                        // console.log('Уже подписан');
                         
                         var html_output = "<p>Адрес <b>" + input_email + "</b> <br>УЖЕ подписан на рассылку <br> системы <b>" + select_system + "</b></p>";
                         
                         $('#message_user').html(html_output); 
						 $('#message_user').show('slow');
						 setTimeout(function() { $('#message_user').hide('slow'); }, 7000);
                    }
                    else if(server_data == 0){
                         subscribe(input_email, select_system);
                    }
                    
                    jQuery('form').get(0).reset(); // строка сброса содержимого формы после нажатия Submit
                    //console.log(server_data);					
					
                }
          });			 	
                       
        });         
    
}); //Конец ready              

