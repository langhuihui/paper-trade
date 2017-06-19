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
        this.range = [new Date("2017-6-19 21:30:00"), new Date("2017-6-20 11:00:00")]
    }
    checkAndRun(now) {
        this.checkTodayIsDone(now)
        if (this.todayIsDone) return false
        if (this.range) {
            if (now.format("yyyy-MM-dd") == this.range[0].format("yyyy-MM-dd")) {
                if (now > this.range[0]) {
                    this.startCompetition()
                    this.lastRun = now
                    this.todayIsDone = true
                    return true
                }
            } else if (now.format("yyyy-MM-dd") == this.range[1].format("yyyy-MM-dd")) {
                if (now > this.range[1]) {
                    this.endCompetition()
                    this.lastRun = now
                    this.todayIsDone = true
                    return true
                }
            }
        } else
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
            }
        return false
    }
    startCompetition() {
        mainDB.query("update wf_competition_apply set State=4")
    }
    endCompetition() {
        mainDB.query("update wf_competition_team set Status=2")
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