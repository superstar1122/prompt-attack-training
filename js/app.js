/*/ Not change any values of the variables below, 
use the "json/config.json" file to make your settings. /*/
let data_index = "";
let prompts_name = "";
let prompts_expert = "";
let prompts_image = "";
let prompts_background_color = "";
let prompts_training = "";
let chat_font_size = "";
let dalle_img_size = "";
let CHAT_PHP_url = 'php/api.php';
let DALLE_PHP_url = 'php/dall-e-2.php';
let API_URL = "";
let API_MODEL = "";
let source = "";
let google_voice = "";
let google_voice_lang_code = "";
let microphone_speak_lang = "";

let dalle_generated_img_count = 1;
let chat_minlength = 0;
let chat_maxlength = 0;
let prompts_temperature = 1;
let prompts_frequency_penalty = 0;
let prompts_presence_penalty = 0;
let lang_index = 0;
let scrollPosition = 0;
let tarot_flipped_cards = 0;

let is_tarot = false;
let shuffle_character = false;
let is_model_turbo = false;
let use_text_stream = false;
let display_microphone_in_chat = false;
let display_avatar_in_chat = false;
let display_contacts_user_list = false;
let display_copy_text_button_in_chat = false;
let filter_badwords = true;
let display_audio_button_answers = true;
let chat_history = true;
let hasBadWord = false;
let tarotFirstDisplay = false;

let chat = [];
let pmt = [];
let array_employees = [];
let array_chat = [];
let lang = [];
let tarot_cards = [];
let = badWords = []
let array_messages = [];
let array_voices = [];
let tarot_selected_cards = [];
let filterBotWords = ["Robot:", "Bot:"];
//---- end configs----//

//Modify the option below according to the prompt you want to use.
//Available options: en, pt-br, es (English, Portuguese, or Spanish)
let user_prompt_lang = "en"; 

if (window.location.protocol === 'file:') {
  alert('This file is not runnable locally, an http server is required, please read the documentation.');
}

//Loads the characters from the config.json file and appends them to the initial slider
loadData("json/config.json", ["json/prompts-" + user_prompt_lang + ".json", "json/lang.json", "json/badwords.json", "json/tarot.json"]);

function loadData(url, urls) {
  // Fetch data from the given url and an array of urls using Promise.all and map functions
  return Promise.all([fetch(url).then(res => res.json()), ...urls.map(url => fetch(url).then(res => res.json()))])
    .then(([out, OutC, OutL, OutB, OutT]) => {
      // Extract necessary data from the response
      lang = OutL;
      tarot_cards = OutT;
      if(filter_badwords){badWords = OutB.badwords.split(',')}
      lang_index = lang.use_lang_index;
      use_text_stream = out.use_text_stream;
      display_avatar_in_chat = out.display_avatar_in_chat;
      display_microphone_in_chat = out.display_microphone_in_chat;
      microphone_speak_lang = out.microphone_speak_lang;
      display_contacts_user_list = out.display_contacts_user_list;
      display_copy_text_button_in_chat = out.display_copy_text_button_in_chat;
      display_audio_button_answers = out.display_audio_button_answers;
      filter_badwords = out.filter_badwords;
      chat_history = out.chat_history;
      chat_font_size = out.chat_font_size;
      dalle_img_size = out.dalle_img_size;
      dalle_generated_img_count = out.dalle_generated_img_count;
      shuffle_character = out.shuffle_character;
      copy_text_in_chat = display_copy_text_button_in_chat ? `<button class="copy-text" onclick="copyText(this)"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg> <span class="label-copy-code">${lang["translate"][lang_index].copy_text1}</span></button>` : '';
			var s=document.createElement('style');s.innerHTML='.message-text{font-size:'+chat_font_size+' !important;}';document.head.appendChild(s);

      if(shuffle_character){
        OutC = shuffleArray(OutC);
      }

      if(!display_contacts_user_list){
      	$(".toggle_employees_list").hide();
      	$(".col-contacts-border").hide();
      }

      if(display_microphone_in_chat){
      		$("#microphone-button").show()
      }
      // Populate array_employees with character data and create HTML elements for each character card
      $("#load-character").html("");
      $(".ai-contacts-scroll").html("");
      for (var i = 0; i < OutC.length; i++) {
        array_employees.push({
          'id':OutC[i]['id'], 
          'name':OutC[i]['name'], 
          'widget_name':OutC[i]['widget_name'], 
          'image':OutC[i]['image'], 
          'welcome_message':OutC[i]['welcome_message'], 
          'display_welcome_message':OutC[i]['display_welcome_message'],
          'training':OutC[i]['training'],
          'description':OutC[i]['description'],
          'temperature':OutC[i]['temperature'],
          'frequency_penalty':OutC[i]['frequency_penalty'],
          'presence_penalty':OutC[i]['presence_penalty'],
          'chat_minlength':OutC[i]['chat_minlength'],
          'chat_maxlength':OutC[i]['chat_maxlength'],
          'max_num_chats_api':OutC[i]['max_num_chats_api'],
          'API_MODEL':OutC[i]['API_MODEL'],
          'google_voice':OutC[i]['google_voice'],
          'google_voice_lang_code':OutC[i]['google_voice_lang_code'],
          'is_tarot':OutC[i]['is_tarot']
        })

        $("#load-character").append(`

          <div class="card-option start-chat" data-index="${i}">
            <div class="card-option-img"><img src="${array_employees[i]['image']}" alt="${array_employees[i]['widget_name']}" title="${array_employees[i]['widget_name']}"></div>
            <div class="card-option-title"><h5>${array_employees[i]['widget_name']}</h5></div>
          </div>
        `)}

      // Get chat history and update the last_chat property for each character
		  if(chat_history){
				arr2 = JSON.parse(localStorage.getItem("oracle_chat_v1"));
		  	
				array_employees.forEach((item1) => {
				  const item2 = (arr2 && arr2.find((item2) => item2.id === item1.id));
				  if (item2) {
				    item1.last_chat = item2.last_chat;
				  }
				});
			}
			translate();
			$("#loading").fadeOut();

      //Check chat url
			const params = new URLSearchParams(window.location.search);
			if (params.has("chat")) {
			  const chatValue = params.get("chat");
			  var array_employees_check = array_employees;
			  const index = array_employees_check.findIndex((employees) => employees.id === Number(chatValue));
			  openModal(index)
			}

			

		}).catch(err => { throw err })}

		function currentDate(){
			const timestamp = new Date();
			return timestamp.toLocaleString();
		}


		function setURLChat(id) {
		  const defaultUrl = window.location.origin + window.location.pathname;
		  const params = new URLSearchParams(window.location.search);
		  params.set("chat", id);
		  const newUrl = new URL(defaultUrl);
		  newUrl.search = params.toString();
		  history.pushState({}, "", newUrl.href);
		}

