//importando chatGPT
import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";


const $ = (selector) => document.querySelector(selector);
// const $ = (selector) => document.querySelectorAll(selector);

// coloco $ por que es un elemnto del DOM
const $form = $('form');
const $input = $('input');
const $template = $('#message-template');
const $messages = $('ul');
const $container = $('main');
const $button = $('button');
const $info = $('small');
const $loading = $('.loading');

let messages = [];



//llamo IA
const SELECTED_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC"

const engine =  await CreateMLCEngine (
    //worker
    //new Worker ('/worker.js', { type: 'module' }),
    SELECTED_MODEL,{
        initProgressCallback: (info) => {
            console.log("initProgressBack", info);
            $info.textContent = `Cargando modelo ${info.progress}%`;
            if (info.progress === 1) {
                $button.disabled = false;
            }
            
        }
        
    
}

)


// formulario

$form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const messageText = $input.value.trim();

    if (messageText !== '') {
        //añadir mensaje al DOM
        $input.value = '';
        }
        
        addMessage(messageText, 'user');
        $button.setAttribute('disabled', '');

       const usereMessage = {
            role: 'user',
            content: messageText
        }
         messages.push(usereMessage);
       
       const chunks = await engine.chat.completions.create(
        {
           messages,
           stream: true
        })

        let reply = " ";
        const $botMessage = addMessage(" ", 'bot');

        for await (const chunk of chunks) {
            const [choise] = chunk.choices;
            const content = choise?.delta?.content ?? '';
            reply += content;
            $botMessage.textContent = reply;
            //aca puedo poner replay antes del content

            
        }

        $button.removeAttribute('disabled');
        messages.push({
            role: 'assistant',
            content: reply
        })
       //const botMessage = reply.choices[0].message;
       //messages.push(botMessage);
       //addMessage(botMessage.content, 'bot');
        
    })

//funcion escribir en el template

function addMessage(text, sender){
    const clonedTemplate = $template.content.cloneNode(true);
    const $newMessage = clonedTemplate.querySelector('.message');

    const $who = $newMessage.querySelector('span');
    const $text = $newMessage.querySelector('p');


    //añadir mensaje al DOM
    $text.textContent = text;
    //añadir mensaje al DOM 
    $who.textContent = sender === 'bot' ? 'GPT' : 'Tu';
    $newMessage.classList.add(sender);
    //lista de mensajes
    $messages.appendChild($newMessage);
    //actualizar el scroll
    $container.scrollTop = $container.scrollHeight;

    //devuelvo el mensaje
    return $text;
   
}



