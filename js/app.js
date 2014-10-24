/* Author: Padmanabhan.P 
 * app.js - search repository in git and return data.
 * */
(function($){
	$.App = {
		SEARCHURL : "https://api.github.com/search/",
		SEARCHTYPE : "repositories",
		SORT : "stars",
		ORDER : "desc",
		sKey : undefined,

		init : function(){
		
			// plugin to listen enter key on search box
			(function($) {
			    $.fn.onEnter = function(func) {
			        this.bind('keypress', function(e) {
            			if (e.keyCode == 13) func.apply(this, [e]);    
		        	});               
	        		return this; 
		    	};
			})(jQuery);

		    $("#keyword").onEnter( function() {
				$.App.search();
	    	});

			// UI dialog initialization
			$(function() {
				$("#dialog").dialog({
					autoOpen: false,
					maxWidth:700,
                    maxHeight: 500,
                    width: 700,
                    height: 500,
					modal: true,
					resizeable: false,
					show: {
					   	effect: "blind",
						duration: 1000
					},
					hide: {
					    effect: "explode",
						duration: 1000
					}
				});
 			});
		},

		// Repository Search
		search : function(key){

			if(!key){
				key = $("#keyword").val();
			}
			this.sKey = key;
			this.reset();
			var url = this.SEARCHURL+this.SEARCHTYPE+"?q="+key+"&sort="+this.SORT+"&order="+this.ORDER;
			$("#loader-container").show();
			$.ajax({
                    type : 'GET',
                    url : url,
                    success : function(resp) {
					if(resp){
						$.App.success(resp);	
					}
                },

				error : function(res){
					$.App.error();
				}
            });
		},

		success : function( data ){
			$("#keyValue").text(this.sKey);
			var items = data.items;
			if(items.length){
				$("#data-container").show();
				$("#logo-container").hide();
				$("#loader-container").hide();
				$("#norec-cotainer").hide();
				this.renderData(items);
			}else{
				$("#loader-container").hide();
				this.noDataStatus();
			}
		},

		error : function(data){
			this.reset();
			alert("an error occured");
		},

		reset : function(){
			$("#data-container").hide();
			$("#loader-container").hide();	
			$("#norec-cotainer").hide();
			$("#logo-container").show();
			$("#keyValue").text("");			
		},

		// Render response data for repository search
		renderData : function(items){
			//loop over the items to render
			var srcResEle = $("#search-result");
			$(srcResEle).html("");
			$.each(items, function(i, item){
				var j  = i+1;
				var ul = $("<ul class=\"filters\"></ul>");
				if(j<10){ j = "0"+j;}
				var clrClass= "";
				if(j%2 == 0){ clrClass="evenColor";}
				var li =  $("<li><span class=\"search-value hash "+ clrClass+" \">"+ j +"</span></li>" + 
							"<li><span class=\"search-value repo  "+ clrClass+" \">"+ item.name+"</span></li>" + 
							"<li><span class=\"search-value owner "+ clrClass+" \">"+ item.owner.login+"</span></li>");
				ul.append(li);
				$(ul).click(function(ev, dt) {
					 $.App.openDetails(item);
				});
				srcResEle.append(ul);
			});			
		},

		noDataStatus : function(){
			$("#norec-cotainer").show();
			alert("an error occured");
		},

		description : "",
		language : "",
		owner : "",
		url : "",
		repositary : "",

		// Followers Details
		openDetails : function(item){
			var followersUrl = item.owner.followers_url;
			this.description = item.description;
			this.repository = item.name;
			this.language = item.language;
			this.owner = item.owner.login;
			this.url = item.url;

			$.ajax({
                type : 'GET',
                url : followersUrl,
                success : function(resp) {
					if(resp){
						$.App.followersSuccess(resp);	
					}
                },

				error : function(res){
					$.App.followersError();
				}
            });
		},

		followersSuccess :function(response){
			$( "#dialog" ).dialog( "open" );
			var dialogContent = $("#dialogContent");
			dialogContent.html("");
			var clrClass= "";
			var li1 = $("<p>Repository Name : <a href=\""+this.url+"\">"+this.repository+"</a></p><br>" + 
						"<p>Language : "+this.language+"</p><br>" +
						"<p>Owner : "+this.owner+"</p><br>"+
						"<p>Description : "+this.description+"</p><br><br>" +
					    "<h6><b style=\"text-decoration: underline;\">Followers</b></h6><br>");
			dialogContent.append(li1);
			var span = $("<span style=\"height:100%;width:100%\"></span>");
			if(response && response.length){
				$.each(response, function(i, resp){
					var name  = resp.login;
					if(i < response.length-1){
						name = name+" , ";
					}
					var a = $("<a style=\"color:red;font-size:"+ $.App.randomNum()+"px; \" title=\""+resp.html_url+"\" href=\""+resp.html_url+"\">"+name+"</a>");
					span.append(a);
				});
			}
			dialogContent.append(span);
			this.dialogReset();
		},

		followersError : function(){
			alert("an error occured");
		},

		dialogReset : function(){
			this.description = "";
			this.repositary = "";
			this.language = "";
			this.owner = "";
			this.url = "";
		},

		//Randum Number Generation between 15 to 25 for font size. [followers name]
		randomNum : function() {
			return Math.floor((Math.random() * 10) + 1) + 15;
		}

	}
})(jQuery);