// Define a placeholder for the image
const placeholder = "img/placeholder.svg";

// Check if the image is in the visible area
$(window).on("scroll", function() {
    $("img[data-src]").each(function() {
        if (isElementInViewport($(this))) {
            $(this).attr("src", $(this).attr("data-src"));
            $(this).removeAttr("data-src");
        }
    });
});

// Helper function to check if the element is in the visible area
function isElementInViewport(el) {
    const rect = el.get(0).getBoundingClientRect();
    return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= $(window).height() &&
        rect.left <= $(window).width()
    );
}

//Main function of GPT chat API
async function getResponse(prompt) {

  //Conversation history
  array_chat.push({"name":"User","message":prompt,"isImg":false,"date":currentDate()})
  array_messages = [];

  //Converting chat to turbo API model
  for (let i = 0; i < array_chat.length; i++) {
    let message = {"role": "", "content": ""};

    if (array_chat[i].training === true) {
      let system_message = {"role": "system", "content": array_chat[i].message};
      array_messages.push(system_message);
    } else {
      if (array_chat[i].name === "User") {
        message.role = "user";
      } else {
        message.role = "assistant";
      }
      message.content = array_chat[i].message; 
      array_messages.push(message);
    }
  }

  if (array_messages.length > max_num_chats_api) {
    var slice_messages = max_num_chats_api - 2;
    array_messages = array_messages.slice(0, 2).concat(array_messages.slice(-slice_messages));
  }

  const params = new URLSearchParams();
  params.append('array_chat', JSON.stringify(array_messages));
  params.append('prompts_name', prompts_name);
  params.append('model', API_MODEL);
  params.append('temperature', prompts_temperature);
  params.append('frequency_penalty', prompts_frequency_penalty);
  params.append('presence_penalty', prompts_presence_penalty);

  try {
    const randomID = generateUniqueID();
		source = new SSE(CHAT_PHP_url, {headers: {'Content-Type': 'application/x-www-form-urlencoded'},payload: params,method: 'POST'});
    streamChat(source,randomID);
    source.stream();
			$("#overflow-chat").append(`

        <div class="conversation-thread thread-ai">
          ${avatar_in_chat}
          <div class="message-container">
            <div class="message-info">
						${copy_text_in_chat}
						${audio_in_chat}            
              <div class="user-name"><h5>${prompts_name}</h5></div>
              <div class="message-text">
              	<div class='tarot-cards-display'></div>
                <div class="chat-response ${randomID}"><span class='get-stream'></span><span class='cursor'></span></div>
              </div>
              <div class="date-chat"><img src="img/icon-clock.svg"> ${currentDate()}</div>
            </div>
          </div>
        </div>
			`);

			if(is_tarot){
				if(!tarotFirstDisplay){
					$(".tarot-cards-display").hide();
					tarotFirstDisplay = true;
				}
				$(".card-tarot-select").hide();
				$(".tarot-grid-item").removeClass("tarot-zoom");
				$(`.tarot-cards-display`).append($(".tarot-grid-container").html());
				$(".tarot-grid-container").html("")
			}


			$(`.chat_${randomID} .chat-audio`).hide();
    scrollChatBottom();			
  } catch (e) {
    console.error(`Error creating SSE: ${e}`);
  }
}

		function generateUniqueID(prefix = 'id_') {
		  const timestamp = Date.now();
		  return `${prefix}${timestamp}`;
		}
		
