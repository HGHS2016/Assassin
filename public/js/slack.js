var slackChatOptions = {
                apiToken: '',       //#Slack Auth token. Required.
                channelId: '',      //#Slack channel ID. Required.
                user: '',           //name of the user. Required.
                userLink: '',       //link to the user in the application - shown in #Slack
                userImg: '',        //image of the user
                userId: '',         //id of the user in the application
                sysImg: '',         //image to show when the support team replies
                sysUser: '',                //Required.
                queryInterval: 3000,
                chatBoxHeader: "Need help? Talk to our support team right here",
                slackColor: "#36a64f",
                messageFetchCount: 100,
                botUser: '',        //username to post to #Slack. Required.
                sendOnEnter: true,
                disableIfAway: false,
                elementToDisable: null,
                heightOffset: 75,
                debug: false,
                webCache: false,
                privateChannel: false,
				serverApiGateway: '/server/php/server.php'
}

$(<elem>).slackChat(slackChatOptions);
