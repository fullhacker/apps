import { DatabaseService } from "./db.service.js";
import { TimerService } from "./timer.service.js";
import { UserService } from "./user.service.js";

const dbService = new DatabaseService();
const timerService = new TimerService();
const db = dbService.store;
const user = new UserService();


export class LeaderBoardService {
    constructor(collectionName) {
        this.leaders = db.collection(collectionName);
    }

    update(level, displayElement) {
        if (level) {
            if (this.unsubscribe) {
                this.unsubscribe();
            }
            this.lastPlace = Number.MAX_SAFE_INTEGER;
            this.topList = this.leaders.doc(level)
                .collection('games').orderBy('time');
            this.unsubscribe = this.setListener(this.topList, displayElement);
        }
    }

    setListener(collection, displayElement) {
        if (!displayElement) return;
        return collection.onSnapshot(list => {
            displayElement.innerHTML = '';
            const docs = list.docs;
            if (docs && docs.length) {
                for (let i = 0; i < 10; i++) {
                    const game = docs[i];
                    if (game) {
                        const prettyTime = timerService.pretty(game.data().time);
                        const name = game.data().name || '';
                        const item = document.createElement('li');
                        item.innerText = `${name} - ${prettyTime}`;
                        displayElement.append(item);
                    }
                }
                if (list.docs.length >= 10) {
                    this.lastPlace = list.docs[9].data().time;
                }

            }
        });

    }

    send(game, key) {
        if (game.status === 'win' && game[key] < this.lastPlace) {
            let name = window.prompt('Enter your name:');
            if (name) {
                if (name.length > 10) {
                    name = `${name.slice(0, 10)}...`;
                }
            } else {
                name = 'Anonymous';
            }

            const newGame = {
                name,
                browserId: user.browserId,
                ...game
            }

            this.leaders.doc(game.level).collection('games').add(newGame);
        }
    }
}