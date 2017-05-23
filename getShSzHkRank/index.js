import redis from 'redis'
import request from 'request-promise'
import Config from '../config'
import singleton from '../common/singleton'
import { dwUrls } from '../common/driveWealth'
import amqp from 'amqplib'
const { mainDB, redisClient } = singleton
var getShSzTimeout = 10000
var getHkTimeout = 10000
var HStockData = new Map()
var ShSzStockData = new Map()
const shszranka = "wf_shszsecurities_rank_a"
const shszrankb = "wf_shszsecurities_rank_b"
const hkranka = "wf_hksecurities_rank_a"
const hkrankb = "wf_hksecurities_rank_b"