<?php
/**
 * OK Cache - OK System Object.
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
 * OK Cache - OK System Object.
 *
 * @package System
 */
class OK_Cache extends OK_Interface
{
    protected $dependencies = array('config', 'client', 'engine', 'user');

    /**#@+
     * @access private
     */

    /** */
    protected $_root;

    protected $_readonly = array('state');

    /** */
    public function __construct()
    {
        parent::__construct();
        parent::$_shared['_cache'] = $this;

        $this->_root = OK_DATA . '/cache';

        if (!is_dir($this->_root) && !mkdir($this->_root, 0770, true)) {
            throw new Exception("Access denied to initialize cache.");
        }

//      $this->refresh();
    }

    /**#@-*/

    /** */
    public function cache($id, $data)
    {
        if (!$this->config->system->cache) {
            return false;
        }

        if (file_put_contents($this->_root . DIRECTORY_SEPARATOR . $this->getId($id), $data)) {
            return true;
        }

        return false;
    }

    /**
     *
     */
    public function clear ($all = false)
    {
        if ($all) {
            $dir = dir($this->_root);
            while ($entry = $dir->read()) {
                $fname = $this->_root . "/" . $entry;
                if (is_file($fname)) {
                    unlink($fname);
                }
            }
        }
    }

    /**
     *
     */
    public function is_cached($id, $original = null)
    {
        if (!$this->config->system->cache) {
            return false;
        }

        $fname = $this->_root . DIRECTORY_SEPARATOR . $this->getId($id);
        if (is_file($fname)) {
            $mtime = $this->convert($original);
            if ($mtime) {
                return filemtime($fname) > $mtime;
            }
            return true;
        }

        return false;
    }

    /**
     *
     */
    public function get($id, $original = null)
    {
        if (!$this->config->system->cache) {
            return false;
        }

        $fname = $this->_root . DIRECTORY_SEPARATOR . $this->getId($id);
        if (is_file($fname)) {
            $mtime = filemtime($fname);
            $_mtime = $this->convert($original);
            if ($original && $mtime < $_mtime) {
                return false;
            }
            return file_get_contents($fname);
        }

        return false;
    }

    /**
     *
     */
    protected function getId($id)
    {
        //return md5($id);
        return str_replace("/", "_", $id);
    }

    // --

    /**
     *
     */
    protected function convert($original)
    {
        if (is_int($original)) {
            return $original;
        } elseif (is_file($original)) {
            return filemtime($original);
        }

        return null;
    }

}

