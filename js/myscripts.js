

function select_load(){  // ������ ������� ������ � ��������� � ����� ��������
    
        $.ajax(
            {
                url: 'server.php',
                type: 'get',
                data: {'select_load': 1},
                success: function(server_data){
                    
                    var data = JSON.parse(server_data);
                    
                    var html_select = "<option value='' disabled selected>�������� �������</option>"; // ���������� � ������� �������� ���� html �������                   
                                        
                    for (i = 0; i < data.length; i++){  
                            
                         html_select += "<option value='"+ data[i][0] +"'>"+ data[i][0] +"</option>";                          
                    }
                    
                    $('#select_system').html(html_select);	
                }
            }
         );
         
        //console.log(select_value);
}

function subscribe(email, select_system){  // ������� ��������, ��������� insert � ������� �������
    
           $.ajax({
                    url: 'server.php',
                    type: 'get',
                    data: {  
                            'input_email': email,
                            'select_system': select_system
                          },
                    success: function(server_data){
                            
                            if(server_data){
                                var html_output = "<p>����� <b>" + email + "</b> <br>������� �������� �� �������� <br> ������� <b>" + select_system + "</b></p>";
                            }else{
                                var html_output = "<p>������ �� ������� ��</p>";
                            }                            
                            
                            $('#message_user').html(html_output);  
							$('#message_user').show('slow');
							setTimeout(function() { $('#message_user').hide('slow'); }, 7000);
                            
                            jQuery('form').get(0).reset(); // ������ ������ ����������� ����� ����� ������� Submit
                           
                        }
                    });  
}


$(document).ready(function(){ 
   
    $('#form_subscrib').submit(function(event){ // ��������� ������� ������ �����
        
        event.preventDefault();        
        
        var form_param = $(this).serializeArray(); // ������ ��������, ������ �� ������� ��������� �������� �����.
                                                   // � ������� ������� ��� �������� name - �������� ��������� � value - ��������
                
        var arr_form_param = [];  // ������ ������ ��� ������ ���� ���������� �����      
        for (var index in form_param){ // ��������� �� ������� � ���������        
            for (var field in form_param[index]){ // ��������� �� ����� �������                    
                    if(field == 'name'){                         
                        arr_form_param[form_param[index][field]] = 0  //������� ������� ������� � ������ ������ �������� ���� 'name' ������                       
                    }
                    else if(field == 'value'){ arr_form_param[form_param[index]['name']] = form_param[index][field] } // ����������� �������� ������� � ������ 'name' �������� ���� 'value'
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
                        // console.log('��� ��������');
                         
                         var html_output = "<p>����� <b>" + input_email + "</b> <br>��� �������� �� �������� <br> ������� <b>" + select_system + "</b></p>";
                         
                         $('#message_user').html(html_output); 
						 $('#message_user').show('slow');
						 setTimeout(function() { $('#message_user').hide('slow'); }, 7000);
                    }
                    else if(server_data == 0){
                         subscribe(input_email, select_system);
                    }
                    
                    jQuery('form').get(0).reset(); // ������ ������ ����������� ����� ����� ������� Submit
                    //console.log(server_data);					
					
                }
          });			 	
                       
        });         
    
}); //����� ready              

