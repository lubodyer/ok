<?php
/**
 * This file contains the Status OK System Object.
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
 * Status - OK System Object
 *
 * @package System
 */
final class OK_Status extends OK_Interface
{
    /**
     *
     * @var string
     */
    protected $id;

    /**
     *
     * @var int
     */
    public $item = 0;

    /**
     *
     * @var int
     */
    public $items = 0;

    /**
     *
     * @var string
     */
    public $status = "";

    // --

    protected $_readonly = array('id');
    protected $_saved = false;

    public function __construct()
    {
        parent::__construct();

        $cid = $this->ok->request->get('OK_CLIENT_REQUEST_ID');

        if ($cid) {
            $sid = $this->session->id;
            $iid = $this->session->instance->id;
            $this->id = 'status.' . md5($cid . '.' . $sid . '.' . $iid);
            $this->debug("STATUS: Initializing " . $this->id, 5, 'status');
        }
    }

    /**
     *
     *
     */
    public function set($item, $items, $status)
    {
        $this->item = $item;
        $this->items = $items;
        $this->status = $status;
        $this->commit();
    }

    /**
     *
     *
     */
    public function setItem($item, $commit = true)
    {
        $this->item = $item;
        if ($commit) $this->commit();
    }

    /**
     *
     *
     */
    public function setItems($items, $commit = true)
    {
        $this->items = $items;
        if ($commit) $this->commit();
    }

    /**
     *
     *
     */
    public function setStatus($status, $commit = true)
    {
        $this->status = $status;
        if ($commit) $this->commit();
    }

    /**
     *
     *
     */
    public function commit()
    {
        if ($this->id) {
            $this->ok->session->commit();
            $this->debug("STATUS: Saving " . $this->id, 105, 'status');
            $fd = OK_TEMP . '/status';
            if (!is_dir($fd) && !mkdir($fd, 0777, true))
                throw new Exception("Unable to create temp status directory.");
            $fn = $fd . '/' . $this->id;
            $fp = fopen($fn, "w");
            if (!$fp)
                trigger_error("STATUS: Failed to obtain resource handle.", E_USER_WARNING);
            elseif (flock($fp, LOCK_EX)) {
                $stamp = time();
                fwrite($fp, serialize(array('item' => $this->item, 'items' => $this->items, 'status' => $this->status, 'stamp' => $stamp)));
                flock($fp, LOCK_UN);
                $this->_saved = true;
                $this->debug("STATUS: Saved ($stamp).", 5, 'status');
            } else
                trigger_error("STATUS: Failed to lock resource for writting.", E_USER_WARNING);
            fclose($fp);
        } else
            trigger_error("STATUS: Unable to save progress.", E_USER_WARNING);
    }

    /**
     *
     *
     */
    public function __destruct()
    {
        if ($this->id) {
            $this->debug("STATUS: Destroying " . $this->id, 105, 'status');
            if ($this->_saved) {
                $fname = OK_TEMP . '/status/' . $this->id;
                if (is_file($fname) && unlink($fname)) {
                    $this->debug("STATUS: Deleted.", 5, 'status');
                } else
                    trigger_error("STATUS: Failed to delete resource.", E_USER_WARNING);
            }
        }

        parent::__destruct();
    }
}
