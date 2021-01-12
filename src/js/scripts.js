let fieldData;

//    animationLength = 6, /* Animation Length. 1 second more than --durationOnScreen */
//    delayBetweenGroups = 2, /* Delay between display groups. */
//    delayCycleRestart = 4, /* Delay after finishing displaying all groups, before start again */

/*    displayTwitter,
    groupTwitter = 1,
    orderTwitter = 1,
    userTwitter = "@MyTwitterName",
    displayYoutube = true,
    groupYoutube = 1,
    orderYoutube = 2,
    userYoutube = "/MyYoutubeChannel",
    displayInstagram = false,
    groupInstagram = 1,
    orderInstagram = 3,
    userInstagram = "@MyInstagramName",

    displayTwitch = false,
    groupTwitch = 2,
    orderTwitch = 1,
    userTwitch = "/MyTwitchName",
    displayTiktok = false,
    groupTiktok = 2,
    orderTiktok = 2,
    userTiktok = "@MyTiktokName",

    displayProfile = false,
    groupProfile = 3,
    orderProfile = 1,
    userProfile = "MyName",
    displayLink = false,
    groupLink = 3,
    orderLink = 2,
    userLink = "www.mydomain.com",

    displayGmail = false,
    groupGmail = 4,
    orderGmail = 1,
    userGmail = "MyMail@gmail.com",
    displaySkype = false,
    groupSkype = 4,
    orderSkype = 2,
    userSkype = "MySkypeName",
    displayTelegram = false,
    groupTelegram = 4,
    orderTelegram = 3,
    userTelegram = "@MyTelegramName",

    displayLinkedin = false,
    groupLinkedin = 5,
    orderLinkedin = 1,
    userLinkedin = "MyLinkedinName",
    displayGithub = false,
    groupGithub = 5,
    orderGithub = 2,
    userGithub = "@MyGithubName";*/

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
    fieldData = obj.detail.fieldData;
    loadWidget();
});

function getParameters() {
    var result = 
    {
          animationSeg: fieldData.animationLength /* 1 second more than --durationOnScreen */
        , delayBtwGroups: fieldData.delayBetweenGroups
        , delayCycle: fieldData.delayCycleRestart
        , items: [
             { icon: "twitter",   active: fieldData.displayTwitter == "yes", group: fieldData.groupTwitter, order: fieldData.orderTwitter, username: fieldData.userTwitter }
            ,{ icon: "youtube",   active: fieldData.displayYoutube == "yes", group: fieldData.groupYoutube, order: fieldData.orderYoutube, username: fieldData.userYoutube }
            ,{ icon: "instagram", active: fieldData.displayInstagram == "yes", group: fieldData.groupInstagram, order: fieldData.orderInstagram, username: fieldData.userInstagram }

            ,{ icon: "twitch",    active: fieldData.displayTwitch == "yes", group: fieldData.groupTwitch, order: fieldData.orderTwitch, username: fieldData.userTwitch }
            ,{ icon: "tiktok",    active: fieldData.displayTiktok == "yes", group: fieldData.groupTiktok, order: fieldData.orderTiktok, username: fieldData.userTiktok }
            ,{ icon: "discord",   active: false, group: 2, order: 3, username: "@MyDiscordServer" }

            ,{ icon: "facebook",  active: false, group: 3, order: 1, username: "MyFacebookName" }
            ,{ icon: "messenger", active: false, group: 3, order: 2, username: "MyMessengerName" }
            
            ,{ icon: "profile",   active: fieldData.displayProfile == "yes", group: fieldData.groupProfile, order: fieldData.orderProfile, username: fieldData.userProfile }
            ,{ icon: "link",      active: fieldData.displayLink == "yes", group: fieldData.groupLink, order: fieldData.orderLink, username: fieldData.userLink }

            ,{ icon: "gmail",     active: fieldData.displayGmail == "yes", group: fieldData.groupGmail, order: fieldData.orderGmail, username: fieldData.userGmail }
            ,{ icon: "skype",     active: fieldData.displaySkype == "yes", group: fieldData.groupSkype, order: fieldData.orderSkype, username: fieldData.userSkype }

            ,{ icon: "linkedin",  active: fieldData.displayLinkedin == "yes", group: fieldData.groupLinkedin, order: fieldData.orderLinkedin, username: fieldData.userLinkedin }
            ,{ icon: "github",    active: fieldData.displayGithub == "yes", group: fieldData.groupGithub, order: fieldData.orderGithub, username: fieldData.userGithub }
            ,{ icon: "slack",     active: false, group: 5, order: 3, username: "MySlackName" }
            
            ,{ icon: "telegram",  active: fieldData.displayTelegram == "yes", group: fieldData.groupTelegram, order: fieldData.orderTelegram, username: fieldData.userTelegram }
            ,{ icon: "whatsapp",  active: false, group: 6, order: 2, username: "(+My)-Whatsapp-Phone" }
            
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

        let busyTimeGroup = this.parameters.animationSeg + this.parameters.delayBtwGroups;
        let busyTimeTotal = busyTimeGroup * distinctGroups.length;
        setInterval(this.doWorkAsync, (busyTimeTotal + this.parameters.delayCycle) * 1000);
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

            await sleep((this.parameters.animationSeg + this.parameters.delayBtwGroups) * 1000);
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
        ,'messenger','tiktok','twitch','twitter','youtube','github','fiverr'
        ,'gmail','gmail-old','gmail-old-light','linkedin','skype','slack','telegram','telegram-old','whatsapp'
        ,'brave','googlechrome','googlehangouts','googledrive','microsoftedge','internetexplorer'
        ,'mozillafirefox','opera','safari'
        ,'user','user-o','user-circle','user-circle-o','user2','user3','user4','user5'
        ,'sphere','earth','link','new-tab'];



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



