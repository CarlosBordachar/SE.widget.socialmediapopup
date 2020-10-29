let includeFollowers = true,
    includeSubs = true/*,
    includeRedemptions = true,
    includeHosts = true,
    includeRaids = true,
    includeTips = true,
    includeCheers = true*/;

let totalEvents = 0;

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
      return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;

    if (listener === 'follower') {
        if (includeFollowers) {
            addFollowEvent();
        }
    } else if (listener === 'subscriber') {
        if (includeSubs) {
            addSubEvent();
        }
    } /*else if (listener === 'redemption') {
        if (includeRedemptions) {
            addRedemptionEvent();
        }
    } else if (listener === 'host') {
        if (includeHosts) {
            addHostEvent();
        }
    } else if (listener === 'raid') {
        if (includeRaids) {
            addRaidEvent();
        }
    } else if (listener === 'cheer') {
        if (includeCheers) {
            addCheerEvent();
        }
    } else if (listener === 'tip') {
        if (includeTips) {
            addTipEvent();
        }
    }*/
});


function loadButtons() {
    let svgSocials = ['follow','sub','discord','facebook','instagram'
        ,'messenger','tiktok','twitch','twitter','youtube','github'
        ,'gmail','linkedin','skype','slack','telegram','whatsapp'];

    svgSocials.forEach(function(item, index, array) {
    let element = `
       <div class="button-showicon" onclick="addSVGIcon('${item}')">show<br><b>${item.toUpperCase()}</b></div>`;

       $('.manage-widget').append(element);
    });
}

function addSVGIcon(iconName) {
    totalEvents += 1;    
    let usernameValue = $('#txtUsername').val() 
    if (!usernameValue) usernameValue = "Nombre Usuario";
    
    let element = `
    <svg class="svgicon svgicon-${iconName}" id="svgicon-${iconName}-${totalEvents}">
         <use xlink:href="#icon-${iconName}"></use>
    </svg>
    <span class="svgiconUsername svgiconUsername-${iconName}" id="svgiconUsername-${iconName}-${totalEvents}">${usernameValue}</span>`;
    
    $('.main-container').empty();
    $('.main-container').append(element);
}
