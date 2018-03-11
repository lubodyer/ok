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
 */
final class OK_Config extends OK_Interface
{
    /**
     *
     */
    protected $config = array ();

    /**
     *
     */
    const MATCH = '#\$[A-Z][A-Z0-9_]+#';

    /**
     *
     */
    protected $mtime = 0;

    /**
     *
     */
    public function __construct ($iniFile, $localIniFile = "")
    {
        parent::__construct();
        $this->load($iniFile, $localIniFile);
    }

    /**
     *
     */
    public function load ($iniFile, $localIniFile = "")
    {
        $this->_parse($iniFile);

        if (!$localIniFile) {
            $pinfo = pathinfo($iniFile);
            $localIniFile = $pinfo['dirname'] . DIRECTORY_SEPARATOR . $pinfo['filename'] . '.local.ini';
        }
        if (is_file($localIniFile)) {
            $this->_parse($localIniFile);
        }
    }

    /**
     *
     */
    protected function _parse($iniFile)
    {
        if (false === ($_config = parse_ini_file($iniFile, true))) {
            throw new OK_Exception("Error parsing config file.($iniFile)");
        }

        $mtime = filemtime($iniFile);
        if ($mtime > $this->mtime) {
            $this->mtime = $mtime;
        }

        $config = $this->config;
        foreach ($_config as $section => $_section)
        {
            $section = strtolower($section);
            if (!isset($config[$section])) {
                $config[$section] = [];
            }

            foreach ($_section as $name => $value) {
                $config[$section][strtolower($name)] = preg_replace_callback(self::MATCH, array($this, '___filter'), $value);
            }
        }
        $this->config = $config;
    }

    /**
     *
     */
    public function ___filter($matches)
    {
        if (false !== ($var = getenv(substr($matches[0], 1)))) {
            return $var;
        }

        return $matches[0];
    }

    /**
     *
     */
    public function __isset ($name)
    {
        return isset($this->config[$name]);
    }

    /**
     *
     */
    public function __get ($name)
    {
        if ($name === "mtime") {
            return $this->mtime;
        }

        if (isset($this->config[$name]) && is_array($this->config[$name])) {
            return new OK_Config_Section($this, $name, $this->config[$name]);
        }

        return null;
    }

    /**
     *
     */
    public function __set ($name, $value)
    {
        // TODO
    }
}

// --

/**
 *
 */
final class OK_Config_Section
{
    /**
     *
     */
    private $_parent;

    /**
     *
     */
    private $_values = array ();

    /**
     *
     */
    private $_section = "";

    /**
     *
     */
    public function __construct (OK_Config $parent, $section = "", array $values)
    {
        $this->_parent = $parent;
        $this->_section = $section;
        $this->_values = $values;
    }

    /**
     *
     */
    public function get()
    {
        return $this->_values;
    }

    /**
     *
     */
    public function __isset($name)
    {
        return isset($this->_values[$name]);
    }

    /**
     *
     */
    public function __get ($name)
    {
        if (isset($this->_values[$name])) {
            return $this->_values[$name];
        }
        return null;
    }

    /**
     *
     */
    public function __set ($name, $value)
    {
        // TODO
    }

    /**
     *
     */
    public function __destruct()
    {
        unset($this->_parent);
    }

}