function streamChat(source, randomID) {
    let fullPrompt = "";

    source.addEventListener('message', function(e) {
        let data = e.data;

        if (data === '[DONE]') {
            $(".cursor").remove();
            let str = $(`.${randomID}`).html();
            str = escapeHtml(str);
            $(`.${randomID}`).html(str);
            enableChat();
            scrollChatBottom();

            if (!use_text_stream) {
                $(`.${randomID}`).append(fullPrompt);
                scrollChatBottom();
            }

            array_chat.push({ "name": prompts_name, "message": fullPrompt, "date": currentDate() });
            checkClearChatDisplay();
            saveChatHistory();
            return;
        }

        // Captura e trata possíveis erros na resposta
        try {
            const parsedData = JSON.parse(data);

            if (parsedData.error) {
                // Exibe o erro usando toastr
                toastr.error(parsedData.message || 'An error occurred');
                enableChat(); // Reabilita o chat em caso de erro
                return;
            }

            // Processa as mensagens corretamente se não houver erro
            data.split(/}\s*{/).forEach((piece, index, array) => {
                if (index > 0) piece = "{" + piece;
                if (index < array.length - 1) piece = piece + "}";

                try {
                    let tokens = JSON.parse(piece);
                    if (tokens && tokens.choices && tokens.choices.length > 0) {
                        let choice = tokens.choices[0].delta || tokens.choices[0];
                        let partPrompt = choice.content || choice.text || "";

                        if (partPrompt) {
                            fullPrompt += partPrompt;
                            if (use_text_stream) {
                                $(`.${randomID} .get-stream`).append(partPrompt);
                                scrollChatBottom();
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error parsing part of the message: ", err);
                }
            });

        } catch (err) {
            console.error("Error handling server response: ", err);
            toastr.error("Failed to process server response.");
            enableChat(); // Reabilita o chat em caso de erro
        }
    });

    // Captura de erro genérica
    source.addEventListener('error', function(e) {
        console.error('Error in SSE:', e);
        toastr.error("An unexpected error occurred. Please try again later.");
        enableChat(); // Reabilita o chat em caso de erro
    });
}




		function saveChatHistory(){
			if (array_employees[data_index]) {
				array_employees[data_index].last_chat = array_chat;
			}
			if(chat_history){
				localStorage.setItem("oracle_chat_v1", JSON.stringify(array_employees));
			}			
			console.log("Saving...")
		}

		//Function that appends the AI response in the chat in html
		function responseChat(response){

			for (var i = 0; i < filterBotWords.length; i++) {
			    if (response.indexOf(filterBotWords[i]) !== -1) {
			        response = response.replace(filterBotWords[i], "");
			    }
			}

			array_chat.push({"name":prompts_name,"message":response, "date":currentDate()})
			response = escapeHtml(response)
		
			avatar_in_chat = "";
			if(display_avatar_in_chat === true){
				avatar_in_chat = `<div class="user-image"><img src="img/oracle-avatar.svg" alt="${prompts_name}" title="${prompts_name}"></div>`;
			}

			audio_in_chat = "";
			if(display_audio_button_answers === true){
				audio_in_chat = `<div class='chat-audio'><img data-play="false" src='img/btn_tts_play.svg'></div>`;
			}	

			
			$("#overflow-chat").append(`
        <div class="conversation-thread thread-ai">
          ${avatar_in_chat}
          <div class="message-container">
            <div class="message-info">
						${copy_text_in_chat}
						${audio_in_chat}            
              <div class="user-name"><h5>${prompts_name}</h5></div>
              <div class="message-text">
                <div class="chat-response">${response}</div>
                <div class="date-chat"><img src="img/icon-clock.svg"> ${currentDate()}</div>
              </div>
            </div>
          </div>
        </div>
			`);
			scrollChatBottom();	
			enableChat();
			saveChatHistory();
			checkClearChatDisplay();
		}

		function appendChatImg(chat){
			const imageID = Date.now();
			IAimagePrompt = chat.replace("/img ","");

			$("#overflow-chat").append(`

        <div class="conversation-thread thread-ai">
          <div class="message-container">
            <div class="message-info">   
              <div class="user-name"><h5>${prompts_name}</h5></div>
              <div class="message-text">
	              <div class="chat-response no-white-space">
	              <p>${lang["translate"][lang_index].creating_ia_image} <strong class='ia-image-prompt-label'>${IAimagePrompt}</strong>
                <div class="wrapper-image-ia image_ia_${imageID}">
	                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40">
	                  <circle cx="50" cy="50" r="40" stroke="#c5c5c5" stroke-width="8" fill="none" />
	                  <circle cx="50" cy="50" r="40" stroke="#249ef7" stroke-width="8" fill="none" stroke-dasharray="250" stroke-dashoffset="0">
	                    <animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" from="0" to="250" />
	                  </circle>
	                </svg>
                </div>
                <p class='expire-img-message'>${lang["translate"][lang_index].expire_img_message}</p>					              
	              </div>
              </div>
            </div>
              <div class='date-chat'><img src='img/icon-clock.svg'> ${currentDate()}</div>
          </div>
        </div>
			`);	

			scrollChatBottom();
			$("#chat").val("");	

			const data = {
			  model: "image-alpha-001",
			  prompt: IAimagePrompt,
			  num_images: dalle_generated_img_count,
			  size: dalle_img_size
			};

			fetch(DALLE_PHP_url, {
			  method: 'POST',
			  body: JSON.stringify(data),
			  headers: {
			    'Content-Type': 'application/json'
			  }
			})
			.then(response => response.json())
			.then(data => {
			  if (data.status == 1) {
		    $(".wrapper-image-ia svg").remove();
		    const images = data.message.data;
		    for (let i = 0; i < images.length; i++) {
		      $(".image_ia_"+imageID).append(`<div class="image-ia"><img onerror="this.src='img/no-image.svg'" src="${images[i].url}"></div>`)
		    }


				const imageUrls = images.map(image => image.url);
		    array_chat.push({"name":"User","message":lang["translate"][lang_index].creating_ia_image_chat_instruction+" "+IAimagePrompt,"isImg":true,imgURL: imageUrls,"date":currentDate()})

			  scrollChatBottom();	
				enableChat();		    
				saveChatHistory();

			  } else{
			  	toastr.error("❌ "+data.message)
			  	enableChat();
			  }
			})			
		}

		//Function that sends the user's question to the chat in html and to the API
		function sendUserChat(){
			let chat = $("#chat").val();

			if(filter_badwords){
				// Create regex to check if word is forbidden
	    	const regex = new RegExp(`\\b(${badWords.join('|')})(?=\\s|$)`, 'gi');
	      // Check if message contains a bad word
	      const hasBadWord = regex.test(chat);
	      // Replace bad words with asterisks
	      if(hasBadWord){
		      const sanitizedMessage = chat.replace(regex, match => '*'.repeat(match.length));
		      $("#chat").val(sanitizedMessage);
		      toastr.error(`${lang["translate"][lang_index].badword_feedback}`);
		      return false;
	      }
    	}

			//checks if the user has entered the minimum amount of characters
			if(chat.length < chat_minlength){
				toastr.error(`${lang["translate"][lang_index].error_chat_minlength} ${chat_minlength} ${lang["translate"][lang_index].error_chat_minlength_part2}`);
				return false;
			}
			
			chat = escapeHtml(chat)			

      avatar_in_chat = display_avatar_in_chat ? `<div class="user-image"><img onerror="this.src='img/no-image.svg'" src="img/oracle-avatar.svg" alt="${prompts_name}" title="${prompts_name}"></div>` : '';
      audio_in_chat = display_audio_button_answers ? `<div class='chat-audio'><img data-play="false" src='img/btn_tts_play.svg'></div>` : '';

			$("#overflow-chat").append(`
        <div class="conversation-thread thread-user">
          <div class="message-container">
            <div class="message-info">
						${copy_text_in_chat}
						${audio_in_chat}            
              <div class="user-name"><h5>${lang["translate"][lang_index].you}</h5></div>
              <div class="message-text"><div class="chat-response">${chat}</div></div>
              <div class="date-chat"><img src="img/icon-clock.svg"> ${currentDate()}</div>
            </div>
          </div>
        </div>
			`);

			scrollChatBottom();
			hljs.highlightAll();

			if(chat.includes("/img")) {
				appendChatImg(chat);
			}else{
				getResponse(chat);
			}

			$("#chat").val("");
			disableChat();
		}

		//Send message in chat by pressing enter
		$("#chat").keypress(function (e) {
		    if(e.which === 13 && !e.shiftKey) {
		        sendUserChat();
		        return false;
		    }
		});

		
		$(".btn-send-chat").on("click", function(){
			sendUserChat();
		})


		// Function to shuffle the array
		function shuffleArray(array) {
		  return array.sort(() => Math.random() - 0.5);
		}

		function translate() {
			translationObj = lang.translate[lang_index];

			// Loop através de todas as chaves do objeto translationObj
			for (let key in translationObj) {
			  // Obtenha o valor da chave atual
			  let value = translationObj[key];
			  
			  // Encontre todos os elementos no HTML que contêm o bloco entre {{ e }}
			  let elements = document.body.querySelectorAll('*:not(script):not(style)');
			  elements.forEach(function(element) {
			    for (let i = 0; i < element.childNodes.length; i++) {
			      let node = element.childNodes[i];
			      if (node.nodeType === Node.TEXT_NODE) {
			        let text = node.nodeValue;
			        let regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
			        if (regex.test(text)) {
			          // Use a propriedade innerHTML para interpretar as tags HTML
			          node.parentElement.innerHTML = text.replace(regex, value);
			        }
			      } else if (node.nodeType === Node.ELEMENT_NODE) {
			        // Para elementos com atributos HTML, substitua o valor da chave no atributo
			        let attributes = node.attributes;
			        for (let j = 0; j < attributes.length; j++) {
			          let attribute = attributes[j];
			          if (attribute.value.includes(`{{${key}}}`)) {
			            let newValue = attribute.value.replace(`{{${key}}}`, value);
			            node.setAttribute(attribute.name, newValue);
			          }
			        }
			      }
			    }
			  });
			}
		}

		function closeChat(){
			hideChat();
			enableChat();
			$(window).scrollTop(scrollPosition);
			$(".cards-options, .select-option-title, #chat-background").show();
			$(".message-area-bottom, .ai-chat-top").hide();
			$("#body-frame").removeClass("body-frame-chat");
			$(".chat-frame").removeClass("chat-frame-talk");
			$(".hide-section").removeClass("hideOnMobile");
			$("body").removeClass("custom-body");
			$("#overflow-chat").hide();
			return false;
		}

		function stopChat(){
			if(source){
			enableChat();
		  source.close();			
		  $(".cursor").remove();
		  }
		}

		$(".btn-cancel-chat").on("click", function(){
			stopChat();
		})

		document.addEventListener("keydown", function(event) {
		  if (event.key === "Escape") {
		    closeChat();
		  }
		});		

		function hideChat(){
			hideFeedback();
			cancelSpeechSynthesis();
			$(".hide-section").show();
			$("#chat-background,.card-tarot-select").hide();
			if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			  $("#overflow-chat").hide();
			}
			
		}


		$(document).delegate(".start-chat", "click", function() {
			openModal($(this).attr("data-index"));
		})		

		function openModal(index){
				data_index = index;
				cancelSpeechSynthesis();
				$(".hide-section").addClass("hideOnMobile");
				$(".chat-frame").addClass("chat-frame-talk");
			  stopChat();
				scrollPosition = $(this).scrollTop();
				array_messages = [];
				$("#overflow-chat").html("");
				$("#overflow-chat").show();
				$("#body-frame").addClass("body-frame-chat");
				array_chat = [];
				setURLChat(array_employees[data_index]['id']);
				API_MODEL = array_employees[data_index]['API_MODEL'];
      	is_model_turbo = API_MODEL.includes('gpt');
				prompts_name = array_employees[data_index]['name'];
				prompts_widget_name = array_employees[data_index]['widget_name'];
				prompts_expert = array_employees[data_index]['expert'];
				prompts_image = array_employees[data_index]['image'];
				prompts_background_color = array_employees[data_index]['background_thumb_color'];
				prompts_temperature = array_employees[data_index]['temperature'];
				prompts_frequency_penalty = array_employees[data_index]['frequency_penalty'];
				prompts_presence_penalty = array_employees[data_index]['presence_penalty'];
				prompts_training = array_employees[data_index]['training'];
	 			displayWelcomeMessage = array_employees[data_index]['display_welcome_message'];
	 			welcome_message = array_employees[data_index]['welcome_message'];
	      chat_minlength = array_employees[data_index]['chat_minlength'];
	      chat_maxlength = array_employees[data_index]['chat_maxlength'];
	      max_num_chats_api = array_employees[data_index]['max_num_chats_api'];
	      google_voice = array_employees[data_index]['google_voice'];
	      google_voice_lang_code = array_employees[data_index]['google_voice_lang_code'];
	      is_tarot = array_employees[data_index]['is_tarot'];
	 			lastChatLength = (array_employees[data_index] && array_employees[data_index]['last_chat']) ? array_employees[data_index]['last_chat'].length : [];
	 			$(".ai-chat-top-job").html(prompts_widget_name)
				$(".cards-options, .select-option-title").hide();
	 			$("#chat").val("");
	 			// Set the maxlength attribute of the chat element to the value of chat_maxlength
	      $("#chat").attr("maxlength",chat_maxlength);				

				if(is_tarot){
					$(".card-tarot-select").show();
					displayTarotCards();
				}else{
					$(".message-area-bottom, .ai-chat-top").show();	
					if (lastChatLength > 2) {
					  loadChat();
					} else {
					  const chat = {"name": prompts_name, "message": prompts_training, "training": true, "date": currentDate()};
					  array_chat.push(chat);
					  if (displayWelcomeMessage) {
					    responseChat(array_employees[data_index]['welcome_message']);
					  }
					}

					setTimeout(function() {
						enableChat();
			    }, 100);					
				}

				$("body").addClass("custom-body");							
	 			translate();
		}


		const escapeHtml = (str) => {

		  // Check if the string contains <code> or <pre> tags
		  if (/<code>|<\/code>|<pre>|<\/pre>/g.test(str)) {
		    // Returns the string without replacing the characters inside the tags
		    return str;
		  }

			// Replaces special characters with their respective HTML codes
		  str = str.replace(/[&<>"'`{}()\[\]]/g, (match) => {
		    switch (match) {
		      
		      case '<': return '&lt;';
		      case '>': return '&gt;';
		      case '{': return '&#123;';
		      case '}': return '&#125;';
		      case '(': return '&#40;';
		      case ')': return '&#41;';
		      case '[': return '&#91;';
		      case ']': return '&#93;';
		      default: return match;
		    }
		  });
  

		  // Remove the stream &lt;span class="get-stream"&gt;
		  str = str.replace(/&lt;span\s+class="get-stream"&gt;/g, "");

		  // Remove the closing tag </span>
		  str = str.replace(/&lt;\/span&gt;/g, "");

		  // Replaces the ```code``` snippet with <pre><code>code</code></pre>
		  str = str.replace(/```(\w+)?([\s\S]*?)```/g, '<pre><code>$2</code><button class="copy-code" onclick="copyCode(this)"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg> <span class="label-copy-code">'+lang["translate"][lang_index].copy_code1+'</span></button></pre>').replace(/(\d+\.\s)/g, "<strong>$1</strong>").replace(/(^[A-Za-z\s]+:)/gm, "<strong>$1</strong>");


		  return str;
		};

		// function to copy the text content
		function copyText(button){
			const div = button.parentElement;
		  const code = div.querySelector('.chat-response');
		  const range = document.createRange();
		  range.selectNode(code);
		  window.getSelection().removeAllRanges();
		  window.getSelection().addRange(range);
		  document.execCommand("copy");
		  window.getSelection().removeAllRanges();
		  button.innerHTML = lang["translate"][lang_index].copy_text2;
		}

		// Function to copy the content of the <pre> tag
		function copyCode(button) {
		  const pre = button.parentElement;
		  const code = pre.querySelector('code');
		  const range = document.createRange();
		  range.selectNode(code);
		  window.getSelection().removeAllRanges();
		  window.getSelection().addRange(range);
		  document.execCommand("copy");
		  window.getSelection().removeAllRanges();
		  button.innerHTML = lang["translate"][lang_index].copy_code2;
		}
	
		// Clear Chat
		function clearChat(target) {
		  // Display confirmation dialog using SweetAlert2 library
		  Swal.fire({
		    title: lang["translate"][lang_index].confirmation_delete_chat1,
		    text: lang["translate"][lang_index].confirmation_delete_chat2,
		    icon: 'warning',
		    showCancelButton: true,
		    confirmButtonColor: '#3085d6',
		    cancelButtonColor: '#d33',
		    confirmButtonText: lang["translate"][lang_index].confirmation_delete_chat3,
		    cancelButtonText: lang["translate"][lang_index].confirmation_delete_chat4
		  }).then((result) => {
		    // If user confirms deletion
		    if (result.isConfirmed) {
		      // If target is "all", clear chat history for all characters
		      if (target == "all") {
		        for (var i = 0; i < array_employees.length; i++) {
		          array_employees[i]['last_chat'] = [];
		        }
		        // Display success message using SweetAlert2
		        Swal.fire(
		          lang["translate"][lang_index].confirmation_delete_chat5,
		          lang["translate"][lang_index].confirmation_delete_chat_all,
		          'success'
		        )
		      } else {
		        // Otherwise, clear chat history for current character only
		        array_employees[data_index]['last_chat'] = [];
		        // Display success message using SweetAlert2
		        Swal.fire(
		          lang["translate"][lang_index].confirmation_delete_chat5,
		          lang["translate"][lang_index].confirmation_delete_current_chat,
		          'success'
		        )
		      }

		      // Clear chat display
		      $("#overflow-chat").html("");
		      // Reset chat history and add initial message
		      array_chat = [];
		      array_chat.push({
		        "name": prompts_name,
		        "message": prompts_training,
		        "training": true,
		        "isImg":false,
		        "date": currentDate()
		      })
		      // Save updated character data to local storage
		      localStorage.setItem("oracle_chat_v1", JSON.stringify(array_employees));

		      // If enabled, display welcome message for current character
		      if (displayWelcomeMessage) {
		        responseChat(array_employees[data_index]['welcome_message']);
		      }
		    }
		  })
		}

		function loadChat(){
		  if(chat_history){
		    checkClearChatDisplay();

		    for(var i=0; i<array_employees[data_index]['last_chat'].length; i++){
		      const currentChat = array_employees[data_index]['last_chat'][i];

		      if(currentChat.name === "User"){
		        if(currentChat.isImg === true){
		        	const imageID = Date.now(); 
							const imgURL = Array.isArray(currentChat.imgURL) ? currentChat.imgURL.map(url => url).join('') : '';
							const imgHtml = Array.isArray(currentChat.imgURL) ? currentChat.imgURL.map(url => `<div class="image-ia"><img onerror="this.src='img/no-image.svg'" src="${url}"></div>`).join('') : '';
		          const chatHtml = `
				        <div class="conversation-thread thread-ai">
				          <div class="message-container">
				            <div class="message-info">
				              <div class="user-name"><h5>${prompts_name}</h5></div>
				              <div class="message-text">
					              <div class="chat-response no-white-space">
					              <p>${lang["translate"][lang_index].creating_ia_image} <strong class='ia-image-prompt-label'>${currentChat.message}</strong>
			                  <div class="wrapper-image-ia image_ia_${imageID}">
			                    ${imgHtml}
			                  </div>
			                  <p class='expire-img-message'>${lang["translate"][lang_index].expire_img_message}</p>					              
					              </div>
				              </div>
				            </div>
				              <div class='date-chat'><img src='img/icon-clock.svg'> ${currentChat.date || ''}</div>
				          </div>
				        </div>
		          `;
		          $("#overflow-chat").append(chatHtml);
		        	array_chat.push({"name":"User","message":currentChat.message,"isImg":true,imgURL: currentChat.imgURL,"date":currentDate()});
		        }else{
		          const chatResponse = escapeHtml(currentChat.message)
		          const chatHtml = `
				        <div class="conversation-thread thread-user">
				          <div class="message-container">
				            <div class="message-info">
										${copy_text_in_chat}
										${audio_in_chat}            
				              <div class="user-name"><h5>${lang["translate"][lang_index].you}</h5></div>
				              <div class="message-text">
				              <div class="chat-response">${chatResponse}</div>
				              </div>
				              <div class='date-chat'><img src='img/icon-clock.svg'> ${currentChat.date || ''}</div>
				            </div>
				          </div>
				        </div>
		          `;
		          $("#overflow-chat").append(chatHtml);
		        	array_chat.push({"name":"User","message":currentChat.message,"isImg":false,"date":currentDate()});
		        }

		      }else{
		        avatar_in_chat = display_avatar_in_chat ? `<div class="user-image"><img onerror="this.src='img/no-image.svg'" src="img/oracle-avatar.svg" alt="${prompts_name}" title="${prompts_name}"></div>` : '';
		        audio_in_chat = display_audio_button_answers ? `<div class='chat-audio'><img data-play="false" src='img/btn_tts_play.svg'></div>` : '';

		        if(!currentChat.training){
		          const chatResponse = escapeHtml(currentChat.message)
		          const chatHtml = `

				        <div class="conversation-thread thread-ai">
				          ${avatar_in_chat}
				          <div class="message-container">
				            <div class="message-info">
										${copy_text_in_chat}
										${audio_in_chat}            
				              <div class="user-name"><h5>${currentChat.name}</h5></div>
				              <div class="message-text">
				              	<div class="chat-response">${chatResponse}</div>
				              </div>
				              <div class='date-chat'><img src='img/icon-clock.svg'> ${currentChat.date || ''}</div>
				            </div>
				          </div>
				        </div>
		          `;
		          $("#overflow-chat").append(chatHtml);
		        }

		        array_chat.push({"name":prompts_name,"message":currentChat.message,"training":currentChat.training,"date":currentDate()});
		      }
		    }
		    hljs.highlightAll();
		    setTimeout(function() {
		      scrollChatBottom();
		    }, 10);
		  }else{
		    if(displayWelcomeMessage){
		      responseChat(welcome_message);
		    }
		  }
		}


		//Check Clear Chat display
		function checkClearChatDisplay(){
			if (array_employees[data_index] && array_employees[data_index].last_chat && array_employees[data_index].last_chat.length > 1) {
			  if (chat_history) {
			    $("#clear-chat").show();
			  }
			} else {
			  $("#clear-chat").hide();
			}

			const hasLastChat = array_employees.some((result) => {
			  return result.last_chat && result.last_chat.length > 2;
			});

			if (hasLastChat) {
			  $("#clear-all-chats").show();
			} else {
				$("#clear-all-chats").hide();
			}
		}		

		//Error messages
		function hideFeedback(){
			toastr.remove()
		}

		//Force chat to scroll down
		function scrollChatBottom(){

			if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
					let body = document.getElementsByTagName("html")[0];
					body.scrollTop = body.scrollHeight;		
			}else{
					let objDiv = document.getElementById("overflow-chat");
					objDiv.scrollTop = objDiv.scrollHeight;		
			}				
	
			hljs.highlightAll();

			setTimeout(function() {
			  if (window.innerWidth < 768) {
			    window.scrollTo(0, document.documentElement.scrollHeight);
			  }
			}, 100);

		}

		//Enable chat input
		function enableChat(){
				$(".character-typing").css('visibility','hidden')
				$(".btn-send-chat,#chat").attr("disabled",false);
				$(".btn-send-chat").show();
				$(".btn-cancel-chat").hide();				
	  		var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			  if(!isMobile) {
			    setTimeout(function() {
			      $('#chat').focus();
			    }, 500);
			  }

		}

		//Disable chat input
		function disableChat(){
				$(".character-typing").css('visibility','visible')
				$(".character-typing").css('display','flex');
				$(".character-typing span").html(prompts_name);
				$(".btn-send-chat,#chat").attr("disabled",true);
				$(".btn-send-chat").hide();
				$(".btn-cancel-chat").show();				
		}

		function createTextFile(data) {
		  let text = "";

		  // Iterate over the array_chat array and add each message to the text variable
		  data.shift();
		  data.forEach(chat => {
		    text += `${chat.name}: ${chat.message}\r\n`;
		  });

		  text = text.replace("User:", lang["translate"][lang_index].you+":");

		  // Create a Blob object with the text
		  const blob = new Blob([text], { type: "text/plain" });

		  // Return the Blob object
		  return blob;
		}

		function downloadPdf(){

		var docDefinition = {
		  content: [
		    { text: lang["translate"][lang_index].header_title_pdf, style: 'header' },
		    "\n"
		  ],

		  styles: {
		    header: {
		      fontSize: 22,
		      bold: true
		    },
		    name: {
		      fontSize: 14,
		      color: '#0072c6',
		      bold: true
		    },
		    message: {
		      fontSize: 12,
		      color: '#2c2c2c',
		      bold: false,
		      lineHeight: 1.2,
		      marginTop: 4
		    },
		    date: {
		    	marginTop: 5,
		      fontSize: 10,
		      color: '#787878'
		    },

			  defaultStyle: {
			    font: 'Roboto'
			  }

		  }
		};

		// Adds each array element to the docDefinition
		for (var i = 1; i < array_chat.length; i++) {
		  var message = array_chat[i];
		  var name = { text: message.name + ': ', style: 'name' };
		  var messageText = { text: message.message.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}]/gu, ''), style: 'message' };
		  
		  docDefinition.content.push(name);
		  docDefinition.content.push(messageText);
		  docDefinition.content.push({ text: message.date, style: 'date' });
		  docDefinition.content.push("\n");
		}

		// Create a pdfMake instance
		var pdfMakeInstance = pdfMake.createPdf(docDefinition);

		// Download pdf
		pdfMakeInstance.download('chat.pdf');
		}

		// Function to download the file
		function downloadFile(blob, fileName) {
		  // Create a URL object with the Blob
		  const url = URL.createObjectURL(blob);

		  // Create a download link and add it to the document
		  const link = document.createElement("a");
		  link.href = url;
		  link.download = fileName;
		  document.body.appendChild(link);

		  // Simulate a click on the link to trigger the download
		  link.click();

		  // Remove the link from the document
		  document.body.removeChild(link);
		}

		// Function to handle the download button click event
		function handleDownload() {
		  const blob = createTextFile(array_chat);
		  downloadFile(blob, "chat.txt");
		}

		//Chat audio
		$(document).on("click", ".chat-audio", function() {
		  var $this = $(this);
		  var $img = $this.find("img");
		  var $chatResponse = $this.siblings(".message-text").find(".chat-response")
		  var play = $img.attr("data-play") == "true";

		  if (play) {
		    cancelSpeechSynthesis();
		  }

		  $img.attr({
		    "src": "img/btn_tts_" + (play ? "play" : "stop") + ".svg",
		    "data-play": play ? "false" : "true"
		  });

		  if (!play) {
		    cancelSpeechSynthesis();

		    // Remove botão de cópia do texto antes de sintetizar a fala
		    var chatResponseText = $chatResponse.html().replace(/<button\b[^>]*\bclass="[^"]*\bcopy-code\b[^"]*"[^>]*>.*?<\/button>/ig, "");

		    // Verifica se o recurso é suportado antes de chamar a função
		    if ('speechSynthesis' in window) {
		      doSpeechSynthesis(chatResponseText,$chatResponse);
		    }
		  }
		});

		function cleanStringToSynthesis(str) {
		  str = str.trim()
		           .replace(/<[^>]*>/g, "")
		           .replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{1F900}-\u{1F9FF}|\u{1F1E0}-\u{1F1FF}|\u{1F200}-\u{1F2FF}|\u{1F700}-\u{1F77F}|\u{1F780}-\u{1F7FF}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{1FA00}-\u{1FA6F}|\u{1FA70}-\u{1FAFF}]/gu, '')
		           .replace(/<div\s+class="date-chat".*?<\/div>/g, '')
		           .replace(/\n/g, '');
		  return str;
		}

		function cancelSpeechSynthesis() {
		    if (window.speechSynthesis) {
		        window.speechSynthesis.cancel();
		    }
		}


