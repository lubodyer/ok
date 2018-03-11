<?php
/**
 * This file contains the Abstract OK Model
 *
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
 * @package System
 */

/**
 * Abstract OK Model
 *
 * @package System
 */
abstract class OK_Model extends OK_Interface
{
    /**
     *
     */
    final public function __construct()
    {
        parent::__construct();

        if (method_exists($this, '___construct')) {
            $arguments = func_get_args();
            call_user_func_array(array($this, '___construct'), $arguments);
        }
    }

    /**
     *
     */
    final public function __destruct()
    {
        if (method_exists($this, '___desctruct')) {
            call_user_func(array($this, '___destruct'));
        }

        parent::__destruct();
    }
}
