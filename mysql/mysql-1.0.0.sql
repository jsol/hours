CREATE table IF NOT EXISTS `times` (
  `uuid` varchar(256) NOT NULL,
  `userid` varchar(256) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `shorttime` varchar(256) NOT NULL,
  `year` int(10) unsigned NOT NULL,
  `month` int(10) unsigned NOT NULL,
  `day` int(10) unsigned NOT NULL,
   PRIMARY KEY (`uuid`),
   KEY `userid` (`userid`),
   KEY `year` (`year`),
   KEY `month` (`month`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE table IF NOT EXISTS `holidays` (
  `uuid` varchar(256) NOT NULL,
  `userid` varchar(256) NOT NULL,
  `type` varchar(256) NOT NULL,
  `year` int(10) unsigned NOT NULL,
  `month` int(10) unsigned NOT NULL,
  `day` int(10) unsigned NOT NULL,
   PRIMARY KEY (`uuid`),
   KEY `userid` (`userid`),
   KEY `year` (`year`),
   KEY `month` (`month`),
   UNIQUE (`userid`, `year`, `month`, `day`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE table IF NOT EXISTS `users` (
  `userid` varchar(256) NOT NULL,
  `timezone` bigint(20) NOT NULL,
   PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE table IF NOT EXISTS `table_revisions` (
  `tablename` varchar(191) NOT NULL,
  `appversion` varchar(256) NOT NULL,
  `lastmodified` datetime  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tablename`)
) ENGINE=InnoDB;

INSERT INTO `table_revisions` (
          `tablename`,       `appversion`
) VALUES ('times',       '1.0.0'),
         ('users', '1.0.0'),
         ('table_revisions', '1.0.0')
  ON DUPLICATE KEY UPDATE `appversion` = '1.0.0';
