const token = localStorage.getItem("token");

const socket = new WebSocket("ws://localhost:8080/ws?token="+encodeURIComponent(token)+"");
socket.onopen = () => {
    console.log("WebSocket connected");
};

socket.onmessage = async (event) => {
    console.log("Received:", event.data);
    const data = JSON.parse(event.data);

    var author = await fetch('http://localhost:8080/api/users/' + data.message.author_id, {headers: { "Authorization": `Bearer ${token}` }}).then(response => response.json());

    formattedTime = getCurDateTime();

    var message =
    `
        <div class="flex items-center p-1 pl-5 my-5 mr-2 hover:bg-[#32353B] group">
            <img src="../backend/uploads/avatars/${author.avatar_url}" alt="" class="h-10 rounded-full cursor-pointer mr-3 hover:shadow-2xl" />
            <div class="flex flex-col">
                <h4 class="flex items-center space-x-2 font-medium">
                    <span class="hover:underline text-white text-sm cursor-pointer">
                        ${author.username}
                    </span>
                    <span class="text-[#72767d] text-xs">
                        ` + formattedTime + `
                    </span>
                </h4>
                <p class="text-sm text-[#dcddde]">` + data.message.content + `</p>
            </div>
        </div>
    `;

    var chat_id = document.getElementById(document.getElementById("title").textContent).dataset.id;
    var channel_id = document.getElementById(document.getElementById("title").textContent).parentNode.parentNode.children[0].children[1].dataset.id;
    var server_id = document.querySelector(".border-white").parentNode.dataset.id;

    if(data.message.server_id == server_id && data.message.channel_id == channel_id && data.message.chat_id == chat_id){
        document.getElementById("chat").innerHTML += message;
    }

    Object.keys(chatsObj).forEach((server, index) => {
        if(data.message.server_id == document.getElementById(server).dataset.id){
            Object.keys(chatsObj[server]).forEach((channel, idx) => {
                if(data.message.channel_id == chatsObj[server][channel].channelId && data.message.chat_id == chatsObj[server][channel].titleId){
                    chatsObj[server][channel].messages += message;
                }
            });
        }
    });
};

socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

socket.onclose = () => {
    console.log("WebSocket closed");
};

