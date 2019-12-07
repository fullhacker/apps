import { LeaderBoardService } from '../services/leader-board.service.js';

const leaderBoard = new LeaderBoardService('mw-leaders', 'mw-all');

window.updateLeaders = () => {
    leaderBoard.updateTimeStampsLeaders();
}