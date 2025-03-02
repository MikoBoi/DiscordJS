function typeMessage(event){
    event.preventDefault();
    var text = document.getElementById("text_id").value;
    // console.log(text)
    text = text.trim();
    if(text === ""){
        return
    }



    const tmstmp = Date.now();
    const date = new Date(tmstmp);
    var formattedTime = (date.getDate() < 10 ? '0' : '') + date.getDate() + '.' + 
                        "0" + (date.getMonth()+1) + '.' + 
                        date.getFullYear() + ' ' + 
                        date.getHours() + ":" + 
                        (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();



    var message =
    `
        <div class="flex items-center p-1 pl-5 my-5 mr-2 hover:bg-[#32353B] group">
            <img src="https://rb.gy/jfrzf7" alt="" class="h-10 rounded-full cursor-pointer mr-3 hover:shadow-2xl" />
            <div class="flex flex-col">
                <h4 class="flex items-center space-x-2 font-medium">
                    <span class="hover:underline text-white text-sm cursor-pointer">
                        Mirbekius
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

    cagesObj[document.getElementById("title").innerHTML] += message;

    document.getElementById('text_id').value = "";
}

function getCurDateTime(){
    const tmstmp = Date.now();
    const date = new Date(tmstmp);
    var formattedTime = (date.getDate() < 10 ? '0' : '') + date.getDate() + '.' + 
                        "0" + (date.getMonth()+1) + '.' + 
                        date.getFullYear() + ' ' + 
                        date.getHours() + ":" + 
                        (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

    // document.getElementById("currentDateTime").innerHTML = formattedTime;
    return formattedTime;
}

function dropDown(id){
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
    if(typeof this.id === "undefined"){
        this.id = "welcome";
        document.getElementById(this.id).classList.add("bg-[#3A3C43]", "text-white")
        document.getElementById("title").innerHTML = this.id;
        document.getElementById("chat").innerHTML = cagesObj[this.id];
        return
    }

    var getCurId = document.getElementsByClassName("bg-[#3A3C43] text-white")
    for(var i = 0; i < getCurId.length; i++){
        if(getCurId[i].id !== this.id){
            document.getElementById(getCurId[i].id).classList.remove("bg-[#3A3C43]", "text-white")
            document.getElementById(this.id).classList.add("bg-[#3A3C43]", "text-white")
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

    // console.log(cagesObj[this.id]);

    document.getElementById("chat").innerHTML = cagesObj[this.id];
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
                <img src="https://rb.gy/oubw0z" alt="" class="h-10 rounded-full cursor-pointer mr-3 hover:shadow-2xl" />
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

var cages = document.getElementsByClassName("cages");
for(i = 0; i < cages.length; i++){
    cages[i].addEventListener("click", activeCage);
}

document.addEventListener("DOMContentLoaded", function() {
    createChat();
    activeCage();
    // getCurDateTime();
});