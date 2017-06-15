import moment from 'moment-timezone'
import EveryDay from '../everyDay'
import marketTime from './marketTime'
import Config from '../../config'
import sqlstr from '../sqlStr'
import singleton from '../singleton'
const { mainDB, redisClient } = singleton
class Competition extends EveryDay {
    constructor() {
        this.name = "Competition"
        this.lastRun = null
        this.todayIsDone = null
    }
    checkAndRun(now) {
        this.checkTodayIsDone(now)
        if (this.todayIsDone) return false
        switch (now.getDay()) {
            case 1:
                if (marketTime.us) {
                    this.startCompetition()
                    this.lastRun = now
                    this.todayIsDone = true
                    return true
                }
                break;
            case 6:
                if (!marketTime.us) {
                    this.endCompetition()
                    this.lastRun = now
                    this.todayIsDone = true
                    return true
                }

            default:
                mainDB.query("CALL PRC_WF_TEAM_RANK()")
        }
        return false
    }
    startCompetition() {
        mainDB.query("update wf_competition_apply set State=4 where State<>4")
    }
    endCompetition() {
        mainDB.query("update wf_competition_team set Status=2 where Status=1")
    }
    run() {
        if (now.getDay() == 1) {
            this.startCompetition()
        } else if (now.getDay() == 6) {
            this.endCompetition()
        }
    }
}
export default new Competition()