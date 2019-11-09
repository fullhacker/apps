/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/

export const DialogService = function() {
    let isOpen = false;
    let isInitialized = false;

    const wrapper = document.createElement('div');
    wrapper.className = 'dialog-wrapper';

    const container = document.createElement('div');
    container.className = 'dialog-container';
    
    // add dialog wrapper and container elements
    this.initialize = function() {
        const bodyElement = document.getElementsByTagName('body')[0];
        wrapper.appendChild(container);
        bodyElement.appendChild(wrapper);
        isInitialized = true;
    }

    this.promptMessage = function(message) {
        isOpen = true;
    }

    this.closeDialog = function() {
        if (isOpen) {
        }
        isOpen = false;
    }

    this.isInitialized = function() {
        return isInitialized;
    }
}

