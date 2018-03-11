<?php
/**
 * OK v.5 - okay-os.com
 *
 * Copyright (c) 2004-2018 Lubo Dyer. All Rights Reserved.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 * @package OK
 */

// Enable full error reporting
error_reporting(E_ALL | E_STRICT);

// Ignore user abort
// ignore_user_abort(true);

// Ensure PHP version > 5.3
if (version_compare(phpversion(), "5.3", "<")) {
    trigger_error("OK Server requires PHP version 5.3 [detected " . phpversion() . "] or higher to operate.", E_USER_ERROR);
    return false;
}

// ---------

if (!defined('OK_ROOT')) {
    define('OK_ROOT', dirname(__FILE__));
}

if (!defined('OK_CONFIG')) {
    define('OK_CONFIG', OK_ROOT . DIRECTORY_SEPARATOR . 'ok.ini');
}

// ---------

if (!ini_get('date.timezone') && !getenv('TZ')) {
    date_default_timezone_set(@date_default_timezone_get());
}

// ---------

umask(0007);

// ---------

// Start the model
require_once OK_ROOT . '/model/ok.obj.php';
OK::start();
