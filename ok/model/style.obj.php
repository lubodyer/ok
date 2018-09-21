<?php
/**
 * This file contains the Style OK System Object.
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
 * Style - OK System Object
 *
 * @package System
 */
class OK_Style implements Serializable
{
    /**
     *
     *
     */
    protected $value;

    /**
     *
     *
     */
    protected $_attributes = array();

    /**
     *
     *
     */
    protected $_px = array('height' => 1, 'margin' => 1, 'padding' => 1, 'width' => 1, 'min-width' => 1, 'min-height' => 1, 'max-width' => 1, 'max-height' => 1);

    /**
     *
     *
     */
    public function __construct($value = '')
    {
        $this->__set('value', $value);
    }

    /**
     *
     *
     */
    public function __get($name)
    {
        $name = trim($name);

        if ($name == 'value')
            return $this->__toString();
        elseif (isset($this->_attributes[$name]))
            return $this->_attributes[$name];
        else
            return '';
    }

    /**
     *
     *
     */
    public function __set($name, $value)
    {
        $name = trim($name);
        $value = trim($value);

        if ($value) {
            if ($name == 'value') {
                $declarations = explode(';', $value);
                foreach ($declarations as $declaration) {
                    $declaration = trim($declaration);
                    $attributes = preg_split("/:[ \t]*(?!\/)/", $declaration);
                    if (count($attributes) == 1) $attributes[] = '';
                    $this->set($attributes[0], $attributes[1]);
                }
            } elseif ($name && !isset($this->$name))
                $this->set($name, $value);
        }
    }

    /**
     *
     *
     */
    public function __toString()
    {
        return $this->toString();
    }

    /**
     * Retrieves whether or not the object is empty.
     * @return boolean
     */
    public function isEmpty()
    {
        return empty($this->_attributes);
    }

    /**
     *
     *
     */
    public function remove($attribute)
    {
        if (isset($this->_attributes[$attribute])) {
            unset($this->_attributes[$attribute]);
        }
    }

    /**
     *
     */
    public function serialize()
    {
        return serialize($this->toString());
    }

    /**
     *
     */
    public function unserialize($serialized)
    {
        $this->__construct(unserialize($serialized));
    }

    /**
     *
     *
     */
    public function set($attribute, $value = null)
    {
        $attribute = trim($attribute);
        $value = trim($value);

        if ($attribute && $value !== null) {
            if (is_numeric($value) && isset($this->_px[$attribute])) {
                $value .= 'px';
            }
            $this->_attributes[$attribute] = $value;
        } elseif ($attribute && isset($this->_attributes[$attribute])) {
            unset($this->_attributes[$attribute]);
        }
    }

    /**
     *
     *
     */
    public function toString()
    {
        $output = array();
        foreach ($this->_attributes as $name => $value) {
            $output[] = $name;
            $output[] = ':';
            $output[] = $value;
            $output[] = ';';
        }
        return implode($output);
    }
}

