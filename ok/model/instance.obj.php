<?php
/**
 * OK Instance - OK System Object.
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
 * OK Instance - OK System Object.
 *
 * @package System
 */
final class OK_Instance extends OK_Interface
{
    protected $id;
    protected $cache = array();
    protected $data = array();

    /**#@+
     * @access private
     */

    /** @ignore */
    public $_id;
    /** @ignore */
    public $_cache;
    /** @ignore */
    public $_data = array();

    /** */
    protected $_readonly = array('id', 'cache');

    /** */
    public function __construct($wid)
    {
        $this->id = $wid;

        parent::__construct();
    }

    /**#@-*/

    /**
     *
     */
    public function set($name, $value)
    {
        $this->data[$name] = $value;
    }

    /**
     *
     */
    public function get($name, $clear = false)
    {
        if (isset($this->data[$name])) {
            $data = $this->data[$name];
            if ($clear) $this->clear($name);
            return $data;
        } else
            return "";
    }

    /**
     *
     */
    public function clear($name)
    {
        if (isset($this->data[$name]))
        {
            unset($this->data[$name]);
            return true;
        }

        return false;
    }

    /**
     *
     */
    public function cache($id, $data = "")
    {
        if (!$this->is_cached($id)) {
            $this->cache[$id] = $data;
            return true;
        }
        return false;
    }

    /**
     *
     */
    public function is_cached($id)
    {
        return isset($this->cache[$id]);
    }

    /**
     *
     */
    public function cache_remove($id)
    {
        if ($this->is_cached($id)) {
            unset($this->cache[$id]);
            return true;
        }
        return false;
    }

    /**#@+
     * @access private
     */

    /**
     *
     *
     */
    public function __sleep()
    {
        $this->_id = $this->id;
        $this->_cache = $this->cache;
        $this->_data = $this->data;

        return array('_id', '_cache', '_data');
    }

    /**
     *
     *
     */
    public function __wakeup()
    {
        $this->id = $this->_id;
        $this->cache = $this->_cache;
        $this->data = $this->_data;

        $this->_id = null;
        $this->_cache = null;
        $this->_data = null;

        parent::__construct();
    }

    /**#@-*/
}

