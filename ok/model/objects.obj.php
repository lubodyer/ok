<?php
/**
 * OK Objects Collection.
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
 * @subpackage Core
 */

/**
 * OK Objects Collection.
 *
 * OK Objects Collection is the central repository for OK Objects.
 *
 * @package System
 * @subpackage Core
 */
final class OK_Objects
{
    /**
     *
     * @access private
     */
    public $_items = array();

    /**
     * Creates OK Object.
     * @param string $sObjectName The name of the object.
     * @param array $aParams (optional) Array of object parameters.
     * @param array $aObjects (optional) Array of child objects.
     * @param array $bRegister (optional) Whether or not to register the object with the {@link OK_Objects objects collection}.
     * @param array $bAddToResponse (optional) Whether or not to add object to {@link OK_Response response}.
     */
    public function create($sObjectName, $aParams = array(), $aObjects = array(), $bRegister = false, $bAddToResponse = false)
    {
        global $ok;

        $sObjectName = strtolower($sObjectName);
        $objectName = 'OK_Object_' . ucfirst($sObjectName);

        if (!class_exists($objectName))
        {
            $found = false;
            if ($ok->app) {
                $filename = OK_PROGRAMS . '/' . $ok->app->app_id . '/objects/' . $sObjectName . '.obj.php';
                if (file_exists($filename)) {
                    require_once $filename;
                    $found = true;
                }
            }

            if (!$found) {
                $filename = OK_ROOT . '/objects/' . $sObjectName . '.obj.php';
                if (!file_exists($filename)) {
                    trigger_error("Object \"$sObjectName\" does not exist!", E_USER_ERROR);
                }
                require_once $filename;
            }

        }

        if (class_exists($objectName))
            $object = new $objectName($aParams, $aObjects, $bRegister);
        elseif (function_exists($objectName))
            $object = $objectName($aParams, $aObjects, $bRegister);
        else
            trigger_error("Error creating object \"$sObjectName\".", E_USER_ERROR);

        if ($bAddToResponse)
            $GLOBALS['ok']->add($object);

        return $object;
    }

    /**
     *
     *
     */
    public function add($object)
    {
        $id = $object->id;
        if (is_object($object) && $id) {
            $this->_items[$id] = $object;
            return true;
        }
        return false;
    }

    /**
     *
     * @access private
     * @todo trigger warning
     */
    public function update($old_id, $new_id)
    {
        if (isset($this->_items[$old_id])) {
            $this->_items[$new_id] = $this->_items[$old_id];
            unset($this->_items[$old_id]);
            return true;
        }
        return false;
    }

    /**
     *
     *
     */
    public function exists($id)
    {
        return isset($this->_items[$id]);
    }

    /**
     *
     *
     */
    public function get($id)
    {
        if (isset($this->_items[$id])) {
            return $this->_items[$id];
        }

        return false;
    }

    /**
     * Checks if object is a valid OK Object.
     * @return boolean
     */
    public function is_object($mixed)
    {
        if (is_string($mixed))
            $mixed = $this->get($mixed);
        return is_object($mixed) && $mixed instanceof OK_Object;
    }

    /**
     *
     */
    public function length()
    {
        return count($this->_items);
    }

    /**
     *
     */
    public function destroy()
    {
        $this->_items = array();
    }

    /**
     *
     *
     *
     */
    public function remove($id)
    {
        if (isset($this->_items[$id])) {
            unset($this->_items[$id]);
        }
    }

}
