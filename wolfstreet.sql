/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50719
Source Host           : localhost:3306
Source Database       : wolfstreet

Target Server Type    : MYSQL
Target Server Version : 50719
File Encoding         : 65001

Date: 2017-12-17 11:00:55
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for wf_ad_focusmap
-- ----------------------------
DROP TABLE IF EXISTS `wf_ad_focusmap`;
CREATE TABLE `wf_ad_focusmap` (
  `FocusmapID` int(11) NOT NULL AUTO_INCREMENT COMMENT '焦点图',
  `ActionType` varchar(20) DEFAULT NULL COMMENT '动作类型',
  `ActionTarget` varchar(1024) DEFAULT NULL COMMENT '动作目标',
  `ImageUrl` varchar(1024) DEFAULT NULL COMMENT '图片地址',
  `Ordering` int(4) DEFAULT NULL COMMENT '排序',
  `Status` int(4) DEFAULT NULL COMMENT '焦点图状态',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Title` varchar(500) DEFAULT '',
  `ShareTitle` varchar(255) DEFAULT NULL COMMENT '分享的标题',
  `ShareContent` varchar(255) DEFAULT NULL COMMENT '分享的正文',
  `ShareImageUrl` varchar(1024) DEFAULT NULL COMMENT '分享的图片',
  PRIMARY KEY (`FocusmapID`)
) ENGINE=InnoDB AUTO_INCREMENT=169 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_ad_push
-- ----------------------------
DROP TABLE IF EXISTS `wf_ad_push`;
CREATE TABLE `wf_ad_push` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '应用间推送广告ID',
  `ActionType` varchar(20) DEFAULT NULL COMMENT '动作类型',
  `ActionTarget` varchar(1024) DEFAULT NULL COMMENT '动作目标',
  `ImageUrl` varchar(1024) DEFAULT NULL COMMENT '图片地址',
  `Ordering` int(4) DEFAULT '0' COMMENT '排序',
  `Status` int(4) DEFAULT '1' COMMENT '广告状态,0表示正常,1表示下架,2表示软删除',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Title` varchar(500) DEFAULT '',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_ad_startup
-- ----------------------------
DROP TABLE IF EXISTS `wf_ad_startup`;
CREATE TABLE `wf_ad_startup` (
  `StartupID` int(11) NOT NULL AUTO_INCREMENT COMMENT '启动图',
  `Title` varchar(500) DEFAULT NULL,
  `ActionType` varchar(20) DEFAULT NULL COMMENT '动作类型',
  `ActionTarget` varchar(1024) DEFAULT NULL COMMENT '动作目标',
  `ImageUrl` varchar(1024) DEFAULT NULL COMMENT '图片地址',
  `Ordering` int(4) DEFAULT NULL COMMENT '排序',
  `Status` int(4) DEFAULT NULL COMMENT '焦点图状态',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`StartupID`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_admin
-- ----------------------------
DROP TABLE IF EXISTS `wf_admin`;
CREATE TABLE `wf_admin` (
  `AdminID` int(11) NOT NULL AUTO_INCREMENT COMMENT '会员表',
  `UserName` varchar(50) DEFAULT NULL COMMENT '用户名',
  `AdminCode` varchar(20) NOT NULL COMMENT '会员号',
  `AdminPrivilege` int(11) NOT NULL COMMENT '角色',
  `LoginPwd` varchar(50) DEFAULT NULL COMMENT '登录密码',
  `Nickname` varchar(20) DEFAULT NULL COMMENT '昵称',
  `NicknamePinyin` varchar(255) DEFAULT NULL COMMENT '昵称拼音',
  `NicknameLetter` varchar(20) DEFAULT NULL COMMENT '昵称首字母',
  `Signature` varchar(200) DEFAULT NULL COMMENT '个性签名',
  `RealName` varchar(20) DEFAULT NULL COMMENT '真实姓名',
  `NamePinyin` varchar(255) DEFAULT NULL COMMENT '姓名拼音',
  `NameLetter` varchar(20) DEFAULT NULL COMMENT '姓名首字母',
  `Sex` varchar(10) DEFAULT NULL COMMENT '性别',
  `Constellation` varchar(20) DEFAULT NULL COMMENT '星座',
  `Mobile` varchar(20) DEFAULT NULL COMMENT '手机号（必须认证）',
  `Email` varchar(100) DEFAULT NULL COMMENT '邮箱（必须认证）',
  `Birthday` date DEFAULT NULL COMMENT '生日',
  `CreateTime` datetime DEFAULT NULL COMMENT '注册时间',
  `LastLoginTime` datetime DEFAULT NULL COMMENT '最后登录时间',
  `MemberCode` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`AdminID`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Table structure for wf_admin_auditrecord
-- ----------------------------
DROP TABLE IF EXISTS `wf_admin_auditrecord`;
CREATE TABLE `wf_admin_auditrecord` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `Type` varchar(1) DEFAULT NULL COMMENT '1是头像审核,2是直播封面审核,3是直播内容审核\n',
  `State` varchar(1) DEFAULT NULL COMMENT '状态,0为未通过,1为通过',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '会员编号',
  `RoomCode` varchar(20) DEFAULT NULL COMMENT '房间编号',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `AdminCode` varchar(20) DEFAULT NULL COMMENT '操作人号',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_admin_privilege
-- ----------------------------
DROP TABLE IF EXISTS `wf_admin_privilege`;
CREATE TABLE `wf_admin_privilege` (
  `PrivilegeID` int(11) NOT NULL AUTO_INCREMENT COMMENT '管理员特权表',
  `Name` varchar(50) DEFAULT NULL COMMENT '特权名称',
  `Privilege` text NOT NULL COMMENT '特权编号',
  PRIMARY KEY (`PrivilegeID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_analyse
-- ----------------------------
DROP TABLE IF EXISTS `wf_analyse`;
CREATE TABLE `wf_analyse` (
  `title` varchar(64) DEFAULT NULL,
  `content` varchar(10) DEFAULT NULL,
  `dtime` varchar(10) DEFAULT NULL,
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=3163 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_analyse_simp
-- ----------------------------
DROP TABLE IF EXISTS `wf_analyse_simp`;
CREATE TABLE `wf_analyse_simp` (
  `title` varchar(64) DEFAULT NULL,
  `content` varchar(10) DEFAULT NULL,
  `dtime` varchar(10) DEFAULT NULL,
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=1114 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_asset_bak
-- ----------------------------
DROP TABLE IF EXISTS `wf_asset_bak`;
CREATE TABLE `wf_asset_bak` (
  `AssetId` int(11) NOT NULL DEFAULT '0' COMMENT '资产表',
  `UserId` varchar(255) DEFAULT NULL COMMENT 'UserId',
  `AccountID` varchar(255) DEFAULT NULL COMMENT 'AccountID',
  `Balance` decimal(20,4) DEFAULT NULL COMMENT '余额',
  `MtmPL` decimal(20,4) DEFAULT NULL COMMENT '浮动盈亏',
  `Positions` decimal(20,4) DEFAULT NULL COMMENT '持仓金额',
  `TodayProfit` decimal(20,4) DEFAULT NULL,
  `TodayYield` decimal(20,4) DEFAULT '0.0000' COMMENT '日收益率',
  `WeekProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益,从周一到周五',
  `WeekYield` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益率',
  `MonthProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益',
  `MonthYield` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益率',
  `YearProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益',
  `YearYield` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益率',
  `TotalProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益',
  `TotalYield` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益率',
  `TotalAmount` decimal(20,4) DEFAULT NULL COMMENT '总金额',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '今日收益',
  `EndDate` date DEFAULT NULL COMMENT '截止日期',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=32243 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_asset_v_bak
-- ----------------------------
DROP TABLE IF EXISTS `wf_asset_v_bak`;
CREATE TABLE `wf_asset_v_bak` (
  `AssetId` int(11) NOT NULL DEFAULT '0' COMMENT '资产表虚拟表',
  `UserId` varchar(255) DEFAULT NULL COMMENT 'UserId',
  `AccountID` varchar(255) DEFAULT NULL COMMENT 'AccountID',
  `Balance` decimal(20,4) DEFAULT '0.0000' COMMENT '余额',
  `MtmPL` decimal(20,4) DEFAULT '0.0000' COMMENT '浮动盈亏',
  `Positions` decimal(20,4) DEFAULT '0.0000' COMMENT '持仓金额',
  `TodayProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '今日收益',
  `TodayYield` decimal(20,4) DEFAULT '0.0000' COMMENT '日收益率',
  `WeekProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益,从周一到周五',
  `WeekYield` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益率',
  `MonthProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益',
  `MonthYield` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益率',
  `YearProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益',
  `YearYield` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益率',
  `TotalProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益',
  `TotalYield` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益率',
  `TotalAmount` decimal(20,4) DEFAULT '0.0000' COMMENT '总金额',
  `MemberCode` varchar(20) DEFAULT NULL,
  `EndDate` date DEFAULT NULL COMMENT '截止日期',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=22195 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_base_school
-- ----------------------------
DROP TABLE IF EXISTS `wf_base_school`;
CREATE TABLE `wf_base_school` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '学校信息表',
  `SchoolName` varchar(64) DEFAULT NULL COMMENT '学校名称',
  `City` varchar(64) DEFAULT NULL COMMENT '城市',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2598 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_bbs_talk
-- ----------------------------
DROP TABLE IF EXISTS `wf_bbs_talk`;
CREATE TABLE `wf_bbs_talk` (
  `TaskID` int(11) NOT NULL AUTO_INCREMENT COMMENT '系统反馈表',
  `BusinessCode` varchar(50) DEFAULT NULL COMMENT '业务编码（关联其它业务编码）',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '反馈的用户',
  `Title` varchar(255) DEFAULT NULL COMMENT '反馈标题',
  `ImageUrl` varchar(1024) DEFAULT NULL,
  `Contents` text COMMENT '反馈内容',
  `Position` varchar(255) DEFAULT NULL COMMENT '位置（文本）',
  `ReadNumber` int(11) DEFAULT '0' COMMENT '阅读数',
  `ClickNumber` int(11) DEFAULT '0' COMMENT '点赞数',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `ShareNumber` int(11) DEFAULT NULL COMMENT '分享数',
  PRIMARY KEY (`TaskID`)
) ENGINE=InnoDB AUTO_INCREMENT=5369 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_bbs_talk_comment
-- ----------------------------
DROP TABLE IF EXISTS `wf_bbs_talk_comment`;
CREATE TABLE `wf_bbs_talk_comment` (
  `CommentID` bigint(20) NOT NULL AUTO_INCREMENT,
  `TalkID` int(10) DEFAULT NULL,
  `MemberCode` varchar(20) DEFAULT NULL,
  `Contents` varchar(500) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`CommentID`)
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_bbs_talk_good
-- ----------------------------
DROP TABLE IF EXISTS `wf_bbs_talk_good`;
CREATE TABLE `wf_bbs_talk_good` (
  `GoodID` bigint(20) NOT NULL AUTO_INCREMENT,
  `TalkID` int(20) DEFAULT NULL,
  `MemberCode` varchar(20) DEFAULT NULL,
  `Status` int(10) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`GoodID`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_books
-- ----------------------------
DROP TABLE IF EXISTS `wf_books`;
CREATE TABLE `wf_books` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `Code` varchar(50) DEFAULT NULL COMMENT '书籍编号',
  `BookName` varchar(64) DEFAULT NULL COMMENT '书名',
  `Author` varchar(64) DEFAULT NULL COMMENT '作者',
  `BookType` int(11) DEFAULT NULL COMMENT '书籍类型',
  `Details` varchar(1024) DEFAULT NULL COMMENT '文字说明',
  `Author_Intro` varchar(500) DEFAULT NULL COMMENT '作者简介',
  `Cover_Image` varchar(255) DEFAULT NULL COMMENT '封面图片',
  `HomePage_Image` varchar(255) DEFAULT NULL COMMENT '首页图片',
  `LikeCount` int(11) DEFAULT '0' COMMENT '点赞次数',
  `CommentCount` int(11) DEFAULT '0' COMMENT '评论次数',
  `Status` int(1) DEFAULT '1' COMMENT '状态 1:正常，0:删除',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_books_comment
-- ----------------------------
DROP TABLE IF EXISTS `wf_books_comment`;
CREATE TABLE `wf_books_comment` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `BookCode` varchar(50) DEFAULT NULL COMMENT '书籍表编号',
  `Content` varchar(500) DEFAULT NULL COMMENT '内容',
  `CreateUser` varchar(20) DEFAULT NULL COMMENT '创建人',
  `ParentID` int(11) DEFAULT NULL,
  `IsDelete` bit(1) DEFAULT b'0',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_books_likes
-- ----------------------------
DROP TABLE IF EXISTS `wf_books_likes`;
CREATE TABLE `wf_books_likes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `BookCode` varchar(50) DEFAULT NULL COMMENT '书籍表编号',
  `CreateUser` varchar(120) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_books_type
-- ----------------------------
DROP TABLE IF EXISTS `wf_books_type`;
CREATE TABLE `wf_books_type` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `TypeCode` int(11) DEFAULT NULL COMMENT '类型编号',
  `TypeName` varchar(50) DEFAULT NULL COMMENT '类型名称',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_choiceness
-- ----------------------------
DROP TABLE IF EXISTS `wf_choiceness`;
CREATE TABLE `wf_choiceness` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `Code` varchar(50) DEFAULT NULL COMMENT '精选编号',
  `Title` varchar(64) DEFAULT NULL COMMENT '标题',
  `Details` varchar(1024) DEFAULT NULL COMMENT '文字简介',
  `content` text COMMENT '内容',
  `CoverImage` varchar(255) DEFAULT NULL COMMENT '封面图片',
  `BannerImage` varchar(255) DEFAULT NULL COMMENT 'banner条图',
  `Provenance` varchar(255) DEFAULT NULL COMMENT '出处',
  `StocksCount` int(11) DEFAULT NULL COMMENT '股票数量',
  `Status` int(1) DEFAULT '1' COMMENT '状态 1:正常，0:删除',
  `State` int(1) DEFAULT '0' COMMENT '是否推荐 1:推荐，0:不推荐',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_choiceness_stock
-- ----------------------------
DROP TABLE IF EXISTS `wf_choiceness_stock`;
CREATE TABLE `wf_choiceness_stock` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `ChoiceCode` varchar(50) DEFAULT NULL COMMENT '精选编号',
  `SecuritiesNo` varchar(20) DEFAULT NULL COMMENT '股票代码',
  `SecuritiesName` varchar(50) DEFAULT NULL COMMENT '股票名称',
  `SecuritiesType` varchar(20) DEFAULT NULL COMMENT '股票类型',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1853 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_affiche
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_affiche`;
CREATE TABLE `wf_competition_affiche` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '比赛公告',
  `Title` varchar(255) DEFAULT NULL COMMENT '标题',
  `Content` text COMMENT '内容',
  `Type` tinyint(4) DEFAULT NULL COMMENT '公告类型:1公告,2战报,3资讯',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `State` tinyint(4) DEFAULT NULL COMMENT '状态（0:添加,1 待审核，9审核通过）',
  `ShowTime` datetime DEFAULT NULL COMMENT '展示时间',
  `AdminCode` varchar(20) DEFAULT NULL COMMENT '管理员编号',
  `CreateUser` varchar(20) DEFAULT NULL COMMENT '创建人',
  `SelectPicture` varchar(255) DEFAULT '/upload/2017/06/27/14985468154250.png' COMMENT '分享图片',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_competition_apply
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_apply`;
CREATE TABLE `wf_competition_apply` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '战队申请表',
  `TeamId` int(11) DEFAULT NULL COMMENT '战队编号',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '申请人',
  `State` tinyint(4) DEFAULT NULL COMMENT '状态:1申请,2通过,3拒绝',
  `CreateTime` datetime DEFAULT NULL COMMENT '申请时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=399 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_competition_banner
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_banner`;
CREATE TABLE `wf_competition_banner` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '赛区首页',
  `BannerImage` varchar(255) DEFAULT NULL COMMENT 'banner条图',
  `OriginalImage` varchar(255) DEFAULT NULL COMMENT '原始详情图',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '作者',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Status` int(1) DEFAULT '1' COMMENT '状态 1:正常，0:删除',
  `State` int(1) DEFAULT '0' COMMENT '是否首页展示 1:展示，0:不展示',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_code
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_code`;
CREATE TABLE `wf_competition_code` (
  `Code` int(11) DEFAULT NULL COMMENT '邀请码',
  `State` tinyint(4) DEFAULT NULL COMMENT '状态：1使用，0未使用',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=18001 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_competition_record
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_record`;
CREATE TABLE `wf_competition_record` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '比赛记录表',
  `Name` varchar(255) DEFAULT NULL,
  `RecordInfo` varchar(255) DEFAULT '' COMMENT '比赛说明',
  `Image` varchar(255) DEFAULT NULL,
  `OriginalImage` varchar(255) DEFAULT NULL COMMENT '原始详情图',
  `StartTime` datetime DEFAULT NULL COMMENT '开始时间',
  `EndTime` datetime DEFAULT NULL COMMENT '结束时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_report
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_report`;
CREATE TABLE `wf_competition_report` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '战报',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `Nickname` varchar(64) DEFAULT NULL COMMENT '昵称',
  `HeadImage` varchar(255) DEFAULT NULL COMMENT '头像',
  `RankValue` decimal(10,2) DEFAULT NULL COMMENT '总资产',
  `Defeat` decimal(10,4) DEFAULT NULL COMMENT '资产击败比例',
  `DealCnt` int(11) DEFAULT NULL COMMENT '交易次数',
  `DefeatTitle` varchar(64) DEFAULT NULL COMMENT '资产击败称号',
  `AmountTitle` varchar(64) DEFAULT NULL COMMENT '资产称号',
  `DealTitle` varchar(64) DEFAULT NULL COMMENT '交易次数称号',
  `LikeCnt` int(11) DEFAULT NULL COMMENT '点赞数',
  `CommentCnt` int(11) DEFAULT NULL COMMENT '评论数',
  `ConcernCnt` int(11) DEFAULT NULL COMMENT '关注度',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Period` int(11) DEFAULT NULL COMMENT '比赛周期',
  `MaxSecuritiesNo` varchar(20) DEFAULT NULL COMMENT '最高收益股票',
  `MaxSecuritiesName` varchar(64) DEFAULT NULL COMMENT '股票名称',
  `MaxYield` decimal(10,4) DEFAULT '0.0000' COMMENT '最大收益率',
  `MinSecuritiesNo` varchar(20) DEFAULT NULL COMMENT '最低收益股票代码',
  `MinSecuritiesName` varchar(64) DEFAULT NULL COMMENT '最低收益股票名称',
  `MinYield` decimal(10,4) DEFAULT '0.0000' COMMENT '最低收益',
  `TeamId` int(11) DEFAULT NULL COMMENT '战队Id',
  `TeamName` varchar(20) DEFAULT NULL COMMENT '战队名称',
  `TeamYield` decimal(10,4) DEFAULT NULL COMMENT '战队收益率',
  `WeekYield` decimal(10,4) DEFAULT NULL COMMENT '个人周收益',
  `TeamRank` int(11) DEFAULT NULL COMMENT '战队排行',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7366 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_report_bak
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_report_bak`;
CREATE TABLE `wf_competition_report_bak` (
  `Id` int(11) NOT NULL DEFAULT '0' COMMENT '战报',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `Nickname` varchar(64) DEFAULT NULL COMMENT '昵称',
  `HeadImage` varchar(255) DEFAULT NULL COMMENT '头像',
  `RankValue` decimal(10,2) DEFAULT NULL COMMENT '总资产',
  `Defeat` decimal(10,4) DEFAULT NULL COMMENT '资产击败比例',
  `DealCnt` int(11) DEFAULT NULL COMMENT '交易次数',
  `DefeatTitle` varchar(64) DEFAULT NULL COMMENT '资产击败称号',
  `AmountTitle` varchar(64) DEFAULT NULL COMMENT '资产称号',
  `DealTitle` varchar(64) DEFAULT NULL COMMENT '交易次数称号',
  `LikeCnt` int(11) DEFAULT NULL COMMENT '点赞数',
  `CommentCnt` int(11) DEFAULT NULL COMMENT '评论数',
  `ConcernCnt` int(11) DEFAULT NULL COMMENT '关注度',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Period` int(11) DEFAULT NULL COMMENT '比赛周期',
  `MaxSecuritiesNo` varchar(20) DEFAULT NULL COMMENT '最高收益股票',
  `MaxSecuritiesName` varchar(64) DEFAULT NULL COMMENT '股票名称',
  `MaxYield` decimal(10,4) DEFAULT NULL COMMENT '最大收益率',
  `MinSecuritiesNo` varchar(20) DEFAULT NULL COMMENT '最低收益股票代码',
  `MinSecuritiesName` varchar(64) DEFAULT NULL COMMENT '最低收益股票名称',
  `MinYield` decimal(10,4) DEFAULT NULL COMMENT '最低收益',
  `TeamId` int(11) DEFAULT NULL COMMENT '战队Id',
  `TeamName` varchar(20) DEFAULT NULL COMMENT '战队名称',
  `TeamYield` decimal(10,4) DEFAULT NULL COMMENT '战队收益率',
  `WeekYield` decimal(10,4) DEFAULT NULL COMMENT '个人周收益',
  `TeamRank` int(11) DEFAULT NULL COMMENT '战队排行',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=1038 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_report_temp
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_report_temp`;
CREATE TABLE `wf_competition_report_temp` (
  `Id` int(11) NOT NULL DEFAULT '0' COMMENT '战报',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `Nickname` varchar(64) DEFAULT NULL COMMENT '昵称',
  `HeadImage` varchar(255) DEFAULT NULL COMMENT '头像',
  `RankValue` decimal(10,2) DEFAULT NULL COMMENT '总资产',
  `Defeat` decimal(10,4) DEFAULT NULL COMMENT '资产击败比例',
  `DealCnt` int(11) DEFAULT NULL COMMENT '交易次数',
  `DefeatTitle` varchar(64) DEFAULT NULL COMMENT '资产击败称号',
  `AmountTitle` varchar(64) DEFAULT NULL COMMENT '资产称号',
  `DealTitle` varchar(64) DEFAULT NULL COMMENT '交易次数称号',
  `LikeCnt` int(11) DEFAULT NULL COMMENT '点赞数',
  `CommentCnt` int(11) DEFAULT NULL COMMENT '评论数',
  `ConcernCnt` int(11) DEFAULT NULL COMMENT '关注度',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Period` int(11) DEFAULT NULL COMMENT '比赛周期',
  `MaxSecuritiesNo` varchar(20) DEFAULT NULL COMMENT '最高收益股票',
  `MaxSecuritiesName` varchar(64) DEFAULT NULL COMMENT '股票名称',
  `MaxYield` decimal(10,4) DEFAULT NULL COMMENT '最大收益率',
  `MinSecuritiesNo` varchar(20) DEFAULT NULL COMMENT '最低收益股票代码',
  `MinSecuritiesName` varchar(64) DEFAULT NULL COMMENT '最低收益股票名称',
  `MinYield` decimal(10,4) DEFAULT NULL COMMENT '最低收益',
  `TeamId` int(11) DEFAULT NULL COMMENT '战队Id',
  `TeamName` varchar(20) DEFAULT NULL COMMENT '战队名称',
  `TeamYield` decimal(10,4) DEFAULT NULL COMMENT '战队收益率',
  `WeekYield` decimal(10,4) DEFAULT NULL COMMENT '个人周收益',
  `TeamRank` int(11) DEFAULT NULL COMMENT '战队排行',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=1038 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_statistics
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_statistics`;
CREATE TABLE `wf_competition_statistics` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '比赛期日活统计',
  `AppLoginNum` int(11) DEFAULT NULL COMMENT '登录人数',
  `DealNum` int(11) DEFAULT NULL COMMENT '交易人数',
  `DealLoginNum` int(11) DEFAULT NULL COMMENT '交易期登录人数',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `EndDate` date DEFAULT NULL COMMENT '统计时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_stock
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_stock`;
CREATE TABLE `wf_competition_stock` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '股票收益表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `SecuritiesNo` varchar(20) DEFAULT NULL COMMENT '股票编码',
  `BPrice` decimal(10,4) DEFAULT NULL COMMENT '买入价',
  `SPrice` decimal(10,4) DEFAULT NULL COMMENT '抛售价',
  `BCreateTime` datetime DEFAULT NULL COMMENT '买入时间',
  `SCreateTime` datetime DEFAULT NULL COMMENT '抛售时间',
  `Yield` decimal(10,4) DEFAULT NULL COMMENT '收益率',
  `Period` int(11) DEFAULT NULL COMMENT '比赛周期',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1552 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_team
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_team`;
CREATE TABLE `wf_competition_team` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '战队表',
  `TeamName` varchar(64) DEFAULT NULL COMMENT '战队名称',
  `Manifesto` varchar(64) DEFAULT NULL COMMENT '战队宣言',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '创建人',
  `Code` int(11) DEFAULT NULL COMMENT '验证码',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Status` tinyint(4) DEFAULT '0' COMMENT '状态：0创建;1正常;2解散',
  `MemberCount` tinyint(4) DEFAULT '1' COMMENT '人数',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=10153 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_team_20170703
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_team_20170703`;
CREATE TABLE `wf_competition_team_20170703` (
  `Id` int(11) NOT NULL DEFAULT '0' COMMENT '战队表',
  `TeamName` varchar(64) DEFAULT NULL COMMENT '战队名称',
  `Manifesto` varchar(64) DEFAULT NULL COMMENT '战队宣言',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '创建人',
  `Code` int(11) DEFAULT NULL COMMENT '验证码',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Status` tinyint(4) DEFAULT '0' COMMENT '状态：0创建;1正常;2解散',
  `MemberCount` tinyint(4) DEFAULT '1' COMMENT '人数',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_team_asset
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_team_asset`;
CREATE TABLE `wf_competition_team_asset` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '战队收益',
  `TeamId` int(11) DEFAULT NULL COMMENT '战队编号',
  `AvgYield` decimal(10,4) DEFAULT NULL COMMENT '平均周收益',
  `EndDate` date DEFAULT NULL COMMENT '统计日期',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1337 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_team_bak
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_team_bak`;
CREATE TABLE `wf_competition_team_bak` (
  `Id` int(11) NOT NULL DEFAULT '0' COMMENT '战队表',
  `TeamName` varchar(64) DEFAULT NULL COMMENT '战队名称',
  `Manifesto` varchar(64) DEFAULT NULL COMMENT '战队宣言',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '创建人',
  `Code` int(11) DEFAULT NULL COMMENT '验证码',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Status` tinyint(4) DEFAULT '0' COMMENT '状态：0创建;1正常;2解散',
  `MemberCount` tinyint(4) DEFAULT '1' COMMENT '人数',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_team_member
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_team_member`;
CREATE TABLE `wf_competition_team_member` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '战队人员表',
  `TeamId` int(11) DEFAULT NULL COMMENT '战队编号',
  `MemberCode` varchar(64) DEFAULT NULL COMMENT '会员编号',
  `Type` tinyint(4) DEFAULT NULL COMMENT '类型1.创建者;2.验证码;3.申请人',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Level` tinyint(4) DEFAULT NULL COMMENT '级别：1队长;2队员',
  `Status` tinyint(4) DEFAULT '1' COMMENT '状态：1正常，0是失效',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=404 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_team_member_20170703
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_team_member_20170703`;
CREATE TABLE `wf_competition_team_member_20170703` (
  `Id` int(11) NOT NULL DEFAULT '0' COMMENT '战队人员表',
  `TeamId` int(11) DEFAULT NULL COMMENT '战队编号',
  `MemberCode` varchar(64) DEFAULT NULL COMMENT '会员编号',
  `Type` tinyint(4) DEFAULT NULL COMMENT '类型1.创建者;2.验证码;3.申请人',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Level` tinyint(4) DEFAULT NULL COMMENT '级别：1队长;2队员',
  `Status` tinyint(4) DEFAULT '1' COMMENT '状态：1正常，0是失效',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_team_member_bak
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_team_member_bak`;
CREATE TABLE `wf_competition_team_member_bak` (
  `Id` int(11) NOT NULL DEFAULT '0' COMMENT '战队人员表',
  `TeamId` int(11) DEFAULT NULL COMMENT '战队编号',
  `MemberCode` varchar(64) DEFAULT NULL COMMENT '会员编号',
  `Type` tinyint(4) DEFAULT NULL COMMENT '类型1.创建者;2.验证码;3.申请人',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Level` tinyint(4) DEFAULT NULL COMMENT '级别：1队长;2队员',
  `Status` tinyint(4) DEFAULT '1' COMMENT '状态：1正常，0是失效',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_team_rank
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_team_rank`;
CREATE TABLE `wf_competition_team_rank` (
  `RankId` int(11) NOT NULL AUTO_INCREMENT COMMENT '排行表',
  `TeamId` int(11) DEFAULT NULL COMMENT '战队编号',
  `RankValue` decimal(10,2) DEFAULT '0.00' COMMENT '总收益or总资产',
  `Rank` int(11) DEFAULT '0' COMMENT '排行',
  `Type` tinyint(4) DEFAULT NULL COMMENT '统计类型:1日收益、2日收益率、3周收益、4周收益率、5月收益、6月收益率、7年收益、8年收益率、9总收益、10总收益率、11总资产',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `Defeat` decimal(10,4) DEFAULT NULL COMMENT '击败百分比',
  PRIMARY KEY (`RankId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_team_yield
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_team_yield`;
CREATE TABLE `wf_competition_team_yield` (
  `TeamId` int(11) DEFAULT NULL COMMENT '战队编号',
  `AvgYield` decimal(46,8) DEFAULT NULL COMMENT '平均周收益',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_competition_title
-- ----------------------------
DROP TABLE IF EXISTS `wf_competition_title`;
CREATE TABLE `wf_competition_title` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '称号表',
  `TitleType` tinyint(4) DEFAULT NULL COMMENT '称号类型',
  `TitleName` varchar(255) DEFAULT NULL COMMENT '称号',
  `StartValue` int(11) DEFAULT NULL COMMENT '开始值',
  `EndValue` int(11) DEFAULT NULL COMMENT '结束值',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_dissertation_list
-- ----------------------------
DROP TABLE IF EXISTS `wf_dissertation_list`;
CREATE TABLE `wf_dissertation_list` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `Code` varchar(50) DEFAULT NULL COMMENT '专题编号',
  `NVCode` varchar(50) DEFAULT NULL COMMENT '资讯or视频ID',
  `Type` int(1) DEFAULT NULL COMMENT '类型 1:资讯，2:视频',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=346 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_dissertation_type
-- ----------------------------
DROP TABLE IF EXISTS `wf_dissertation_type`;
CREATE TABLE `wf_dissertation_type` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `Code` varchar(50) DEFAULT NULL COMMENT '专题编号',
  `Title` varchar(64) DEFAULT NULL COMMENT '主标题',
  `Subhead` varchar(64) DEFAULT NULL COMMENT '副标题',
  `Details` varchar(500) DEFAULT NULL COMMENT '文字介绍',
  `HomePage_Image` varchar(255) DEFAULT NULL COMMENT '首页图片',
  `Cover_Image` varchar(255) DEFAULT NULL COMMENT '封面图片',
  `Status` int(1) DEFAULT '1' COMMENT '状态 1:正常，0:删除',
  `State` int(1) DEFAULT '0' COMMENT '是否首页展示 1:展示，0:不展示',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_account
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_account`;
CREATE TABLE `wf_drivewealth_account` (
  `AccountId` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '真实账户',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '会员号',
  `UserId` varchar(50) DEFAULT NULL COMMENT '用户 ID',
  `ownershipType` varchar(20) DEFAULT NULL COMMENT '账户类型',
  `emailAddress1` varchar(100) DEFAULT NULL COMMENT '邮箱地址1',
  `emailAddress2` varchar(100) DEFAULT NULL COMMENT '邮箱地址2',
  `firstName` varchar(50) DEFAULT NULL COMMENT '名',
  `lastName` varchar(50) DEFAULT NULL COMMENT '姓',
  `username` varchar(100) DEFAULT NULL COMMENT '用户名。',
  `password` varchar(100) DEFAULT NULL COMMENT '密码。要求：至少 8 个字符，少于 90 个字符，至少 1 个数字，至少 1 个字母。',
  `gender` varchar(10) DEFAULT NULL COMMENT '性别',
  `languageID` varchar(50) DEFAULT NULL COMMENT '语言选项: "en_US" （默认）， "zh_CN", "es_ES", "pt_BR" 或 "ja_JP"',
  `phoneHome` varchar(50) DEFAULT NULL COMMENT '家庭电话',
  `phoneWork` varchar(50) DEFAULT NULL COMMENT '工作电话',
  `phoneMobile` varchar(100) DEFAULT NULL COMMENT '电话',
  `addressLine1` varchar(100) DEFAULT NULL COMMENT '地址1',
  `addressLine2` varchar(50) DEFAULT NULL COMMENT '地址2',
  `city` varchar(50) DEFAULT NULL COMMENT '城市',
  `countryID` varchar(50) DEFAULT NULL COMMENT '3个字符的国家代码。按照 ISO 3166-1 格式.\r\n            ',
  `stateProvince` varchar(50) DEFAULT NULL COMMENT '国家/省',
  `wlpID` varchar(20) DEFAULT NULL COMMENT 'WLPID。注：默认为 "DW".',
  `zipPostalCode` varchar(10) DEFAULT NULL COMMENT '邮编/邮政编码',
  `dob` varchar(20) DEFAULT NULL COMMENT '生日要求：要求“年年年年 - 月月 - 日日”的格式。必须满 18 岁以上。',
  `maritalStatus` varchar(20) DEFAULT NULL COMMENT '婚姻状况选: "Single", "Divorced", "Married" 或 "Widowed".',
  `idNo` varchar(50) DEFAULT NULL COMMENT 'SSN, TaxID, or National ID Number (non-USA)',
  `usCitizen` bit(1) DEFAULT NULL COMMENT '美国公民或者永久居住权',
  `referralCode` varchar(50) DEFAULT NULL COMMENT '推荐这个新投资人的投资人推荐编号',
  `tradingType` varchar(50) DEFAULT NULL COMMENT '交易类型选项: C 为现金账户（默认）和 M 为保证金账户',
  `citizenship` varchar(50) DEFAULT NULL COMMENT '国家居民，使用3个字符的国家代码。按照 ISO 3166-1 格式.',
  `utm_campaign` varchar(50) DEFAULT NULL COMMENT '该广告活动的名称、口号、推广代码等。',
  `utm_content` varchar(1024) DEFAULT NULL COMMENT '用以区分相似的内容或在同一则广告内的链接。',
  `utm_medium` varchar(50) DEFAULT NULL COMMENT '广告或营销媒介。',
  `utm_source` varchar(50) DEFAULT NULL COMMENT '识别广告投放人、网站、发布等。',
  `utm_term` varchar(50) DEFAULT NULL COMMENT '识别付费的搜索关键词。',
  `employerBusiness` varchar(50) DEFAULT NULL COMMENT '雇主业务类型选项',
  `employerCompany` varchar(100) DEFAULT NULL COMMENT '雇主公司名称',
  `employerAddressLine1` varchar(100) DEFAULT NULL COMMENT '雇主地址1',
  `employerAddressLine2` varchar(100) DEFAULT NULL COMMENT '雇主地址2',
  `employerCity` varchar(50) DEFAULT NULL COMMENT '雇主城市',
  `employerStateProvince` varchar(50) DEFAULT NULL COMMENT '雇主国家/省',
  `employerZipPostalCode` varchar(10) DEFAULT NULL COMMENT '雇主邮编/邮政代码',
  `employerCountryID` varchar(50) DEFAULT NULL COMMENT '雇主城市，使用3个字符的国家代码。按照 ISO 3166-1 格式',
  `employerIsBroker` bit(1) DEFAULT NULL COMMENT 'Is user affiliated with stock exchange, FINRA or broker dealer?',
  `employmentPosition` varchar(20) DEFAULT NULL COMMENT '职业',
  `employmentStatus` varchar(20) DEFAULT NULL COMMENT '雇佣状态选项',
  `employmentYears` int(11) DEFAULT NULL COMMENT '工作时长',
  `annualIncome` varchar(50) DEFAULT NULL COMMENT '年收入选项',
  `investmentObjectives` varchar(50) DEFAULT NULL COMMENT '投资目标选项',
  `investmentExperience` varchar(50) DEFAULT NULL COMMENT '投资经历选项',
  `networthLiquid` varchar(50) DEFAULT NULL COMMENT '流动资产净值选项',
  `networthTotal` varchar(5) DEFAULT NULL COMMENT '总净值选项',
  `director` bit(1) DEFAULT NULL COMMENT '您是上市公司的董事或管理人员吗？',
  `directorOf` varchar(10) DEFAULT NULL COMMENT '如果回答“是”（或“对”） director 然后问：官方问题：如果是，请列出公司名称和它的股票代码。',
  `politicallyExposed` bit(1) DEFAULT NULL COMMENT '政治人物或政府官员？官方问题',
  `politicallyExposedNames` varchar(10) DEFAULT NULL COMMENT '如果回答“是”（或“对”） politicallyExposed 然后问',
  `riskTolerance` varchar(50) DEFAULT NULL COMMENT '风险忍受力选项: "Conservative", "Moderate" 或 "Aggressive".',
  `disclosureAck` bit(1) DEFAULT NULL COMMENT '所有的信息披露和确认。',
  `disclosureRule14b` bit(1) DEFAULT NULL COMMENT '披露规则14b-1（C）。官方文本:',
  `ackCustomerAgreement` bit(1) DEFAULT NULL COMMENT '承认 DriveWealth’s 客户账户协议官方链接: 英语, 中文, 西班牙语 and 葡萄牙语.',
  `ackSweep` bit(1) DEFAULT NULL,
  `ackFindersFee` bit(1) DEFAULT NULL COMMENT 'finders费用确认注只在用户不是美国公民并且被推荐到DriveWealth的情况下需要',
  `ackForeignFindersFee` bit(1) DEFAULT NULL COMMENT 'foreign finders费用确认注只在用户不是美国公民并且被推荐到DriveWealth的情况下需要\r\n            ',
  `ackMarketData` bit(1) DEFAULT NULL COMMENT '市场数据协议确认官方文本',
  `ackSignedBy` varchar(50) DEFAULT NULL COMMENT '电子签名注：用户必须输入全名',
  `ackMarginAgreementWhen` varchar(20) DEFAULT NULL COMMENT '注：使用UTC时间戳。',
  `ackSignedWhen` varchar(50) DEFAULT NULL COMMENT 'Timestamp of application submittal. 应用提交时间戳。注：使用UTC时间戳。',
  `accountMgmtType` int(11) DEFAULT NULL COMMENT 'Sets Account Management Type:? 0 - Self-Directed (Default)? 1 - Managed\r\n            ',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `ackSigned` varchar(50) DEFAULT NULL COMMENT '电子签名注：用户必须输入全名',
  PRIMARY KEY (`AccountId`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_account
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_account`;
CREATE TABLE `wf_drivewealth_practice_account` (
  `PracticeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '创建模拟账户',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `UserId` varchar(50) DEFAULT NULL COMMENT '用户ID',
  `emailAddress1` varchar(100) DEFAULT NULL COMMENT '电子邮箱。',
  `firstName` varchar(50) DEFAULT NULL COMMENT '名',
  `lastName` varchar(50) DEFAULT NULL COMMENT '姓',
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `password` varchar(100) DEFAULT NULL COMMENT '密码要求：至少 8 个字符，少于 90 个字符，至少 1 个数字，至少 1 个字母。',
  `languageID` varchar(50) DEFAULT NULL COMMENT '用户语言首选项选项: "en_US" （默认）， "zh_CN", "es_ES", "pt_BR", "ja_JP".',
  `tranAmount` int(11) DEFAULT NULL COMMENT '模拟账户入资金额。',
  `referralCode` varchar(50) DEFAULT NULL COMMENT '推荐了此用户的投资者的推荐代码。',
  `utm_campaign` varchar(50) DEFAULT NULL COMMENT '该广告活动的名称、口号、推广代码等。',
  `utm_content` varchar(50) DEFAULT NULL COMMENT '用以区分内容的版本。',
  `utm_medium` varchar(50) DEFAULT NULL COMMENT '广告或营销媒介。',
  `utm_source` varchar(50) DEFAULT NULL COMMENT '识别广告投放人、网站、发布等。',
  `utm_term` varchar(50) DEFAULT NULL COMMENT '识别付费的搜索关键词。',
  `wlpID` varchar(50) DEFAULT NULL COMMENT 'WLPID 注：默认为 "DW".\r\n  ',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `sessionKey` varchar(255) DEFAULT NULL COMMENT 'sessionKey',
  `accountID` varchar(255) DEFAULT NULL COMMENT 'accountID',
  `accountNo` varchar(255) DEFAULT NULL COMMENT 'accountNo',
  `IsActivate` bit(1) DEFAULT b'0' COMMENT '是否完成新手激活任务',
  PRIMARY KEY (`PracticeId`),
  UNIQUE KEY `idx_dw_paccount_code` (`MemberCode`)
) ENGINE=InnoDB AUTO_INCREMENT=7897 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_asset
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_asset`;
CREATE TABLE `wf_drivewealth_practice_asset` (
  `AssetId` int(11) NOT NULL AUTO_INCREMENT COMMENT '资产表',
  `UserId` varchar(255) DEFAULT NULL COMMENT 'UserId',
  `AccountID` varchar(255) DEFAULT NULL COMMENT 'AccountID',
  `Balance` decimal(20,4) DEFAULT NULL COMMENT '余额',
  `MtmPL` decimal(20,4) DEFAULT NULL COMMENT '浮动盈亏',
  `Positions` decimal(20,4) DEFAULT NULL COMMENT '持仓金额',
  `TodayProfit` decimal(20,4) DEFAULT NULL,
  `TodayYield` decimal(20,4) DEFAULT '0.0000' COMMENT '日收益率',
  `WeekProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益,从周一到周五',
  `WeekYield` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益率',
  `MonthProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益',
  `MonthYield` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益率',
  `YearProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益',
  `YearYield` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益率',
  `TotalProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益',
  `TotalYield` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益率',
  `TotalAmount` decimal(20,4) DEFAULT NULL COMMENT '总金额',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '今日收益',
  `EndDate` date DEFAULT NULL COMMENT '截止日期',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`AssetId`)
) ENGINE=InnoDB AUTO_INCREMENT=229702 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_asset_v
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_asset_v`;
CREATE TABLE `wf_drivewealth_practice_asset_v` (
  `AssetId` int(11) NOT NULL AUTO_INCREMENT COMMENT '资产表虚拟表',
  `UserId` varchar(255) DEFAULT NULL COMMENT 'UserId',
  `AccountID` varchar(255) DEFAULT NULL COMMENT 'AccountID',
  `Balance` decimal(20,4) DEFAULT '0.0000' COMMENT '余额',
  `MtmPL` decimal(20,4) DEFAULT '0.0000' COMMENT '浮动盈亏',
  `Positions` decimal(20,4) DEFAULT '0.0000' COMMENT '持仓金额',
  `TodayProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '今日收益',
  `TodayYield` decimal(20,4) DEFAULT '0.0000' COMMENT '日收益率',
  `WeekProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益,从周一到周五',
  `WeekYield` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益率',
  `MonthProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益',
  `MonthYield` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益率',
  `YearProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益',
  `YearYield` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益率',
  `TotalProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益',
  `TotalYield` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益率',
  `TotalAmount` decimal(20,4) DEFAULT '0.0000' COMMENT '总金额',
  `MemberCode` varchar(20) DEFAULT NULL,
  `EndDate` date DEFAULT NULL COMMENT '截止日期',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`AssetId`)
) ENGINE=InnoDB AUTO_INCREMENT=195304 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_asset_v20170703
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_asset_v20170703`;
CREATE TABLE `wf_drivewealth_practice_asset_v20170703` (
  `AssetId` int(11) NOT NULL DEFAULT '0' COMMENT '资产表虚拟表',
  `UserId` varchar(255) DEFAULT NULL COMMENT 'UserId',
  `AccountID` varchar(255) DEFAULT NULL COMMENT 'AccountID',
  `Balance` decimal(20,4) DEFAULT '0.0000' COMMENT '余额',
  `MtmPL` decimal(20,4) DEFAULT '0.0000' COMMENT '浮动盈亏',
  `Positions` decimal(20,4) DEFAULT '0.0000' COMMENT '持仓金额',
  `TodayProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '今日收益',
  `TodayYield` decimal(20,4) DEFAULT '0.0000' COMMENT '日收益率',
  `WeekProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益,从周一到周五',
  `WeekYield` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益率',
  `MonthProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益',
  `MonthYield` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益率',
  `YearProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益',
  `YearYield` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益率',
  `TotalProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益',
  `TotalYield` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益率',
  `TotalAmount` decimal(20,4) DEFAULT '0.0000' COMMENT '总金额',
  `MemberCode` varchar(20) DEFAULT NULL,
  `EndDate` date DEFAULT NULL COMMENT '截止日期',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=84445 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_asset_v20170708
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_asset_v20170708`;
CREATE TABLE `wf_drivewealth_practice_asset_v20170708` (
  `AssetId` int(11) NOT NULL DEFAULT '0' COMMENT '资产表虚拟表',
  `UserId` varchar(255) DEFAULT NULL COMMENT 'UserId',
  `AccountID` varchar(255) DEFAULT NULL COMMENT 'AccountID',
  `Balance` decimal(20,4) DEFAULT '0.0000' COMMENT '余额',
  `MtmPL` decimal(20,4) DEFAULT '0.0000' COMMENT '浮动盈亏',
  `Positions` decimal(20,4) DEFAULT '0.0000' COMMENT '持仓金额',
  `TodayProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '今日收益',
  `TodayYield` decimal(20,4) DEFAULT '0.0000' COMMENT '日收益率',
  `WeekProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益,从周一到周五',
  `WeekYield` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益率',
  `MonthProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益',
  `MonthYield` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益率',
  `YearProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益',
  `YearYield` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益率',
  `TotalProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益',
  `TotalYield` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益率',
  `TotalAmount` decimal(20,4) DEFAULT '0.0000' COMMENT '总金额',
  `MemberCode` varchar(20) DEFAULT NULL,
  `EndDate` date DEFAULT NULL COMMENT '截止日期',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=5102 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_asset20170708
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_asset20170708`;
CREATE TABLE `wf_drivewealth_practice_asset20170708` (
  `AssetId` int(11) NOT NULL DEFAULT '0' COMMENT '资产表',
  `UserId` varchar(255) DEFAULT NULL COMMENT 'UserId',
  `AccountID` varchar(255) DEFAULT NULL COMMENT 'AccountID',
  `Balance` decimal(20,4) DEFAULT NULL COMMENT '余额',
  `MtmPL` decimal(20,4) DEFAULT NULL COMMENT '浮动盈亏',
  `Positions` decimal(20,4) DEFAULT NULL COMMENT '持仓金额',
  `TodayProfit` decimal(20,4) DEFAULT NULL,
  `TodayYield` decimal(20,4) DEFAULT '0.0000' COMMENT '日收益率',
  `WeekProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益,从周一到周五',
  `WeekYield` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益率',
  `MonthProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益',
  `MonthYield` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益率',
  `YearProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益',
  `YearYield` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益率',
  `TotalProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益',
  `TotalYield` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益率',
  `TotalAmount` decimal(20,4) DEFAULT NULL COMMENT '总金额',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '今日收益',
  `EndDate` date DEFAULT NULL COMMENT '截止日期',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=140133 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_order
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_order`;
CREATE TABLE `wf_drivewealth_practice_order` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'DW模拟交易订单表',
  `AccountType` tinyint(4) DEFAULT NULL COMMENT '账户类型： "1" - 模拟 或 "2" - 真实。',
  `OrdNo` varchar(64) DEFAULT NULL COMMENT '订单编号',
  `MemberCode` varchar(20) DEFAULT '' COMMENT '沃夫号',
  `AccountNo` varchar(20) DEFAULT '' COMMENT 'DW模拟账号',
  `SecuritiesType` varchar(10) DEFAULT '' COMMENT '股票类型：us,hk,sh,sz',
  `SecuritiesNo` varchar(20) DEFAULT '' COMMENT '股票编号',
  `Price` decimal(20,4) DEFAULT '0.0000' COMMENT '价格',
  `OrderQty` decimal(20,4) DEFAULT '0.0000' COMMENT '股票数据量',
  `Side` char(1) DEFAULT '' COMMENT '交易类型：B买、S卖',
  `OrdType` tinyint(4) DEFAULT '1' COMMENT '订单类型：1市场订单、2限价订单、3止损订单',
  `ExecType` tinyint(4) DEFAULT '1' COMMENT '执行类型："0"- 新的，"1" - 部分成交，"2" - 成交，"4"- 取消，"8"- 拒绝。',
  `OrdStatus` tinyint(4) DEFAULT NULL COMMENT '订单状态："0"- 新的，"1"-部分成交，"2"-成交，"4"-取消，"8"- 拒绝',
  `CreateTime` datetime DEFAULT NULL COMMENT '订单时间',
  `TurnoverTime` datetime DEFAULT NULL COMMENT '成交时间',
  `PaperTrade` bit(1) DEFAULT b'1' COMMENT '标识是否为模拟交易,0表示不是,1表示是',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=68995 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_order_20170703
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_order_20170703`;
CREATE TABLE `wf_drivewealth_practice_order_20170703` (
  `Id` int(11) NOT NULL DEFAULT '0' COMMENT 'DW模拟交易订单表',
  `AccountType` tinyint(4) DEFAULT NULL COMMENT '账户类型： "1" - 模拟 或 "2" - 真实。',
  `OrdNo` varchar(64) DEFAULT NULL COMMENT '订单编号',
  `MemberCode` varchar(20) DEFAULT '' COMMENT '沃夫号',
  `AccountNo` varchar(20) DEFAULT '' COMMENT 'DW模拟账号',
  `SecuritiesType` varchar(10) DEFAULT '' COMMENT '股票类型：us,hk,sh,sz',
  `SecuritiesNo` varchar(20) DEFAULT '' COMMENT '股票编号',
  `Price` decimal(20,4) DEFAULT '0.0000' COMMENT '价格',
  `OrderQty` decimal(20,4) DEFAULT '0.0000' COMMENT '股票数据量',
  `Side` char(1) DEFAULT '' COMMENT '交易类型：B买、S卖',
  `OrdType` tinyint(4) DEFAULT '1' COMMENT '订单类型：1市场订单、2限价订单、3止损订单',
  `ExecType` tinyint(4) DEFAULT '1' COMMENT '执行类型："0"- 新的，"1" - 部分成交，"2" - 成交，"4"- 取消，"8"- 拒绝。',
  `OrdStatus` tinyint(4) DEFAULT NULL COMMENT '订单状态："0"- 新的，"1"-部分成交，"2"-成交，"4"-取消，"8"- 拒绝',
  `CreateTime` datetime DEFAULT NULL COMMENT '订单时间',
  `TurnoverTime` datetime DEFAULT NULL COMMENT '成交时间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=33187 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_order_bak
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_order_bak`;
CREATE TABLE `wf_drivewealth_practice_order_bak` (
  `Id` int(11) NOT NULL DEFAULT '0' COMMENT 'DW模拟交易订单表',
  `AccountType` tinyint(4) DEFAULT NULL COMMENT '账户类型： "1" - 模拟 或 "2" - 真实。',
  `OrdNo` varchar(64) DEFAULT NULL COMMENT '订单编号',
  `MemberCode` varchar(20) DEFAULT '' COMMENT '沃夫号',
  `AccountNo` varchar(20) DEFAULT '' COMMENT 'DW模拟账号',
  `SecuritiesType` varchar(10) DEFAULT '' COMMENT '股票类型：us,hk,sh,sz',
  `SecuritiesNo` varchar(20) DEFAULT '' COMMENT '股票编号',
  `Price` decimal(20,4) DEFAULT '0.0000' COMMENT '价格',
  `OrderQty` decimal(20,4) DEFAULT '0.0000' COMMENT '股票数据量',
  `Side` char(1) DEFAULT '' COMMENT '交易类型：B买、S卖',
  `OrdType` tinyint(4) DEFAULT '1' COMMENT '订单类型：1市场订单、2限价订单、3止损订单',
  `ExecType` tinyint(4) DEFAULT '1' COMMENT '执行类型："0"- 新的，"1" - 部分成交，"2" - 成交，"4"- 取消，"8"- 拒绝。',
  `OrdStatus` tinyint(4) DEFAULT NULL COMMENT '订单状态："0"- 新的，"1"-部分成交，"2"-成交，"4"-取消，"8"- 拒绝',
  `CreateTime` datetime DEFAULT NULL COMMENT '订单时间',
  `TurnoverTime` datetime DEFAULT NULL COMMENT '成交时间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=55575 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_position
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_position`;
CREATE TABLE `wf_drivewealth_practice_position` (
  `symbol` varchar(20) DEFAULT NULL COMMENT '股票代码',
  `userID` varchar(100) DEFAULT NULL,
  `accountID` varchar(100) DEFAULT NULL,
  `MemberCode` varchar(20) DEFAULT NULL,
  `instrumentID` varchar(100) DEFAULT NULL COMMENT '嘉维产品ID',
  `openQty` decimal(10,2) DEFAULT NULL COMMENT '拥有的股票数量',
  `costBasis` decimal(10,2) DEFAULT NULL COMMENT '头寸的成本',
  `marketValue` decimal(10,2) DEFAULT NULL COMMENT '头寸的当前市场价格',
  `side` varchar(5) DEFAULT NULL COMMENT '头寸的买卖："B"- 买或者"S"-卖',
  `priorClose` decimal(10,2) DEFAULT NULL COMMENT '此产品的收盘前价格。',
  `availableForTradingQty` decimal(10,2) DEFAULT NULL COMMENT '可售数量',
  `avgPrice` decimal(10,2) DEFAULT NULL COMMENT '头寸的平均价格',
  `mktPrice` decimal(10,2) DEFAULT NULL COMMENT '头寸的当前市场价格',
  `unrealizedPL` decimal(10,2) DEFAULT NULL COMMENT '未实现的头寸盈亏',
  `unrealizedDayPLPercent` decimal(10,2) DEFAULT NULL COMMENT '未实现的头寸一天盈亏百分比',
  `unrealizedDayPL` decimal(10,2) DEFAULT NULL COMMENT '未实现的头寸一天盈亏',
  `CreateTime` date DEFAULT NULL,
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=89319 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_position_20170703
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_position_20170703`;
CREATE TABLE `wf_drivewealth_practice_position_20170703` (
  `symbol` varchar(20) DEFAULT NULL COMMENT '股票代码',
  `userID` varchar(100) DEFAULT NULL,
  `accountID` varchar(100) DEFAULT NULL,
  `MemberCode` varchar(20) DEFAULT NULL,
  `instrumentID` varchar(100) DEFAULT NULL COMMENT '嘉维产品ID',
  `openQty` decimal(10,2) DEFAULT NULL COMMENT '拥有的股票数量',
  `costBasis` decimal(10,2) DEFAULT NULL COMMENT '头寸的成本',
  `marketValue` decimal(10,2) DEFAULT NULL COMMENT '头寸的当前市场价格',
  `side` varchar(5) DEFAULT NULL COMMENT '头寸的买卖："B"- 买或者"S"-卖',
  `priorClose` decimal(10,2) DEFAULT NULL COMMENT '此产品的收盘前价格。',
  `availableForTradingQty` decimal(10,2) DEFAULT NULL COMMENT '可售数量',
  `avgPrice` decimal(10,2) DEFAULT NULL COMMENT '头寸的平均价格',
  `mktPrice` decimal(10,2) DEFAULT NULL COMMENT '头寸的当前市场价格',
  `unrealizedPL` decimal(10,2) DEFAULT NULL COMMENT '未实现的头寸盈亏',
  `unrealizedDayPLPercent` decimal(10,2) DEFAULT NULL COMMENT '未实现的头寸一天盈亏百分比',
  `unrealizedDayPL` decimal(10,2) DEFAULT NULL COMMENT '未实现的头寸一天盈亏',
  `CreateTime` date DEFAULT NULL,
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=2073 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_rank
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_rank`;
CREATE TABLE `wf_drivewealth_practice_rank` (
  `RankId` int(11) NOT NULL AUTO_INCREMENT COMMENT '排行表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `RankValue` decimal(20,2) DEFAULT '0.00' COMMENT '总收益or总资产',
  `Rank` int(11) DEFAULT '0' COMMENT '排行',
  `Type` tinyint(4) DEFAULT NULL COMMENT '统计类型:1日收益、2日收益率、3周收益、4周收益率、5月收益、6月收益率、7年收益、8年收益率、9总收益、10总收益率、11总资产',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`RankId`)
) ENGINE=InnoDB AUTO_INCREMENT=44795 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_rank_v
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_rank_v`;
CREATE TABLE `wf_drivewealth_practice_rank_v` (
  `RankId` int(11) NOT NULL AUTO_INCREMENT COMMENT '排行表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `RankValue` decimal(20,2) DEFAULT '0.00' COMMENT '总收益or总资产',
  `Rank` int(11) DEFAULT '0' COMMENT '排行',
  `Type` tinyint(4) DEFAULT NULL COMMENT '统计类型:1日收益、2日收益率、3周收益、4周收益率、5月收益、6月收益率、7年收益、8年收益率、9总收益、10总收益率、11总资产',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `Defeat` decimal(10,4) DEFAULT NULL COMMENT '击败百分比',
  PRIMARY KEY (`RankId`)
) ENGINE=InnoDB AUTO_INCREMENT=13509 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_rank_v_20170609
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_rank_v_20170609`;
CREATE TABLE `wf_drivewealth_practice_rank_v_20170609` (
  `RankId` int(11) NOT NULL DEFAULT '0' COMMENT '排行表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `RankValue` decimal(20,2) DEFAULT '0.00' COMMENT '总收益or总资产',
  `Rank` int(11) DEFAULT '0' COMMENT '排行',
  `Type` tinyint(4) DEFAULT NULL COMMENT '统计类型:1日收益、2日收益率、3周收益、4周收益率、5月收益、6月收益率、7年收益、8年收益率、9总收益、10总收益率、11总资产',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=9725 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_practice_rank_v20170603
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_practice_rank_v20170603`;
CREATE TABLE `wf_drivewealth_practice_rank_v20170603` (
  `AssetId` int(11) NOT NULL DEFAULT '0' COMMENT '资产表虚拟表',
  `UserId` varchar(255) DEFAULT NULL COMMENT 'UserId',
  `AccountID` varchar(255) DEFAULT NULL COMMENT 'AccountID',
  `Balance` decimal(20,4) DEFAULT '0.0000' COMMENT '余额',
  `MtmPL` decimal(20,4) DEFAULT '0.0000' COMMENT '浮动盈亏',
  `Positions` decimal(20,4) DEFAULT '0.0000' COMMENT '持仓金额',
  `TodayProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '今日收益',
  `TodayYield` decimal(20,4) DEFAULT '0.0000' COMMENT '日收益率',
  `WeekProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益,从周一到周五',
  `WeekYield` decimal(20,4) DEFAULT '0.0000' COMMENT '周收益率',
  `MonthProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益',
  `MonthYield` decimal(20,4) DEFAULT '0.0000' COMMENT '月收益率',
  `YearProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益',
  `YearYield` decimal(20,4) DEFAULT '0.0000' COMMENT '年收益率',
  `TotalProfit` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益',
  `TotalYield` decimal(20,4) DEFAULT '0.0000' COMMENT '总收益率',
  `TotalAmount` decimal(20,4) DEFAULT '0.0000' COMMENT '总金额',
  `MemberCode` varchar(20) DEFAULT NULL,
  `EndDate` date DEFAULT NULL COMMENT '截止日期',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=38987 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_user
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_user`;
CREATE TABLE `wf_drivewealth_user` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '嘉维用户',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `userID` varchar(255) NOT NULL COMMENT 'userID',
  `username` varchar(255) DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `firstName` varchar(255) DEFAULT NULL COMMENT '名',
  `lastName` varchar(255) DEFAULT NULL COMMENT '姓',
  `emailAddress1` varchar(255) DEFAULT NULL COMMENT '电子邮箱',
  `languageID` varchar(255) DEFAULT NULL COMMENT '语言',
  `wlpID` varchar(255) DEFAULT NULL COMMENT 'WLP ID',
  `referralCode` varchar(255) DEFAULT NULL COMMENT '推荐这个新投资者的投资者推荐代码',
  `utm_campaign` varchar(255) DEFAULT NULL COMMENT 'UTM 活动代码，某产品单独活动名称，口号，促销代码等。',
  `utm_content` varchar(255) DEFAULT NULL COMMENT '用以区分相似的内容或在同一则广告内的链接。',
  `utm_medium` varchar(255) DEFAULT NULL COMMENT '广告或营销媒介，例如cpc，推荐人，电子邮件，Facebook。',
  `utm_source` varchar(255) DEFAULT NULL COMMENT '确认正发送通信流的广告客户、网站、出版物等，例如谷歌、Citysearch、newsletter4、billboard。',
  `utm_term` varchar(255) DEFAULT NULL COMMENT '识别付费的搜索关键词。',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_drivewealth_user20170710
-- ----------------------------
DROP TABLE IF EXISTS `wf_drivewealth_user20170710`;
CREATE TABLE `wf_drivewealth_user20170710` (
  `Id` int(11) NOT NULL DEFAULT '0' COMMENT '嘉维用户',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `userID` varchar(255) NOT NULL COMMENT 'userID',
  `username` varchar(255) DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `firstName` varchar(255) DEFAULT NULL COMMENT '名',
  `lastName` varchar(255) DEFAULT NULL COMMENT '姓',
  `emailAddress1` varchar(255) DEFAULT NULL COMMENT '电子邮箱',
  `languageID` varchar(255) DEFAULT NULL COMMENT '语言',
  `wlpID` varchar(255) DEFAULT NULL COMMENT 'WLP ID',
  `referralCode` varchar(255) DEFAULT NULL COMMENT '推荐这个新投资者的投资者推荐代码',
  `utm_campaign` varchar(255) DEFAULT NULL COMMENT 'UTM 活动代码，某产品单独活动名称，口号，促销代码等。',
  `utm_content` varchar(255) DEFAULT NULL COMMENT '用以区分相似的内容或在同一则广告内的链接。',
  `utm_medium` varchar(255) DEFAULT NULL COMMENT '广告或营销媒介，例如cpc，推荐人，电子邮件，Facebook。',
  `utm_source` varchar(255) DEFAULT NULL COMMENT '确认正发送通信流的广告客户、网站、出版物等，例如谷歌、Citysearch、newsletter4、billboard。',
  `utm_term` varchar(255) DEFAULT NULL COMMENT '识别付费的搜索关键词。',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_finance_in_out
-- ----------------------------
DROP TABLE IF EXISTS `wf_finance_in_out`;
CREATE TABLE `wf_finance_in_out` (
  `InoutID` int(11) NOT NULL AUTO_INCREMENT COMMENT '收支明细',
  `BusinessCode` varchar(255) DEFAULT NULL COMMENT '业务编号',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '所属人',
  `Type` varchar(20) DEFAULT NULL COMMENT '收支类型：支出out；收入in',
  `WolfDou` int(20) DEFAULT NULL COMMENT '沃夫券',
  `WolfCoins` decimal(20,2) DEFAULT NULL COMMENT '狼牙',
  `Amount` decimal(20,2) DEFAULT NULL COMMENT '金额',
  `Remark` varchar(1024) DEFAULT NULL COMMENT '备注',
  `Source` varchar(255) DEFAULT NULL COMMENT '来源',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`InoutID`)
) ENGINE=InnoDB AUTO_INCREMENT=569 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_finance_pay_order
-- ----------------------------
DROP TABLE IF EXISTS `wf_finance_pay_order`;
CREATE TABLE `wf_finance_pay_order` (
  `OrderID` bigint(11) NOT NULL AUTO_INCREMENT COMMENT '会员充值记录表',
  `OrderNo` varchar(50) DEFAULT NULL COMMENT '订单编号',
  `OrderType` varchar(20) DEFAULT NULL COMMENT '订单类型（充值、）',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '充值会员',
  `PayWay` varchar(20) DEFAULT NULL,
  `OrderSource` varchar(20) DEFAULT NULL COMMENT '订单来源',
  `PayAmount` decimal(10,2) DEFAULT NULL COMMENT '充值金额',
  `WolfDou` int(10) DEFAULT NULL COMMENT '充值的沃夫豆',
  `PayStatus` int(10) DEFAULT NULL COMMENT '充值状态',
  `VoucherNo` text,
  `Remark` varchar(255) DEFAULT NULL,
  `IsVerification` bit(1) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL COMMENT '充值时间',
  PRIMARY KEY (`OrderID`)
) ENGINE=InnoDB AUTO_INCREMENT=686 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_finance_withdrawals_account
-- ----------------------------
DROP TABLE IF EXISTS `wf_finance_withdrawals_account`;
CREATE TABLE `wf_finance_withdrawals_account` (
  `AccountID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '提现账号绑定表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '所属会员',
  `AccountType` varchar(20) DEFAULT NULL COMMENT '绑定的账号类型（alipay）',
  `Account` varchar(255) DEFAULT NULL COMMENT '账户',
  `RealName` varchar(20) DEFAULT NULL COMMENT '真实姓名',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`AccountID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_finance_withdrawals_apply
-- ----------------------------
DROP TABLE IF EXISTS `wf_finance_withdrawals_apply`;
CREATE TABLE `wf_finance_withdrawals_apply` (
  `ApplyID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '会员提现申请表',
  `ApplyNo` varchar(50) DEFAULT NULL COMMENT '申请编号',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '申请会员',
  `WolfCoins` decimal(10,2) DEFAULT NULL,
  `RMB` decimal(10,2) DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL COMMENT '申请金额',
  `ProcedureFee` decimal(10,2) DEFAULT NULL,
  `TaxFee` decimal(10,2) DEFAULT NULL,
  `AccountType` varchar(20) DEFAULT NULL,
  `Account` varchar(100) DEFAULT NULL,
  `RealName` varchar(20) DEFAULT NULL,
  `ApplyStatus` int(10) DEFAULT NULL,
  `PayStaff` varchar(20) DEFAULT NULL,
  `PayTime` datetime DEFAULT NULL,
  `AuditStaff` varchar(20) DEFAULT NULL,
  `AuditTime` datetime DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `AuditReason` text,
  PRIMARY KEY (`ApplyID`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_finance_withdrawals_log
-- ----------------------------
DROP TABLE IF EXISTS `wf_finance_withdrawals_log`;
CREATE TABLE `wf_finance_withdrawals_log` (
  `WithdrawCashID` int(11) NOT NULL AUTO_INCREMENT,
  `ApplyNo` varchar(20) DEFAULT NULL,
  `Operator` varchar(20) DEFAULT NULL,
  `OperationPurpose` varchar(100) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`WithdrawCashID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_finance_wolfcoins_conversion
-- ----------------------------
DROP TABLE IF EXISTS `wf_finance_wolfcoins_conversion`;
CREATE TABLE `wf_finance_wolfcoins_conversion` (
  `ConversionID` int(11) NOT NULL AUTO_INCREMENT COMMENT '沃夫币兑换沃夫豆表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '兑换的会员',
  `WolfCoins` decimal(10,2) DEFAULT NULL COMMENT '兑换沃夫币',
  `WolfDou` int(10) DEFAULT NULL COMMENT '兑换沃夫豆',
  `CreateTime` datetime DEFAULT NULL COMMENT '兑换时间',
  PRIMARY KEY (`ConversionID`)
) ENGINE=InnoDB AUTO_INCREMENT=257 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_finance_wolfdou
-- ----------------------------
DROP TABLE IF EXISTS `wf_finance_wolfdou`;
CREATE TABLE `wf_finance_wolfdou` (
  `WolfDouID` int(11) NOT NULL AUTO_INCREMENT,
  `ProductID` varchar(50) DEFAULT NULL,
  `WolfDou` int(10) DEFAULT NULL,
  `RMB` decimal(10,2) DEFAULT NULL,
  `Platform` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`WolfDouID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_game_guesspercent
-- ----------------------------
DROP TABLE IF EXISTS `wf_game_guesspercent`;
CREATE TABLE `wf_game_guesspercent` (
  `MemberCode` varchar(20) DEFAULT NULL,
  `WinPercent` int(10) DEFAULT NULL,
  `Percentage` int(10) DEFAULT NULL,
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=3155 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_game_guessstockhistory
-- ----------------------------
DROP TABLE IF EXISTS `wf_game_guessstockhistory`;
CREATE TABLE `wf_game_guessstockhistory` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增长主键ID',
  `GuessStockCode` varchar(20) DEFAULT NULL COMMENT '猜涨跌主表的编号',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `RoomCode` varchar(20) DEFAULT NULL COMMENT '直播间编号',
  `WolfDou` int(10) DEFAULT '0' COMMENT '沃夫豆',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `GuessResult` varchar(1) DEFAULT NULL COMMENT '竞猜值,0为跌,1为涨',
  `WxGuess` varchar(1) DEFAULT NULL COMMENT '标识通过微信小程序下的注,1表示是,0表示否',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_game_guessstockmain
-- ----------------------------
DROP TABLE IF EXISTS `wf_game_guessstockmain`;
CREATE TABLE `wf_game_guessstockmain` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主ID',
  `Code` varchar(20) DEFAULT '' COMMENT '唯一编码',
  `StartTime` datetime DEFAULT NULL COMMENT '开始时间',
  `EndTime` datetime DEFAULT NULL COMMENT '结束时间',
  `Result` varchar(1) DEFAULT '' COMMENT '涨跌,0是跌,1是涨',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_game_sendmoneyhistory
-- ----------------------------
DROP TABLE IF EXISTS `wf_game_sendmoneyhistory`;
CREATE TABLE `wf_game_sendmoneyhistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `GuessCode` varchar(20) DEFAULT NULL COMMENT '竞猜CODE',
  `WolfDou` int(11) DEFAULT '0' COMMENT '沃夫豆数',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_homepage
-- ----------------------------
DROP TABLE IF EXISTS `wf_homepage`;
CREATE TABLE `wf_homepage` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `Versions` int(11) DEFAULT NULL COMMENT '版本',
  `Page` int(11) DEFAULT NULL COMMENT '页数',
  `Content` text COMMENT '首页内容',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1784595 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_homepage_bak
-- ----------------------------
DROP TABLE IF EXISTS `wf_homepage_bak`;
CREATE TABLE `wf_homepage_bak` (
  `Id` int(11) NOT NULL DEFAULT '0' COMMENT 'ID',
  `Versions` int(11) DEFAULT NULL COMMENT '版本',
  `Page` int(11) DEFAULT NULL COMMENT '页数',
  `Content` text COMMENT '首页内容',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=2140 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_im_jpush
-- ----------------------------
DROP TABLE IF EXISTS `wf_im_jpush`;
CREATE TABLE `wf_im_jpush` (
  `JpushID` int(11) NOT NULL AUTO_INCREMENT,
  `MemberCode` varchar(10) DEFAULT NULL,
  `JpushRegID` varchar(50) DEFAULT NULL,
  `JpushIMEI` varchar(50) DEFAULT NULL,
  `JpushDeviceID` varchar(50) DEFAULT NULL,
  `JpushVersion` varchar(10) DEFAULT NULL,
  `JpushPlatform` varchar(10) DEFAULT NULL,
  `JpushLastLoginTime` datetime DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`JpushID`)
) ENGINE=InnoDB AUTO_INCREMENT=4626 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_imagetext
-- ----------------------------
DROP TABLE IF EXISTS `wf_imagetext`;
CREATE TABLE `wf_imagetext` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `Code` varchar(50) DEFAULT NULL COMMENT '图说编号',
  `Original_Image` varchar(255) DEFAULT NULL COMMENT '原始图片',
  `Details` varchar(1024) DEFAULT NULL COMMENT '文字介绍',
  `Thumbnail` varchar(255) DEFAULT NULL COMMENT '原始缩略图',
  `Composite_Image` varchar(255) DEFAULT NULL COMMENT '合成图',
  `LikeCount` int(11) DEFAULT '0' COMMENT '点赞次数',
  `CommentCount` int(11) DEFAULT '0' COMMENT '评论次数',
  `Status` int(1) DEFAULT '1' COMMENT '状态 1:正常，0:删除',
  `State` int(1) DEFAULT '0' COMMENT '是否首页展示 1:展示，0:不展示',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '作者',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Type` tinyint(4) DEFAULT '3' COMMENT '类型,0为图解财经,1为纯文字图说,2为纯图图说,3为图文混合图说',
  `SecuritiesNo` varchar(50) DEFAULT NULL COMMENT '证券号码',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1742 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_imagetext_comment
-- ----------------------------
DROP TABLE IF EXISTS `wf_imagetext_comment`;
CREATE TABLE `wf_imagetext_comment` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `ITCode` varchar(50) DEFAULT NULL COMMENT '图说表编号',
  `Content` varchar(500) DEFAULT NULL COMMENT '内容',
  `CreateUser` varchar(20) DEFAULT NULL COMMENT '创建人',
  `ParentID` int(11) DEFAULT NULL,
  `IsDelete` bit(1) DEFAULT b'0',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2610 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_imagetext_likes
-- ----------------------------
DROP TABLE IF EXISTS `wf_imagetext_likes`;
CREATE TABLE `wf_imagetext_likes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `ITCode` varchar(50) DEFAULT NULL COMMENT '图说表编号',
  `CreateUser` varchar(120) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2108 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_live_cover
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_cover`;
CREATE TABLE `wf_live_cover` (
  `CoverID` int(11) NOT NULL AUTO_INCREMENT COMMENT '直播封面',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '会员',
  `ImageUrl` varchar(1024) DEFAULT NULL COMMENT '图片地址',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`CoverID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_live_liketimes
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_liketimes`;
CREATE TABLE `wf_live_liketimes` (
  `MemberCode` varchar(10) DEFAULT NULL,
  `LikeMemberCode` varchar(10) DEFAULT NULL,
  `LikeTimes` bigint(8) DEFAULT NULL,
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=49566 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_live_manager
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_manager`;
CREATE TABLE `wf_live_manager` (
  `MemberCode` varchar(20) NOT NULL COMMENT '会员编号',
  `LiveMemberCode` varchar(20) NOT NULL COMMENT '主播会员编号',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='场控表';

-- ----------------------------
-- Table structure for wf_live_memberoperations
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_memberoperations`;
CREATE TABLE `wf_live_memberoperations` (
  `RoomCode` varchar(20) NOT NULL COMMENT '直播房间编号',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '会员编号',
  `LiveMemberCode` varchar(20) DEFAULT NULL COMMENT '主播会员编号',
  `Type` varchar(2) DEFAULT NULL COMMENT '贡献类型，0为送礼，1为分享，2为观看时长,3为门票,4为直播时长,5为点赞,6为留言',
  `Time` int(8) DEFAULT NULL COMMENT '时长分钟数',
  `GiftsNo` varchar(20) DEFAULT NULL COMMENT '礼物编码',
  `ShareTimes` int(4) DEFAULT NULL COMMENT '分享次数',
  `WolfCoins` decimal(10,2) DEFAULT NULL COMMENT '金币数',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `BusinessCode` varchar(255) DEFAULT NULL,
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=19509 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_live_memmainoperations
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_memmainoperations`;
CREATE TABLE `wf_live_memmainoperations` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '会员沃夫号',
  `LiveMemberCode` varchar(20) DEFAULT NULL COMMENT '主播沃夫号',
  `Type` varchar(2) DEFAULT NULL COMMENT '贡献类型，0为送礼，1为分享，2为时长',
  `Data` bigint(20) DEFAULT '0' COMMENT '时长,分享次数,送礼钱数',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4813 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_live_memmainoperations_bak
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_memmainoperations_bak`;
CREATE TABLE `wf_live_memmainoperations_bak` (
  `Id` int(11) NOT NULL DEFAULT '0',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '会员沃夫号',
  `LiveMemberCode` varchar(20) DEFAULT NULL COMMENT '主播沃夫号',
  `Type` varchar(2) DEFAULT NULL COMMENT '贡献类型，0为送礼，1为分享，2为时长',
  `Data` bigint(20) DEFAULT '0' COMMENT '时长,分享次数,送礼钱数',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=1596 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_live_outlink
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_outlink`;
CREATE TABLE `wf_live_outlink` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增长ID',
  `LinkNo` varchar(8) DEFAULT NULL COMMENT '编号',
  `RoomCode` varchar(20) DEFAULT NULL COMMENT '直播间编号',
  `Type` varchar(10) DEFAULT NULL COMMENT '运用类型,如雪球',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_live_personalbum
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_personalbum`;
CREATE TABLE `wf_live_personalbum` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增长ID',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `CoverImgUrl` varchar(255) DEFAULT NULL COMMENT '封面地址',
  `SortOrder` int(11) DEFAULT NULL COMMENT '排序号',
  `Title` varchar(100) DEFAULT NULL COMMENT '标题',
  `Description` varchar(255) DEFAULT NULL COMMENT '描述',
  `State` tinyint(1) DEFAULT NULL COMMENT '状态,0为关闭,1为启用',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `VideoUrl` varchar(255) DEFAULT NULL COMMENT '小视频URL',
  `ClickNum` int(11) DEFAULT '0' COMMENT '视频播放次数',
  `PersonalbumCode` varchar(20) DEFAULT NULL COMMENT '个人专栏编号',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_live_rankrecord
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_rankrecord`;
CREATE TABLE `wf_live_rankrecord` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MemberCode` varchar(20) DEFAULT NULL COMMENT ' 沃夫号',
  `RoomCode` varchar(20) DEFAULT NULL COMMENT '直播间编号',
  `RankType` varchar(1) DEFAULT NULL COMMENT '贡献类型，0为送礼，1为分享，2为观看时长,3为门票,4为直播时长,5为点赞,6为留言',
  `RankUpdateValue` int(11) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `BusinessCode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11617 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_live_redpacketrecord
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_redpacketrecord`;
CREATE TABLE `wf_live_redpacketrecord` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增长ID',
  `PacketCode` varchar(50) DEFAULT NULL COMMENT '红包编号',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `WolfDou` int(11) DEFAULT NULL COMMENT '沃夫豆',
  `CreateTime` datetime DEFAULT NULL COMMENT '合建时间',
  `RecordType` varchar(1) DEFAULT NULL COMMENT '记录类型（0：抢红包；1退包）',
  `PacketCount` int(11) DEFAULT NULL COMMENT '退还剩余的红包个数',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=814 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_live_redpackets
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_redpackets`;
CREATE TABLE `wf_live_redpackets` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增长ID',
  `PacketCode` varchar(50) DEFAULT NULL COMMENT '红包编号',
  `Type` varchar(10) DEFAULT NULL COMMENT '类型,0为给主播的红包,1为拼手气红包',
  `PacketMoney` int(11) DEFAULT NULL COMMENT '红包金额,豆数',
  `PacketCount` int(11) DEFAULT NULL COMMENT '红包个数',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `State` varchar(1) DEFAULT NULL COMMENT '状态,1为有效,2为过期',
  `RemainCount` int(11) DEFAULT NULL COMMENT '剩余个数',
  `RemainMoney` int(11) DEFAULT NULL COMMENT '剩余金额',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `PacketMessage` varchar(255) DEFAULT NULL COMMENT '红包留言',
  `ByCode` varchar(20) DEFAULT NULL COMMENT '接受方号',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=580 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_live_roomtopic
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_roomtopic`;
CREATE TABLE `wf_live_roomtopic` (
  `LiveRoomCode` varchar(20) DEFAULT NULL COMMENT '直播室编号',
  `TopicCode` varchar(4) DEFAULT NULL COMMENT '话题编号',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=1360 DEFAULT CHARSET=utf8 COMMENT='直播室与话题关系表';

-- ----------------------------
-- Table structure for wf_live_topic
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_topic`;
CREATE TABLE `wf_live_topic` (
  `TopicCode` varchar(4) NOT NULL COMMENT '话题编号',
  `TopicName` varchar(20) DEFAULT NULL COMMENT '话题名称',
  `TopicType` varchar(2) DEFAULT NULL COMMENT '话题类型',
  PRIMARY KEY (`TopicCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='话题表';

-- ----------------------------
-- Table structure for wf_live_video
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_video`;
CREATE TABLE `wf_live_video` (
  `VideoId` int(11) NOT NULL AUTO_INCREMENT COMMENT '视频ID自增长',
  `MemberCode` varchar(20) DEFAULT NULL,
  `VideoCode` varchar(20) NOT NULL COMMENT '视频编号',
  `VideoName` varchar(50) DEFAULT NULL COMMENT '视频名称',
  `VideoType` varchar(2) DEFAULT NULL COMMENT '视频类型',
  `VideoUrl` varchar(200) DEFAULT NULL COMMENT '视频链接地址',
  `VideoImage` varchar(100) DEFAULT NULL COMMENT '视频图片',
  `Status` varchar(2) DEFAULT NULL COMMENT '状态，0为正常，1为删除',
  `ClickNum` int(8) DEFAULT '0' COMMENT '点击次数',
  `SortOrder` int(8) DEFAULT NULL COMMENT '视频排列权重，越大越靠前',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Backup1` varchar(255) DEFAULT NULL COMMENT '备用',
  `ClickLikeNum` int(8) DEFAULT NULL COMMENT '点赞次数',
  `TimeLong` int(11) DEFAULT '0' COMMENT '时长',
  `ShareTitle` varchar(255) DEFAULT NULL COMMENT '分享标题',
  `ShareContent` varchar(255) DEFAULT NULL COMMENT '分享内容',
  `ShareImageUrl` varchar(1024) DEFAULT NULL COMMENT '分享图片',
  `GoodNumber` int(11) DEFAULT '0' COMMENT '点赞次数',
  `StarLevel` decimal(10,1) DEFAULT '0.0' COMMENT '评分值',
  `ShareNumber` int(11) DEFAULT '0' COMMENT '分享次数',
  `CommentNumber` int(10) DEFAULT '0' COMMENT '评论数量',
  `Contents` text COMMENT '内容',
  `AdminCode` varchar(20) DEFAULT NULL COMMENT '管理员',
  `Lables` varchar(500) DEFAULT NULL COMMENT ' 标签',
  `IsRecommend` bit(1) DEFAULT NULL COMMENT '是否推荐',
  `ShowTime` datetime DEFAULT NULL COMMENT '发布时间',
  `MemberNumber` int(11) DEFAULT '0' COMMENT '评论人数',
  `ColumnId` int(11) DEFAULT '0',
  `DissertationId` int(11) DEFAULT '0',
  PRIMARY KEY (`VideoId`)
) ENGINE=InnoDB AUTO_INCREMENT=1159 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_live_video_delete
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_video_delete`;
CREATE TABLE `wf_live_video_delete` (
  `VideoId` int(11) NOT NULL DEFAULT '0' COMMENT '视频ID自增长',
  `MemberCode` varchar(20) DEFAULT NULL,
  `VideoCode` varchar(20) NOT NULL COMMENT '视频编号',
  `VideoName` varchar(50) DEFAULT NULL COMMENT '视频名称',
  `VideoType` varchar(2) DEFAULT NULL COMMENT '视频类型',
  `VideoUrl` varchar(200) DEFAULT NULL COMMENT '视频链接地址',
  `VideoImage` varchar(100) DEFAULT NULL COMMENT '视频图片',
  `Status` varchar(2) DEFAULT NULL COMMENT '状态，0为正常，1为删除',
  `ClickNum` int(8) DEFAULT '0' COMMENT '点击次数',
  `SortOrder` int(8) DEFAULT NULL COMMENT '视频排列权重，越大越靠前',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Backup1` varchar(255) DEFAULT NULL COMMENT '备用',
  `ClickLikeNum` int(8) DEFAULT NULL COMMENT '点赞次数',
  `TimeLong` int(11) DEFAULT '0' COMMENT '时长',
  `ShareTitle` varchar(255) DEFAULT NULL COMMENT '分享标题',
  `ShareContent` varchar(255) DEFAULT NULL COMMENT '分享内容',
  `ShareImageUrl` varchar(1024) DEFAULT NULL COMMENT '分享图片',
  `GoodNumber` int(11) DEFAULT '0' COMMENT '点赞次数',
  `StarLevel` decimal(10,1) DEFAULT '0.0' COMMENT '评分值',
  `ShareNumber` int(11) DEFAULT '0' COMMENT '分享次数',
  `CommentNumber` int(10) DEFAULT '0' COMMENT '评论数量',
  `Contents` text COMMENT '内容',
  `AdminCode` varchar(20) DEFAULT NULL COMMENT '管理员',
  `Lables` varchar(500) DEFAULT NULL COMMENT ' 标签',
  `IsRecommend` bit(1) DEFAULT NULL COMMENT '是否推荐',
  `ShowTime` datetime DEFAULT NULL COMMENT '发布时间',
  `MemberNumber` int(11) DEFAULT '0' COMMENT '评论人数',
  `DeleteTime` datetime DEFAULT NULL,
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_live_video_old
-- ----------------------------
DROP TABLE IF EXISTS `wf_live_video_old`;
CREATE TABLE `wf_live_video_old` (
  `VideoId` int(11) NOT NULL DEFAULT '0' COMMENT '视频ID自增长',
  `VideoCode` varchar(20) NOT NULL COMMENT '视频编号',
  `VideoName` varchar(50) DEFAULT NULL COMMENT '视频名称',
  `VideoType` varchar(2) DEFAULT NULL COMMENT '视频类型',
  `VideoUrl` varchar(200) DEFAULT NULL COMMENT '视频链接地址',
  `VideoImage` varchar(100) DEFAULT NULL COMMENT '视频图片',
  `Status` varchar(2) DEFAULT NULL COMMENT '状态，0为正常，1为删除',
  `ClickNum` int(8) DEFAULT NULL COMMENT '点击次数',
  `SortOrder` int(8) DEFAULT NULL COMMENT '视频排列权重，越大越靠前',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Backup1` varchar(255) DEFAULT NULL COMMENT '备用',
  `ClickLikeNum` int(8) DEFAULT NULL COMMENT '点赞次数',
  `TimeLong` int(11) DEFAULT '0' COMMENT '时长',
  `ShareTitle` varchar(255) DEFAULT NULL COMMENT '分享标题',
  `ShareContent` varchar(255) DEFAULT NULL COMMENT '分享内容',
  `ShareImageUrl` varchar(1024) DEFAULT NULL COMMENT '分享图片',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_liveroom
-- ----------------------------
DROP TABLE IF EXISTS `wf_liveroom`;
CREATE TABLE `wf_liveroom` (
  `RoomID` int(11) NOT NULL AUTO_INCREMENT COMMENT '直播房间表',
  `BusinessCode` varchar(50) DEFAULT NULL,
  `RoomCode` varchar(20) NOT NULL COMMENT '房间编号',
  `RoomTitle` varchar(100) NOT NULL COMMENT '直播房间标题',
  `MemberCode` varchar(20) NOT NULL COMMENT '主播会员号',
  `ImageUrl` varchar(200) DEFAULT NULL COMMENT '房间图标',
  `SecretType` varchar(10) DEFAULT NULL COMMENT '加密类型,none为不加密,passsword为密码,level为等级,ticket为门票',
  `Password` varchar(50) DEFAULT NULL COMMENT '房间密码',
  `TicketPrice` int(5) DEFAULT '0' COMMENT '门票价格',
  `LevelLimit` int(4) DEFAULT '0' COMMENT '限制等级',
  `Status` varchar(1) DEFAULT NULL COMMENT '房间状态,0为关闭,1为开启,2为删除',
  `Longitude` varchar(10) DEFAULT NULL COMMENT '经度',
  `Latitude` varchar(10) DEFAULT NULL COMMENT '纬度',
  `City` varchar(50) DEFAULT NULL COMMENT '城市',
  `ClickLikeNum` int(8) DEFAULT '0' COMMENT '点赞次数',
  `WolfCoins` decimal(10,2) DEFAULT NULL COMMENT '获得金币数',
  `MemberNum` int(10) DEFAULT '0' COMMENT '人数',
  `StreamId` varchar(200) DEFAULT NULL COMMENT '直播ID由七牛云提供',
  `PlayBackUrl` varchar(200) DEFAULT NULL COMMENT '观看回放的地址',
  `WatchLiveUrl` varchar(200) DEFAULT NULL COMMENT '观看直播的rtmp地址',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `DestoryTime` datetime DEFAULT NULL COMMENT '关闭时间',
  `TopicType` varchar(10) DEFAULT NULL COMMENT '话题类型',
  `Concerns` int(10) DEFAULT '0' COMMENT '关注数',
  `RobotNum` int(11) DEFAULT '0' COMMENT '机器人数',
  `ROrder` int(11) DEFAULT NULL,
  `RobotConf` int(11) DEFAULT NULL COMMENT '机器人人数配置',
  `Country` varchar(50) DEFAULT NULL COMMENT '国家',
  `Province` varchar(50) DEFAULT NULL COMMENT '省',
  `Address` varchar(200) DEFAULT NULL COMMENT '详细地址',
  `HlsWatchLiveUrl` varchar(200) DEFAULT NULL COMMENT '观看直播的hls地址',
  `MaxOnlineCount` int(11) DEFAULT '0' COMMENT '最大同时在线人数',
  `FlvWatchLiveUrl` varchar(200) DEFAULT NULL COMMENT 'flv观看地址',
  `LiveSource` varchar(1) DEFAULT NULL COMMENT '直播来源,0是手机端,1是PC端',
  `Height` int(11) DEFAULT '0' COMMENT '视频高度',
  `Width` int(11) DEFAULT '0' COMMENT '视频宽度',
  `PersistentId` varchar(255) DEFAULT NULL COMMENT '转码ID,由七牛云提供',
  `PlayBackClickNum` int(11) DEFAULT '0' COMMENT '回放点击次数',
  `OpenGuessStock` varchar(1) DEFAULT '0' COMMENT '猜涨跌的开关,0为关闭,1为开启',
  PRIMARY KEY (`RoomID`),
  KEY `idx_liveroom_bcode` (`BusinessCode`(10))
) ENGINE=InnoDB AUTO_INCREMENT=5799 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_liveroom_robot
-- ----------------------------
DROP TABLE IF EXISTS `wf_liveroom_robot`;
CREATE TABLE `wf_liveroom_robot` (
  `RoomCode` varchar(20) DEFAULT NULL COMMENT '房间编号',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '机器人沃夫号',
  `Status` int(1) DEFAULT '0' COMMENT '状态值，0表示未进入房间，1表示进入房间',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=81726 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_liveroom_secrethistory
-- ----------------------------
DROP TABLE IF EXISTS `wf_liveroom_secrethistory`;
CREATE TABLE `wf_liveroom_secrethistory` (
  `RoomCode` varchar(20) NOT NULL COMMENT '直播间编号',
  `MemberCode` varchar(20) NOT NULL COMMENT '沃夫号',
  PRIMARY KEY (`RoomCode`,`MemberCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_liveroom_sort
-- ----------------------------
DROP TABLE IF EXISTS `wf_liveroom_sort`;
CREATE TABLE `wf_liveroom_sort` (
  `RoomCode` varchar(20) NOT NULL COMMENT '房间编号',
  `SortOrder` int(8) unsigned zerofill DEFAULT '00000000' COMMENT '排序号',
  `Type` varchar(1) DEFAULT NULL COMMENT '0为直播间,1为专栏',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=2390143 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_member
-- ----------------------------
DROP TABLE IF EXISTS `wf_member`;
CREATE TABLE `wf_member` (
  `MemberID` int(11) NOT NULL AUTO_INCREMENT COMMENT '会员表',
  `UserName` varchar(50) DEFAULT NULL COMMENT '用户名',
  `MemberCode` varchar(20) NOT NULL COMMENT '会员号',
  `MemberType` varchar(10) DEFAULT NULL COMMENT '账户类型（0员工，1会员）',
  `SupportType` varchar(10) DEFAULT '0' COMMENT '1是支持者账号，0不是',
  `LoginPwd` varchar(50) DEFAULT NULL COMMENT '登录密码',
  `PayPwd` varchar(50) DEFAULT NULL COMMENT '支付密码',
  `Nickname` varchar(20) DEFAULT NULL COMMENT '昵称',
  `NicknamePinyin` varchar(255) DEFAULT NULL COMMENT '昵称拼音',
  `NicknameLetter` varchar(20) DEFAULT NULL COMMENT '昵称首字母',
  `Signature` varchar(200) DEFAULT NULL COMMENT '个性签名',
  `RankValue` int(11) DEFAULT NULL COMMENT '会员/主播等级（经验值）',
  `RealName` varchar(20) DEFAULT NULL COMMENT '真实姓名',
  `NamePinyin` varchar(255) DEFAULT NULL COMMENT '姓名拼音',
  `NameLetter` varchar(20) DEFAULT NULL COMMENT '姓名首字母',
  `Sex` varchar(10) DEFAULT NULL COMMENT '性别',
  `Constellation` varchar(20) DEFAULT NULL COMMENT '星座',
  `CountryCode` varchar(20) DEFAULT NULL COMMENT '手机国字区号',
  `Mobile` varchar(20) DEFAULT NULL COMMENT '手机号（必须认证）',
  `Email` varchar(100) DEFAULT NULL COMMENT '邮箱（必须认证）',
  `Country` varchar(50) DEFAULT NULL COMMENT '国家',
  `Province` varchar(50) DEFAULT NULL COMMENT '省份',
  `City` varchar(50) DEFAULT NULL COMMENT '城市',
  `IsAuth` bit(1) DEFAULT NULL COMMENT '是否职业认证',
  `AuthType` varchar(20) DEFAULT '0' COMMENT '会员类型：0个人认证、机构认证',
  `Occupation` varchar(200) DEFAULT NULL COMMENT '认证的职业',
  `Birthday` date DEFAULT NULL COMMENT '生日',
  `DataSource` varchar(20) DEFAULT NULL COMMENT '数据来源（android、ios）',
  `PhoneCode` varchar(20) DEFAULT NULL COMMENT '手机编码',
  `PhoneBrand` varchar(20) DEFAULT NULL COMMENT '手机品牌',
  `PhoneModel` varchar(50) DEFAULT NULL COMMENT '手机型号',
  `PhoneNumber` varchar(20) DEFAULT NULL COMMENT '手机号',
  `Status` int(11) DEFAULT '1' COMMENT '状态（0停用、1正常）',
  `ProductSource` varchar(20) DEFAULT NULL COMMENT '来源产品',
  `AmountAccount` decimal(10,2) DEFAULT NULL COMMENT '账户金额',
  `Integral` int(10) DEFAULT '0' COMMENT '账户积分',
  `WolfDou` int(10) DEFAULT '0' COMMENT '沃夫豆',
  `WolfCoins` decimal(10,2) DEFAULT '0.00' COMMENT '沃夫币',
  `SupportDou` int(10) DEFAULT '0' COMMENT '给支持者充值的沃夫豆（预留）',
  `SupportCoins` decimal(10,2) DEFAULT '0.00' COMMENT '从支持者那获取的沃夫币',
  `CreateTime` datetime DEFAULT NULL COMMENT '注册时间',
  `LastLoginTime` datetime DEFAULT NULL COMMENT '最后登录时间',
  `HeadImage` longtext COMMENT '用户头像',
  `QQOpenID` varchar(255) DEFAULT NULL COMMENT 'QQ登录',
  `WeixinOpenID` varchar(255) DEFAULT NULL COMMENT '微信登录',
  `WeiboOpenID` varchar(255) DEFAULT NULL COMMENT '微博登录',
  `AlipayOpenID` varchar(255) DEFAULT NULL COMMENT '支付宝登录',
  `Remark1` varchar(255) DEFAULT NULL,
  `Remark2` varchar(255) DEFAULT NULL,
  `Remark3` varchar(255) DEFAULT NULL,
  `Remark4` varchar(255) DEFAULT NULL,
  `Remark5` varchar(255) DEFAULT NULL,
  `Remark6` varchar(255) DEFAULT NULL,
  `Remark7` varchar(255) DEFAULT NULL,
  `Remark8` varchar(255) DEFAULT NULL,
  `Remark9` varchar(255) DEFAULT NULL,
  `Remark10` varchar(255) DEFAULT NULL,
  `Remark11` varchar(255) DEFAULT NULL,
  `Remark12` varchar(255) DEFAULT NULL,
  `Remark13` varchar(255) DEFAULT NULL,
  `Remark14` varchar(255) DEFAULT NULL,
  `Remark15` varchar(255) DEFAULT NULL,
  `Remark16` varchar(255) DEFAULT NULL,
  `Remark17` varchar(255) DEFAULT NULL,
  `Remark18` varchar(255) DEFAULT NULL,
  `Remark19` varchar(255) DEFAULT NULL,
  `Remark20` varchar(255) DEFAULT NULL,
  `ShowPositionList` bit(1) DEFAULT b'1' COMMENT '是否显示持仓,默认为0',
  `SchoolName` varchar(100) DEFAULT NULL COMMENT '学校名称',
  PRIMARY KEY (`MemberID`,`MemberCode`),
  KEY `idx_member_code` (`MemberCode`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8801 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Table structure for wf_member_auth
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_auth`;
CREATE TABLE `wf_member_auth` (
  `AuthID` bigint(11) NOT NULL AUTO_INCREMENT COMMENT '会员认证表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '认证的会员',
  `BusinessCode` varchar(50) DEFAULT NULL COMMENT '业务编码',
  `AuthType` varchar(20) DEFAULT NULL COMMENT '认证类型（1个人认证、2新浪微博认证、3机构认证、4职业资格认证）',
  `WeiboOpenID` varchar(50) DEFAULT NULL COMMENT '微博OpenID',
  `RealName` varchar(20) DEFAULT NULL COMMENT '真实姓名',
  `IsHide` bit(1) DEFAULT NULL,
  `OrganizationName` varchar(50) DEFAULT NULL,
  `CertificateType` varchar(20) DEFAULT NULL COMMENT '证件类型、官方机构',
  `CertificateNo` varchar(50) DEFAULT NULL COMMENT '证件/营业执照号码',
  `OfficialWebsite` varchar(1024) DEFAULT NULL COMMENT '官方网站',
  `Description` varchar(255) DEFAULT NULL COMMENT '申请描述',
  `IsCommit` bit(1) DEFAULT NULL COMMENT '是否提交（可先保存）',
  `AuditStatus` int(4) DEFAULT NULL COMMENT '审核状态',
  `AuditStaff` varchar(20) DEFAULT NULL COMMENT '审核人',
  `AuditTime` datetime DEFAULT NULL COMMENT '审核时间',
  `Reason` varchar(200) DEFAULT NULL COMMENT '不通过原因',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`AuthID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_member_auth_file
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_auth_file`;
CREATE TABLE `wf_member_auth_file` (
  `FileID` int(11) NOT NULL AUTO_INCREMENT COMMENT '认证资料附件',
  `BusinessCode` varchar(50) DEFAULT NULL COMMENT '业务编码',
  `FileType` varchar(10) DEFAULT NULL COMMENT '文件类型（img、doc）',
  `FileUrl` varchar(1024) DEFAULT NULL COMMENT '文件地址',
  `FileStatus` int(4) DEFAULT NULL COMMENT '文件状态',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`FileID`)
) ENGINE=InnoDB AUTO_INCREMENT=425 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_member_author
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_author`;
CREATE TABLE `wf_member_author` (
  `AuthorID` int(11) NOT NULL AUTO_INCREMENT,
  `AdminCode` varchar(20) DEFAULT NULL COMMENT '管理员',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '会员',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`AuthorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_member_concern
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_concern`;
CREATE TABLE `wf_member_concern` (
  `ConcernID` bigint(11) NOT NULL AUTO_INCREMENT COMMENT '会员关系表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '主人',
  `ByMemberCode` varchar(20) DEFAULT NULL COMMENT '客人',
  `RelationshipType` varchar(10) DEFAULT NULL COMMENT '关系类型（1关注、2黑名单）',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`ConcernID`)
) ENGINE=InnoDB AUTO_INCREMENT=2184 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_member_copy
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_copy`;
CREATE TABLE `wf_member_copy` (
  `MemberID` int(11) NOT NULL AUTO_INCREMENT COMMENT '会员表',
  `UserName` varchar(50) DEFAULT NULL COMMENT '用户名',
  `MemberCode` varchar(20) NOT NULL COMMENT '会员号',
  `MemberType` varchar(50) DEFAULT NULL COMMENT '账户类型（0员工，1会员）',
  `LoginPwd` varchar(50) DEFAULT NULL COMMENT '登录密码',
  `PayPwd` varchar(50) DEFAULT NULL COMMENT '支付密码',
  `Nickname` varchar(20) DEFAULT NULL COMMENT '昵称',
  `Signature` varchar(200) DEFAULT NULL COMMENT '个性签名',
  `RankValue` int(11) DEFAULT NULL COMMENT '会员/主播等级（经验值）',
  `RealName` varchar(20) DEFAULT NULL COMMENT '真实姓名',
  `Sex` varchar(10) DEFAULT NULL COMMENT '性别',
  `Constellation` varchar(20) DEFAULT NULL COMMENT '星座',
  `CountryCode` varchar(20) DEFAULT NULL COMMENT '手机国字区号',
  `Mobile` varchar(20) DEFAULT NULL COMMENT '手机号（必须认证）',
  `Email` varchar(100) DEFAULT NULL COMMENT '邮箱（必须认证）',
  `Country` varchar(50) DEFAULT NULL COMMENT '国家',
  `Province` varchar(50) DEFAULT NULL COMMENT '省份',
  `City` varchar(50) DEFAULT NULL COMMENT '城市',
  `IsAuth` bit(1) DEFAULT NULL COMMENT '是否职业认证',
  `AuthType` varchar(20) DEFAULT NULL COMMENT '会员类型：0个人认证、机构认证',
  `Occupation` varchar(200) DEFAULT NULL COMMENT '认证的职业',
  `Birthday` date DEFAULT NULL COMMENT '生日',
  `DataSource` varchar(20) DEFAULT NULL COMMENT '数据来源（android、ios）',
  `PhoneCode` varchar(20) DEFAULT NULL COMMENT '手机编码',
  `PhoneBrand` varchar(20) DEFAULT NULL COMMENT '手机品牌',
  `PhoneNumber` varchar(20) DEFAULT NULL COMMENT '手机号',
  `Status` int(11) DEFAULT NULL COMMENT '状态（0停用、1正常）',
  `ProductSource` varchar(20) DEFAULT NULL COMMENT '来源产品',
  `AmountAccount` decimal(10,2) DEFAULT NULL COMMENT '账户金额',
  `Integral` int(10) DEFAULT NULL COMMENT '账户积分',
  `WolfDou` int(10) DEFAULT NULL COMMENT '沃夫豆',
  `WolfCoins` decimal(10,2) DEFAULT NULL COMMENT '沃夫币',
  `CreateTime` datetime NOT NULL COMMENT '注册时间',
  `HeadImage` longtext COMMENT '用户头像',
  `QQOpenID` varchar(255) DEFAULT NULL COMMENT 'QQ登录',
  `WeixinOpenID` varchar(255) DEFAULT NULL COMMENT '微信登录',
  `WeiboOpenID` varchar(255) DEFAULT NULL COMMENT '微博登录',
  `AlipayOpenID` varchar(255) DEFAULT NULL COMMENT '支付宝登录',
  PRIMARY KEY (`MemberID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Table structure for wf_member_field_control
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_field_control`;
CREATE TABLE `wf_member_field_control` (
  `ControlID` int(11) NOT NULL AUTO_INCREMENT COMMENT '我的场控表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '所属会员',
  `ManagerCode` varchar(20) DEFAULT NULL COMMENT '我的场控',
  `Authority` varchar(255) DEFAULT NULL COMMENT '场控权限（预留）',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`ControlID`)
) ENGINE=InnoDB AUTO_INCREMENT=778 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_member_gifts_contrast
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_gifts_contrast`;
CREATE TABLE `wf_member_gifts_contrast` (
  `ContrastID` int(11) NOT NULL AUTO_INCREMENT COMMENT '礼物对照表',
  `GiftsNo` varchar(20) DEFAULT NULL COMMENT '礼物编码',
  `GiftsName` varchar(50) DEFAULT NULL COMMENT '礼物名称',
  `GiftsDou` int(4) DEFAULT NULL COMMENT '礼物价格豆',
  `ImageUrl` varchar(255) DEFAULT NULL COMMENT '礼物图标',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `GiftsJson` text COMMENT '礼物JSON',
  `SortOrder` int(4) DEFAULT '0' COMMENT '排序',
  `Thumb` varchar(255) DEFAULT NULL COMMENT '缩略图',
  `Status` varchar(1) DEFAULT NULL COMMENT '状态,0为关闭,1为启用',
  `Type` varchar(1) DEFAULT NULL COMMENT '类型,0是png,1是gif,2是html',
  `High` int(4) DEFAULT '0' COMMENT '高度',
  `Width` int(4) DEFAULT '0' COMMENT '宽度',
  `Words` varchar(10) DEFAULT NULL COMMENT '关键字',
  PRIMARY KEY (`ContrastID`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_member_gifts_receive
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_gifts_receive`;
CREATE TABLE `wf_member_gifts_receive` (
  `ReceiveGiftsID` int(11) NOT NULL AUTO_INCREMENT COMMENT '会员收礼记录表',
  `BusinessCode` varchar(50) DEFAULT NULL COMMENT '收礼业务编码',
  `GiftsNo` varchar(20) DEFAULT NULL COMMENT '礼物编号',
  `WolfCoins` decimal(10,2) DEFAULT NULL COMMENT '收到的沃夫币',
  `SendMemberCode` varchar(20) DEFAULT NULL COMMENT '送礼会员',
  `ReceiveMemberCode` varchar(20) DEFAULT NULL COMMENT '收礼会员',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`ReceiveGiftsID`)
) ENGINE=InnoDB AUTO_INCREMENT=7695 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_member_gifts_send
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_gifts_send`;
CREATE TABLE `wf_member_gifts_send` (
  `SendGiftsID` int(11) NOT NULL AUTO_INCREMENT COMMENT '会员送礼记录表',
  `BusinessCode` varchar(50) DEFAULT NULL COMMENT '送礼业务编码',
  `GiftsNo` varchar(20) DEFAULT NULL COMMENT '礼物编号',
  `GiftsDou` int(4) DEFAULT NULL COMMENT '礼物价格豆',
  `SendMemberCode` varchar(20) DEFAULT NULL COMMENT '送礼会员',
  `ReceiveMemberCode` varchar(20) DEFAULT NULL COMMENT '收礼会员',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`SendGiftsID`)
) ENGINE=InnoDB AUTO_INCREMENT=7697 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_member_login_log
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_login_log`;
CREATE TABLE `wf_member_login_log` (
  `LoginID` bigint(20) NOT NULL AUTO_INCREMENT,
  `MemberCode` varchar(255) DEFAULT NULL,
  `LoginTime` datetime DEFAULT NULL,
  `LoginPlatform` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`LoginID`)
) ENGINE=InnoDB AUTO_INCREMENT=3591 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_member_privilege
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_privilege`;
CREATE TABLE `wf_member_privilege` (
  `PrivilegeID` int(11) NOT NULL AUTO_INCREMENT COMMENT '系统特权表',
  `Name` varchar(50) DEFAULT NULL COMMENT '特权名称',
  `PrivilegeNo` varchar(20) DEFAULT NULL COMMENT '特权编号',
  `ImageUrl` varchar(255) DEFAULT NULL COMMENT '特权图标',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`PrivilegeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_member_privilege_my
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_privilege_my`;
CREATE TABLE `wf_member_privilege_my` (
  `PrivilegeID` int(11) NOT NULL AUTO_INCREMENT COMMENT '我的特权表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '所属会员',
  `PrivilegeNo` varchar(20) DEFAULT NULL COMMENT '特权编码',
  `CreateTime` datetime DEFAULT NULL COMMENT '拥有时间',
  PRIMARY KEY (`PrivilegeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_member_rank
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_rank`;
CREATE TABLE `wf_member_rank` (
  `RankID` int(11) NOT NULL AUTO_INCREMENT,
  `Rank` int(11) DEFAULT NULL,
  `UpperValue` int(11) DEFAULT NULL,
  PRIMARY KEY (`RankID`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_member_reported
-- ----------------------------
DROP TABLE IF EXISTS `wf_member_reported`;
CREATE TABLE `wf_member_reported` (
  `ReportedID` int(11) NOT NULL AUTO_INCREMENT COMMENT '会员举报表',
  `ReportedType` varchar(20) DEFAULT NULL COMMENT '五大类型,1是广告欺骗,2是淫秽色情,3是骚扰谩骂,4是反动政治,5是其他内容',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '举报者',
  `ByMemberCode` varchar(20) DEFAULT NULL COMMENT '被举报者',
  `ReportedExplain` varchar(255) DEFAULT NULL COMMENT '1是直播举报,2是图文举报,3是他人主页举报',
  `HandleStaff` varchar(20) DEFAULT NULL COMMENT '处理人',
  `HandleTime` datetime DEFAULT NULL COMMENT '处理时间',
  `HandleExplain` varchar(255) DEFAULT NULL COMMENT '处理意见',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Status` varchar(1) DEFAULT '0' COMMENT '状态，0是未处理，1是已处理',
  PRIMARY KEY (`ReportedID`)
) ENGINE=InnoDB AUTO_INCREMENT=189 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_message
-- ----------------------------
DROP TABLE IF EXISTS `wf_message`;
CREATE TABLE `wf_message` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(1) DEFAULT NULL COMMENT '类型,1为股价提醒',
  `Content` varchar(500) DEFAULT NULL COMMENT '消息内容',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `Sender` varchar(1) DEFAULT NULL COMMENT '发送人,预留',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Status` varchar(1) DEFAULT '0' COMMENT '状态,0为正常,1为已读',
  `Title` varchar(100) DEFAULT NULL COMMENT '消息标题',
  `Extension` varchar(100) DEFAULT NULL,
  `IsDelete` bit(1) DEFAULT b'0' COMMENT '0为正常,1为删除',
  `IsSend` bit(1) DEFAULT b'0' COMMENT '默认0,显示是否发送,0为未发送,1为已发送',
  `SendTime` datetime DEFAULT NULL COMMENT '发送时间',
  `Target` varchar(255) DEFAULT NULL COMMENT '目标操作,根据类型不同会有不同的值',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=34840 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_mychoice
-- ----------------------------
DROP TABLE IF EXISTS `wf_mychoice`;
CREATE TABLE `wf_mychoice` (
  `Id` varchar(50) NOT NULL COMMENT 'Guid',
  `UserName` varchar(50) DEFAULT NULL COMMENT '用户名',
  `SecuritiesNO` varchar(20) DEFAULT NULL COMMENT '证券号码',
  `SecuritiesName` varchar(50) DEFAULT NULL COMMENT '证券名称',
  `SecuritiesType` varchar(20) DEFAULT NULL COMMENT '证券类型',
  `OrderNo` int(11) DEFAULT NULL COMMENT '排序号',
  `Remarks` varchar(100) DEFAULT NULL COMMENT '备注',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_news
-- ----------------------------
DROP TABLE IF EXISTS `wf_news`;
CREATE TABLE `wf_news` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `Code` varchar(50) DEFAULT NULL COMMENT '编码',
  `Label` varchar(200) DEFAULT NULL COMMENT '标签',
  `Title` varchar(200) DEFAULT NULL COMMENT '标题',
  `Content` text COMMENT '内容',
  `TitlePicture` varchar(200) DEFAULT NULL COMMENT '标题图片',
  `SelectPicture` varchar(200) DEFAULT NULL COMMENT '搜索缩略图',
  `SecuritiesType` varchar(50) DEFAULT NULL COMMENT '证券类型sh，深股：sz，美股us，港股，hk',
  `SecuritiesNo` varchar(50) DEFAULT NULL COMMENT '证券号码',
  `ReadCount` int(11) unsigned zerofill NOT NULL DEFAULT '00000000000' COMMENT '阅读次数',
  `ShowTime` datetime DEFAULT NULL COMMENT '发布时间',
  `IsStartNews` bit(1) DEFAULT NULL COMMENT '是否起始页资讯（true:是,false:否）',
  `Type` int(11) DEFAULT NULL COMMENT '状态（0:添加,1 待审核，9审核通过）',
  `AdminCode` varchar(50) DEFAULT NULL COMMENT '管理员编号',
  `Remark` varchar(120) DEFAULT NULL COMMENT '备注',
  `CreateUser` varchar(120) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `Extended` varchar(120) DEFAULT NULL COMMENT '推展字段(管理员编号)',
  `ColumnNo` varchar(11) DEFAULT '' COMMENT '栏目代码',
  `LikesCount` int(11) DEFAULT '0' COMMENT '点赞数',
  `CommentCount` int(11) DEFAULT '0' COMMENT '评论数',
  PRIMARY KEY (`Id`),
  KEY `idx_news_code` (`Code`),
  KEY `idx_news_user` (`CreateUser`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4924 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_news_bottomimage
-- ----------------------------
DROP TABLE IF EXISTS `wf_news_bottomimage`;
CREATE TABLE `wf_news_bottomimage` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Imageurl` varchar(255) DEFAULT NULL COMMENT '图片地址',
  `State` int(11) DEFAULT '1' COMMENT '状态,0表示未启用,1表示正常',
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_news_collection
-- ----------------------------
DROP TABLE IF EXISTS `wf_news_collection`;
CREATE TABLE `wf_news_collection` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `NewsCode` varchar(50) DEFAULT NULL COMMENT '资讯表Code',
  `CreateUser` varchar(120) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `Extended` varchar(120) DEFAULT NULL COMMENT '推展字段',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=485 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_news_column
-- ----------------------------
DROP TABLE IF EXISTS `wf_news_column`;
CREATE TABLE `wf_news_column` (
  `ColumnId` int(11) NOT NULL AUTO_INCREMENT COMMENT '资讯栏目表',
  `ColumnNo` varchar(11) DEFAULT NULL COMMENT '栏目代码',
  `Name` varchar(255) DEFAULT NULL COMMENT '栏目名称',
  `ImageUrl` varchar(1024) DEFAULT NULL COMMENT '栏目封面',
  `HomePage_Image` varchar(255) DEFAULT NULL COMMENT '首页图片',
  `StickImage` varchar(255) DEFAULT NULL COMMENT '置顶图片',
  `Description` varchar(1024) DEFAULT NULL COMMENT '描述',
  `Status` int(1) DEFAULT '0' COMMENT '是否置顶 1:置顶，0:不置顶',
  `State` int(1) DEFAULT '0' COMMENT '是否首页展示 1:展示，0:不展示',
  `Type` int(1) DEFAULT '1' COMMENT '状态 1:正常，0:删除',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`ColumnId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_news_column_my
-- ----------------------------
DROP TABLE IF EXISTS `wf_news_column_my`;
CREATE TABLE `wf_news_column_my` (
  `SubscribeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '栏目订阅表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '订阅人',
  `ColumnNo` varchar(20) DEFAULT NULL COMMENT '订阅的栏目',
  `Status` int(10) DEFAULT NULL COMMENT '订阅状态：1订阅；2取消订阅',
  `CreateTime` datetime DEFAULT NULL COMMENT '订阅时间',
  PRIMARY KEY (`SubscribeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_news_comment
-- ----------------------------
DROP TABLE IF EXISTS `wf_news_comment`;
CREATE TABLE `wf_news_comment` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `NewsCode` varchar(50) DEFAULT NULL COMMENT '资讯表Id',
  `Content` varchar(500) DEFAULT NULL COMMENT '内容',
  `CreateUser` varchar(120) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `Extended` varchar(120) DEFAULT NULL COMMENT '推展字段',
  `ParentID` int(11) DEFAULT NULL,
  `IsDelete` bit(1) DEFAULT b'0',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=8618 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_news_delete
-- ----------------------------
DROP TABLE IF EXISTS `wf_news_delete`;
CREATE TABLE `wf_news_delete` (
  `Id` int(11) NOT NULL DEFAULT '0' COMMENT 'Id',
  `Code` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '编码',
  `Label` varchar(200) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '标签',
  `Title` varchar(200) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '标题',
  `Content` text CHARACTER SET utf8mb4 COMMENT '内容',
  `TitlePicture` varchar(200) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '标题图片',
  `SelectPicture` varchar(200) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '搜索缩略图',
  `SecuritiesType` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '证券类型sh，深股：sz，美股us，港股，hk',
  `SecuritiesNo` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '证券号码',
  `ReadCount` int(11) unsigned zerofill NOT NULL DEFAULT '00000000000' COMMENT '阅读次数',
  `ShowTime` datetime DEFAULT NULL COMMENT '发布时间',
  `IsStartNews` bit(1) DEFAULT NULL COMMENT '是否起始页资讯（true:是,false:否）',
  `Type` int(11) DEFAULT NULL COMMENT '状态（0:添加,1 待审核，9审核通过）',
  `AdminCode` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '管理员编号',
  `Remark` varchar(120) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '备注',
  `CreateUser` varchar(120) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `Extended` varchar(120) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '推展字段(管理员编号)',
  `ColumnNo` varchar(11) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '栏目代码',
  `DeleteTime` datetime DEFAULT NULL,
  `LikesCount` int(11) DEFAULT '0' COMMENT '点赞数',
  `CommentCount` int(11) DEFAULT '0' COMMENT '评论数',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=683 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_news_error
-- ----------------------------
DROP TABLE IF EXISTS `wf_news_error`;
CREATE TABLE `wf_news_error` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `NewsCode` varchar(50) DEFAULT NULL COMMENT '编码',
  `Content` text COMMENT '内容',
  `CreateUser` varchar(120) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Reply` text COMMENT '回复',
  `ReplyUser` varchar(120) DEFAULT NULL COMMENT '回复人',
  `ReplyTime` datetime DEFAULT NULL COMMENT '回复时间',
  `Extended` varchar(120) DEFAULT NULL COMMENT '推展字段，联系方式',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_news_label
-- ----------------------------
DROP TABLE IF EXISTS `wf_news_label`;
CREATE TABLE `wf_news_label` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `Name` varchar(50) DEFAULT NULL COMMENT '标签名称',
  `CreateUser` varchar(120) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `Extended` varchar(120) DEFAULT NULL COMMENT '推展字段',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1826 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_news_likes
-- ----------------------------
DROP TABLE IF EXISTS `wf_news_likes`;
CREATE TABLE `wf_news_likes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `NewsCode` varchar(50) DEFAULT NULL COMMENT '资讯表Code',
  `CreateUser` varchar(120) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `Extended` varchar(120) DEFAULT NULL COMMENT '推展字段',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2254 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_news_mybroke
-- ----------------------------
DROP TABLE IF EXISTS `wf_news_mybroke`;
CREATE TABLE `wf_news_mybroke` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `Code` varchar(50) DEFAULT NULL COMMENT '编码',
  `Content` varchar(2000) DEFAULT NULL COMMENT '内容',
  `ContactNo` varchar(200) NOT NULL COMMENT '联系号码，邮箱或电话',
  `CreateUser` varchar(200) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Extended` varchar(120) DEFAULT NULL COMMENT '推展字段',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_news_mybroke_image
-- ----------------------------
DROP TABLE IF EXISTS `wf_news_mybroke_image`;
CREATE TABLE `wf_news_mybroke_image` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `MyBrokeCode` varchar(50) DEFAULT NULL COMMENT '我要爆料Code',
  `Image` varchar(200) DEFAULT NULL COMMENT '图片',
  `CreateUser` varchar(50) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Extended` varchar(120) DEFAULT NULL COMMENT '推展字段',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_news_uploadimages
-- ----------------------------
DROP TABLE IF EXISTS `wf_news_uploadimages`;
CREATE TABLE `wf_news_uploadimages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `oriName` varchar(50) DEFAULT NULL COMMENT '原始文件名',
  `fileName` varchar(50) DEFAULT NULL COMMENT '新的文件名',
  `fullName` varchar(200) DEFAULT NULL COMMENT '相对路径,包含文件名',
  `fileSize` int(11) DEFAULT NULL COMMENT '文件大小,字节',
  `createtime` datetime DEFAULT NULL COMMENT '创建时间',
  `uploadUser` varchar(20) DEFAULT NULL COMMENT '上传人',
  `md5` varchar(255) DEFAULT NULL COMMENT '文件的md5值',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26209 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_newsandvideos_error
-- ----------------------------
DROP TABLE IF EXISTS `wf_newsandvideos_error`;
CREATE TABLE `wf_newsandvideos_error` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `Code` varchar(50) DEFAULT NULL COMMENT '编码',
  `Content` text COMMENT '内容',
  `CreateUser` varchar(120) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Reply` text COMMENT '回复',
  `ReplyUser` varchar(120) DEFAULT NULL COMMENT '回复人',
  `ReplyTime` datetime DEFAULT NULL COMMENT '回复时间',
  `Contact` varchar(120) DEFAULT NULL COMMENT '联系方式',
  `Type` varchar(20) DEFAULT NULL COMMENT '类型，资讯,1,视频.2',
  `Extended` varchar(120) DEFAULT NULL COMMENT '推展字段',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_notes
-- ----------------------------
DROP TABLE IF EXISTS `wf_notes`;
CREATE TABLE `wf_notes` (
  `NotesID` int(255) NOT NULL AUTO_INCREMENT,
  `RoomCode` varchar(255) DEFAULT NULL,
  `NotesNo` varchar(50) DEFAULT NULL,
  `MemberCode` varchar(20) DEFAULT NULL,
  `Contents` varchar(1024) DEFAULT NULL,
  `Status` int(10) DEFAULT NULL COMMENT '小纸条状态：0初始；1接受；2结束；3拒绝；4关闭',
  `GoodNumber` int(11) DEFAULT '0',
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`NotesID`)
) ENGINE=InnoDB AUTO_INCREMENT=797 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_notes_good
-- ----------------------------
DROP TABLE IF EXISTS `wf_notes_good`;
CREATE TABLE `wf_notes_good` (
  `GoodID` int(11) NOT NULL AUTO_INCREMENT,
  `NotesNo` varchar(50) DEFAULT NULL,
  `MemberCode` varchar(20) DEFAULT NULL,
  `WolfDou` int(10) DEFAULT NULL,
  `Status` int(10) DEFAULT NULL COMMENT '点赞状态：0初始状态；1完成支付；2拒绝退回；3关闭退回',
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`GoodID`)
) ENGINE=InnoDB AUTO_INCREMENT=556 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_notes_room
-- ----------------------------
DROP TABLE IF EXISTS `wf_notes_room`;
CREATE TABLE `wf_notes_room` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `RoomCode` varchar(255) DEFAULT NULL,
  `Status` int(10) DEFAULT '0',
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=434 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_quotation_comment
-- ----------------------------
DROP TABLE IF EXISTS `wf_quotation_comment`;
CREATE TABLE `wf_quotation_comment` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `StockCode` varchar(20) DEFAULT '' COMMENT '股票代码',
  `StockType` varchar(10) DEFAULT '' COMMENT '股票类型,sh,sz',
  `ParentID` int(11) DEFAULT NULL COMMENT '父评论ID',
  `Content` varchar(500) DEFAULT NULL COMMENT '评论内容',
  `CreateUser` varchar(20) DEFAULT NULL COMMENT '评论人沃夫号',
  `CreateTime` datetime DEFAULT NULL,
  `IsDelete` bit(1) DEFAULT b'0' COMMENT '是否删除,0表示正常,1表示删除',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_rank_test
-- ----------------------------
DROP TABLE IF EXISTS `wf_rank_test`;
CREATE TABLE `wf_rank_test` (
  `MemberCode` varchar(20) DEFAULT NULL,
  `AvgProfit` decimal(25,8) DEFAULT NULL,
  `daycnt` bigint(21) DEFAULT NULL,
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=1537 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_securities
-- ----------------------------
DROP TABLE IF EXISTS `wf_securities`;
CREATE TABLE `wf_securities` (
  `SecuritiesID` int(11) NOT NULL AUTO_INCREMENT,
  `SecuritiesNo` varchar(50) DEFAULT NULL,
  `SecuritiesName` varchar(255) DEFAULT NULL,
  `Remark` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`SecuritiesID`)
) ENGINE=InnoDB AUTO_INCREMENT=5349 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_securities_comment
-- ----------------------------
DROP TABLE IF EXISTS `wf_securities_comment`;
CREATE TABLE `wf_securities_comment` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `SecuritiesNo` varchar(50) DEFAULT NULL COMMENT '证券号码',
  `Content` varchar(100) DEFAULT NULL COMMENT '内容',
  `CreateUser` varchar(120) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `Extended` varchar(120) DEFAULT NULL COMMENT '推展字段',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_securities_config
-- ----------------------------
DROP TABLE IF EXISTS `wf_securities_config`;
CREATE TABLE `wf_securities_config` (
  `ConfigID` int(11) NOT NULL AUTO_INCREMENT,
  `MemberCode` varchar(20) DEFAULT NULL,
  `Price` int(10) DEFAULT NULL,
  `UpdateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`ConfigID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_securities_dw
-- ----------------------------
DROP TABLE IF EXISTS `wf_securities_dw`;
CREATE TABLE `wf_securities_dw` (
  `Id` varchar(65) DEFAULT NULL,
  `SecuritiesNo` varchar(20) DEFAULT NULL,
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_securities_my
-- ----------------------------
DROP TABLE IF EXISTS `wf_securities_my`;
CREATE TABLE `wf_securities_my` (
  `MyID` int(11) NOT NULL AUTO_INCREMENT,
  `MemberCode` varchar(255) DEFAULT NULL,
  `SecuritiesNo` varchar(50) DEFAULT NULL,
  `Sorting` int(11) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`MyID`)
) ENGINE=InnoDB AUTO_INCREMENT=504 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_securities_pay
-- ----------------------------
DROP TABLE IF EXISTS `wf_securities_pay`;
CREATE TABLE `wf_securities_pay` (
  `PayID` int(11) NOT NULL AUTO_INCREMENT COMMENT '投资组合付款表',
  `InMemberCode` varchar(20) DEFAULT NULL COMMENT '收款人',
  `OutMemberCode` varchar(20) DEFAULT NULL COMMENT '付款人',
  `PayAmount` int(11) DEFAULT NULL COMMENT '付款金额',
  `PayTime` datetime DEFAULT NULL COMMENT '付款时间',
  PRIMARY KEY (`PayID`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_securities_remind
-- ----------------------------
DROP TABLE IF EXISTS `wf_securities_remind`;
CREATE TABLE `wf_securities_remind` (
  `RemindId` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '股价提醒表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `SmallType` varchar(20) DEFAULT NULL COMMENT '新浪查询urlcode',
  `SecuritiesNo` varchar(20) DEFAULT NULL COMMENT '股票代码',
  `LowerLimit` decimal(20,2) DEFAULT '0.00' COMMENT '股票跌到下限值',
  `IsOpenLower` bit(1) DEFAULT NULL COMMENT '是否打开最低值提醒',
  `UpperLimit` decimal(20,2) DEFAULT '0.00' COMMENT '股票涨到最高值提醒',
  `IsOpenUpper` bit(1) DEFAULT NULL COMMENT '是否打开最高值',
  `FallLimit` decimal(10,4) DEFAULT '0.0000' COMMENT '涨跌幅',
  `IsOpenFall` bit(1) DEFAULT NULL COMMENT '是否开启涨跌幅提醒',
  `RiseLimit` decimal(10,4) DEFAULT NULL,
  `IsOpenRise` bit(1) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`RemindId`)
) ENGINE=InnoDB AUTO_INCREMENT=511 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_securities_trade
-- ----------------------------
DROP TABLE IF EXISTS `wf_securities_trade`;
CREATE TABLE `wf_securities_trade` (
  `SecuritiesID` int(11) NOT NULL AUTO_INCREMENT,
  `SecuritiesNo` varchar(50) DEFAULT NULL,
  `SecuritiesName` varchar(255) DEFAULT NULL,
  `Remark` varchar(255) DEFAULT NULL COMMENT 'sh,sz,hk,us（gb_小写）,期权（qq）,股指欧美(gzom，b_大写)，股指亚太（gzyt，b_大写），期货（qh，hf_大写），外汇（wh，大写）',
  `BigType` varchar(50) DEFAULT NULL COMMENT '大类别',
  `SmallType` varchar(50) DEFAULT NULL COMMENT '小类别',
  `QueryUrlCode` varchar(50) DEFAULT NULL COMMENT '新浪查询urlcode',
  `PinYin` varchar(255) DEFAULT NULL COMMENT '拼音',
  `FirstPinYin` varchar(100) DEFAULT NULL COMMENT '拼音首字母',
  `Trade_ParentID` varchar(20) DEFAULT NULL,
  `Trade_ID` varchar(20) DEFAULT NULL,
  `Expand` varchar(255) DEFAULT NULL COMMENT '拓展字段',
  `ShowType` varchar(20) DEFAULT '' COMMENT '展示分类：美股中概股(CCS)，美股明星股(GS)，美股ETFs(ETF)，港股创业板(HKGEM)，沪深创业板(HSGEM)',
  `Hotrank` int(11) DEFAULT '0' COMMENT '热度',
  PRIMARY KEY (`SecuritiesID`)
) ENGINE=InnoDB AUTO_INCREMENT=20745 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_securities_version
-- ----------------------------
DROP TABLE IF EXISTS `wf_securities_version`;
CREATE TABLE `wf_securities_version` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Content` text COMMENT 'sql语句',
  `Versions` int(11) DEFAULT NULL COMMENT '版本号',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_shareurl
-- ----------------------------
DROP TABLE IF EXISTS `wf_shareurl`;
CREATE TABLE `wf_shareurl` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `Code` varchar(50) DEFAULT NULL COMMENT '编号',
  `Name` varchar(50) DEFAULT NULL COMMENT '分享名称(1资讯分享2 视频分享3 主播开播分享4 分享直播间 5 分享他人主页6 分享行情)',
  `Type` varchar(50) DEFAULT NULL COMMENT '分享类型(1资讯分享2 视频分享3 主播开播分享4 分享直播间 5 分享他人主页6 分享行情)',
  `Url` varchar(200) DEFAULT NULL COMMENT '分享链接',
  `CreateUser` varchar(120) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `Extended` varchar(120) DEFAULT NULL COMMENT '推展字段',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_start
-- ----------------------------
DROP TABLE IF EXISTS `wf_start`;
CREATE TABLE `wf_start` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `NewsCode` varchar(50) DEFAULT NULL COMMENT '资讯Code',
  `BGMusic` varchar(200) DEFAULT NULL COMMENT '背景音乐',
  `HDPicture` varchar(200) DEFAULT NULL COMMENT '高清图片(750*1334)',
  `BDPicture` varchar(200) DEFAULT NULL COMMENT '标清图片(大图750*400)',
  `IsShow` bit(1) DEFAULT NULL COMMENT '展示状态（true展示，false不展示）',
  `Remark` varchar(120) DEFAULT NULL COMMENT '备注',
  `CreateUser` varchar(120) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  `Extended` varchar(120) DEFAULT NULL COMMENT '推展字段',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_statistics_analyse
-- ----------------------------
DROP TABLE IF EXISTS `wf_statistics_analyse`;
CREATE TABLE `wf_statistics_analyse` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '统计分析表',
  `Title` varchar(20) NOT NULL COMMENT '标题',
  `Sun` int(11) NOT NULL DEFAULT '0' COMMENT '真实数据',
  `Shadow` int(11) NOT NULL DEFAULT '0' COMMENT '不可说数据',
  `StatisticsTime` date NOT NULL COMMENT '统计时间',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2246 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_statistics_login
-- ----------------------------
DROP TABLE IF EXISTS `wf_statistics_login`;
CREATE TABLE `wf_statistics_login` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '登录日志表',
  `LoginId` varchar(64) NOT NULL DEFAULT '' COMMENT '登录状态：沃夫号',
  `DataSource` varchar(10) NOT NULL DEFAULT '' COMMENT 'IOS,Android',
  `AppVersion` varchar(10) NOT NULL DEFAULT '' COMMENT 'App版本号',
  `IsLogin` tinyint(4) NOT NULL COMMENT '是否登录，1登录，0未登录',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=94385 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_statistics_module
-- ----------------------------
DROP TABLE IF EXISTS `wf_statistics_module`;
CREATE TABLE `wf_statistics_module` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '模块点击统计表',
  `LoginId` varchar(64) NOT NULL DEFAULT '' COMMENT '登录状态：沃夫号',
  `TypeId` tinyint(4) NOT NULL COMMENT '统计分类ID,TypeId为21-26',
  `IsLogin` tinyint(4) NOT NULL COMMENT '是否登录，1登录，0未登录',
  `StartTime` datetime DEFAULT NULL COMMENT '开始时间',
  `EndTime` datetime DEFAULT NULL COMMENT '结束时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=122586 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_statistics_page
-- ----------------------------
DROP TABLE IF EXISTS `wf_statistics_page`;
CREATE TABLE `wf_statistics_page` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '页面统计表',
  `LoginId` varchar(64) NOT NULL DEFAULT '' COMMENT '登录状态：沃夫号',
  `TypeId` tinyint(4) NOT NULL COMMENT '统计分类ID,TypeId为13-20',
  `PageId` int(11) NOT NULL COMMENT '页面id',
  `IsLogin` tinyint(4) NOT NULL COMMENT '是否登录，1登录，0未登录',
  `StartTime` datetime DEFAULT NULL COMMENT '开始时间',
  `EndTime` datetime DEFAULT NULL COMMENT '结束时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=63428 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_statistics_personalcenter
-- ----------------------------
DROP TABLE IF EXISTS `wf_statistics_personalcenter`;
CREATE TABLE `wf_statistics_personalcenter` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '个人中心统计表',
  `LoginId` varchar(64) NOT NULL DEFAULT '' COMMENT '登录状态：沃夫号',
  `MemberCode` varchar(20) NOT NULL COMMENT '被查看个人中心沃夫号',
  `StartTime` datetime DEFAULT NULL COMMENT '开始时间',
  `EndTime` datetime DEFAULT NULL COMMENT '结束时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_statistics_privateletter
-- ----------------------------
DROP TABLE IF EXISTS `wf_statistics_privateletter`;
CREATE TABLE `wf_statistics_privateletter` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '私信统计表',
  `LoginId` varchar(64) NOT NULL DEFAULT '' COMMENT '登录状态：沃夫号',
  `MemberCode` varchar(20) NOT NULL COMMENT '被私信人沃夫号',
  `StartTime` datetime DEFAULT NULL COMMENT '开始时间',
  `EndTime` datetime DEFAULT NULL COMMENT '结束时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_statistics_rank
-- ----------------------------
DROP TABLE IF EXISTS `wf_statistics_rank`;
CREATE TABLE `wf_statistics_rank` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '统计排行表',
  `Type` tinyint(4) NOT NULL COMMENT '分类：19资讯、18图说、17精选、14书籍、13投票、1banner条',
  `PageId` int(11) NOT NULL COMMENT '页面id',
  `Sun` int(11) NOT NULL DEFAULT '0' COMMENT '真实数据',
  `Shadow` int(11) NOT NULL DEFAULT '0' COMMENT '不可说数据',
  `StatisticsTime` date NOT NULL COMMENT '统计时间',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=18960 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_statistics_stock
-- ----------------------------
DROP TABLE IF EXISTS `wf_statistics_stock`;
CREATE TABLE `wf_statistics_stock` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '页面统计表',
  `LoginId` varchar(64) NOT NULL DEFAULT '' COMMENT '登录状态：沃夫号',
  `StockType` varchar(10) NOT NULL DEFAULT '' COMMENT '股票类型',
  `StockNo` varchar(10) NOT NULL DEFAULT '' COMMENT '股票编码',
  `IsLogin` tinyint(4) NOT NULL COMMENT '是否登录，1登录，0未登录',
  `StartTime` datetime DEFAULT NULL COMMENT '开始时间',
  `EndTime` datetime DEFAULT NULL COMMENT '结束时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=537095 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_statistics_stock_rank
-- ----------------------------
DROP TABLE IF EXISTS `wf_statistics_stock_rank`;
CREATE TABLE `wf_statistics_stock_rank` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '股票统计排行表',
  `StockType` varchar(10) NOT NULL DEFAULT '' COMMENT '股票类型',
  `StockNo` varchar(10) NOT NULL DEFAULT '' COMMENT '股票编码',
  `Sun` int(11) NOT NULL DEFAULT '0' COMMENT '真实数据',
  `Shadow` int(11) NOT NULL DEFAULT '0' COMMENT '不可说数据',
  `StatisticsTime` date NOT NULL COMMENT '统计时间',
  `CreateTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=27440 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_statistics_type
-- ----------------------------
DROP TABLE IF EXISTS `wf_statistics_type`;
CREATE TABLE `wf_statistics_type` (
  `Id` tinyint(4) NOT NULL COMMENT '统计分类表',
  `TypeName` varchar(64) NOT NULL DEFAULT '' COMMENT '统计分类名称',
  `TypeDesc` varchar(64) NOT NULL DEFAULT '' COMMENT '统计分类描述',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_statistics_user
-- ----------------------------
DROP TABLE IF EXISTS `wf_statistics_user`;
CREATE TABLE `wf_statistics_user` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户注册信息统计',
  `Totalreg` int(11) DEFAULT NULL COMMENT '总注册人数',
  `Dayreg` int(11) DEFAULT NULL COMMENT '当日注册人数',
  `Loginnum` int(11) DEFAULT NULL COMMENT '登录人数',
  `Keepnum` int(11) DEFAULT NULL COMMENT '次日留存人数',
  `Startnum` int(11) DEFAULT NULL COMMENT '启动次数',
  `StatisticsTime` date DEFAULT NULL COMMENT '统计时间',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=551 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_stock_hs
-- ----------------------------
DROP TABLE IF EXISTS `wf_stock_hs`;
CREATE TABLE `wf_stock_hs` (
  `Id` int(10) NOT NULL AUTO_INCREMENT,
  `SecuritiesNo` varchar(20) NOT NULL COMMENT '股票代码',
  `SecuritiesName` varchar(255) NOT NULL COMMENT '股票名称',
  `SPreClose` decimal(10,2) DEFAULT NULL COMMENT '前收盘价',
  `SOpen` decimal(10,2) DEFAULT NULL COMMENT '开盘价',
  `SHigh` decimal(10,2) DEFAULT NULL COMMENT '最高价',
  `SLow` decimal(10,2) DEFAULT NULL COMMENT '最低价',
  `SClose` decimal(10,2) DEFAULT NULL COMMENT '收盘价',
  `SChange` decimal(10,2) DEFAULT NULL COMMENT '涨跌',
  `SPctChange` decimal(18,6) DEFAULT NULL COMMENT '涨跌幅',
  `SVolume` decimal(30,2) DEFAULT NULL COMMENT '成交量',
  `SAmount` decimal(30,2) DEFAULT NULL COMMENT '成交额',
  `SAmplitude` decimal(30,6) DEFAULT NULL COMMENT '振幅',
  `STradestatus` varchar(64) DEFAULT NULL COMMENT '交易状态',
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=656102 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_stock_hs_add
-- ----------------------------
DROP TABLE IF EXISTS `wf_stock_hs_add`;
CREATE TABLE `wf_stock_hs_add` (
  `Id` int(10) NOT NULL AUTO_INCREMENT,
  `SecuritiesNo` varchar(20) NOT NULL COMMENT '股票代码',
  `SecuritiesName` varchar(255) NOT NULL COMMENT '股票名称',
  `SPreClose` decimal(10,2) DEFAULT NULL COMMENT '前收盘价',
  `SOpen` decimal(10,2) DEFAULT NULL COMMENT '开盘价',
  `SHigh` decimal(10,2) DEFAULT NULL COMMENT '最高价',
  `SLow` decimal(10,2) DEFAULT NULL COMMENT '最低价',
  `SClose` decimal(10,2) DEFAULT NULL COMMENT '收盘价',
  `SChange` decimal(10,2) DEFAULT NULL COMMENT '涨跌',
  `SPctChange` decimal(18,6) DEFAULT NULL COMMENT '涨跌幅',
  `SVolume` decimal(30,2) DEFAULT NULL COMMENT '成交量',
  `SAmount` decimal(30,2) DEFAULT NULL COMMENT '成交额',
  `SAmplitude` decimal(30,6) DEFAULT NULL COMMENT '振幅',
  `STradestatus` varchar(64) DEFAULT NULL COMMENT '交易状态',
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_stockcompetitionmember
-- ----------------------------
DROP TABLE IF EXISTS `wf_stockcompetitionmember`;
CREATE TABLE `wf_stockcompetitionmember` (
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `CollegeName` varchar(100) DEFAULT '' COMMENT '大学名称',
  `Mobile` varchar(20) DEFAULT '' COMMENT '手机号',
  `UserName` varchar(20) DEFAULT '' COMMENT '学生姓名',
  `StudentID` varchar(20) DEFAULT '' COMMENT '学号',
  `CreateTime` datetime DEFAULT NULL,
  `Source` tinyint(4) DEFAULT '0' COMMENT '来源,0为手机端报名,1为运营端报名',
  `CompetitionId` int(11) DEFAULT NULL COMMENT '比赛ID',
  `Sex` varchar(1) DEFAULT NULL COMMENT '性别 男，女',
  `Specialty` varchar(64) DEFAULT NULL COMMENT '专业',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`),
  KEY `idx_scm_membercode` (`MemberCode`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2806 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_system_about
-- ----------------------------
DROP TABLE IF EXISTS `wf_system_about`;
CREATE TABLE `wf_system_about` (
  `AboutID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Contents` text,
  `EditStaff` varchar(20) DEFAULT NULL,
  `EditTime` datetime DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`AboutID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_system_appconfig
-- ----------------------------
DROP TABLE IF EXISTS `wf_system_appconfig`;
CREATE TABLE `wf_system_appconfig` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'app配置表',
  `AppKey` varchar(128) DEFAULT NULL COMMENT 'Key值',
  `AppValue` varchar(128) DEFAULT NULL COMMENT 'Value值',
  `AppVersion` varchar(20) DEFAULT NULL COMMENT 'App版本',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_system_closedate
-- ----------------------------
DROP TABLE IF EXISTS `wf_system_closedate`;
CREATE TABLE `wf_system_closedate` (
  `dealdate` datetime DEFAULT NULL COMMENT '时间',
  `type` varchar(2) NOT NULL DEFAULT '',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=189 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_system_downloadhistory
-- ----------------------------
DROP TABLE IF EXISTS `wf_system_downloadhistory`;
CREATE TABLE `wf_system_downloadhistory` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IP` varchar(255) DEFAULT NULL COMMENT '访问IP',
  `ActivityName` varchar(255) DEFAULT NULL COMMENT '活动名称',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `PlatForm` varchar(255) DEFAULT NULL COMMENT '平台,1是IOS,2是安卓',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2309 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_system_feedback
-- ----------------------------
DROP TABLE IF EXISTS `wf_system_feedback`;
CREATE TABLE `wf_system_feedback` (
  `FeedbackID` int(11) NOT NULL AUTO_INCREMENT COMMENT '系统反馈表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '反馈的用户',
  `Title` varchar(255) DEFAULT NULL COMMENT '反馈标题',
  `Contents` varchar(2000) DEFAULT NULL COMMENT '反馈内容',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`FeedbackID`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_system_log
-- ----------------------------
DROP TABLE IF EXISTS `wf_system_log`;
CREATE TABLE `wf_system_log` (
  `LogID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '系统操作日志表',
  `LogCode` varchar(20) DEFAULT NULL COMMENT '日志编码',
  `MemberCode` varchar(20) DEFAULT NULL,
  `LogType` varchar(255) DEFAULT NULL,
  `Contents` text,
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`LogID`)
) ENGINE=InnoDB AUTO_INCREMENT=267 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_system_opendate
-- ----------------------------
DROP TABLE IF EXISTS `wf_system_opendate`;
CREATE TABLE `wf_system_opendate` (
  `DealDate` datetime DEFAULT NULL COMMENT '时间',
  `Type` varchar(10) DEFAULT NULL COMMENT '股票类型',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=566 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_system_opendate_bak
-- ----------------------------
DROP TABLE IF EXISTS `wf_system_opendate_bak`;
CREATE TABLE `wf_system_opendate_bak` (
  `DealDate` datetime DEFAULT NULL COMMENT '时间',
  `Type` varchar(10) CHARACTER SET utf8 DEFAULT NULL COMMENT '股票类型',
  `id` int(11) NOT NULL DEFAULT '0',
  `weeked` int(11) DEFAULT NULL,
  `StartTimeAM` datetime DEFAULT NULL,
  `EndTimeAM` datetime DEFAULT NULL,
  `StartTimePM` datetime DEFAULT NULL,
  `EndTimePM` datetime DEFAULT NULL,
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=1503 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_system_provide_news
-- ----------------------------
DROP TABLE IF EXISTS `wf_system_provide_news`;
CREATE TABLE `wf_system_provide_news` (
  `ProvideNewsID` int(11) NOT NULL AUTO_INCREMENT COMMENT '爆料',
  `MemberCode` varchar(20) DEFAULT NULL,
  `BusinessCode` varchar(50) DEFAULT NULL COMMENT '业务编码',
  `ContactWay` varchar(255) DEFAULT NULL COMMENT '联系方式',
  `Contents` text COMMENT '内容',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`ProvideNewsID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_system_provide_news_file
-- ----------------------------
DROP TABLE IF EXISTS `wf_system_provide_news_file`;
CREATE TABLE `wf_system_provide_news_file` (
  `FileID` int(11) NOT NULL AUTO_INCREMENT COMMENT '爆料附件',
  `BusinessCode` varchar(255) DEFAULT NULL COMMENT '业务编码',
  `FileUrl` varchar(1024) DEFAULT NULL COMMENT '文件地址',
  `FileType` varchar(255) DEFAULT NULL COMMENT '文件类型',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`FileID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_system_roomstatus
-- ----------------------------
DROP TABLE IF EXISTS `wf_system_roomstatus`;
CREATE TABLE `wf_system_roomstatus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `streamid` varchar(255) DEFAULT NULL,
  `createtime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4910 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_system_setting
-- ----------------------------
DROP TABLE IF EXISTS `wf_system_setting`;
CREATE TABLE `wf_system_setting` (
  `SettingID` int(11) NOT NULL AUTO_INCREMENT COMMENT '推送设置表',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '会员沃夫号',
  `RemindVoice` bit(1) DEFAULT NULL COMMENT '提醒声音',
  `CommentNotice` bit(1) DEFAULT NULL COMMENT '点赞和评论时通知我',
  `FollowMe` bit(1) DEFAULT NULL COMMENT '有人关注我',
  `MessageAlert` bit(1) DEFAULT NULL COMMENT '官方消息提醒',
  `PrivateLetterAlert` bit(1) DEFAULT NULL COMMENT '私信',
  `OpenPlayAlert` bit(1) DEFAULT NULL COMMENT '开播提醒',
  `NoFollowAlert` bit(1) DEFAULT NULL COMMENT '拒收未关注人的消息',
  `DontDisturb` bit(1) DEFAULT NULL COMMENT '免打扰',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `PriceNotify` bit(1) DEFAULT b'1' COMMENT '股价通知',
  PRIMARY KEY (`SettingID`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_test
-- ----------------------------
DROP TABLE IF EXISTS `wf_test`;
CREATE TABLE `wf_test` (
  `NewsCode` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '资讯表Id',
  `cnt` bigint(21) NOT NULL DEFAULT '0',
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_test1
-- ----------------------------
DROP TABLE IF EXISTS `wf_test1`;
CREATE TABLE `wf_test1` (
  `a` varchar(50) DEFAULT NULL,
  `__#alibaba_rds_row_id#__` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Implicit Primary Key by RDS',
  KEY `__#alibaba_rds_row_id#__` (`__#alibaba_rds_row_id#__`)
) ENGINE=InnoDB AUTO_INCREMENT=17890 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_token
-- ----------------------------
DROP TABLE IF EXISTS `wf_token`;
CREATE TABLE `wf_token` (
  `TokenID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ClientType` varchar(10) DEFAULT NULL,
  `MemberCode` varchar(10) DEFAULT NULL,
  `TokenValue` varchar(255) DEFAULT NULL,
  `Status` int(4) DEFAULT NULL,
  `ValidityTime` datetime DEFAULT NULL,
  PRIMARY KEY (`TokenID`),
  KEY `idx_token_value` (`TokenValue`)
) ENGINE=InnoDB AUTO_INCREMENT=2849 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_verify_code
-- ----------------------------
DROP TABLE IF EXISTS `wf_verify_code`;
CREATE TABLE `wf_verify_code` (
  `VerifyCodeID` bigint(20) NOT NULL AUTO_INCREMENT,
  `CountryCode` varchar(50) DEFAULT NULL,
  `MemberAccount` varchar(255) DEFAULT NULL,
  `VerifyCode` varchar(255) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`VerifyCodeID`)
) ENGINE=InnoDB AUTO_INCREMENT=6958 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Table structure for wf_video_banner
-- ----------------------------
DROP TABLE IF EXISTS `wf_video_banner`;
CREATE TABLE `wf_video_banner` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(50) DEFAULT NULL COMMENT '标题',
  `VideoCode` varchar(255) DEFAULT NULL COMMENT '视频编号',
  `CoverImageUrl` varchar(200) DEFAULT NULL COMMENT '封面地址',
  `IsDelete` bit(1) DEFAULT NULL COMMENT '0表示正常,1表示删除',
  `SortOrder` int(11) DEFAULT '0' COMMENT '排序编号,越大越靠前',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_video_column
-- ----------------------------
DROP TABLE IF EXISTS `wf_video_column`;
CREATE TABLE `wf_video_column` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL COMMENT '专栏名称',
  `CoverImageUrl` varchar(100) DEFAULT '' COMMENT '封面图片',
  `IsDelete` bit(1) DEFAULT b'0' COMMENT '0为正常,1为删除',
  `SortOrder` int(11) DEFAULT '0' COMMENT '排序数字,越大越靠前',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_video_comment
-- ----------------------------
DROP TABLE IF EXISTS `wf_video_comment`;
CREATE TABLE `wf_video_comment` (
  `CommentID` int(11) NOT NULL AUTO_INCREMENT COMMENT '视频评论',
  `VideoType` varchar(20) DEFAULT NULL COMMENT '视频类型：video，live',
  `VideoCode` varchar(20) DEFAULT NULL COMMENT '评论的视频',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '评论人',
  `Contents` varchar(1024) DEFAULT NULL COMMENT '评论内容',
  `StarLevel` decimal(10,1) DEFAULT NULL COMMENT '评论星级',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `IsDelete` bit(1) DEFAULT b'0',
  `ParentID` int(11) DEFAULT '0',
  PRIMARY KEY (`CommentID`)
) ENGINE=InnoDB AUTO_INCREMENT=478 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_video_dissertation
-- ----------------------------
DROP TABLE IF EXISTS `wf_video_dissertation`;
CREATE TABLE `wf_video_dissertation` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL COMMENT '专题名称',
  `Description` varchar(500) DEFAULT NULL COMMENT '描述',
  `CoverImageUrl` varchar(255) DEFAULT NULL COMMENT '封面地址',
  `IsDelete` bit(1) DEFAULT b'0' COMMENT '0为正常,1为删除',
  `SortOrder` int(11) DEFAULT '0' COMMENT '排序,越大越靠前',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_video_favorites
-- ----------------------------
DROP TABLE IF EXISTS `wf_video_favorites`;
CREATE TABLE `wf_video_favorites` (
  `FavoritesID` int(11) NOT NULL AUTO_INCREMENT COMMENT '视频收藏',
  `VideoCode` varchar(20) DEFAULT NULL COMMENT '视频编码',
  `MemberCode` varchar(255) DEFAULT NULL COMMENT '收藏人',
  `CreateTime` datetime DEFAULT NULL COMMENT '收藏时间',
  PRIMARY KEY (`FavoritesID`)
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_video_good
-- ----------------------------
DROP TABLE IF EXISTS `wf_video_good`;
CREATE TABLE `wf_video_good` (
  `GoodID` int(11) NOT NULL AUTO_INCREMENT COMMENT '视频点赞',
  `VideoCode` varchar(20) DEFAULT NULL COMMENT '视频编码',
  `MemberCode` varchar(255) DEFAULT NULL COMMENT '点赞人',
  `Status` int(10) DEFAULT NULL COMMENT '点赞状态',
  `CreateTime` datetime DEFAULT NULL COMMENT '点赞时间',
  PRIMARY KEY (`GoodID`)
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_vote
-- ----------------------------
DROP TABLE IF EXISTS `wf_vote`;
CREATE TABLE `wf_vote` (
  `VoteId` int(11) NOT NULL AUTO_INCREMENT COMMENT '投票',
  `VoteCode` varchar(50) DEFAULT NULL COMMENT '投票编号',
  `Title` varchar(255) DEFAULT NULL COMMENT '标题',
  `Description` text COMMENT '描述',
  `CoverImage` varchar(255) DEFAULT NULL COMMENT '图片',
  `HomePageImage` varchar(255) DEFAULT NULL COMMENT ' 详情图',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `IsDelete` bit(1) DEFAULT NULL,
  `StopTime` datetime DEFAULT NULL COMMENT '截止时间',
  `CommentCount` int(20) DEFAULT '0' COMMENT '评论次数',
  `VoteCount` int(20) DEFAULT '0' COMMENT '投票人数',
  PRIMARY KEY (`VoteId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_vote_comment
-- ----------------------------
DROP TABLE IF EXISTS `wf_vote_comment`;
CREATE TABLE `wf_vote_comment` (
  `CommentID` int(11) NOT NULL AUTO_INCREMENT COMMENT '投票评论',
  `VoteCode` varchar(50) DEFAULT NULL COMMENT '评论的投票编号',
  `ParentID` int(11) DEFAULT NULL COMMENT '上级评论',
  `MemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `Contents` varchar(1024) DEFAULT NULL COMMENT '评论内容',
  `CreateTime` datetime DEFAULT NULL COMMENT '评论时间',
  `IsDelete` bit(1) DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (`CommentID`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_vote_option
-- ----------------------------
DROP TABLE IF EXISTS `wf_vote_option`;
CREATE TABLE `wf_vote_option` (
  `OptionId` int(11) NOT NULL AUTO_INCREMENT COMMENT '投票选项',
  `VoteCode` varchar(50) DEFAULT NULL COMMENT '投票编号',
  `ImageUrl` varchar(255) DEFAULT NULL COMMENT '选项图',
  `Description` varchar(255) DEFAULT NULL COMMENT '选项描述',
  `VoteCount` int(20) DEFAULT '0' COMMENT '投票次数',
  `IsDelete` bit(1) DEFAULT b'0' COMMENT '是否删除状态,0是正常,1表示删除',
  PRIMARY KEY (`OptionId`)
) ENGINE=InnoDB AUTO_INCREMENT=183 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_wx_cutmeatclicklike
-- ----------------------------
DROP TABLE IF EXISTS `wf_wx_cutmeatclicklike`;
CREATE TABLE `wf_wx_cutmeatclicklike` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MeatCode` varchar(20) DEFAULT NULL COMMENT '投票的主编号',
  `WxMemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `CreateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_wx_cutmeatcomment
-- ----------------------------
DROP TABLE IF EXISTS `wf_wx_cutmeatcomment`;
CREATE TABLE `wf_wx_cutmeatcomment` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MeatCode` varchar(20) DEFAULT NULL COMMENT '投票的主编号',
  `WxMemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `Comment` varchar(500) DEFAULT NULL COMMENT '评论',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=228 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_wx_cutmeatmain
-- ----------------------------
DROP TABLE IF EXISTS `wf_wx_cutmeatmain`;
CREATE TABLE `wf_wx_cutmeatmain` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `MeatCode` varchar(20) DEFAULT NULL COMMENT '投票的主编号',
  `WxMemberCode` varchar(20) DEFAULT NULL COMMENT '微信membercode',
  `StockCode` varchar(50) DEFAULT NULL COMMENT '股票代码',
  `Price` decimal(10,2) DEFAULT '0.00' COMMENT '成本价',
  `Description` varchar(100) DEFAULT NULL COMMENT '心情描述',
  `Anonymity` varchar(2) DEFAULT '0' COMMENT '状态,1是匿名,0是不匿名',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `State` varchar(2) DEFAULT NULL COMMENT '状态,1为正常,0为删除',
  `CutNum` int(11) DEFAULT '0' COMMENT '割肉人数',
  `NotCutNum` int(11) DEFAULT '0' COMMENT '不割肉的人数',
  `ClickLikeNum` int(11) DEFAULT '0' COMMENT '点赞数',
  `CommentNum` int(11) DEFAULT '0' COMMENT '评论数',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=170 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_wx_cutmeatvote
-- ----------------------------
DROP TABLE IF EXISTS `wf_wx_cutmeatvote`;
CREATE TABLE `wf_wx_cutmeatvote` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WxMemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `MeatCode` varchar(20) DEFAULT NULL COMMENT '投票主编号',
  `Cut` varchar(2) DEFAULT NULL COMMENT '1是割肉,0是不割',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=219 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_wx_game_guessstockhistory
-- ----------------------------
DROP TABLE IF EXISTS `wf_wx_game_guessstockhistory`;
CREATE TABLE `wf_wx_game_guessstockhistory` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `GuessStockCode` varchar(20) CHARACTER SET utf8mb4 DEFAULT NULL,
  `WxMemberCode` varchar(20) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '微信沃夫号',
  `WolfDou` int(11) DEFAULT NULL COMMENT '沃夫豆',
  `CreateTime` datetime DEFAULT NULL COMMENT 'GuessResult',
  `GuessResult` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '涨跌,0是跌,1是涨,2是平',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_wx_game_guessstockmain
-- ----------------------------
DROP TABLE IF EXISTS `wf_wx_game_guessstockmain`;
CREATE TABLE `wf_wx_game_guessstockmain` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `Code` varchar(20) DEFAULT NULL COMMENT '竞猜编号',
  `StartTime` datetime DEFAULT NULL COMMENT '开始时间',
  `EndTime` datetime DEFAULT NULL COMMENT '结束时间',
  `Result` varchar(1) DEFAULT NULL COMMENT '涨跌,0是跌,1是涨,2是平',
  `Type` varchar(1) DEFAULT NULL COMMENT '类型,1为上证,2为港股恒生,3为美股道琼斯',
  `Price` varchar(10) DEFAULT NULL COMMENT '收盘指数',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wf_wx_game_sendmoneyhistory
-- ----------------------------
DROP TABLE IF EXISTS `wf_wx_game_sendmoneyhistory`;
CREATE TABLE `wf_wx_game_sendmoneyhistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `WxMemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `GuessCode` varchar(20) DEFAULT NULL COMMENT '竞猜CODE',
  `WolfDou` int(11) DEFAULT '0' COMMENT '沃夫豆数',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for wf_wx_newyearcouplets
-- ----------------------------
DROP TABLE IF EXISTS `wf_wx_newyearcouplets`;
CREATE TABLE `wf_wx_newyearcouplets` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增长ID',
  `WxMemeberCode` varchar(20) DEFAULT NULL COMMENT '微信沃夫号',
  `ImageUrl` varchar(500) DEFAULT NULL COMMENT '图片地址',
  `CreateTime` datetime DEFAULT NULL,
  `CoupletsCode` varchar(20) DEFAULT NULL COMMENT '对联编号',
  `CoupletsId` int(10) DEFAULT '0' COMMENT '春联ID',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_wx_smallprogrammember
-- ----------------------------
DROP TABLE IF EXISTS `wf_wx_smallprogrammember`;
CREATE TABLE `wf_wx_smallprogrammember` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增长ID',
  `WxMemberCode` varchar(20) DEFAULT NULL COMMENT '沃夫号',
  `State` varchar(2) DEFAULT NULL COMMENT '状态,0表示未注册,1表示注册',
  `Country` varchar(20) DEFAULT NULL COMMENT '国家',
  `Province` varchar(50) DEFAULT NULL COMMENT '省',
  `City` varchar(50) DEFAULT NULL COMMENT '城市',
  `Nickname` varchar(20) DEFAULT NULL COMMENT '昵称',
  `Sex` varchar(10) DEFAULT NULL COMMENT '微信的性别',
  `HeadImage` longtext COMMENT '头像',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `AppID` varchar(50) DEFAULT NULL COMMENT '微信公众号的appid',
  `OpenId` varchar(50) DEFAULT NULL COMMENT '微信的ID',
  `WolfDou` int(11) DEFAULT '0' COMMENT '沃夫豆',
  `MemberCode` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=332 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wf_wx_token
-- ----------------------------
DROP TABLE IF EXISTS `wf_wx_token`;
CREATE TABLE `wf_wx_token` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增长Id',
  `TokenValue` varchar(255) DEFAULT NULL COMMENT 'token值',
  `CreateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `WxMemberCode` varchar(20) DEFAULT NULL COMMENT '微信的membercode',
  `State` varchar(2) DEFAULT NULL COMMENT '0表示失效,1表示正常',
  `Session_key` varchar(50) DEFAULT NULL COMMENT '微信提供的session_key',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2033 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Procedure structure for PRC_WF_ACCEPT_JOINTEAM
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_ACCEPT_JOINTEAM`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_ACCEPT_JOINTEAM`(IN `P_MEMBERCODE` varchar(20),IN `P_MEMBERCODE2` varchar(20),OUT `P_RESULT` tinyint,OUT `P_TEAMID` int,OUT `P_TEAMNAME` varchar(64))
BEGIN
	DECLARE t_error INTEGER DEFAULT 0;  
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET t_error=1; 
set P_TEAMID = '';
set P_TEAMNAME = '';
select Id ,MemberCount,TeamName into @tid,@p_MemberCount,@teamname from wf_competition_team where MemberCode = P_MEMBERCODE and `Status`<2;
IF @tid is not null then
	set P_TEAMID = @tid;
	set P_TEAMNAME = @teamname;
	if @p_MemberCount >= 3 THEN
		set P_RESULT = -5;
	ELSE
		select State into @st from wf_competition_apply where MemberCode = P_MEMBERCODE2 AND TeamId = @tid;
		if @st is not null then
			if @st = 1 THEN
				select count(*) into @cnt from wf_competition_team_member where MemberCode = P_MEMBERCODE2 and Status = 1;	
				IF @cnt = 0 THEN
					START TRANSACTION;
					update wf_competition_apply set State = 2 where MemberCode = P_MEMBERCODE2 and TeamId = @tid;
					insert into wf_competition_team_member(TeamId,MemberCode,Level,Type,Status,CreateTime) values(@tid,P_MEMBERCODE2,2,3,1,now());
					update wf_competition_apply set State=4 where MemberCode=P_MEMBERCODE2 and TeamId<>@tid;
					IF @p_MemberCount = 2 THEN
						update wf_competition_team set Status = 1,MemberCount=@p_MemberCount+1 where Id = @tid;
					ELSE
						update wf_competition_team set Status = 0,MemberCount=@p_MemberCount+1 where Id = @tid;
					END IF;
					select concat(TeamName,' 队长已同意您的入队申请!')  into @tname from wf_competition_team where Id = @tid;
					insert into wf_message(Type,Content,MemberCode,Title,IsSend,CreateTime,SendTime) values(2,@tname,P_MEMBERCODE2,'申请已通过',1,now(),now());
					if t_error = 1 then
						set P_RESULT = 500;
						rollback;
					ELSE
						COMMIT;
						set P_RESULT = 0;
					end if;
				ELSE
					select count(*) into @cnt from wf_competition_team_member where MemberCode = P_MEMBERCODE2 and Status = 1 and TeamId = @tid;
					IF @cnt = 0 THEN
						set P_RESULT = -3;
					else
						set P_RESULT = -4;
					end if;
				END IF;
			ELSE
				set P_RESULT = @st;
			end if;
		ELSE
			set P_RESULT = -2;
		end if;
	end if;
	
	ELSE
		set P_RESULT = -1;
	end if;
	select P_RESULT,P_TEAMID,P_TEAMNAME; 
	
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_ANALYSE
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_ANALYSE`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_ANALYSE`(IN `P_DATE` varchar(10))
BEGIN
	#Routine body goes here...
DECLARE P_Y_DATE VARCHAR(10);
SET P_Y_DATE = DATE_SUB(P_DATE,INTERVAL 1 DAY);
	#1.当日直播场次
	INSERT INTO WF_ANALYSE 
	SELECT
		'当日直播场次' AS title,
		count(roomid) AS content,
		P_DATE AS dtime
	FROM
		wf_liveroom
	WHERE
		(
			substr(createtime, 1, 10) = P_DATE
			OR substr(destorytime, 1, 10) = P_DATE
		)
	AND destorytime IS NOT NULL;
	
	#2.当日直播时长（分钟）
	INSERT INTO WF_ANALYSE 
	SELECT
		'当日直播时长（分钟）' AS title,
		round(
			sum(
				UNIX_TIMESTAMP(destorytime)-UNIX_TIMESTAMP(createtime)
			) / 60
		) AS content,
		P_DATE AS dtime
	FROM
		wf_liveroom
	WHERE
		(
			substr(createtime, 1, 10) = P_DATE
			OR substr(destorytime, 1, 10) = P_DATE
		)
	AND destorytime IS NOT NULL;
	
	#3.当日直播用户数
	INSERT INTO WF_ANALYSE
	SELECT
		'当日直播用户数' AS title,
		count(a.membercode) AS content,
		P_DATE AS dtime
	FROM
		(
			SELECT DISTINCT
				MemberCode
			FROM
				wf_liveroom
			WHERE
				(
					substr(createtime, 1, 10) = P_DATE
					OR substr(destorytime, 1, 10) = P_DATE
				)
			AND destorytime IS NOT NULL
		) a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND b.DataSource = 'android';
	
	#4.当日累计观看用户数
	INSERT INTO WF_ANALYSE
	SELECT
		'当日累计观看用户数' AS titile,
		count(DISTINCT membercode) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations
	WHERE
		substr(createtime, 1, 10) = P_DATE;
		
	#5.当日累计观看用户数-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'当日累计观看用户数-ios' AS title,
		count(a.membercode) AS content,
		P_DATE AS dtime
		FROM
			(
				SELECT DISTINCT
					MemberCode
				FROM
					wf_live_memberoperations
				WHERE
					substr(createtime, 1, 10) = P_DATE
			) a,
			wf_member b
		WHERE
			a.MemberCode = b.MemberCode
		AND b.DataSource = 'ios';
	
	#6.当日累计观看用户数-android
	INSERT INTO WF_ANALYSE
	SELECT
		'当日累计观看用户数-android' AS title,
		count(a.membercode) AS content,
		P_DATE AS dtime
		FROM
			(
				SELECT DISTINCT
					MemberCode
				FROM
					wf_live_memberoperations
				WHERE
					substr(createtime, 1, 10) = P_DATE
			) a,
			wf_member b
		WHERE
			a.MemberCode = b.MemberCode
		AND b.DataSource = 'android';
	
	#7.当日累计观看用户数-other
	INSERT INTO WF_ANALYSE
	SELECT
		'当日累计观看用户数-other' AS title,
		count(a.membercode) AS content,
		P_DATE AS dtime
	FROM
		(
			SELECT DISTINCT
				MemberCode
			FROM
				wf_live_memberoperations
			WHERE
				substr(createtime, 1, 10) = P_DATE
		) a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND b.DataSource NOT IN ('ios', 'android');
	
	#8.场均观看用户数
	INSERT INTO WF_ANALYSE
	SELECT
		'场均观看用户数' AS title,
		floor(
			count(
				DISTINCT membercode,
				RoomCode
			) / (
				SELECT content from wf_analyse where title = '当日直播场次' and dtime = P_DATE)
		) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations
	WHERE
		substr(createtime, 1, 10) = P_DATE;
	
	#9.人均观看时长
	INSERT INTO WF_ANALYSE
	SELECT
		'人均观看时长' AS title,
		floor(
			sum(time) / (
				SELECT
					content
				FROM
					wf_analyse
				WHERE
					title = '当日累计观看用户数'
				AND dtime = P_DATE
			)
		) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations
	WHERE
		type = 2
	AND substr(createtime, 1, 10) = P_DATE;
	
	#10.当日人均观看时长-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'当日人均观看时长-ios' AS title,
		sum(a.time) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日累计观看用户数-ios'
			AND dtime = P_DATE
		) AS content,
		P_DATE AS dtime
	FROM
		(
			SELECT
				*
			FROM
				wf_live_memberoperations
			WHERE
				type = 2
			AND substr(createtime, 1, 10) = P_DATE
		) a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND b.DataSource = 'ios';
	
	#11.当日人均观看时长-android
	INSERT INTO WF_ANALYSE
	SELECT
		'当日人均观看时长-android' AS title,
		sum(a.time) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日累计观看用户数-android'
			AND dtime = P_DATE
		) AS content,
		P_DATE AS dtime
	FROM
		(
			SELECT
				*
			FROM
				wf_live_memberoperations
			WHERE
				type = 2
			AND substr(createtime, 1, 10) = P_DATE
		) a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND b.DataSource = 'android';	
	
	#12.当日人均观看时长-other
	INSERT INTO WF_ANALYSE
	SELECT
		'当日人均观看时长-other' AS title,
		sum(a.time) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日累计观看用户数-other'
			AND dtime = P_DATE
		) AS content,
		P_DATE AS dtime
	FROM
		(
			SELECT
				*
			FROM
				wf_live_memberoperations
			WHERE
				type = 2
			AND substr(createtime, 1, 10) = P_DATE
		) a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND b.DataSource not in ('ios','android');
	
	#13.人均观看场次
	INSERT INTO WF_ANALYSE
	SELECT
		'人均观看场次' AS title,
		floor(
			count(
				DISTINCT MemberCode,
				RoomCode
			) / count(DISTINCT membercode)
		) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations
	WHERE
		substr(createtime, 1, 10) = P_DATE;
	
	#14.当日人均观看场次-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'当日人均观看场次-ios' AS title,
		floor(
			count(
				DISTINCT a.MemberCode,
				a.RoomCode
			) / (
				SELECT
					content
				FROM
					wf_analyse
				WHERE
					title = '当日累计观看用户数-ios'
				AND dtime = P_DATE
			)) AS content,
			P_DATE AS dtime
		FROM
			(
				SELECT
					*
				FROM
					wf_live_memberoperations
				WHERE
					substr(createtime, 1, 10) = P_DATE
			) a,
			wf_member b
		WHERE
			a.MemberCode = b.MemberCode
		AND b.DataSource = 'ios';
	
	#15.当日人均观看场次-android
	INSERT INTO WF_ANALYSE
	SELECT
		'当日人均观看场次-android' AS title,
		floor(
			count(
				DISTINCT a.MemberCode,
				a.RoomCode
			) / (
				SELECT
					content
				FROM
					wf_analyse
				WHERE
					title = '当日累计观看用户数-android'
				AND dtime = P_DATE
			)) AS content,
			P_DATE AS dtime
		FROM
			(
				SELECT
					*
				FROM
					wf_live_memberoperations
				WHERE
					substr(createtime, 1, 10) = P_DATE
			) a,
			wf_member b
		WHERE
			a.MemberCode = b.MemberCode
		AND b.DataSource = 'android';	

	#16.当日人均观看场次-other
	INSERT INTO WF_ANALYSE
	SELECT
		'当日人均观看场次-other' AS title,
		floor(
			count(
				DISTINCT a.MemberCode,
				a.RoomCode
			) / (
				SELECT
					content
				FROM
					wf_analyse
				WHERE
					title = '当日累计观看用户数-other'
				AND dtime = P_DATE
			)) AS content,
			P_DATE AS dtime
		FROM
			(
				SELECT
					*
				FROM
					wf_live_memberoperations
				WHERE
					substr(createtime, 1, 10) = P_DATE
			) a,
			wf_member b
		WHERE
			a.MemberCode = b.MemberCode
		AND b.DataSource not in ('ios','android');	
	
	#17.当日活跃用户数
	INSERT INTO WF_ANALYSE
	SELECT
		'当日活跃用户数' AS titile,
		count(DISTINCT membercode) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations
	WHERE
		substr(createtime, 1, 10) = P_DATE;
		
	#18.当日活跃用户数-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'当日活跃用户数-ios' AS title,
		count(a.membercode) AS content,
		P_DATE AS dtime
		FROM
			(
				SELECT DISTINCT
					MemberCode
				FROM
					wf_live_memberoperations
				WHERE
					substr(createtime, 1, 10) = P_DATE
			) a,
			wf_member b
		WHERE
			a.MemberCode = b.MemberCode
		AND b.DataSource = 'ios';
	
	#19.当日活跃用户数-android
	INSERT INTO WF_ANALYSE
		SELECT
		'当日活跃用户数-android' AS title,
		count(a.membercode) AS content,
		P_DATE AS dtime
		FROM
			(
				SELECT DISTINCT
					MemberCode
				FROM
					wf_live_memberoperations
				WHERE
					substr(createtime, 1, 10) = P_DATE
			) a,
			wf_member b
		WHERE
			a.MemberCode = b.MemberCode
		AND b.DataSource = 'android';
	
	#20.当日活跃用户数-other
	INSERT INTO WF_ANALYSE
	SELECT
		'当日活跃用户数-other' AS title,
		count(a.membercode) AS content,
		P_DATE AS dtime
	FROM
		(
			SELECT DISTINCT
				MemberCode
			FROM
				wf_live_memberoperations
			WHERE
				substr(createtime, 1, 10) = P_DATE
		) a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND b.DataSource NOT IN ('ios', 'android');
	
	#21.次日留存用户数
	INSERT INTO WF_ANALYSE
	SELECT
		'次日留存用户数' AS title,
		count(tt.membercode) AS content,
		P_DATE AS dtime
	FROM
		(
			SELECT
				membercode,
				count(MemberCode) cnt
			FROM
				(
					SELECT DISTINCT
						MemberCode,
						substr(CreateTime, 1, 10)
					FROM
						wf_live_memberoperations
					WHERE
						substr(CreateTime, 1, 10) BETWEEN P_Y_DATE AND P_DATE
				) t
			GROUP BY
				t.MemberCode
		) tt
	WHERE
		tt.cnt = 2;

	#22.次日留存用户数-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'次日留存用户数-ios' AS title,
		count(tt.membercode) AS content,
		P_DATE as dtime
	FROM
		(
			SELECT
				membercode,
				count(MemberCode) cnt
			FROM
				(
					SELECT DISTINCT
						a.MemberCode,
						substr(a.CreateTime, 1, 10)
					FROM
						wf_live_memberoperations a, wf_member b 
					WHERE a.MemberCode = b.MemberCode
						and substr(a.CreateTime, 1, 10) BETWEEN P_Y_DATE AND P_DATE
						and b.DataSource = 'ios'
				) t
			GROUP BY
				t.MemberCode
		) tt
	WHERE
		tt.cnt = 2;
		
	#23.次日留存用户数-android
	INSERT INTO WF_ANALYSE
	SELECT
		'次日留存用户数-android' AS title,
		count(tt.membercode) AS content,
		P_DATE as dtime
	FROM
		(
			SELECT
				membercode,
				count(MemberCode) cnt
			FROM
				(
					SELECT DISTINCT
						a.MemberCode,
						substr(a.CreateTime, 1, 10)
					FROM
						wf_live_memberoperations a, wf_member b 
					WHERE a.MemberCode = b.MemberCode
						and substr(a.CreateTime, 1, 10) BETWEEN P_Y_DATE AND P_DATE
						and b.DataSource = 'android'
				) t
			GROUP BY
				t.MemberCode
		) tt
	WHERE
		tt.cnt = 2;

	#24.次日留存用户数-other
	INSERT INTO WF_ANALYSE
	SELECT
		'次日留存用户数-other' AS title,
		count(tt.membercode) AS content,
		P_DATE as dtime
	FROM
		(
			SELECT
				membercode,
				count(MemberCode) cnt
			FROM
				(
					SELECT DISTINCT
						a.MemberCode,
						substr(a.CreateTime, 1, 10)
					FROM
						wf_live_memberoperations a, wf_member b 
					WHERE a.MemberCode = b.MemberCode
						and substr(a.CreateTime, 1, 10) BETWEEN P_Y_DATE AND P_DATE
						and b.DataSource not in ('ios','android')
				) t
			GROUP BY
				t.MemberCode
		) tt
	WHERE
		tt.cnt = 2;
	
	#25.次日留存率-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'次日留存率-ios' AS title,
		(
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '次日留存用户数-ios'
			AND dtime = P_DATE
		) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日活跃用户数-ios'
			AND dtime = P_Y_DATE
		) AS content,
		P_DATE as dtime;
		
	#26.次日留存率-android
	INSERT INTO WF_ANALYSE
	SELECT
		'次日留存率-android' AS title,
		(
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '次日留存用户数-android'
			AND dtime = P_DATE
		) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日活跃用户数-android'
			AND dtime = P_Y_DATE
		) AS content,
		P_DATE as dtime;
		
	#27.次日留存率-other
	INSERT INTO WF_ANALYSE
	SELECT
		'次日留存率-other' AS title,
		(
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '次日留存用户数-other'
			AND dtime = P_DATE
		) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日活跃用户数-other'
			AND dtime = P_Y_DATE
		) AS content,
		P_DATE as dtime;
	
	#28.累计活跃用户数
	INSERT INTO WF_ANALYSE
	SELECT
		'累计活跃用户数' AS title,
		count(MemberID) AS content,
		P_DATE AS dtime
	FROM
		wf_member
	WHERE
		supportType = '0'
	AND substr(createtime, 1, 10) <= P_DATE;
	
	#29.累计活跃用户数-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'累计活跃用户数-ios' AS title,
		count(MemberID) AS content,
		P_DATE AS dtime
	FROM
		wf_member
	WHERE supportType = '0'
	AND substr(createtime, 1, 10) <= P_DATE
	AND DataSource = 'ios';
	
	#30.累计活跃用户数-android
	INSERT INTO WF_ANALYSE
	SELECT
		'累计活跃用户数-android' AS title,
		count(MemberID) AS content,
		P_DATE AS dtime
	FROM
		wf_member
	WHERE supportType = '0'
	AND substr(createtime, 1, 10) <= P_DATE
	AND DataSource = 'android';	
	
	#31.累计活跃用户数-other
	INSERT INTO WF_ANALYSE
	SELECT
		'累计活跃用户数-other' AS title,
		count(MemberID) AS content,
		P_DATE AS dtime
	FROM
		wf_member
	WHERE supportType = '0'
	AND substr(createtime, 1, 10) <= P_DATE
	AND DataSource not in ('ios','android');	
	
	#32.当日新增注册用户数
	INSERT INTO WF_ANALYSE
	SELECT
		'当日新增注册用户数' AS title,
		count(MemberID) AS content,
		P_DATE AS dtime
	FROM
		wf_member
	WHERE
		supportType = '0'
	AND substr(createtime, 1, 10) = P_DATE;
	
	#33.当日新增注册用户数-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'当日新增注册用户数-ios' AS title,
		count(MemberID) AS content,
		P_DATE AS dtime
	FROM
		wf_member
	WHERE supportType = '0'
	AND substr(createtime, 1, 10) = P_DATE
	AND DataSource = 'ios';
	
	#34.当日新增注册用户数-android
	INSERT INTO WF_ANALYSE
	SELECT
		'当日新增注册用户数-android' AS title,
		count(MemberID) AS content,
		P_DATE AS dtime
	FROM
		wf_member
	WHERE supportType = '0'
	AND substr(createtime, 1, 10) = P_DATE
	AND DataSource = 'android';	
	
	#35.当日新增注册用户数-other
	INSERT INTO WF_ANALYSE
	SELECT
		'当日新增注册用户数-other' AS title,
		count(MemberID) AS content,
		P_DATE AS dtime
	FROM
		wf_member
	WHERE supportType = '0'
	AND substr(createtime, 1, 10) = P_DATE
	AND DataSource not in ('ios','android');	
	
	#36.次日新增注册留存用户数
	INSERT INTO WF_ANALYSE
	SELECT
		'次日新增注册留存用户数' AS title,
		count(DISTINCT a.membercode) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations a,
		wf_member b
	WHERE
		a.membercode = b.membercode
	AND substr(b.createtime, 1, 10) = P_Y_DATE
	AND substr(a.createtime, 1, 10) = P_DATE;	
	
	#37.次日新增注册留存用户数-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'次日新增注册留存用户数-ios' AS title,
		count(DISTINCT a.membercode) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations a,
		wf_member b
	WHERE
		a.membercode = b.membercode
	AND substr(b.createtime, 1, 10) = P_Y_DATE
	AND substr(a.createtime, 1, 10) = P_DATE
	and b.DataSource = 'ios';
	
	#38.次日新增注册留存用户数-android
	INSERT INTO WF_ANALYSE
	SELECT
		'次日新增注册留存用户数-android' AS title,
		count(DISTINCT a.membercode) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations a,
		wf_member b
	WHERE
		a.membercode = b.membercode
	AND substr(b.createtime, 1, 10) = P_Y_DATE
	AND substr(a.createtime, 1, 10) = P_DATE
	and b.DataSource = 'android';
	
	#39.次日新增注册留存用户数-other
	INSERT INTO WF_ANALYSE
	SELECT
		'次日新增注册留存用户数-other' AS title,
		count(DISTINCT a.membercode) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations a,
		wf_member b
	WHERE
		a.membercode = b.membercode
	AND substr(b.createtime, 1, 10) = P_Y_DATE
	AND substr(a.createtime, 1, 10) = P_DATE
	and b.DataSource not in ('ios','android');	
	
	#40.次日新增注册留存率-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'次日新增注册留存率-ios' AS title,
		(
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '次日新增注册留存用户数-ios'
			AND dtime = P_DATE
		) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日新增注册用户数-ios'
			AND dtime = P_Y_DATE
		) AS content,
		P_DATE as dtime;

	#41.次日新增注册留存率-android
	INSERT INTO WF_ANALYSE
	SELECT
		'次日新增注册留存率-android' AS title,
		(
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '次日新增注册留存用户数-android'
			AND dtime = P_DATE
		) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日新增注册用户数-android'
			AND dtime = P_Y_DATE
		) AS content,
		P_DATE as dtime;

	#42.次日新增注册留存率-other
	INSERT INTO WF_ANALYSE
	SELECT
		'次日新增注册留存率-other' AS title,
		(
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '次日新增注册留存用户数-other'
			AND dtime = P_DATE
		) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日新增注册用户数-other'
			AND dtime = P_Y_DATE
		) AS content,
		P_DATE as dtime;		

	#43.当日送礼用户数（去重）
	INSERT INTO WF_ANALYSE		
	SELECT
		'当日送礼用户数（去重）' as title,
		count(DISTINCT membercode) as content,
		P_DATE as dtime
	FROM
		wf_live_memberoperations
	WHERE
		type = 0
	AND substr(createtime, 1, 10) = P_DATE;
	
	#44.当日送礼用户数（去重）-ios
	INSERT INTO WF_ANALYSE	
	SELECT
		'当日送礼用户数（去重）-ios' AS title,
		count(DISTINCT a.membercode) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND a.type = 0
	AND substr(a.createtime, 1, 10) = P_DATE
	AND b.DataSource = 'ios';
	
	#45.当日送礼用户数（去重）-android
	INSERT INTO WF_ANALYSE	
	SELECT
		'当日送礼用户数（去重）-android' AS title,
		count(DISTINCT a.membercode) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND a.type = 0
	AND substr(a.createtime, 1, 10) = P_DATE
	AND b.DataSource = 'android';
	
	#46.当日送礼用户数（去重）-other
	INSERT INTO WF_ANALYSE	
	SELECT
		'当日送礼用户数（去重）-other' AS title,
		count(DISTINCT a.membercode) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND a.type = 0
	AND substr(a.createtime, 1, 10) = P_DATE
	AND b.DataSource not in ('ios','android');

	#47.当日送礼用户数（不去重）
	INSERT INTO WF_ANALYSE		
	SELECT
		'当日送礼用户数（不去重）' as title,
		count(membercode) as content,
		P_DATE as dtime
	FROM
		wf_live_memberoperations
	WHERE
		type = 0
	AND substr(createtime, 1, 10) = P_DATE;
	
	#48.当日送礼用户数（不去重）-ios
	INSERT INTO WF_ANALYSE	
	SELECT
		'当日送礼用户数（不去重）-ios' AS title,
		count(a.membercode) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND a.type = 0
	AND substr(a.createtime, 1, 10) = P_DATE
	AND b.DataSource = 'ios';
	
	#49.当日送礼用户数（不去重）-android
	INSERT INTO WF_ANALYSE	
	SELECT
		'当日送礼用户数（不去重）-android' AS title,
		count(a.membercode) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND a.type = 0
	AND substr(a.createtime, 1, 10) = P_DATE
	AND b.DataSource = 'android';
	
	#50.当日送礼用户数（不去重）-other
	INSERT INTO WF_ANALYSE	
	SELECT
		'当日送礼用户数（不去重）-other' AS title,
		count(a.membercode) AS content,
		P_DATE AS dtime
	FROM
		wf_live_memberoperations a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND a.type = 0
	AND substr(a.createtime, 1, 10) = P_DATE
	AND b.DataSource not in ('ios','android');
	
	#51.当日累计充值金额
	INSERT INTO WF_ANALYSE
	SELECT
		'当日累计充值金额' AS title,
		sum(PayAmount) AS content,
		p_date AS dtime
	FROM
		wf_finance_pay_order
	WHERE
		substr(createtime, 1, 10) = p_date;
	
	#52.当日累计充值金额-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'当日累计充值金额-ios' AS title,
		sum(a.PayAmount) AS content,
		P_DATE AS dtime
	FROM
		wf_finance_pay_order a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND substr(a.createtime, 1, 10) = P_DATE
	AND b.DataSource = 'ios';
	
	#53.当日累计充值金额-android
	INSERT INTO WF_ANALYSE
	SELECT
		'当日累计充值金额-android' AS title,
		sum(a.PayAmount) AS content,
		P_DATE AS dtime
	FROM
		wf_finance_pay_order a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND substr(a.createtime, 1, 10) = P_DATE
	AND b.DataSource = 'android';
	
	#54.当日累计充值金额-other
	INSERT INTO WF_ANALYSE
	SELECT
		'当日累计充值金额-other' AS title,
		sum(a.PayAmount) AS content,
		P_DATE AS dtime
	FROM
		wf_finance_pay_order a,
		wf_member b
	WHERE
		a.MemberCode = b.MemberCode
	AND substr(a.createtime, 1, 10) = P_DATE
	AND b.DataSource not in ('ios','android');

	#55.当日累计送礼金额
	INSERT INTO WF_ANALYSE
	SELECT
		'当日累计送礼金额' AS title,
		sum(GiftsDou) AS content,
		p_date AS dtime
	FROM
		wf_member_gifts_send
	WHERE
		substr(createtime, 1, 10) = p_date;
	
	#56.当日累计送礼金额-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'当日累计送礼金额-ios' AS title,
		sum(a.GiftsDou) AS content,
		P_DATE AS dtime
	FROM
		wf_member_gifts_send a,
		wf_member b
	WHERE
		a.SendMemberCode = b.MemberCode
	AND substr(a.createtime, 1, 10) = P_DATE
	AND b.DataSource = 'ios';
	
	#57.当日累计送礼金额-android
	INSERT INTO WF_ANALYSE
	SELECT
		'当日累计送礼金额-android' AS title,
		sum(a.GiftsDou) AS content,
		P_DATE AS dtime
	FROM
		wf_member_gifts_send a,
		wf_member b
	WHERE
		a.SendMemberCode = b.MemberCode
	AND substr(a.createtime, 1, 10) = P_DATE
	AND b.DataSource = 'android';
	
	#58.当日累计送礼金额-other
	INSERT INTO WF_ANALYSE
	SELECT
		'当日累计送礼金额-other' AS title,
		sum(a.GiftsDou) AS content,
		P_DATE AS dtime
	FROM
		wf_member_gifts_send a,
		wf_member b
	WHERE
		a.SendMemberCode = b.MemberCode
	AND substr(a.createtime, 1, 10) = P_DATE
	AND b.DataSource not in ('ios','android');
	
	#59.当日观看直播用户送礼转化率
	INSERT INTO WF_ANALYSE
	SELECT
		'当日观看直播用户送礼转化率' AS title,
		(
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日送礼用户数（去重）'
			AND dtime = P_DATE
		) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日累计观看用户数'
			AND dtime = P_Y_DATE
		) AS content,
		P_DATE as dtime;

	#60.当日观看直播用户送礼转化率-ios
	INSERT INTO WF_ANALYSE
	SELECT
		'当日观看直播用户送礼转化率-ios' AS title,
		(
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日送礼用户数（去重）-ios'
			AND dtime = P_DATE
		) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日累计观看用户数-ios'
			AND dtime = P_Y_DATE
		) AS content,
		P_DATE as dtime;

	#61.当日观看直播用户送礼转化率-android
	INSERT INTO WF_ANALYSE
	SELECT
		'当日观看直播用户送礼转化率-android' AS title,
		(
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日送礼用户数（去重）-android'
			AND dtime = P_DATE
		) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日累计观看用户数-android'
			AND dtime = P_Y_DATE
		) AS content,
		P_DATE as dtime;

	#62.当日观看直播用户送礼转化率-other
	INSERT INTO WF_ANALYSE
	SELECT
		'当日观看直播用户送礼转化率-other' AS title,
		(
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日送礼用户数（去重）-other'
			AND dtime = P_DATE
		) / (
			SELECT
				content
			FROM
				wf_analyse
			WHERE
				title = '当日累计观看用户数-other'
			AND dtime = P_Y_DATE
		) AS content,
		P_DATE as dtime;	
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_ASSET
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_ASSET`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_ASSET`(IN P_InitFun int, IN P_LastDate datetime, IN P_UserId varchar(255), IN P_MEMBERCODE varchar(255), IN P_AccountID varchar(255), IN P_Balance decimal(20, 4), IN P_Positions decimal(20, 4), IN P_TotalAmount decimal(20, 4), IN P_MtmPL decimal(20, 4))
BEGIN
DECLARE V_WeekAmount decimal(20, 4) DEFAULT 0.0000;
DECLARE V_TodayAmount DECIMAL(20,4) DEFAULT 0.0000;
DECLARE V_TodayProfit DECIMAL(20,4) DEFAULT 0.0000;
DECLARE V_WeekProfit DECIMAL(20,4) DEFAULT 0.0000;
DECLARE V_TotalProfit DECIMAL(20,4) DEFAULT 0.0000;
DECLARE t_error INTEGER DEFAULT 0;  
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET t_error=1;

set V_WeekAmount = P_InitFun;
set V_TodayAmount = P_InitFun;
start TRANSACTION;
  SELECT
    TotalAmount INTO V_TodayAmount
  FROM wf_drivewealth_practice_asset
  WHERE UserID = P_UserId AND EndDate < CURDATE()
  ORDER BY EndDate DESC LIMIT 1;
  SELECT
    TotalAmount INTO V_WeekAmount
  FROM wf_drivewealth_practice_asset
  WHERE UserID = P_UserId AND EndDate < P_LastDate
  ORDER BY EndDate DESC LIMIT 1;
  
  SELECT
    P_TotalAmount - V_TodayAmount,
    P_TotalAmount - V_WeekAmount,
    P_TotalAmount - P_InitFun INTO V_TodayProfit, V_WeekProfit, V_TotalProfit;
	Delete from wf_drivewealth_practice_asset where MemberCode=P_MEMBERCODE and AccountId = P_AccountID and EndDate = CURDATE();
  INSERT INTO wf_drivewealth_practice_asset (UserID, MemberCode, AccountId, Balance, Positions, TotalAmount, MtmPL, TodayProfit, TodayYield, WeekProfit,WeekYield, TotalProfit, TotalYield,CreateTime,EndDate)
    VALUES (P_UserId, P_MEMBERCODE, P_AccountID, P_Balance, P_Positions, P_TotalAmount, P_MtmPL, V_TodayProfit, V_TodayProfit * 100 / V_TodayAmount, V_WeekProfit, V_WeekProfit * 100 / V_WeekAmount, V_TotalProfit, V_TotalProfit * 100 / P_InitFun,NOW(),CURDATE());
if t_error = 1 then
					rollback;
				ELSE
					COMMIT;
				end if;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_BIND_MOBILE
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_BIND_MOBILE`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_BIND_MOBILE`(IN P_MEMBERCODE VARCHAR(255), IN P_CountryCode VARCHAR(255),IN P_Mobile VARCHAR(255),  IN P_VerifyCode VARCHAR(255), IN P_LoginPwd VARCHAR(255))
BEGIN
  DECLARE P_RESULT INT DEFAULT 0;
DECLARE v_COUNT int default 0;
  SELECT
    COUNT(*) INTO v_COUNT
  FROM wf_verify_code
  WHERE VerifyCode = P_VerifyCode AND CountryCode = P_CountryCode AND MemberAccount = P_Mobile AND CreateTime > DATE_SUB(NOW(), INTERVAL 10 MINUTE);
  IF (v_COUNT > 0) THEN
    UPDATE wf_member
    SET Mobile = P_Mobile,
        LoginPwd = P_LoginPwd,
        CountryCode = P_CountryCode
    WHERE MemberCode = P_MEMBERCODE;
		SET P_RESULT = 0;
  ELSE
    SET P_RESULT = 40005;
  END IF;
  SELECT
    P_RESULT;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_CLEAR_DW
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_CLEAR_DW`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_CLEAR_DW`(IN P_MEMBERCODE varchar(255))
BEGIN
  DELETE
    FROM wf_drivewealth_practice_account
  WHERE MemberCode = P_MEMBERCODE;
  DELETE
    FROM wf_drivewealth_practice_asset
  WHERE MemberCode = P_MEMBERCODE;
  DELETE
    FROM wf_drivewealth_practice_asset_v
  WHERE MemberCode = P_MEMBERCODE;
  DELETE
    FROM wf_drivewealth_practice_rank
  WHERE MemberCode = P_MEMBERCODE;
  DELETE
    FROM wf_drivewealth_practice_rank_v
  WHERE MemberCode = P_MEMBERCODE;
  DELETE
    FROM wf_drivewealth_practice_order
  WHERE MemberCode = P_MEMBERCODE;
  DELETE
    FROM wf_drivewealth_practice_position
  WHERE MemberCode = P_MEMBERCODE;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_COMPETITION_REPORT
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_COMPETITION_REPORT`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_COMPETITION_REPORT`(IN P_PERIOD INT)
BEGIN

delete from wf_competition_report where Period = P_PERIOD ;
insert into wf_competition_report(MemberCode,Nickname,HeadImage,RankValue,Defeat,DealCnt,DefeatTitle,AmountTitle,DealTitle,LikeCnt,CommentCnt,ConcernCnt,CreateTime,Period)
SELECT
	a.MemberCode,
	a.Nickname,
	a.HeadImage,
	c.RankValue,
	c.Defeat,
	(
		CASE
		WHEN f.cnt IS NULL THEN
			0
		ELSE
			f.cnt
		END
	) dealcnt,
	d.TitleName amounttitle,
	e.TitleName defeattitle,
	(
		CASE
		WHEN f.TitleName IS NULL THEN
			'咱追求以静制动，以不变应万变'
		ELSE
			f.TitleName
		END
	) dealtitle,
	(
		CASE
		WHEN g.lcnt IS NULL THEN
			0
		ELSE
			g.lcnt
		END
	) lcnt,
	(
		CASE
		WHEN g.cmcnt IS NULL THEN
			0
		ELSE
			g.cmcnt
		END
	) cmcnt,
	(
		CASE
		WHEN h.cnt IS NULL THEN
			0
		ELSE
			h.cnt
		END
	) concnt,NOW(),P_PERIOD
FROM
	wf_member a,
	wf_stockcompetitionmember b
LEFT JOIN wf_drivewealth_practice_rank_v c ON b.MemberCode = c.MemberCode
LEFT JOIN (
	SELECT
		a1.MemberCode,
		b1.TitleName
	FROM
		wf_drivewealth_practice_rank_v a1,
		wf_competition_title b1
	WHERE
		(
			a1.RankValue >= b1.StartValue
			AND a1.RankValue < b1.EndValue
		)
	AND a1.Type = 11
	AND b1.TitleType = 1
) d ON c.MemberCode = d.MemberCode
LEFT JOIN (
	SELECT
		a2.MemberCode,
		b2.TitleName
	FROM
		wf_drivewealth_practice_rank_v a2,
		wf_competition_title b2
	WHERE
		(
			a2.Defeat >= b2.StartValue
			AND a2.Defeat < b2.EndValue
		)
	AND a2.Type = 11
	AND b2.TitleType = 2
) e ON d.MemberCode = e.MemberCode
LEFT JOIN (
	SELECT
		a3.MemberCode,
		b3.TitleName,
		a3.cnt
	FROM
		(
			SELECT
				b.MemberCode,
				count(a.Id) cnt
			FROM
				wf_drivewealth_practice_order a,
				wf_stockcompetitionmember b
			WHERE
				a.MemberCode = b.MemberCode
			AND b.CompetitionId = 1
			AND a.CreateTime BETWEEN DATE_SUB(NOW(), INTERVAL 6 DAY)
			and now()
			AND A.AccountType = 1
			AND a.ExecType = 2
			GROUP BY
				b.MemberCode
		) a3,
		wf_competition_title b3
	WHERE
		a3.cnt >= b3.StartValue
	AND a3.cnt < b3.EndValue
	AND b3.TitleType = 3
) f ON e.MemberCode = f.MemberCode
LEFT JOIN (
	SELECT
		b.MemberCode,
		sum(a.LikeCount) lcnt,
		sum(a.CommentCount) cmcnt
	FROM
		wf_imagetext a,
		wf_stockcompetitionmember b
	WHERE
		a.MemberCode = b.MemberCode
	AND b.CompetitionId = 1
	GROUP BY
		b.MemberCode
) g ON b.MemberCode = g.MemberCode
LEFT JOIN (
	SELECT
		b.MemberCode,
		count(a.ConcernID) cnt
	FROM
		wf_stockcompetitionmember b
	LEFT JOIN wf_member_concern a ON a.ByMemberCode = b.MemberCode
	WHERE
		b.CompetitionId = 1
	AND (
		a.CreateTime BETWEEN DATE_SUB(NOW(), INTERVAL 6 DAY)
		AND NOW()
	)
	AND a.RelationshipType = 1
	GROUP BY
		b.MemberCode
) h ON b.MemberCode = h.MemberCode
WHERE
	a.MemberCode = b.MemberCode
AND b.CompetitionId = 1
AND c.Type = 11;

update wf_competition_report c LEFT JOIN(
SELECT
	a.MemberCode,
	b.Id,
	b.TeamName,
	d.AvgYield,
	e.Rank
FROM
	wf_competition_report a,
	wf_competition_team b,
	wf_competition_team_member c,
	wf_competition_team_asset d,
	wf_competition_team_rank e
WHERE
	a.MemberCode = c.MemberCode
AND b.Id = c.TeamId
AND b.Id = d.TeamId
AND d.EndDate = CURDATE()
AND e.TeamId = d.TeamId
AND e.Type = 4
AND b.`Status` = 1
and a.Period = P_PERIOD ) d on c.MemberCode = d.MemberCode
set c.TeamId = d.Id,c.TeamName = d.TeamName,c.TeamYield = d.AvgYield,c.TeamRank = d.Rank
where c.Period = P_PERIOD;

UPDATE wf_competition_report a
LEFT JOIN (
	SELECT
		*
	FROM
		wf_drivewealth_practice_rank_v
	WHERE
		type = 4
) b ON a.MemberCode = b.MemberCode
SET a.WeekYield = b.RankValue
where a.Period = P_PERIOD;

CALL PRC_WF_STOCK_YIELD(P_PERIOD);

call PRC_WF_STOCK_REPORT(P_PERIOD);

 update wf_competition_team_member set Status=0;
 update wf_competition_team set Status = 2;

 insert into wf_competition_affiche(Title,Content,Type,CreateTime,State,ShowTime,AdminCode,CreateUser)
 values(concat('第',P_PERIOD,'周战报'),P_PERIOD,2,NOW(),9,NOW(),'24448443','18250203');

END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_CREATE_MEMBER
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_CREATE_MEMBER`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_CREATE_MEMBER`(IN P_DataSource VARCHAR(255), IN P_PhoneBrand VARCHAR(255), IN P_PhoneModel VARCHAR(255), IN P_ImageType VARCHAR(255), IN P_NickName VARCHAR(255), IN P_CountryCode VARCHAR(255), IN P_Mobile VARCHAR(255), IN P_VerifyCode VARCHAR(255), IN P_LoginPwd VARCHAR(255))
BEGIN
  DECLARE P_RESULT INT DEFAULT 0;
  SELECT
    COUNT(*) INTO @cnt
  FROM wf_verify_code
  WHERE VerifyCode = P_VerifyCode AND CountryCode = P_CountryCode AND MemberAccount = P_Mobile AND CreateTime > DATE_SUB(NOW(), INTERVAL 10 MINUTE);
  IF (@cnt > 0) THEN
    SELECT
      MemberCode INTO @membercode
    FROM wf_member
    WHERE Mobile = P_Mobile;
    IF @membercode IS NULL THEN
      SELECT
        30000000 + ROUND(RAND() * 10000000) INTO @membercode;
      SELECT
        COUNT(*) INTO @cnt
      FROM wf_member
      WHERE MemberCode = @membercode;
      WHILE (@cnt > 0) DO
        SELECT
          30000000 + ROUND(RAND() * 10000000) INTO @membercode;
        SELECT
          COUNT(*) INTO @cnt
        FROM wf_member
        WHERE MemberCode = @membercode;
      END WHILE;
      SELECT
        P_NickName,
        LENGTH(P_NickName) INTO @nickname, @namelength;
      SELECT
        COUNT(*) INTO @cnt
      FROM wf_member
      WHERE Nickname = @nickname;
      WHILE (@cnt > 0) DO
        IF (@namelength > 6) THEN
          SELECT
            CONCAT(SUBSTR(@nickname, 0, 6), ROUND(RAND() * 10000)) INTO @nickname;
        ELSE
          SELECT
            CONCAT(@nickname, ROUND(RAND() * 10000)) INTO @nickname;
        END IF;

        SELECT
          COUNT(*),
          LENGTH(@nickname) INTO @cnt, @namelength
        FROM wf_member
        WHERE Nickname = @nickname;
      END WHILE;
      INSERT INTO wf_member (MemberCode, DataSource, PhoneBrand, PhoneModel, LastLoginTime, CreateTime, AmountAccount, MemberType, IsAuth, HeadImage, Nickname, CountryCode, Mobile, LoginPwd)
        VALUES (@membercode, P_DataSource, P_PhoneBrand, P_PhoneModel, NOW(), NOW(), 0, '0', FALSE, CASE WHEN P_ImageType IS NULL THEN '/UploadFile/Default/default_headerimage.png' ELSE CONCAT('/images/head/', @membercode, '.',P_ImageType) END, @nickname, P_CountryCode, P_Mobile, P_LoginPwd);
      SELECT
        P_RESULT,
        a.*,
        0 Rank
      FROM wf_member a
      WHERE a.MemberCode = @membercode;
    ELSE
      SET P_RESULT = 1;
      SELECT
        P_RESULT,
        a.*,
        0 Rank
      FROM wf_member a
      WHERE a.MemberCode = @membercode;
    END IF;
  ELSE
    SET P_RESULT = 40005;
    SELECT
      P_RESULT;
  END IF;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_CREATETEAM
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_CREATETEAM`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_CREATETEAM`(IN `P_MEMBERCODE` varchar(20),IN `P_TEAMNAME` varchar(20),IN `P_MANIFESTO` varchar(20),OUT `P_RESULT` int,OUT P_CODE int,OUT P_TEAMID int)
BEGIN
	DECLARE t_error INTEGER DEFAULT 0;  
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET t_error=1; 
	select `Level` into @v_level from wf_competition_team_member where Status=1 and MemberCode = P_MEMBERCODE;
	set P_CODE = 0;
	set P_TEAMID=0;
	if @v_level is not NULL THEN
		set P_RESULT = 45005+@v_level-1;
	ELSE
		select count(*) into @v_count from wf_competition_team where TeamName=P_TEAMNAME and `Status`<2;
		if @v_count>0 THEN
			set P_RESULT = 40013;
		ELSE
			select count(*) into @v_count from wf_competition_team where `Status`<2;
			if @v_count>100 THEN
				set P_RESULT = 45001;
			ELSE
				select `Code` into @v_code from wf_competition_code where State = 0 order by rand() limit 1;
				set P_CODE = @v_code;
				START TRANSACTION;
				update wf_competition_code set State=1 where `Code` = @v_code;
				insert into wf_competition_team(`Code`,MemberCode,MemberCount,Status,CreateTime,TeamName,Manifesto) values(@v_code,P_MEMBERCODE,1,0,now(),P_TEAMNAME ,P_MANIFESTO);
				select LAST_INSERT_ID() into @v_teamid from wf_competition_team limit 1;
				insert into wf_competition_team_member(TeamId,MemberCode,Level,Type,Status,CreateTime) values(@v_teamid,P_MEMBERCODE,1,1,1,now());
				if t_error = 1 then
					set P_RESULT = 500;
					rollback;
				ELSE
					COMMIT;
					set P_RESULT = 0;
					set P_TEAMID=@v_teamid;
				end if;
			end if;
		end IF;
	end if;
	select P_RESULT,P_CODE,P_TEAMID;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_GAME_GUESSPERCENT
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_GAME_GUESSPERCENT`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_GAME_GUESSPERCENT`()
BEGIN
	delete from wf_game_guesspercent;
insert into wf_game_guesspercent
SELECT c.membercode,round(c.winpercent),
round((count(d.membercode)/(select count(*) from (SELECT IFNULL(b.wincount,0)/a.guesscount*100 winpercent,a.* 
from (SELECT COUNT(DISTINCT wf_game_guessstockhistory.GuessResult,wf_game_guessstockhistory.GuessStockCode)guesscount,wf_game_guessstockhistory.MemberCode 
from wf_game_guessstockhistory GROUP BY 
wf_game_guessstockhistory.MemberCode)a
left join 
(SELECT count(*)wincount,wf_game_sendmoneyhistory.MemberCode from wf_game_sendmoneyhistory
GROUP BY wf_game_sendmoneyhistory.MemberCode)b
on a.membercode=b.MemberCode  ORDER BY winpercent DESC)e))*100) Percentage from (SELECT IFNULL(b.wincount,0)/a.guesscount*100 winpercent,a.* from (SELECT COUNT(DISTINCT wf_game_guessstockhistory.GuessResult,wf_game_guessstockhistory.GuessStockCode)guesscount,wf_game_guessstockhistory.MemberCode 
from wf_game_guessstockhistory GROUP BY 
wf_game_guessstockhistory.MemberCode)a
left join 
(SELECT count(*)wincount,wf_game_sendmoneyhistory.MemberCode from wf_game_sendmoneyhistory
GROUP BY wf_game_sendmoneyhistory.MemberCode)b
on a.membercode=b.MemberCode  ORDER BY winpercent DESC)c,
(SELECT IFNULL(b.wincount,0)/a.guesscount*100 winpercent,a.* from (SELECT COUNT(DISTINCT wf_game_guessstockhistory.GuessResult,wf_game_guessstockhistory.GuessStockCode)guesscount,wf_game_guessstockhistory.MemberCode 
from wf_game_guessstockhistory GROUP BY 
wf_game_guessstockhistory.MemberCode)a
left join 
(SELECT count(*)wincount,wf_game_sendmoneyhistory.MemberCode from wf_game_sendmoneyhistory
GROUP BY wf_game_sendmoneyhistory.MemberCode)b
on a.membercode=b.MemberCode  ORDER BY winpercent DESC)d where c.winpercent>=d.winpercent
GROUP BY c.membercode;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_LOGIN
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_LOGIN`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_LOGIN`(IN P_MEMBERCODE varchar(20), IN P_JPUSHID varchar(255), IN P_IMEI varchar(255), IN P_DEVICEID varchar(255), IN P_VERSION varchar(255), IN P_PLATFORM varchar(255))
BEGIN
	DECLARE dwUserID varchar(255) DEFAULT '';
  DECLARE dwUserName varchar(255) DEFAULT '';
  DECLARE dwEmail varchar(255) DEFAULT '';
  DECLARE dwpUserID varchar(255) DEFAULT '';
  DECLARE dwpUserName varchar(255) DEFAULT '';
  DECLARE dwpEmail varchar(255) DEFAULT '';
  DECLARE dwpPassword varchar(255) DEFAULT '';
	DECLARE P_RESULT int DEFAULT 0;
  DECLARE P_TOKEN varchar(255) DEFAULT NULL;
  SELECT
    TokenValue INTO P_TOKEN
  FROM wf_token
  WHERE MemberCode = P_MEMBERCODE;
  IF P_TOKEN IS NOT NULL THEN
		set P_TOKEN =  UUID();
    UPDATE wf_token
    SET ValidityTime = NOW(),TokenValue = P_TOKEN
    WHERE MemberCode = P_MEMBERCODE;
  ELSE
    SET
    P_TOKEN = UUID();
    INSERT INTO wf_token (MemberCode,TokenValue, ValidityTime, `Status`, ClientType)
      VALUES (P_MEMBERCODE,P_TOKEN, NOW(), 1, 'client');
  END IF;
  SELECT
    COUNT(*) INTO @cnt
  FROM wf_im_jpush
  WHERE JpushRegID = P_JPUSHID;
  IF @cnt > 0 THEN
    UPDATE wf_im_jpush
    SET JpushLastLoginTime = NOW(),
        JpushRegID = NULL
    WHERE JpushRegID = P_JPUSHID;
  END IF;
  SELECT
    COUNT(*) INTO @cnt
  FROM wf_im_jpush
  WHERE MemberCode = P_MEMBERCODE;
  IF @cnt > 0 THEN
    UPDATE wf_im_jpush
    SET JpushLastLoginTime = NOW(),
        JpushRegID = P_JPUSHID
    WHERE MemberCode = P_MEMBERCODE;
  ELSE
    INSERT INTO wf_im_jpush (JpushRegID, JpushLastLoginTime, CreateTime, JpushIMEI, JpushDeviceID, JpushVersion, JpushPlatform)
      VALUES (P_JPUSHID, NOW(), NOW(), P_IMEI, P_DEVICEID, P_VERSION, P_PLATFORM);
  END IF;
  UPDATE wf_member
  SET LastLoginTime = NOW()
  WHERE MemberCode = P_MEMBERCODE;
  INSERT INTO wf_member_login_log (LoginPlatform, MemberCode, LoginTime)
    VALUES (P_PLATFORM, P_MEMBERCODE, NOW());


  SELECT
    UserID,
    UserName,
    emailAddress1 INTO dwUserID, dwUserName, dwEmail
  FROM wf_drivewealth_account
  WHERE MemberCode = P_MEMBERCODE;
  SELECT
    UserID,
    UserName,
    emailAddress1,
    password INTO dwpUserID, dwpUserName, dwpEmail, dwpPassword
  FROM wf_drivewealth_practice_account
  WHERE MemberCode = P_MEMBERCODE;
  SELECT
    P_RESULT Status,
    P_TOKEN Token,
    dwUserID UserID,
    dwUserName UserName,
    dwEmail EmailAddress1,
    dwpUserID PracticeUserId,
    dwpUserName PracticeUserName,
    dwpEmail PracticeEmailAddress1,
    dwpPassword PracticePassword;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_PRACTICE_RANK
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_PRACTICE_RANK`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_PRACTICE_RANK`()
BEGIN

truncate table wf_drivewealth_practice_rank;

#1 日收益
insert into wf_drivewealth_practice_rank(MemberCode,RankValue,Rank,Type,CreateTime)
SELECT
	tt.MemberCode,
	tt.TodayProfit,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset a
		WHERE
			a.EndDate = CURDATE()
		AND a.TodayProfit > tt.TodayProfit
	) AS rank,
	1 AS Type,
	CurDate() CreateTime
FROM
	wf_drivewealth_practice_asset tt
WHERE
	tt.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;

#2 日收益率
insert into wf_drivewealth_practice_rank(MemberCode,RankValue,Rank,Type,CreateTime)
SELECT
	tt.MemberCode,
	tt.TodayYield,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset a
		WHERE
			a.EndDate = CURDATE()
		AND a.TodayYield > tt.TodayYield
	) AS rank,
	2 AS Type,
	CurDate() CreateTime
FROM
	wf_drivewealth_practice_asset tt
WHERE
	tt.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;


#3 周收益
insert into wf_drivewealth_practice_rank(MemberCode,RankValue,Rank,Type,CreateTime)
SELECT
	tt.MemberCode,
	tt.WeekProfit,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset a
		WHERE
			a.EndDate = CURDATE()
		AND a.WeekProfit > tt.WeekProfit
	) AS rank,
	3 AS Type,
	CurDate() CreateTime
FROM
	wf_drivewealth_practice_asset tt
WHERE
	tt.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;

#4 周收益率
insert into wf_drivewealth_practice_rank(MemberCode,RankValue,Rank,Type,CreateTime)
SELECT
	tt.MemberCode,
	tt.WeekYield,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset a
		WHERE
			a.EndDate = CURDATE()
		AND a.WeekYield > tt.WeekYield
	) AS rank,
	4 AS Type,
	CurDate() CreateTime
FROM
	wf_drivewealth_practice_asset tt
WHERE
	tt.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;

#5 月收益
insert into wf_drivewealth_practice_rank(MemberCode,RankValue,Rank,Type,CreateTime)
SELECT
	tt.MemberCode,
	tt.MonthProfit,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset a
		WHERE
			a.EndDate = CURDATE()
		AND a.MonthProfit > tt.MonthProfit
	) AS rank,
	5 AS Type,
	CurDate() CreateTime
FROM
	wf_drivewealth_practice_asset tt
WHERE
	tt.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;

#6 月收益率
insert into wf_drivewealth_practice_rank(MemberCode,RankValue,Rank,Type,CreateTime)
SELECT
	tt.MemberCode,
	tt.MonthYield,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset a
		WHERE
			a.EndDate = CURDATE()
		AND a.MonthYield > tt.MonthYield
	) AS rank,
	6 AS Type,
	CurDate() CreateTime
FROM
	wf_drivewealth_practice_asset tt
WHERE
	tt.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;


#7 年收益
insert into wf_drivewealth_practice_rank(MemberCode,RankValue,Rank,Type,CreateTime)
SELECT
	tt.MemberCode,
	tt.YearProfit,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset a
		WHERE
			a.EndDate = CURDATE()
		AND a.YearProfit > tt.YearProfit
	) AS rank,
	7 AS Type,
	CurDate() CreateTime
FROM
	wf_drivewealth_practice_asset tt
WHERE
	tt.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;

#8 年收益率
insert into wf_drivewealth_practice_rank(MemberCode,RankValue,Rank,Type,CreateTime)
SELECT
	tt.MemberCode,
	tt.YearYield,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset a
		WHERE
			a.EndDate = CURDATE()
		AND a.YearYield > tt.YearYield
	) AS rank,
	8 AS Type,
	CurDate() CreateTime
FROM
	wf_drivewealth_practice_asset tt
WHERE
	tt.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;


#9 总收益
insert into wf_drivewealth_practice_rank(MemberCode,RankValue,Rank,Type,CreateTime)
SELECT
	tt.MemberCode,
	tt.TotalProfit,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset a
		WHERE
			a.EndDate = CURDATE()
		AND a.TotalProfit > tt.TotalProfit
	) AS rank,
	9 AS Type,
	CurDate() CreateTime
FROM
	wf_drivewealth_practice_asset tt
WHERE
	tt.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;


#10 年收益率
insert into wf_drivewealth_practice_rank(MemberCode,RankValue,Rank,Type,CreateTime)
SELECT
	tt.MemberCode,
	tt.TotalYield,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset a
		WHERE
			a.EndDate = CURDATE()
		AND a.TotalYield > tt.TotalYield
	) AS rank,
	10 AS Type,
	CurDate() CreateTime
FROM
	wf_drivewealth_practice_asset tt
WHERE
	tt.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;


#11 总收益
insert into wf_drivewealth_practice_rank(MemberCode,RankValue,Rank,Type,CreateTime)
SELECT
	tt.MemberCode,
	tt.TotalAmount,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset a
		WHERE
			a.EndDate = CURDATE()
		AND a.TotalAmount > tt.TotalAmount
	) AS rank,
	11 AS Type,
	CurDate() CreateTime
FROM
	wf_drivewealth_practice_asset tt
WHERE
	tt.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;



END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_PRACTICE_RANK_V
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_PRACTICE_RANK_V`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_PRACTICE_RANK_V`()
BEGIN
delete from wf_drivewealth_practice_asset_v where EndDate = CURDATE();
INSERT INTO wf_drivewealth_practice_asset_v (
	UserId,
	AccountID,
	Balance,
	MtmPL,
	Positions,
	TodayProfit,
	TodayYield,
	WeekProfit,
	WeekYield,
	MonthProfit,
	MonthYield,
	YearProfit,
	YearYield,
	TotalProfit,
	TotalYield,
	TotalAmount,
	MemberCode,
	EndDate,
	CreateTime
)
SELECT
	a.UserId,
	a.AccountID,
	a.Balance,
	a.MtmPL,
	a.Positions,
	a.TodayProfit,
	a.TodayYield,
	a.WeekProfit,
	a.WeekYield,
	a.MonthProfit,
	a.MonthYield,
	a.YearProfit,
	a.YearYield,
	a.TotalProfit,
	a.TotalYield,
	a.TotalAmount,
	a.MemberCode,
	a.EndDate,
	a.CreateTime
FROM
	wf_drivewealth_practice_asset a
WHERE
	a.EndDate = CurDate() 
AND a.MemberCode IN (
	SELECT
		MemberCode
	FROM
		wf_stockcompetitionmember
	WHERE
		CompetitionId = 1
);

update wf_drivewealth_practice_asset_v 
set WeekProfit = WeekProfit - 2091.811,
TotalAmount = TotalAmount - 2091.811,
TotalProfit = TotalProfit - 2091.811,
TotalYield = TotalProfit/10000*100
where MemberCode = 32654769
and EndDate = CURDATE();

truncate table wf_drivewealth_practice_rank_v;

#1 日收益
insert into wf_drivewealth_practice_rank_v(MemberCode,RankValue,Rank,Type,CreateTime,Defeat)
SELECT
	tt.MemberCode,
	tt.TodayProfit,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset_v a
		WHERE
			a.EndDate = CURDATE()
		AND a.TodayProfit > tt.TodayProfit
	) AS rank,
	1 AS Type,
	CurDate() CreateTime,
count(tt.MemberCode)/(select count(*) from wf_drivewealth_practice_asset_v where enddate = CURDATE())*100
FROM
	wf_drivewealth_practice_asset_v tt,wf_drivewealth_practice_asset_v b
WHERE
tt.TodayProfit >=  b.TodayProfit
and	tt.EndDate = CURDATE() and b.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;

#2 日收益率
insert into wf_drivewealth_practice_rank_v(MemberCode,RankValue,Rank,Type,CreateTime,Defeat)
SELECT
	tt.MemberCode,
	tt.TodayYield,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset_v a
		WHERE
			a.EndDate = CURDATE()
		AND a.TodayYield > tt.TodayYield
	) AS rank,
	2 AS Type,
	CurDate() CreateTime,
	count(tt.MemberCode)/(select count(*) from wf_drivewealth_practice_asset_v where enddate = CURDATE())*100
FROM
	wf_drivewealth_practice_asset_v tt,wf_drivewealth_practice_asset_v b
WHERE
tt.TodayYield >=  b.TodayYield
and	tt.EndDate = CURDATE() and b.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;


#3 周收益
insert into wf_drivewealth_practice_rank_v(MemberCode,RankValue,Rank,Type,CreateTime,Defeat)
SELECT
	tt.MemberCode,
	tt.WeekProfit,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset_v a
		WHERE
			a.EndDate = CURDATE()
		AND a.WeekProfit > tt.WeekProfit
	) AS rank,
	3 AS Type,
	CurDate() CreateTime,
	count(tt.MemberCode)/(select count(*) from wf_drivewealth_practice_asset_v where enddate = CURDATE())*100
FROM
	wf_drivewealth_practice_asset_v tt,wf_drivewealth_practice_asset_v b
WHERE
tt.WeekProfit >=  b.WeekProfit
and	tt.EndDate = CURDATE() and b.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;

#4 周收益率
insert into wf_drivewealth_practice_rank_v(MemberCode,RankValue,Rank,Type,CreateTime,Defeat)
SELECT
	tt.MemberCode,
	tt.WeekYield,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset_v a
		WHERE
			a.EndDate = CURDATE()
		AND a.WeekYield > tt.WeekYield
	) AS rank,
	4 AS Type,
	CurDate() CreateTime,
	count(tt.MemberCode)/(select count(*) from wf_drivewealth_practice_asset_v where enddate = CURDATE())*100
FROM
	wf_drivewealth_practice_asset_v tt,wf_drivewealth_practice_asset_v b
WHERE
tt.WeekYield >=  b.WeekYield
and	tt.EndDate = CURDATE() and b.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;



#9 总收益
insert into wf_drivewealth_practice_rank_v(MemberCode,RankValue,Rank,Type,CreateTime,Defeat)
SELECT
	tt.MemberCode,
	tt.TotalProfit,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset_v a
		WHERE
			a.EndDate = CURDATE()
		AND a.TotalProfit > tt.TotalProfit
	) AS rank,
	9 AS Type,
	CurDate() CreateTime,
	count(tt.MemberCode)/(select count(*) from wf_drivewealth_practice_asset_v where enddate = CURDATE())*100
FROM
	wf_drivewealth_practice_asset_v tt,wf_drivewealth_practice_asset_v b
WHERE
tt.TotalProfit >=  b.TotalProfit
and	tt.EndDate = CURDATE() and b.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;


#10 总收益率
insert into wf_drivewealth_practice_rank_v(MemberCode,RankValue,Rank,Type,CreateTime,Defeat)
SELECT
	tt.MemberCode,
	tt.TotalYield,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset_v a
		WHERE
			a.EndDate = CURDATE()
		AND a.TotalYield > tt.TotalYield
	) AS rank,
	10 AS Type,
	CurDate() CreateTime,
	count(tt.MemberCode)/(select count(*) from wf_drivewealth_practice_asset_v where enddate = CURDATE())*100
FROM
	wf_drivewealth_practice_asset_v tt,wf_drivewealth_practice_asset_v b
WHERE
tt.TotalYield >=  b.TotalYield
and	tt.EndDate = CURDATE() and b.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;


#11 总资产
insert into wf_drivewealth_practice_rank_v(MemberCode,RankValue,Rank,Type,CreateTime,Defeat)
SELECT
	tt.MemberCode,
	tt.TotalAmount,
	(
		SELECT
			count(1) + 1
		FROM
			wf_drivewealth_practice_asset_v a
		WHERE
			a.EndDate = CURDATE()
		AND a.TotalAmount > tt.TotalAmount
	) AS rank,
	11 AS Type,
	CurDate() CreateTime,
	count(tt.MemberCode)/(select count(*) from wf_drivewealth_practice_asset_v where enddate = CURDATE())*100
FROM
	wf_drivewealth_practice_asset_v tt,wf_drivewealth_practice_asset_v b
WHERE
tt.TotalAmount >=  b.TotalAmount
and	tt.EndDate = CURDATE() and b.EndDate = CURDATE()
GROUP BY tt.MemberCode
ORDER BY rank ASC;

delete from wf_competition_team_asset where enddate = CURDATE();

insert into wf_competition_team_asset(teamid,avgyield,enddate,createtime)
select b.TeamId,sum(a.WeekYield)/3 AvgYield,a.EndDate,NOW() from wf_drivewealth_practice_asset_v a,wf_competition_team_member b,wf_competition_team c
where a.MemberCode = b.MemberCode and b.TeamId = c.Id and c.`Status` = 1 and c.MemberCount = 3 and a.EndDate = CURDATE()
group by b.TeamId;

truncate table wf_competition_team_yield;
insert INTO wf_competition_team_yield
select b.TeamId,sum(a.WeekYield)/3 AvgYield from wf_drivewealth_practice_asset_v a,wf_competition_team_member b,wf_competition_team c
where a.MemberCode = b.MemberCode and b.TeamId = c.Id and c.`Status` = 1 and c.MemberCount = 3 and a.EndDate = CURDATE()
group by b.TeamId;


truncate table wf_competition_team_rank;
insert into wf_competition_team_rank(TeamId,RankValue,Rank,Type,Defeat,CreateTime)
SELECT
	tt.TeamId,
	tt.AvgYield,
	(
		SELECT
			count(1) + 1
		FROM
			wf_competition_team_yield a
		WHERE a.AvgYield > tt.AvgYield
	) AS rank,
	4 AS Type,
count(tt.TeamId)/(select count(*) from wf_competition_team_yield ),
	CurDate() CreateTime
FROM
	wf_competition_team_yield tt ,wf_competition_team_yield b
where tt.AvgYield >= b.AvgYield
GROUP BY tt.TeamId
ORDER BY rank ASC;


insert into wf_competition_team_rank(TeamId,RankValue,Rank,Type,Defeat,CreateTime)
select c.id,0,(select max(rank)+1 from wf_competition_team_rank where type = 4),4,0,CURDATE() as rank from wf_competition_team c
where  c.`Status` < 2 and c.MemberCount <> 3;


END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_STATISTICS_ADD
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_STATISTICS_ADD`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_STATISTICS_ADD`()
BEGIN
#1.总注册人数
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
select 'totalreg',count(*),DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() from wf_member where SupportType = 0 and substr(CreateTime, 1, 10) < CURDATE();

#2.当日注册人数
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
select 'dayreg',count(*),DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() from wf_member where SupportType = 0 and substr(CreateTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day);

#3.登录人数
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
select 'loginnum', count(distinct(LoginId)),DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() from wf_statistics_login where substr(CreateTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day);

#4.次日留存
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
SELECT
	'keepnum' AS title,
	count(tt.LoginId) AS sun,
	DATE_SUB(CURDATE(),INTERVAL 1 day) dtime,
	NOW()
FROM
	(
		SELECT
			t.LoginId,
			count(t.LoginId) cnt
		FROM
			(
				SELECT DISTINCT
					LoginId,
					substr(CreateTime, 1, 10)
				FROM
					wf_statistics_login
				WHERE
					substr(CreateTime, 1, 10) BETWEEN DATE_SUB(CURDATE(),INTERVAL 2 day) AND DATE_SUB(CURDATE(),INTERVAL 1 day)
			) t
		GROUP BY
			t.LoginId
	) tt
WHERE
	tt.cnt = 2;

#5.次日留存率
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)	
SELECT
	'keepnumrate',
	round((
		SELECT
			sun
		FROM
			wf_statistics_analyse
		WHERE
			StatisticsTime = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
		AND title = 'keepnum'
	) / (
		SELECT
			sun
		FROM
			wf_statistics_analyse
		WHERE
			StatisticsTime = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
		AND title = 'loginnum'
	)*100),
	DATE_SUB(CURDATE(), INTERVAL 1 DAY),
	NOW();	
	
	
#6.总浏览量
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
select 'totalreadcount',count(*)+(select count(*) from wf_statistics_stock where substr(StartTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day) ),
DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() 
from wf_statistics_page where typeid in(13,14,15,16,17,18,19,20)
and substr(StartTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day);

#7.资讯总浏览量
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
select 'newsreadcount',count(*),DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() from wf_statistics_page where typeid in(13,14,15,16,17,18,19)
and substr(StartTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day);

#8.视频总浏览量
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
select 'videoreadcount',count(*),DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() from wf_statistics_page where typeid = 20
and substr(StartTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day);

#9.行情总浏览量
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
select 'quotationreadcount',count(*),DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() from wf_statistics_stock 
where substr(StartTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day);

#10.资讯总评论数
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
select 'newscommentcount',sum(cnt),DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() from (
select count(*) cnt from wf_news_comment where substr(CreateTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day) and IsDelete = 0
union ALL
select count(*) cnt from wf_books_comment where substr(CreateTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day) and IsDelete = 0
union ALL
select count(*) cnt from wf_imagetext_comment where substr(CreateTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day) and IsDelete = 0
union ALL
select count(*) cnt from wf_vote_comment where substr(CreateTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day) and IsDelete = 0) t;

#11.视频总评论数
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
select 'videocommentcount',count(*),DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() from wf_video_comment where substr(CreateTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day) and IsDelete = 0;

#12.股票总评论数
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
select 'quotationcommentcount',count(*),DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() from wf_securities_comment where substr(CreateTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day);

#13.总评论数
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
SELECT
	'totalcommentcount',sum(sun),DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() from
	(
		SELECT
			sun
		FROM
			wf_statistics_analyse
		WHERE
			Title = 'newscommentcount'
		AND substr(StatisticsTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day)
	union all
		SELECT
			sun
		FROM
			wf_statistics_analyse
		WHERE
			Title = 'videocommentcount'
		AND substr(StatisticsTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day)
	union all
		SELECT
			sun
		FROM
			wf_statistics_analyse
		WHERE
			Title = 'quotationcommentcount'
		AND substr(StatisticsTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day)
)t;

#资讯视频点击排行
insert into wf_statistics_rank(Type,PageId,Sun,StatisticsTime,CreateTime)
select TypeId,PageId,count(*),DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() 
from wf_statistics_page where substr(StartTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day)  group by TypeId,PageId,substr(StartTime, 1, 10);

#股票点击排行
insert into wf_statistics_stock_rank(StockType,StockNo,Sun,StatisticsTime,CreateTime)
select StockType,StockNo,count(*),DATE_SUB(CURDATE(),INTERVAL 1 day),NOW() 
from wf_statistics_stock where substr(StartTime, 1, 10) = DATE_SUB(CURDATE(),INTERVAL 1 day)  group by StockType,StockNo,substr(StartTime, 1, 10);


#股票热度统计
update wf_securities_trade a ,(select StockNo,sum(sun) sn from wf_statistics_stock_rank group by StockNo) b
set a.Hotrank = b.sn
where a.SecuritiesNo = b.StockNo ;

insert into wf_statistics_user(totalreg,dayreg,loginnum,keepnum,StatisticsTime,createtime)
select max(case when Title = 'totalreg' then Sun else 0 end) totalreg,
			 max(case when Title = 'dayreg' then Sun else 0 end) dayreg,
			 max(case when Title = 'loginnum' then Sun else 0 end) loginnum,
			 max(case when Title = 'keepnum' then Sun else 0 end) keepnum,
StatisticsTime,StatisticsTime
from wf_statistics_analyse
where StatisticsTime = DATE_SUB(CURDATE(),INTERVAL 1 day);

update wf_statistics_user a INNER JOIN 
(select substr(CreateTime,1,10) ctime,count(*) cnt from wf_statistics_login where substr(CreateTime,1,10) =  DATE_SUB(CURDATE(),INTERVAL 1 day))b 
on a.StatisticsTime = b.ctime
set a.Startnum = b.cnt;


END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_STATISTICS_ANALYSE
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_STATISTICS_ANALYSE`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_STATISTICS_ANALYSE`(IN `P_DATE` date)
BEGIN
declare starttime date;
set starttime = p_date;
while starttime < CURDATE() DO
insert into wf_statistics_analyse(Title,Sun,StatisticsTime,CreateTime)
SELECT
	'totalcommentcount',sum(sun),starttime,NOW() from
	(
		SELECT
			sun
		FROM
			wf_statistics_analyse
		WHERE
			Title = 'newscommentcount'
		AND substr(StatisticsTime, 1, 10) = starttime
	union all
		SELECT
			sun
		FROM
			wf_statistics_analyse
		WHERE
			Title = 'videocommentcount'
		AND substr(StatisticsTime, 1, 10) = starttime
	union all
		SELECT
			sun
		FROM
			wf_statistics_analyse
		WHERE
			Title = 'quotationcommentcount'
		AND substr(StatisticsTime, 1, 10) = starttime
)t;

set starttime = DATE_ADD(starttime,INTERVAL 1 DAY);
end while;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_STOCK_REPORT
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_STOCK_REPORT`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_STOCK_REPORT`(IN P_PERIOD INT)
BEGIN
DECLARE i int default 0;
DECLARE v_num int;
DECLARE v_membercode varchar(20);
	declare cur cursor for
select MemberCode from wf_competition_report where Period = P_PERIOD;

select count(*) into v_num from wf_competition_report where Period = P_PERIOD;

OPEN cur;

while i < v_num DO
FETCH cur into v_membercode;

update wf_competition_report a,
(select MemberCode,SecuritiesNo,max(Yield) MaxYield from wf_competition_stock 
where Yield > 0 and MemberCode = v_membercode and Period = P_PERIOD ORDER BY Yield desc limit 1) b
set a.MaxSecuritiesNo = b.SecuritiesNo,a.MaxYield = b.MaxYield
where a.MemberCode = v_membercode and Period = P_PERIOD;

update wf_competition_report a,
(select SecuritiesNo,Yield MinYield  from wf_competition_stock
 where Yield < 0 and MemberCode = v_membercode and Period = P_PERIOD ORDER BY Yield asc limit 1) b
set a.MinSecuritiesNo = b.SecuritiesNo,a.MinYield = b.MinYield
where a.MemberCode = v_membercode and Period = P_PERIOD;

set i = i + 1;

end while;

CLOSE cur;

UPDATE wf_competition_report a LEFT JOIN wf_securities_trade b on a.MaxSecuritiesNo = b.SecuritiesNo
  SET MaxSecuritiesName = b.SecuritiesName
where a.MaxSecuritiesNo is not null;

UPDATE wf_competition_report a LEFT JOIN wf_securities_trade b on a.MinSecuritiesNo = b.SecuritiesNo
  SET MinSecuritiesName = b.SecuritiesName
where a.MinSecuritiesNo is not null;

END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_STOCK_YIELD
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_STOCK_YIELD`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_STOCK_YIELD`(IN P_PERIOD INT)
BEGIN
	declare v_num int;
	declare v_membercode varchar(20);
	declare v_securitiesno varchar(20);
	declare v_price decimal(10,2);
	declare v_createtime datetime;
	declare i int default 0;
	declare cur cursor for
	SELECT
		a.MemberCode,
		a.SecuritiesNo,
		a.Price,
		a.CreateTime
	FROM
		wf_drivewealth_practice_order a,
		wf_stockcompetitionmember b
	WHERE
		a.MemberCode = b.MemberCode
	AND b.CompetitionId = 1
	AND a.Side = 'S'
	AND a.ExecType = 2
	AND a.CreateTime > '2017-07-03' and a.CreateTime < '2017-07-09'
	AND AccountType = 1;

	SELECT
		count(a.Id) into v_num
	FROM
		wf_drivewealth_practice_order a,
		wf_stockcompetitionmember b
	WHERE
		a.MemberCode = b.MemberCode
	AND b.CompetitionId = 1
	AND a.Side = 'S'
	AND a.ExecType = 2
	AND a.CreateTime > '2017-07-03' and a.CreateTime < '2017-07-09'
	AND AccountType = 1;

	DELETE FROM wf_competition_stock where Period = P_PERIOD;
	
	open cur;
	
	while i < v_num DO
	FETCH cur into v_membercode,v_securitiesno,v_price,v_createtime;
	insert into wf_competition_stock(MemberCode,SecuritiesNo,BPrice,SPrice,BCreateTime,SCreateTime,Yield,Period)
	SELECT
		a.MemberCode,
		a.SecuritiesNo,
		a.Price,
		v_price,
		a.CreateTime,
		v_createtime,
		(v_price-a.Price)/a.Price*100,
		P_PERIOD
	FROM
		wf_drivewealth_practice_order a
	WHERE
		a.MemberCode = v_membercode
	and a.SecuritiesNo = v_securitiesno
	AND a.Side = 'B'
	AND a.ExecType = 2
	AND a.CreateTime > '2017-07-03' and a.CreateTime < v_createtime
	AND AccountType = 1
	limit 1;
	
	set i = i + 1;
	END WHILE;
	CLOSE cur;
		
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for PRC_WF_TEAM_RANK
-- ----------------------------
DROP PROCEDURE IF EXISTS `PRC_WF_TEAM_RANK`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` PROCEDURE `PRC_WF_TEAM_RANK`()
BEGIN

insert into wf_competition_team_asset(TeamId,AvgYield,EndDate,CreateTime)
select b.TeamId,sum(a.WeekYield)/3 AvgYield,a.EndDate,NOW() from wf_drivewealth_practice_asset_v a,wf_competition_team_member b,wf_competition_team c
where a.MemberCode = b.MemberCode and b.TeamId = c.Id and c.`Status` = 1 and c.MemberCount = 3 and a.EndDate = CURDATE()
group by b.TeamId;

truncate table wf_competition_team_yield;
insert INTO wf_competition_team_yield
select b.TeamId,sum(a.WeekYield)/3 AvgYield from wf_drivewealth_practice_asset_v a,wf_competition_team_member b,wf_competition_team c
where a.MemberCode = b.MemberCode and b.TeamId = c.Id and c.`Status` = 1 and c.MemberCount = 3 and a.EndDate = CURDATE()
group by b.TeamId;


truncate table wf_competition_team_rank;
insert into wf_competition_team_rank(TeamId,RankValue,Rank,Type,Defeat,CreateTime)
SELECT
	tt.TeamId,
	tt.AvgYield,
	(
		SELECT
			count(1) + 1
		FROM
			wf_competition_team_yield a
		WHERE a.AvgYield > tt.AvgYield
	) AS rank,
	4 AS Type,
count(tt.TeamId)/(select count(*) from wf_competition_team_yield ),
	CurDate() CreateTime
FROM
	wf_competition_team_yield tt ,wf_competition_team_yield b
where tt.AvgYield >= b.AvgYield
GROUP BY tt.TeamId
ORDER BY rank ASC;


insert into wf_competition_team_rank(TeamId,RankValue,Rank,Type,Defeat,CreateTime)
select c.id,0,(select max(rank)+1 from wf_competition_team_rank where type = 4),4,0,CURDATE() as rank from wf_competition_team c
where  c.`Status` < 2 and c.MemberCount <> 3;

END
;;
DELIMITER ;

-- ----------------------------
-- Event structure for event_analyse
-- ----------------------------
DROP EVENT IF EXISTS `event_analyse`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` EVENT `event_analyse` ON SCHEDULE EVERY 1 DAY STARTS '2017-03-04 23:59:00' ON COMPLETION PRESERVE DISABLE ON SLAVE DO begin
insert into wf_analyse_simp
select '历史注册人数' AS title,count(*) as content,CURDATE() from wf_member where SupportType = '0';
insert into wf_analyse_simp
SELECT '总注册人数' AS title,count(MemberID) AS content,CURDATE() FROM wf_member WHERE supportType = '0';
insert into wf_analyse_simp
select '资讯总浏览次数' as title, sum(ReadCount)+(select sum(ReadCount) from wf_news_delete ) as content,CURDATE() from wf_news ;
insert into wf_analyse_simp
select '视频总浏览次数' as title, sum(ClickNum)+(select sum(ClickNum) from wf_live_video_delete)+130 as content,CURDATE() from wf_live_video;
insert into wf_analyse_simp
select '资讯总评论次数' as title, count(*) as content,CURDATE() from wf_news_comment;
insert into wf_analyse_simp
select '视频总评论次数' as title, count(*)+19 as content,CURDATE() from wf_video_comment;
insert into wf_analyse_simp
select '资讯总点赞次数' as title, count(*) as content,CURDATE() from wf_news_likes;
insert into wf_analyse_simp
select '视频总点赞次数' as title, sum(GoodNumber)+(select sum(GoodNumber) from wf_live_video_delete)+2 as content ,CURDATE() from wf_live_video;
end
;;
DELIMITER ;

-- ----------------------------
-- Event structure for event_competition_statistics
-- ----------------------------
DROP EVENT IF EXISTS `event_competition_statistics`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` EVENT `event_competition_statistics` ON SCHEDULE EVERY 1 DAY STARTS '2017-07-08 05:00:00' ON COMPLETION PRESERVE DISABLE ON SLAVE DO begin
insert into wf_competition_statistics(DealLoginNum,AppLoginNum,DealNum,CreateTime,EndDate)
	SELECT
		a.DealLoginNum,
		b.AppLoginNum,
		c.DealNum,
		NOW(),
		DATE_SUB(CURDATE(), INTERVAL 1 DAY)
	FROM
		(
			SELECT
				count(DISTINCT LoginId) DealLoginNum
			FROM
				wf_statistics_login
			WHERE
				CreateTime BETWEEN DATE_SUB(
					CURDATE(),
					INTERVAL 150 MINUTE
				)
			AND DATE_ADD(
				CURDATE(),
				INTERVAL 240 MINUTE
			)
		) a,
		(
			SELECT
				count(DISTINCT LoginId) AppLoginNum
			FROM
				wf_statistics_login
			WHERE
				substr(CreateTime, 1, 10) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
		) b,
		(
			SELECT
				count(DISTINCT a.MemberCode) DealNum
			FROM
				wf_drivewealth_practice_order a,
				wf_stockcompetitionmember b
			WHERE
				a.MemberCode = b.MemberCode
			AND b.CompetitionId = 1
			AND a.AccountType = 1
			AND a.CreateTime > DATE_SUB(CURDATE(), INTERVAL 1 DAY)
			AND a.CreateTime < CURDATE()
		) c;
end
;;
DELIMITER ;

-- ----------------------------
-- Event structure for event_start
-- ----------------------------
DROP EVENT IF EXISTS `event_start`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` EVENT `event_start` ON SCHEDULE EVERY 1 DAY STARTS '2017-01-23 12:00:00' ON COMPLETION PRESERVE DISABLE ON SLAVE DO begin
declare c_id int;
declare cnt int;
select count(b.id) into cnt from wf_News a, wf_Start b
where a.`Code` = b.NewsCode
and b.IsShow is null
and a.Type = 9;
if cnt > 0 then
update wf_Start set isshow = 0 where isshow = 1;
select b.id into c_id from wf_News a,wf_Start b
where a.`Code` = b.NewsCode
and b.IsShow is null 
and a.Type = 9
order by a.ShowTime asc limit 1;
update wf_Start set isshow = 1 where id = c_id;
end if;
end
;;
DELIMITER ;

-- ----------------------------
-- Event structure for event_statistics_add
-- ----------------------------
DROP EVENT IF EXISTS `event_statistics_add`;
DELIMITER ;;
CREATE DEFINER=`wfadmin`@`%` EVENT `event_statistics_add` ON SCHEDULE EVERY 1 DAY STARTS '2017-04-24 01:00:00' ON COMPLETION PRESERVE DISABLE ON SLAVE DO CALL PRC_WF_STATISTICS_ADD()
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_video_delete`;
DELIMITER ;;
CREATE TRIGGER `trg_video_delete` BEFORE DELETE ON `wf_live_video` FOR EACH ROW BEGIN
insert into wf_live_video_delete values(old.VideoId,old.MemberCode,old.VideoCode,old.VideoName,old.VideoType,old.VideoUrl,old.VideoImage,old.Status,old.ClickNum,old.SortOrder,old.CreateTime,old.Backup1,old.ClickLikeNum,old.TimeLong,old.ShareTitle,old.ShareContent,old.ShareImageUrl,old.GoodNumber,old.StarLevel,old.ShareNumber,old.MemberNumber,old.CommentNumber,old.Contents,old.AdminCode,old.Lables,old.IsRecommend,old.ShowTime,NOW());
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_news_delete`;
DELIMITER ;;
CREATE TRIGGER `trg_news_delete` BEFORE DELETE ON `wf_news` FOR EACH ROW BEGIN
insert into wf_news_delete values(old.Id,old.Code,old.Label,old.Title,old.Content,old.TitlePicture,old.SelectPicture,old.SecuritiesType,old.SecuritiesNo,old.ReadCount,old.ShowTime,old.IsStartNews,old.Type,old.AdminCode,old.Remark,old.CreateUser,old.CreateTime,old.Extended,old.ColumnNo,NOW(),old.LikesCount,old.CommentCount);
END
;;
DELIMITER ;
