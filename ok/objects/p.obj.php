<?php
/**
 * This file contains the P OK Object.
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
 * @subpackage HTML
 */

/** P object extends the Element object. Include the Element object, if not already available. */
if (!class_exists('OK_Object_Element'))
    require_once(dirname(__FILE__) . '/element.obj.php');

/**
 * P - OK Object
 *
 * @package Objects
 * @subpackage HTML
 */
class OK_Object_P extends OK_Object_Element
{
    /**
     *
     *
     */
    public $element = 'p';
}
