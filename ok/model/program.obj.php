<?php
/**
 * Copyright (c) 2004-2018 Lubo Dyer. All Rights Reserved.
 *
 * OK v.5 - okay-os.com
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
 */
class OK_Program extends OK_Interface
{
    /**
     *
     */
    protected $root;

    /**
     *
     */
    protected $config;

    /**
     *
     */
    final public function __construct()
    {
        $this->root = $this->engine->root;

        parent::__construct();

        // --

        $sIniFileName = $this->root . DIRECTORY_SEPARATOR . "application.ini";
        if (is_file($sIniFileName)) {
            $this->config = new OK_Config($sIniFileName);
        }
        unset($sIniFileName);

        // --

        if (method_exists($this, '___construct'))
        {
            $arguments = func_get_args();
            call_user_func_array(array($this, '___construct'), $arguments);
        }
    }

    /**
     *
     */
    final public function __run($sFileName)
    {
        try
        {
            global $ok;
            require $sFileName;
        }
        catch (Exception $x)
        {
            throw new OK_Exception($x->getMessage(), -1, $x);
        }
    }

    /**
     *
     */
    final public function __load($sFileName)
    {
        $contents = file_get_contents($sFileName);

        if (method_exists($this, '___load')) {
            $contents = call_user_func_array(array($this, '___load'), [$contents]);
        }

        return $contents;
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

