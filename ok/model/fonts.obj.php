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
 * @package System
 */

/**
 *
 * @package System
 */
class OK_Fonts extends OK_Items
{
    /**
     *
     */
    public function __construct()
    {
        parent::__construct("fonts");
    }

    /**
     *
     */
    public function dataURI($fname, $app_id = '.')
    {
        if ($app_id == '.')
            $path = OK_ROOT;
        elseif ($app_id[0] == '.')
            $path = OK_ROOT . DIRECTORY_SEPARATOR . 'programs' . DIRECTORY_SEPARATOR . substr($app_id, 1);
        else
            $path = OK_PROGRAMS . DIRECTORY_SEPARATOR . $app_id;

        $fpath = $path . DIRECTORY_SEPARATOR . 'fonts' . DIRECTORY_SEPARATOR . $fname;

        if (!file_exists($fpath)) {
            throw new OK_Exception(sprintf("File \"%s\" does not exist.", $fpath));
        };

        return "data:font/opentype;base64," . base64_encode(file_get_contents($fpath));
    }

    /**
     *
     */
    public function load($src, $app_id = '.')
    {
        return $this->_load($src, $app_id);
    }
}