function doSpeechSynthesis(longText, chatResponse) {

	$("span.chat-response-highlight").each(function() {
	  $(this).replaceWith($(this).text());
	});	

  longText = cleanStringToSynthesis(longText);

  // The maximum number of characters in each part
  const maxLength = 100;

  // Find the indices of punctuation marks in the longText string
  const punctuationIndices = [...longText.matchAll(/[,.?!]/g)].map(match => match.index);

  // Divide the text into smaller parts at the punctuation marks
  const textParts = [];
  let startIndex = 0;
  for (let i = 0; i < punctuationIndices.length; i++) {
    if (punctuationIndices[i] - startIndex < maxLength) {
      continue;
    }
    textParts.push(longText.substring(startIndex, punctuationIndices[i] + 1));
    startIndex = punctuationIndices[i] + 1;
  }
  if (startIndex < longText.length) {
    textParts.push(longText.substring(startIndex));
  }


const utterances = textParts.map(textPart => {
  const utterance = new SpeechSynthesisUtterance(textPart);
  utterance.lang = google_voice_lang_code;
  utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === google_voice);

  if (!utterance.voice) {
    const backupVoice = array_voices.find(voice => voice.lang === utterance.lang);
    if (backupVoice) {
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === backupVoice.name);
    }
  }
  return utterance;
});


  // Define the end of speech event
  utterances[utterances.length - 1].addEventListener("end", () => {
    $(".chat-audio img").attr("src", "img/btn_tts_play.svg");
    $(".chat-audio img").attr("data-play", "false");
  });

  let firstChat = false;
		// Read each piece of text sequentially
		function speakTextParts(index = 0) {
		  if (index < utterances.length) {
		    const textToHighlight = textParts[index];
		    const highlightIndex = longText.indexOf(textToHighlight);

		    // Highlight the text
		    chatResponse.html(chatResponse.html().replace(textToHighlight, `<span class="chat-response-highlight">${textToHighlight}</span>`));

		    // Speak the text
		    speechSynthesis.speak(utterances[index]);
		    utterances[index].addEventListener("end", () => {
		      // Remove the highlight
		      chatResponse.html(chatResponse.html().replace(`<span class="chat-response-highlight">${textToHighlight}</span>`, textToHighlight));
		      speakTextParts(index + 1);
		    });

		    // Remove the highlight if speech synthesis is interrupted
		    speechSynthesis.addEventListener('pause', () => {
		      chatResponse.html(chatResponse.html().replace(`<span class="chat-response-highlight">${textToHighlight}</span>`, textToHighlight));
		    }, {once: true});
		  }
		}

	  // Begin speak
	  speakTextParts();
	}

		window.speechSynthesis.onvoiceschanged = function() {
			getTextToSpeechVoices();  
		};

		function displayVoices(){
			console.table(array_voices)
		}

		function getTextToSpeechVoices(){
			window.speechSynthesis.getVoices().forEach(function(voice) {
			  const voiceObj = {
			    name: voice.name,
			    lang: voice.lang
			  };
			  array_voices.push(voiceObj);
			});			
		}

		//Display employees description
		const myModalEl = document.getElementById('modalDefault')
		myModalEl.addEventListener('show.bs.modal', event => {
		  $("#modalDefault .modal-title").html(array_employees[data_index].name);
		  $("#modalDefault .modal-body").html(array_employees[data_index].description);
		})

			// Define the key for the localStorage storage item
			const localStorageKey = "col-contacts-border-display";

			// Get the current display state of the div from localStorage, if it exists
			let displayState = localStorage.getItem(localStorageKey);
			if (displayState) {
			  $(".col-contacts-border").css("display", displayState);
			} else {
			  // If the display state of the div is not stored in localStorage, set the default state to "none"
			  $(".col-contacts-border").css("display", "none");
			}

			// Add the click event to toggle the display state of the div
			$(".toggle_employees_list").on("click", function(){
			  $(".col-contacts-border").toggle();

			  // Get the new display state of the div
			  displayState = $(".col-contacts-border").css("display");

			  // Store the new display state of the div in localStorage
			  localStorage.setItem(localStorageKey, displayState);
			});


		toastr.options = {
			  "closeButton": true,
			  "debug": false,
			  "newestOnTop": false,
			  "progressBar": true,
			  "positionClass": "toast-bottom-full-width",
			  "preventDuplicates": true,
			  "onclick": null,
			  "showDuration": "300",
			  "hideDuration": "1000",
			  "timeOut": "5000",
			  "extendedTimeOut": "2000",
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
		}


	const textarea = document.querySelector('#chat');
	const microphoneButton = document.querySelector('#microphone-button');

	let isTranscribing = false; // Initially not transcribing

	if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
	  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

	  recognition.lang = microphone_speak_lang;
	  recognition.continuous = true;

	  recognition.addEventListener('start', () => {
	    console.log('microphone activated');
	    $(".btn-send-chat").attr("disabled",true);
	    $("#microphone-button").attr("src","img/mic-stop.svg")
	  });

	  recognition.addEventListener('result', (event) => {
	    const transcript = event.results[0][0].transcript;
	    textarea.value += transcript + '\n';
	  });

	  recognition.addEventListener('end', () => {
	    console.log('microphone off');
	    $(".btn-send-chat").attr("disabled",false);
	    $("#microphone-button").attr("src","img/mic-start.svg")
	    isTranscribing = false; // Define a transcrição como encerrada
	  });

	  microphoneButton.addEventListener('click', () => {
	    if (!isTranscribing) {
	      // Start transcription if not transcrivendo
	      recognition.start();
	      isTranscribing = true; 
	    } else {
	      // Stop transcription if already transcribing
	      recognition.stop();
	      isTranscribing = false;
	    }
	  });
	} else {
	  toastr.error('Web Speech Recognition API not supported by browser');
	  $("#microphone-button").hide()
	}


