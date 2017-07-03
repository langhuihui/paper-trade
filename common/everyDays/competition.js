import moment from 'moment-timezone'
import EveryDay from '../everyDay'
import marketTime from './marketTime'
import Config from '../../config'
import sqlstr from '../sqlStr'
import singleton from '../singleton'
const { mainDB, redisClient } = singleton
class Competition extends EveryDay {
    constructor() {
        super(null, null)
        this.checkRange()
    }
    checkRange() {
        redisClient.get("teamCompetitionTimetable", result => {
            this.range = result ? result.split(',').map(x => new Date(x)) : null
        })
        mainDB.query("select * from wf_competition_record order by Id desc limit 1", { type: "SELECT" }).then(result => {
            this.currentCompetition = result[0]
        })
    }

    checkAndRun(now) {
        this.checkTodayIsDone(now)
        if (this.todayIsDone) return false
        if (this.currentCompetition) {
            if (now < new Date(this.currentCompetition.StartTime)) {
                //比赛前不做任何处理
                return false
            }
        } else {
            //没有任何比赛，不做处理
            return false
        }
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
        mainDB.query("update wf_competition_team_member set Status=0")
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