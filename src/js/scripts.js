let includeFollowers = true,
    includeSubs = true;

let totalSM = 0;

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
    loadWidget();
});

function getParameters() {
    var result = 
    {
        durationAnimSeg: 6
        , durationSleepSeg: 1
        , items: [
             { icon: "twitter",   active: true, group: 1, order: 1, username: "@MyTwitterName" }
            ,{ icon: "youtube",   active: true, group: 1, order: 2, username: "/MyYoutubeChannel" }
            ,{ icon: "instagram", active: true, group: 1, order: 3, username: "@MyInstagramName" }

            ,{ icon: "twitch",    active: true, group: 2, order: 1, username: "/MyTwitchName" }
            ,{ icon: "tiktok",    active: true, group: 2, order: 2, username: "@MyTiktokName" }
            ,{ icon: "discord",   active: true, group: 2, order: 3, username: "@MyDiscordServer" }

            ,{ icon: "facebook",  active: false, group: 3, order: 1, username: "MyFacebookName" }
            ,{ icon: "messenger", active: false, group: 3, order: 2, username: "MyMessengerName" }
            
            ,{ icon: "gmail",     active: true, group: 4, order: 1, username: "MyMail@Gmail.com" }
            ,{ icon: "skype",     active: true, group: 4, order: 2, username: "MySkypeName" }

            ,{ icon: "linkedin",  active: true, group: 5, order: 1, username: "MyLinkedinName" }
            ,{ icon: "github",    active: true, group: 5, order: 2, username: "@MyGithubName" }
            ,{ icon: "slack",     active: true, group: 5, order: 3, username: "MySlackName" }
            
            ,{ icon: "telegram",  active: true, group: 6, order: 1, username: "@MyTelegramName" }
            ,{ icon: "whatsapp",  active: true, group: 6, order: 2, username: "(+My)-Whatsapp-Phone" }
            
            ,{ icon: "follow",    active: false, group: 7, order: 1, username: "Followers ###" }
            ,{ icon: "sub",       active: false, group: 7, order: 2, username: "Subs ###" }]
    };

    return result;
}

class SocialWorker {
    constructor(){
        // https://stackoverflow.com/a/42239212
        // https://stackoverflow.com/a/57774483
        this.doWorkAsync = this.doWorkAsync.bind(this);
    }

    configure(parameters) {
        this.parameters = parameters;
    }

    doWork() {
        this.socialsToAdd = this.getSocialsToAdd(this.parameters.items);
        let distinctGroups = this.getDistinctGroups(this.socialsToAdd);

        let busyTime = this.parameters.durationAnimSeg * distinctGroups.length;
        setInterval(this.doWorkAsync, (busyTime + this.parameters.durationSleepSeg) * 1000);
    }

     async doWorkAsync() {
        let distinctGroups = this.getDistinctGroups(this.socialsToAdd);

        let group;
        while(group = distinctGroups.shift()) {
            let elementsList = [];
            let socialsByGroup = this.socialsToAdd.filter(function(item) {
                return item.group == group;
            });

            socialsByGroup.forEach(function(item, index, array) {
                if(item && item.active) {
                    let sm = getSMHTMLElement(item);
                    elementsList.push(sm);
                }
            });

            // Add to page
            $('.main-container').empty();
            $('.main-container').append(elementsList);

            await sleep(this.parameters.durationAnimSeg * 1000);
        }
    }

    getSocialsToAdd(socialItems) {
        // Select active items. and order them by Group and then by Order.
        let resultList = socialItems
            .filter(function(item) { return item.active; })
            .sort(function(a,b){
                let result = 0;

                // Order from min to max
                if (a.group > b.group) {
                    return 1;
                } else if (a.group < b.group) { 
                    return -1;
                }

                // Else go to the 2nd item
                if (a.order < b.order) { 
                    return -1;
                } else if (a.order > b.order) {
                    return 1
                } else { // nothing to split them
                    return 0;
                }
            });

        return resultList;
    }

    getDistinctGroups(socialItems) {
        // Select all groups
        let result = socialItems.map(function(item){
            return item.group;
        });

        // Do Disctinct
        result = [...new Set(result)];

        return result;
    }
}

function loadWidget() {
    /*https://css-tricks.com/restart-css-animation/*/

    let parameters = getParameters();

    let worker = new SocialWorker();
    
    worker.configure(parameters);

    worker.doWork();
}

function getSMHTMLElement(smItem) {
    totalSM += 1;    
    
    
    let element = `
    <div class="svgiconHolder svgiconHolder-${smItem.icon}" id="svgiconHolder-${smItem.icon}-${totalSM}">
        <svg class="svgicon svgicon-${smItem.icon}" id="svgicon-${smItem.icon}-${totalSM}">
             <use xlink:href="#icon-${smItem.icon}"></use>
        </svg>
        <span class="svgiconUsername svgiconUsername-${smItem.icon}" id="svgiconUsername-${smItem.icon}-${totalSM}">${smItem.username}</span>
    </div>`;

    return element;
}

/// SLEEP
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



///*** Functions only for test page ***///
function fnOnLoad() {
    let svgSocials = ['follow','sub','discord','facebook','instagram'
        ,'messenger','tiktok','twitch','twitter','youtube','github'
        ,'gmail','linkedin','skype','slack','telegram','telegram-old','whatsapp'];

    svgSocials.forEach(function(item, index, array) {
    let element = `
       <div class="button-showicon" onclick="addSVGIcon('${item}')">show<br><b>${item.toUpperCase()}</b></div>`;

       $('.manage-widget').append(element);
    });

    loadWidget();
}

function addSVGIcon(iconName) {
    totalSM += 1;    
    let usernameValue = $('#txtUsername').val() 
    if (!usernameValue) usernameValue = "Nombre Usuario";
    
    let element = `
    <div class="svgiconHolder svgiconHolder-${iconName}" id="svgiconHolder-${iconName}-${totalSM}">
        <svg class="svgicon svgicon-${iconName}" id="svgicon-${iconName}-${totalSM}">
            <use xlink:href="#icon-${iconName}"></use>
        </svg>
        <span class="svgiconUsername svgiconUsername-${iconName}" id="svgiconUsername-${iconName}-${totalSM}">${usernameValue}</span>
    </div>`;
    
    $('.main-container').empty();
    $('.main-container').append(element);
}