//Tarot

//Display Cards
function displayTarotCards(){
	tarotFirstDisplay = false;
	toastr.success(lang["translate"][lang_index].select_tarot_cards_label);
	tarot_flipped_cards = 0;
	tarot_selected_cards = [];
	tarot_cards.sort(() => Math.random() - 0.5);
	$(".card-tarot-select").removeClass("tarot-fixed-top");
	$("#load-tarot-cards").html("");
	for (var i = 0; i < tarot_cards.length; i++) {	  	
		$("#load-tarot-cards").append(`
	     <div class="tarot-grid-item">
	        <div class="tarot-card" data-name="${tarot_cards[i].name}">
	          <div class="tarot-back"><img src="tarot/card-back.svg"></div>
	          <div class="tarot-front"><img src="${tarot_cards[i].image}"></div>
	        </div>
	      </div>
		`)
	}

	// Selects all cards and adds a click listener for each one
	const cards = document.querySelectorAll('.tarot-card');
	cards.forEach(card => {
	  card.addEventListener('click', flipCard);
	});
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	  window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}


function flipCard() {
  // Check if 3 cards have already been turned over
  if (tarot_flipped_cards < 3) {
		const card = {
		  name: this.getAttribute('data-name'),
		  image_url: this.querySelector('.tarot-front img').getAttribute('src')
		};

		// Add the object to the "tarot_selected_cards" array
		tarot_selected_cards.push(card);
    // Adds the "flipped" class to the card to activate the flip effect
    this.classList.add('flipped');
    // Increment the flipped cards counter
    tarot_flipped_cards++;
    // Checks if the maximum limit of turned cards has been reached
    if (tarot_flipped_cards === 3) {

				// Select all divs with class ".tarot-card"
				const cards = document.querySelectorAll('.tarot-card');

				// Loops through each div and performs an action if it doesn't have a "flipped" class
				cards.forEach(card => {
				  if (!card.classList.contains('flipped')) {
				    card.parentNode.classList.add('tarot-card-removed');   				
				  }
				});


				setTimeout(function() {


				// Cria uma cópia do elemento tarot-grid-container
				const tarot_grid_container = document.querySelector('#load-tarot-cards').cloneNode(true);

						// Removes all children from the copy
						while (tarot_grid_container.firstChild) {
						  tarot_grid_container.removeChild(tarot_grid_container.firstChild);
						}
						// Add the cards to the copy in the order of the tarot_selected_cards array
						tarot_selected_cards.forEach((card, index) => {
						  // Finds the HTML element corresponding to the name of the card
						  const card_element = document.querySelector(`.tarot-card[data-name="${card.name}"]`);
						  if (card_element) {
						    // Create a copy of the HTML element
						    const card_clone = card_element.parentNode.cloneNode(true);
						    // Adds the "tarot-zoom" class
						    card_clone.classList.add('tarot-zoom');
						    // Add the card to the tarot-grid-container copy in the correct position
						    tarot_grid_container.insertBefore(card_clone, tarot_grid_container.children[index]);
						  }
						});

						// Replaces the original tarot-grid-container element with the copy with the cards in the correct order
						const load_tarot_cards = document.querySelector('#load-tarot-cards');
						load_tarot_cards.parentNode.replaceChild(tarot_grid_container, load_tarot_cards);

						const chat = {"name": prompts_name, "message": prompts_training, "training": true, "date": currentDate()};
						array_chat.push(chat);

						setTimeout(function() {
							const formatted_tarot_selected_cards = tarot_selected_cards.map((card, index) => {return `${index + 1}- ${card.name}`;}).join(", ");
							$("#chat").val(formatted_tarot_selected_cards)
							sendUserChat();
							$(".message-area-bottom, .ai-chat-top").show();
							$(".tarot-cards-display").css("display","flex");
				    }, 2000);

		    }, 1000); 				
    }
  }
}
