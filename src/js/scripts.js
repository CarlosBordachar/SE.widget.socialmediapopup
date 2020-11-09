let includeFollowers = true,
    includeSubs = true,
    durationWithSleep = 26;

let totalEvents = 0,
    timerId;

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

window.addEventListener('onWidgetLoad', function (obj) {
    addSocialBanner('twitter', durationWithSleep);
});

function addSocialBanner(iconName, sleep) {

    if(timerId) clearInterval(timerId);/*clearTimeout(timerId);*/

    /*timerId = setInterval(addSVGIcon, sleep * 1000, iconName);*/
    timerId = setInterval(addSVGIconsList, sleep * 1000, ['twitter', 'tiktok', 'twitch']);

    /*timerId = setTimeout(function run() {
      addSVGIcon(iconName);
      timerId = setTimeout(run, sleep * 1000);
    }, sleep * 1000);*/   
}

let timer2;
async function addSVGIconsList(iconsNameList) {
    let iconName;

timer2 = setTimeout(addSVGIcon, 6000, 'twitter');
await sleep(6000);
timer2 = setTimeout(addSVGIcon, 6000, 'tiktok');
await sleep(6000);
timer2 = setTimeout(addSVGIcon, 6000, 'twitch');

      /*timer2 = setTimeout(function run() {
          if(timer2) clearTimeout(timer2);

          iconName = iconsNameList.shift();
          addSVGIcon(iconName);
          iconsNameList.push(iconName);

          timer2 = setTimeout(run, 6000);
        }, 6000);*/
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

function fnOnLoad() {
    let svgSocials = ['follow','sub','discord','facebook','instagram'
        ,'messenger','tiktok','twitch','twitter','youtube','github'
        ,'gmail','linkedin','skype','slack','telegram','whatsapp'];

    svgSocials.forEach(function(item, index, array) {
    let element = `
       <div class="button-showicon" onclick="addSocialBanner('${item}', ${durationWithSleep})">show<br><b>${item.toUpperCase()}</b></div>`;

       $('.manage-widget').append(element);
    });

    addSocialBanner('twitter', durationWithSleep);
}
