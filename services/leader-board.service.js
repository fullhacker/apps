import { DatabaseService } from "./db.service.js";
import { TimerService } from "./timer.service.js";
import { UserService } from "./user.service.js";
import { LoadingService } from "./loading/loading.js";

const dbService = new DatabaseService();
const timerService = new TimerService();
const loadingService = new LoadingService();
const db = dbService.store;
const user = new UserService();
let previousLevel;


export class LeaderBoardService {
    constructor(leaders, all) {
        this.leaders = db.collection(leaders);
        this.all = db.collection(all);
    }

    updateTimeStampsLeaders() {
        const levels = ['beginner', 'intermediate', 'expert'];

        levels.forEach(level => {
            const collection = this.leaders.doc(level).collection('games');
            collection.get()
                .then(res => {
                    const levelArray = res.docs.map(doc => ({id: doc.id, ...doc.data()}))
                    // console.log(level+": ", levelArray);

                    levelArray.forEach(leaderGame => {
                        // const leaderGame = levelArray[0];
                        const leaderTime = leaderGame.time;
                        const browser = leaderGame.browserId;
                        this.all.doc(browser).collection('games')
                            .get().then(games => {
                                const allGames = games.docs.map(doc => ({id: doc.id, games: {...doc.data()}}));
                                console.log(level + '...........' + browser);
                                allGames.forEach(day => {
                                    const keys = Object.keys(day.games);
                                    const winningKeys = keys.filter(key => day.games[key].status === 'win');
                                    winningKeys.forEach(key => {
                                        const game = day.games[key];
                                        const dateString = [day.id, key].join(' ').replace(/_/g, ' ');
                                        const newGame = {time_stamp: new Date(dateString), ...leaderGame};
                                        if (game.time === leaderTime) {
                                            console.log('updated', newGame);
                                            // collection.doc(leaderGame.id).get().then(res => console.log(res.data()));
                                            collection.doc(leaderGame.id).set(newGame);
                                        }
                                    })
                                });
                            });
                    })
                });
        })
    }

    update(level, displayElement, title) {
        if (level !== previousLevel) {
            loadingService.addLoading(displayElement);
            previousLevel = level;
            if (this.unsubscribe) {
                this.unsubscribe();
            }
            this.lastPlace = Number.MAX_SAFE_INTEGER;
            this.topList = this.leaders.doc(level)
                .collection('games').orderBy('time').limit(10);
            this.unsubscribe = this.setListener(this.topList, displayElement, title);
        }

    }

    renderList(displayElement, title, docs) {
        if (!displayElement) return;

        displayElement.innerHTML = '';
        const leaderHeading = document.createElement('h3');
        leaderHeading.innerText = title;
        leaderHeading.style.borderBottom = '1px solid #c0c0c0';
        leaderHeading.style.paddingBottom = '10px';


        displayElement.style.maxWidth = '270px';
        displayElement.style.margin = '0 auto';

        const leaderList = document.createElement('div');

        leaderList.innerHTML = '';
        leaderList.style.listStyle = 'none';
        leaderList.style.textAlign = 'left';
        leaderList.style.marginTop = '-15px';

        if (docs && docs.length) {
            let i = 1;
            docs.forEach(game => {
                if (game) {
                    const prettyTime = timerService.pretty(game.data().time);
                    const name = game.data().name || 'Anonymous';
                    const item = document.createElement('div');
                    item.style.display = 'flex';
                    const nameElement =document.createElement('div'); // `<span class="ellipsis" title="${name}">${name}</span>` ;
                    nameElement.innerHTML = name;
                    nameElement.setAttribute('title', name);
                    nameElement.style.textOverflow = 'ellipsis';
                    nameElement.style.whiteSpace = 'nowrap';
                    nameElement.style.overflow = 'hidden';
                    nameElement.style.padding = '0 5px';
                    nameElement.style.cursor = 'pointer';
                    nameElement.style.fontWeight = 'bold';
                    nameElement.style.fontStyle = 'italic';

                    const indexElement = document.createElement('div');
                    indexElement.innerText = `#${i++}`;
                    
                    const timeElement = document.createElement('div');
                    timeElement.innerText = prettyTime;

                    item.append(indexElement, nameElement, timeElement);
                    leaderList.append(item);
                }
            })
            if (docs.length >= 10) {
                this.lastPlace = docs[9].data().time;
            }

            displayElement.append(leaderHeading, leaderList);
        } else {
            const message = document.createElement('em');
            message.innerText = 'Be the first to the top!';
            displayElement.append(leaderHeading, message);
        }
    }

    setListener(collection, displayElement, title) {
        return collection.onSnapshot(list => this.renderList(displayElement, title, list.docs));
    }

    send(game, key) {
        const sessionId = new Date().toDateString().replace(/\s/g, '_');
        const gameId = new Date().toTimeString().replace(/\s/g, '_');
        const data = {};
        game = {
            time_stamp: new Date(),
            ...game
        }
        data[gameId] = game;
        this.all.doc(user.browserId).collection('games').doc(sessionId).set(data, {merge: true});

        if (game.status === 'win' && game[key] < this.lastPlace) {
            let name = window.prompt('Top performance! Enter your name:');
            if (!name) {
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
