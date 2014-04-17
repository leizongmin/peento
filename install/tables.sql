-- phpMyAdmin SQL Dump
-- version 3.2.0.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2014 年 04 月 17 日 06:39
-- 服务器版本: 5.1.36
-- PHP 版本: 5.2.11

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- 数据库: `peento`
--

-- --------------------------------------------------------

--
-- 表的结构 `article_list`
--

CREATE TABLE IF NOT EXISTS `article_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `tags` text NOT NULL,
  `summary` varchar(255) NOT NULL,
  `is_removed` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `is_removed` (`is_removed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
