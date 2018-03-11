<?php
/**
 * This file contains the Extras OK System Object.
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
 * Items - OK System Object.
 *
 * Collects items - dialogs, images, scrips, styles and fonts that are to be transfered to client.
 *
 * @package System
 */
class OK_Items extends OK_Interface
{
    /**
     * Retrieves the list of the collected extras.
     * @var array
     */
    protected $items = array();

    /**
     *
     */
    protected $index = array();

    /**
     * Retrieves the type of the collected items.
     * @var string
     */
    protected $_type;

    /**#@+
     * @access private
     */

    /** @var array */
    protected $_readonly = array('items', 'index', '_type');

    /** */
    public function __construct($type)
    {
        $this->_type = $type;

        parent::__construct();
    }

    /**#@-*/

    // -----------------

    /**
     * Alias of {@link load()}.
     * @see load()
     */
    public function add($name)
    {
        return $this->load($name);
    }

    /**
     *
     *
     */
    public function load($name, $app_id = '.')
    {
        if (isset(self::$_shared['_engine'])) {
            $app = self::$_shared['_engine'];
            if (is_object($app)) {
                $app_id = self::$_shared['_engine']->app_id;
            }
            elseif (is_string($app)) {
                $app_id = $app;
            } else
                throw new Exception("Error loading " . $this->_type . " - application detection error.");
        } else {
            $app_id = '.';
        }

        // --

        return $this->_load($name, $app_id);
    }

    // -----------------

    /**
     * @ignore
     * @iaccess protected
     */
    public function _set($items)
    {
        for ($i = 0, $l = count($items); $i < $l; $i++)
        {
            $item = $items[$i];
            $item_id = $item['id'];

            if (!array_key_exists($item_id, $this->index)) {
                $this->items[] = array(
                    'id' => $item_id,
                    'app_id' => $app_id,
                    'name' => $name
                );
                $this->index[$item_id] = count($items) - 1;
            }
        }
    }

    // --

    /**
     *
     *
     */
    protected function _load($name, $app_id)
    {
        if (!is_string($name))
            return false;

        $item_id = '/ok/' . $this->_type;

        if ($app_id == '.')
            $item_id .= '/object';
        elseif ($app_id[0] == '.')
            $item_id .= '/system/program/' . substr($app_id, 1) . '/service';
        else
            $item_id .= '/program/'.$app_id . ($this->_type == "images" ? '' : '/service');

        $item_id .= '/' . $name;

        if (!array_key_exists($item_id, $this->index)) {
            $this->items[] = array(
                'id' => $item_id,
                'app_id' => $app_id,
                'name' => $name
            );
            $this->index[$item_id] = count($this->items) - 1;
        }

        return $item_id;
    }
}

