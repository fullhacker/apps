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

    update(level, displayElement, title) {
        if (level) {
            if (this.unsubscribe) {
                this.unsubscribe();
            }
            this.lastPlace = Number.MAX_SAFE_INTEGER;
            this.topList = this.leaders.doc(level)
                .collection('games').orderBy('time');
            this.unsubscribe = this.setListener(this.topList, displayElement, title);
        }

    }

    setListener(collection, displayElement, title) {
        if (!displayElement) return;

        displayElement.innerHTML = '';
        const leaderHeading = document.createElement('h3');
        leaderHeading.innerText = title;
        leaderHeading.style.borderBottom = '1px solid #c0c0c0';
        leaderHeading.style.paddingBottom = '10px';

        const leaderList = document.createElement('ol');

        displayElement.style.maxWidth = '270px';
        displayElement.style.margin = '0 auto 30px';

        return collection.onSnapshot(list => {
            leaderList.innerHTML = '';
            leaderList.style.listStyle = 'none';
            leaderList.style.textAlign = 'left';
            leaderList.style.marginLeft = '-40px';
            leaderList.style.marginTop = '-15px';

            const docs = list.docs;
            if (docs && docs.length) {
                for (let i = 0; i < 10; i++) {
                    const game = docs[i];
                    if (game) {
                        const prettyTime = timerService.pretty(game.data().time);
                        const name = game.data().name || 'Anonymous';
                        const item = document.createElement('li');
                        item.innerHTML = `#${i+1}: <em>${name}</em> ${prettyTime}`;
                        leaderList.append(item);
                    }
                }
                if (list.docs.length >= 10) {
                    this.lastPlace = list.docs[9].data().time;
                }

                displayElement.append(leaderHeading, leaderList);
            }
        });

    }

    send(game, key) {
        if (game.status === 'win' && game[key] < this.lastPlace) {
            let name = window.prompt('Top performance! Enter your name:');
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