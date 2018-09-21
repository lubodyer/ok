<?php
/**
 * This file contains the Label OK Object
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
 * @package Objects
 * @subpackage Interface
 */

 /** Label object extends the Element object. Include the Element object, if not already available. */
if (!class_exists('OK_Object_Element'))
    require_once(dirname(__FILE__) . '/element.obj.php');

/**
 * Label - OK Object
 *
 * Use the Label object to provide descriptive text for another object. For example, use a Label
 * for a {@link OK_Object_CheckBox} to inform the users about the type of data expected from
 * them. Use the {@link $for} property to specify to which object the label belongs to.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_Label extends OK_Object_Element
{
    /**
     * Retrieves the string identifying the object type.
     * @var string
     */
    protected $_type = 'label';

    // --

    protected $element = 'label';

    // --

    protected $_scripts = array("label");
    protected $_events = array("mousedown");

    // --

    /**
     *
     */
    protected function _toHTML()
    {
        $output = parent::_toHTML();

        $ref = $this->client->init("OK_Object_Label", $this->id, $this->for);
        $this->process_events($ref);

        return $output;
    }

    // --
}

