// ==UserScript==
// @name         Small YouTube Thumbnails
// @namespace    http://tampermonkey.net/
// @version      2024-09-15
// @description  Reduce the size of YouTube thumbnails
// @author       Niji Bemani
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @licence      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Minimize all thumbnails
    const minimizeThumbnails = function() {
        document.querySelectorAll('ytd-thumbnail, ytd-playlist-thumbnail, ytd-channel-renderer #avatar-section')
            .forEach(node => {node.style.maxWidth = 0});
    };

    // Add a MutationObserver on #contents element
    const startObserver = function() {
        // Select the node that will be observed for mutations
        const targetNode = document.querySelector("ytd-app");

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            // Minimize thumbnails if any of below elements are found in added nodes
            const targetElements = ["YTD-VIDEO", "YTD-PLAYLIST", "YTD-CHANNEL", "YTD-RADIO"];

            // Loop through added nodes
            for (const mutation of mutationList) {
                if (mutation.type === "childList" && mutation.addedNodes.length) {
                    for (let index = 0; index < mutation.addedNodes.length; index++) {
                        if (targetElements.some(targetName => mutation.addedNodes.item(index).nodeName.includes(targetName))) {
                            return minimizeThumbnails();
                        }
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Set observer to target node
        observer.observe(targetNode,{
            attributes: true, childList: true, subtree: true
        });
    };

    // Start observer
    setTimeout(function(){
        startObserver();
    }, 100);
})();
