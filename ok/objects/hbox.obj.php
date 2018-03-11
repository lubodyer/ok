<?php
/**
 * This file contains the HBox OK Object.
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

/** HBox objects extends the Box object. Include the Box object, if not already available. */
if (!class_exists('OK_Object_Box'))
    require_once(dirname(__FILE__) . '/box.obj.php');

/**
 * HBox - OK Object
 *
 * The HBox Object is a {@link OK_Object_Box} object with the {@link $orientation} property
 * set to "horizontal" by default.
 *
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_HBox extends OK_Object_Box
{
    /**
     *
     *
     */
    protected $orientation = 'horizontal';
}
