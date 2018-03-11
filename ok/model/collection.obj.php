<?php
/**
 * OK v.5 - okay-os.com
 *
 * This file contains the Collection OK System Object.
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
 * Collection - OK System Object
 *
 * Collects Objects' children as well as the main system content.
 *
 * @package System
 */
class OK_Collection implements Serializable
{
    /**
     * Retrieves the total number of objects in the colection.
     * @var int
     */
    public $length = 0;

    /**
     * Sets or retrieves the reference to the parent object, if any.
     * @var object
     */
    public $parent = null;

    /**
     * Objects are stored here.
     * @access private
     * @var array
     */
    protected $_items = array();

    /**
     * Constructs the object.
     * @access private
     */
    public function __construct($parent = NULL)
    {
        if ($parent)
            $this->parent = $parent;
    }

    /**
     * Adds a new object to the collection.
     * @param object $object The object to add
     * @param boolean $bUnShift Optional. If set to TRUE object will be added at the begining instead of at the end of the collection.
     */
    function add($object, $bUnShift = FALSE)
    {
        global $ok;

        if ($ok->config->system->safe_mode) {
            if (is_object($object) && is_object($this->parent) && ((count($this->parent->_accept) && !in_array($object->_type, $this->parent->_accept)) || (count($this->parent->_reject) && in_array($object->_type, $this->parent->_reject))))
                trigger_error("Accept error. \"" . $this->parent->_type . "\" object does not accept child objects of type \"" . $object->_type . '".', E_USER_ERROR);
        }
        if ($object instanceof OK_Object)
            $object->parent = $this->parent;

        if ($bUnShift) {
            array_unshift($this->_items, $object);
        } else {
            $this->_items[] = $object;
        }

        $this->length++;
    }

    /**
     * Retrieves an object at a specified index.
     * @param int $index The index of the object to retrieve.
     */
    function get($index)
    {
        if (isset($this->_items[$index]))
            return $this->_items[$index];
        return false;
    }

    /**
     * Removes an object from the collection at a specified index.
     * @param int $index The index of the object to remove.
     * @return mixed Returns the object or the boolean FALSE if not found.
     */
    function remove($index) {
        $ret = array_splice($this->_items, $index, 1);
        if (is_array($ret) && count($ret)) {
            $this->length--;
            return $ret[0];
        }
        return false;
    }

    /**
     *
     */
    function set($index, $object)
    {
        if (isset($this->_items[$index]))
        {
            if ($object instanceof OK_Object) {
                $object->parent = $this->parent;
            }

            $this->_items[$index] = $object;

            return true;
        }
        return false;
    }

    /*
     *
     *
     *
    function insert($object, $index = 0, $before = TRUE) {
        // TODO, meanwhile use add
    }
    */

    /**
     * Removes all objects from the content collection.
     */
    function clear()
    {
        $this->length = 0;
        $this->_items = array();
    }

    /**
     * Destroys all objects and clears the collection.
     */
    public function destroy()
    {

        for ($i = 0; $i < $this->length; $i++) {
            $item = $this->_items[$i];
            if ($item instanceof OK_Object)
                $item->destroy();
        };

        $this->length = 0;
        $this->_items = array();
    }

    /**
     * Returns the HTML representation of an object at a specified index.
     * @param int $index The index of the object.
     * @return string The HTML representation of the object.
     */
    function itemToHTML($index)
    {
        $item = $this->get($index);
        if (is_object($item) && method_exists($item, 'toHTML')) {
            $ret = $item->toHTML();
            return $ret;
        }
        elseif (is_object($item))
            trigger_error($this->parent->id . ': Unidentified object in collection. Object output omitted.', E_USER_WARNING);
        elseif (is_string($item))
            return $item;

        return "";
    }

    /**
     * Retrieves the index of a specific object.
     * @param object $object The object reference.
     * @return mixed Returns the index or the boolean FALSE if not found.
     */
    public function index($object)
    {
        return array_search($object, $this->_items, true);
    }

    /**
     *
     */
    public function serialize()
    {
        return serialize($this->_items);
    }

    /**
     *
     */
    public function unserialize($serialized)
    {
        $this->_items = unserialize($serialized);
        $this->length = count($this->_items);
    }

    /**
     *
     */
    public function setParent($parent)
    {
        $this->parent = $parent;
        foreach ($this->_items as $item)
            if ($item instanceof OK_Object)
                $item->parent = $parent;
    }

    /**
     *
     */
    public function fixParent($parent)
    {
        $this->parent = $parent;
        foreach ($this->_items as $item)
            if ($item instanceof OK_Object)
                $item->fixParent($parent);
    }

    /**
     * Adds a free-style text to the collection.
     * @param string $text Free-style text to add to the collection.
     */
    public function write($text)
    {
        if (!is_object($text)) {
            $this->length++;
            $this->_items[] = $text;
        } else
            $this->add($text);
    }


    /**
     * Returns the HTML representation of all the items in the collection.
     * @return string The HTML representation of the items in the collection.
     */
    public function toHTML()
    {
        $output = array();
        for ($i = 0; $i < $this->length; $i++)
            $output[] = $this->itemToHTML($i);
        return implode('', $output);
    }

}
