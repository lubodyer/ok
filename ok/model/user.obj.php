<?php
/**
 * OK User - OK System Object.
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
 * User - OK System Object
 *
 * @package System
 */
final class OK_User extends OK_Interface implements Serializable
{
    /**
     *
     */
    protected $id = 0;

    /**
     *
     */
    protected $group_id = 0;

    /**
     *
     */
    protected $store = null;

    // --

    /**#@+
    * Private object configuration.
    * @access private
    */

    protected $_params = array ('id', 'group_id', 'store');

    // --

    public function __construct ($id = 0, $group_id = 0, $store = null)
    {
        parent::__construct();

        // --

        $this->id = $id;
        $this->group_id = $group_id;
        $this->store = $store;
    }

    // --

    /**
     *
     */
    public function serialize ()
    {
        return serialize(array($this->id, $this->group_id, $this->store));
    }

    /**
     *
     */
    public function unserialize ($data)
    {
        if ($this->ok->_protected) {
            $user = unserialize($data);
            $this->__construct($user[0], $user[1], $user[2]);
            return;
        }

        // --

        throw new OK_Exception("Access denied to unserialize OK User.");
    }

    /**
     *
     */
    public function __toString ()
    {
        return $this->id;
    }

    // --

    /**#@-*/
}
