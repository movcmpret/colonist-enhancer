// SPDX-License-Identifier: MIT

// Icons: Copyright "Pixel perfect" // flaticon.com
// Knight Icon: Copyright "Freeplk" // flaticon.com

const hidePage = `body > :not(#cb-content-panel) {
                    display: none;
                  }`;

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
    document.addEventListener("click", (e) => {


        if (e.target.id === "reloadButton")
            browser.tabs.query({active: true, currentWindow: true})
                .then((tabs) => {
                    browser.tabs.sendMessage(tabs[0].id, {
                        command: "reload",
                    });
                })

        if (e.target.id === "hideToggleButton")
            browser.tabs.query({active: true, currentWindow: true})
                .then((tabs) => {
                    browser.tabs.sendMessage(tabs[0].id, {
                        command: "toggle",
                    });
                })
    })
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  //  document.querySelector("#popup-content").classList.add("hidden");
  //  document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute colonist enhancer content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */

browser.runtime.onMessage.addListener((message) =>
{
    if( message.command == "toggled"  )
    {
        let btn =  document.querySelector("#hideToggleButton")
        if(message.state)
        {
            btn.className=("btn btn-danger mb-2")
            btn.innerHTML = "Hide"
        }
        else
        {
            btn.className=("btn btn-primary mb-2")
            btn.innerHTML = "Show"
        }

    }

})


function initContent(){
browser.tabs.executeScript({file: "/content_scripts/main.js"})
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
}

initContent()
