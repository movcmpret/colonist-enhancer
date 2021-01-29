
(function() {

    const GAME_LOG_ID="game-log-text"
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
        return;
   }
    window.hasRun = true;


    let players =
        [

        ]


    browser.runtime.onMessage.addListener((message) =>
    {
        if( message.command == "reload"  )
            init()
        if( message.command == "toggle"  )
            toggleHide()
    })


    var isInjected = false
    var contentPanel = null

    function init()
    {
        buildContentPanel()
        removeAds()
        initGameLog()
        injectEventListeners()


        console.log("Colonist Buster Loaded")
    }

    function injectEventListeners()
    {
        document.getElementById(gameLogId).addEventListener("DOMNodeInserted", onGameLogChanged)
    }
    function removeAds()
    {
        document.getElementById("in-game-ad-left").remove()
        document.getElementById("in-game-ad-right").remove()
    }

    function toggleHide()
    {

        isInjected = !isInjected
        if(isInjected === true)
        {
            document.body.prepend(contentPanel);
        }
        else
        {
            contentPanel.remove();
        }

        browser.runtime.sendMessage({
            command: "toggled",
            state : isInjected
          });
    }


    function initGameLog()
    {
        let g = document.getElementById(GAME_LOG_ID)

        for(let i = 0; i < g.children.length; i++)
        {
            extractInfoFromPost(g.children[i])
        }
    }

    function extractInfoFromPost(post)
    {
        //Check if one child is img
        if( post.children.length  )
        {
            for(let i = 0; i < post.children.length; i++)
            {
                if( post.children[i].tagName === "img")
                    return post.children[i]
            }

        }
    }

    function onGameLogChanged(evt)
    {
        console.log("yes" + evt)
    }

    function buildContentPanel()
    {
        contentPanel = document.createElement("div")
        contentPanel.id = "cb_content_panel"
        contentPanel.style.position = "absolute"
        contentPanel.innerHTML = "Hallo Welt. Injected"
    }

    init()
})();