async function currentUser(){
const response = await fetch(
    "http://localhost:8080/api/auth/me",
    {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
);

window.currentUser = await response.json();

document.getElementById("user").innerHTML =
`
    <img src="../backend/uploads/avatars/${currentUser.avatar_url}" alt="" class="h-10 rounded-full" />
    <h4 class="text-white text-xs font-medium">
        ${currentUser.username}
        <span class="text-[#b9bbbe] block">
            #7292
        </span>
    </h4>
`;

return currentUser;
}

function typeMessage(event){
    event.preventDefault();
    var text = document.getElementById("text_id").value;
    // console.log(text)
    text = text.trim();
    if(text === ""){
        return
    }



    // const tmstmp = Date.now();
    // const date = new Date(tmstmp);
    // var formattedTime = (date.getDate() < 10 ? '0' : '') + date.getDate() + '.' + 
    //                     (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth()+1) + '.' + 
    //                     date.getFullYear() + ' ' + 
    //                     date.getHours() + ":" + 
    //                     (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    formattedTime = getCurDateTime();



    var message =
    `
        <div class="flex items-center p-1 pl-5 my-5 mr-2 hover:bg-[#32353B] group">
            <img src="../backend/uploads/avatars/${currentUser.avatar_url}" alt="" class="h-10 rounded-full cursor-pointer mr-3 hover:shadow-2xl" />
            <div class="flex flex-col">
                <h4 class="flex items-center space-x-2 font-medium">
                    <span class="hover:underline text-white text-sm cursor-pointer">
                        ${currentUser.username}
                    </span>
                    <span class="text-[#72767d] text-xs">
                        ` + formattedTime + `
                    </span>
                </h4>
                <p class="text-sm text-[#dcddde]">` + text + `</p>
            </div>
        </div>
    `;

    document.getElementById("chat").innerHTML += message;

    // cagesObj[document.getElementById("title").innerHTML] += message;
    chatsObj[document.querySelector(".border-white").parentNode.id][document.getElementById("title").innerHTML].messages += message;

    var chat_id = document.getElementById(document.getElementById("title").textContent).dataset.id;
    var channel_id = document.getElementById(document.getElementById("title").textContent).parentNode.parentNode.children[0].children[1].dataset.id;
    var server_id = document.querySelector(".border-white").parentNode.dataset.id

    fetch('http://localhost:8080/api/server/'+server_id+'/channel/'+channel_id+'/chat/'+chat_id+'/message', 
    {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    })
    // .then(response => response.json())

    document.getElementById('text_id').value = "";
}

function getCurDateTime(){
    const tmstmp = Date.now();
    const date = new Date(tmstmp);
    var formattedTime = (date.getDate() < 10 ? '0' : '') + date.getDate() + '.' + 
                        (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth()+1) + '.' + 
                        date.getFullYear() + ' ' + 
                        date.getHours() + ":" + 
                        (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

    // document.getElementById("currentDateTime").innerHTML = formattedTime;
    return formattedTime;
}

function dropDown(id){
    console.log(id);
    // if(document.getElementById(id).children[1].classList.contains("hidden")){
    //     document.getElementById(id).children[0].children[0].outerHTML =
    //     `
    //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3 mr-2">
    //             <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd" />
    //         </svg>
    //     `
    //     document.getElementById(id).children[1].classList.remove("hidden")
    // }
    // else{
    //     document.getElementById(id).children[0].children[0].outerHTML =
    //     `
    //     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-3 mr-2">
    //         <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    //     </svg>
    //     `
    //     document.getElementById(id).children[1].classList.add("hidden");
    // }
    
    var cages = document.getElementById(id).children[1].children
    if(Object.values(cages).some(el => el.classList.contains("hidden"))){
        document.getElementById(id).children[0].children[0].outerHTML =
        `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3 mr-2">
                <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd" />
            </svg>
        `
        for(var i = 0; i < cages.length; i++){
            if(cages[i].classList.contains("hidden")){
                cages[i].classList.remove("hidden");
            }
        }
    }
    else if(cages.length < 2){
        if(document.getElementById(id).children[0].children[0].children[0].getAttribute("d") === "m8.25 4.5 7.5 7.5-7.5 7.5"){
            document.getElementById(id).children[0].children[0].outerHTML =
            `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3 mr-2">
                    <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd" />
                </svg>
            `
            cages[0].classList.remove("hidden");
        }
        else if(document.getElementById(id).children[0].children[0].children[0].getAttribute("d") === "M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"){
            document.getElementById(id).children[0].children[0].outerHTML =
            `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-3 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            `
            if(!cages[0].classList.contains("bg-[#3A3C43]", "text-white")){
                cages[0].classList.add("hidden");
            }
        }
    }
    else if(!Object.values(cages).some(el => el.classList.contains("hidden"))){
        // Object.values(cages).some(el => el.classList.contains("bg-[#3A3C43]", "text-white"))
        document.getElementById(id).children[0].children[0].outerHTML =
        `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-3 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        `
        for(var i = 0; i < cages.length; i++){
            if(!cages[i].classList.contains("bg-[#3A3C43]", "text-white")){
                cages[i].classList.add("hidden");
            }
        }
    }

}

function activeCage(){
    var cages = document.getElementsByClassName("cages");
    if(!Object.values(cages).some(el => el.classList.contains("text-white"))){
        var firstChat = document.getElementById("chatsDiv").children[0].children[1].children[0];
        this.id = firstChat.id;
        document.getElementById(this.id).classList.add("bg-[#3A3C43]", "text-white");
        document.getElementById("title").innerHTML = this.id;
        // document.getElementById("chat").innerHTML = cagesObj[this.id];
        document.getElementById("chat").innerHTML = chatsObj[document.querySelector(".border-white").parentNode.id][this.id].messages;
        return
    }
    
    // if(this.id === "s0"){
    //     var firstChat = document.getElementById("chatsDiv").children[0].children[1].children[0];
    //     this.id = firstChat.id;
    //     document.getElementById(this.id).classList.add("bg-[#3A3C43]", "text-white");
    //     document.getElementById("title").innerHTML = this.id;
    //     document.getElementById("chat").innerHTML = cagesObj[this.id];
    //     return
    // }

    var getCurId = document.getElementsByClassName("bg-[#3A3C43] text-white");
    for(var i = 0; i < getCurId.length; i++){
        if(getCurId[i].id !== this.id){
            document.getElementById(getCurId[i].id).classList.remove("bg-[#3A3C43]", "text-white")
            document.getElementById(this.id).classList.add("bg-[#3A3C43]", "text-white");
        }
    }

    document.getElementById("title").innerHTML = this.id;

    var getParent = document.getElementsByClassName("hidden");
    for(var i = 0; i < getParent.length; i++){
        for(var k = 0; k < getParent[i].parentNode.children.length; k++){
            if(!getParent[i].parentNode.children[k].classList.contains("hidden")){
                getParent[i].parentNode.children[k].classList.add("hidden");
            }
        }
    }

    if(Object.values(cages).some(el => el.parentNode.children.length < 2)){
        for(var i = 0; i < cages.length; i++){
            if(cages[i].parentNode.children.length < 2){
                if((!cages[i].classList.contains("bg-[#3A3C43]", "text-white")) &&
                (cages[i].parentNode.parentNode.children[0].children[0].children[0].getAttribute("d") ===
                "m8.25 4.5 7.5 7.5-7.5 7.5")
                ){
                    cages[i].classList.add("hidden");
                }
            }
        }
    }

    // console.log(cagesObj[this.id]);

    // document.getElementById("chat").innerHTML = cagesObj[this.id];
    document.getElementById("chat").innerHTML = chatsObj[document.querySelector(".border-white").parentNode.id][this.id].messages;
}

function createChat(){
    var curDateTime = getCurDateTime();
    var cages = document.getElementsByClassName("cages");
    window.cagesObj = {};
    for(i = 0; i < cages.length; i++){
        // console.log(cages[i].id);
        // var element = document.createElement('div');
        // element.id = cages[i].id + "Chat";
        cagesObj[cages[i].id] = 
        `
            <div class="flex items-center p-1 pl-5 my-5 mr-2 hover:bg-[#32353B] group">
                <img src="../backend/uploads/avatars/chatbot-icon.png" alt="" class="h-10 rounded-full cursor-pointer mr-3 hover:shadow-2xl" />
                <div class="flex flex-col">
                    <h4 class="flex items-center space-x-2 font-medium">
                        <span class="hover:underline text-white text-sm cursor-pointer">
                        DiscordBOT
                        </span>
                        <span id="currentDateTime" class="text-[#72767d] text-xs">
                        `+ curDateTime +`
                        </span>
                    </h4>
                    <p class="text-sm text-[#dcddde]">#`+ cages[i].id +` chat</p>
                </div>
            </div>
        `;
    }
    // console.log(cagesObj);
}

window.chatsObj = {};

async function createChats(){
    var curDateTime = getCurDateTime();
    // var data = await fetch('./data.json').then(response => response.json());
    var data = await fetch('http://localhost:8080/api/servers', {headers: { "Authorization": `Bearer ${token}` }}).then(response => response.json());
    var users = await fetch('http://localhost:8080/api/users', {headers: { "Authorization": `Bearer ${token}` }}).then(response => response.json());
    // window.chatsObj = {};

    // data.data.forEach((item, index) => {
    data.forEach((item, index) => {
        index = "s"+index;
        if (!chatsObj[index]) {
            chatsObj[index] = {};
        }

        item.channels.forEach((i, idx) => {

            // if (!chatsObj[index][idx]) {
            //     chatsObj[index][idx] = {};
            // }

            i.chats.forEach((chat, ndx) => {
                chatsObj[index][chat.title] ??= {
                    channelId: i.id,
                    titleId: chat.id,
                    messages: ""
                };
                fetch('http://localhost:8080/api/server/'+ (Number(index.slice(1))+1) +'/channel/'+ (idx+1) +'/chat/'+ (ndx+1) +'/messages', 
                {headers: { "Authorization": `Bearer ${token}` }})
                .then(response => response.json())
                .then(messages => {
                    if(messages){
                        // console.log(messages);
                        messages.forEach((e, x) =>{
                            // console.log(e.content)
                            chatsObj[index][chat.title].messages +=
                            `
                                <div class="flex items-center p-1 pl-5 my-5 mr-2 hover:bg-[#32353B] group">
                                    <img src="../backend/uploads/avatars/${users[e.author_id-1].avatar_url}" alt="" class="h-10 rounded-full cursor-pointer mr-3 hover:shadow-2xl" />
                                    <div class="flex flex-col">
                                        <h4 class="flex items-center space-x-2 font-medium">
                                            <span class="hover:underline text-white text-sm cursor-pointer">
                                            ${users[e.author_id-1].username}
                                            </span>
                                            <span id="currentDateTime" class="text-[#72767d] text-xs">
                                            `+ curDateTime +`
                                            </span>
                                        </h4>
                                        <p class="text-sm text-[#dcddde]">`+ e.content +`</p>
                                    </div>
                                </div>
                        `;
                        })
                    }
                });

                // console.log(index, chat);
            //     chatsObj[index][chat.title] =
            //     `
            //         <div class="flex items-center p-1 pl-5 my-5 mr-2 hover:bg-[#32353B] group">
            //             <img src="../backend/uploads/avatars/chatbot-icon.png" alt="" class="h-10 rounded-full cursor-pointer mr-3 hover:shadow-2xl" />
            //             <div class="flex flex-col">
            //                 <h4 class="flex items-center space-x-2 font-medium">
            //                     <span class="hover:underline text-white text-sm cursor-pointer">
            //                     DiscordBOT
            //                     </span>
            //                     <span id="currentDateTime" class="text-[#72767d] text-xs">
            //                     `+ curDateTime +`
            //                     </span>
            //                 </h4>
            //                 <p class="text-sm text-[#dcddde]">#`+ chat.title +` chat</p>
            //             </div>
            //         </div>
            // `;
            });

        });
    });

    // console.log(chatsObj);

}

async function createServers(){
    // var data = await fetch('./data.json').then(response => response.json());
    var data = await fetch('http://localhost:8080/api/servers', {headers: { "Authorization": `Bearer ${token}` }}).then(response => response.json());
    // console.log(data);

    // data.data.forEach((item, index) => {
    data.forEach((item, index) => {
        var server =
        `
            <div id="s`+ index +`" title="` + item.name + `" data-id="${item.id}" class="servers server hover:bg-discord_purple group active:rounded-3xl">
                <img src="`+ item.logo_link +`" alt="" class="h-12 cursor-pointer rounded-full transition-all duration-100 ease-out hover:rounded-2xl active:rounded-3xl" />
            </div>
        `
        var leftBar = document.getElementById("leftBar");
        leftBar.children[2+index].insertAdjacentHTML("beforebegin", server);
        // console.log(document.getElementById("leftBar").children[5])
    });

    var servers = document.getElementsByClassName("servers");
    for(i = 0; i < servers.length; i++){
        servers[i].addEventListener("click", activeServer);
        // console.log(servers[i]);
    }
}

async function createChannels(id){
    // data = await fetch('./data.json').then(response => response.json())
    var data = await fetch('http://localhost:8080/api/servers', {headers: { "Authorization": `Bearer ${token}` }}).then(response => response.json());

    document.getElementById("chatsDiv").innerHTML = "";

    // data.data.forEach((item, index) => {
    data.forEach((item, index) => {
        if("s"+index === id){
            // console.log(item.channels);

            item.channels.forEach((i, idx) => {
                var divElement = document.createElement("div");
                var id = divElement.id = idx+1;
                divElement.innerHTML =
                `
                    <div onclick="dropDown('`+ id +`')" class="flex items-center p-2 hover:text-white cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3  mr-2">
                            <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd" />
                        </svg>
                        <h4 data-id="${i.id}" class="font-semibold font-mono">`+ i.name +`</h4>
                    </div>
                    <div class="flex flex-col space-y-2 px-2 mb-4">
                    </div>
                `

                i.chats.forEach((chat, ndx) => {
                    divElement.children[1].innerHTML +=
                    `
                        <div id="`+ chat.title +`" tabindex="-1" data-id="${chat.id}" class="cages font-medium flex items-center cursor-pointer hover:bg-[#3A3C43] p-1 rounded-md  hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 mr-2">
                                <path fill-rule="evenodd" d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 110-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z" clip-rule="evenodd" />
                            </svg>
                            `+ chat.title +`
                        </div>
                    `
                });

                // console.log(divElement);

                document.getElementById("chatsDiv").appendChild(divElement);

            });
        }
    });

    var cages = document.getElementsByClassName("cages");
    for(i = 0; i < cages.length; i++){
        cages[i].addEventListener("click", activeCage);
    }
}

async function activeServer(){
    if(typeof this.id === "undefined"){
        var firstServer = document.getElementById("leftBar").getElementsByClassName("servers").item(0);
        this.id = firstServer.id;
        this.title = firstServer.title;
        document.getElementById("serverTitle").childNodes[0].nodeValue = firstServer.title;
        document.getElementById(this.id).children[0].classList.add("border-2", "border-white");
        await createChannels(this.id);
        return
    }

    var getCurId = document.getElementsByClassName("border-2 border-white");
    for(var i = 0; i < getCurId.length; i++){
        if(getCurId[i].parentNode.id !== this.id){
            document.getElementById(getCurId[i].parentNode.id).children[0].classList.remove("border-2", "border-white")
            // document.getElementById(this.id).children[0].classList.add("border-2", "border-white");
        }
    }

    document.getElementById("serverTitle").childNodes[0].nodeValue = this.title;
    document.getElementById(this.id).children[0].classList.add("border-2", "border-white");
    await createChannels(this.id);
    activeCage();
    // (async () => {
    //     data = await fetch('./data.json').then(response => response.json())

    //     document.getElementById("chatsDiv").innerHTML = "";

    //     data.data.forEach((item, index) => {
    //         if("s"+index === this.id){
    //             // console.log(item.channels);

    //             item.channels.forEach((i, idx) => {
    //                 var divElement = document.createElement("div");
    //                 var id = divElement.id = idx+1;
    //                 divElement.innerHTML =
    //                 `
    //                     <div onclick="dropDown('`+ id +`')" class="flex items-center p-2 hover:text-white cursor-pointer">
    //                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3  mr-2">
    //                             <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd" />
    //                         </svg>
    //                         <h4 class="font-semibold font-mono">`+ i.name +`</h4>
    //                     </div>
    //                     <div class="flex flex-col space-y-2 px-2 mb-4">
    //                     </div>
    //                 `

    //                 i.chats.forEach((chat, ndx) => {
    //                     divElement.children[1].innerHTML +=
    //                     `
    //                         <div id="`+ chat.title +`" tabindex="-1" class="cages font-medium flex items-center cursor-pointer hover:bg-[#3A3C43] p-1 rounded-md  hover:text-white">
    //                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 mr-2">
    //                                 <path fill-rule="evenodd" d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 110-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z" clip-rule="evenodd" />
    //                             </svg>
    //                             `+ chat.title +`
    //                         </div>
    //                     `
    //                 });

    //                 // console.log(divElement);

    //                 document.getElementById("chatsDiv").appendChild(divElement);

    //             });
    //         }
    //     });

    //     // createChat();
    //     // activeCage();

    // })()
}

// var cages = document.getElementsByClassName("cages");
// for(i = 0; i < cages.length; i++){
//     cages[i].addEventListener("click", activeCage);
// }

document.addEventListener("DOMContentLoaded", async function() {
    await currentUser();
    await createServers();
    // await activeServer();
    await createChats();
    await activeServer();
    // createChat();
    activeCage();
    // getCurDateTime();
    // await currentUser();

});