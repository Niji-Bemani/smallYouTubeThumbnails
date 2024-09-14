// ==UserScript==
// @name         Small Thumbnails
// @namespace    http://tampermonkey.net/
// @version      2024-09-14
// @description  Reduce the size of YouTube thumbnails
// @author       Niji Bemani
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Clean elements
    const clean = function() {
        $('ytd-thumbnail').css('max-width', 0);
        $('ytd-playlist-renderer').css('max-width', '50%');
        $('ytd-radio-renderer').css('max-width', '50%');
        //$('ytd-playlist-renderer').hide();
        //$('ytd-radio-renderer').hide();
    };

    // Add a MutationObserver on #contents element
    const initObserver = function() {
        // Select the node that will be observed for mutations
        const targetNode = document.getElementById("contents");

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            // Execute a clean if any of below elements are found in added nodes
            const targetElements = ["YTD-THUMBNAIL", "YTD-PLAYLIST", "YTD-RADIO"];

            // Loop through added nodes
            let shouldClean = false;
            for (const mutation of mutationList) {
                if (mutation.type === "childList" && mutation.addedNodes.length) {
                    [].every.call(mutation.addedNodes, function(elm){
                        if (targetElements.some(name => elm.nodeName.includes(name))) {
                            shouldClean = true;
                            return false;
                        }
                    });
                }
                if (shouldClean) {
                    clean();
                    break;
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing
        observer.observe(targetNode,{
            attributes: true, childList: true, subtree: true
        });
    };

    // Clean at the begining, then for future elements
    $(document).ready(function() {
        setTimeout(function(){
            clean();
            initObserver();
        }, 100);
    });
})();
