<?php
/**
 * This file contains the HScrollBar OK Object.
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

/** HScrollBar object extends the ScrollBar object. Include the ScrollBar object, if not already available. */
if (!class_exists('OK_Object_ScrollBar'))
    require_once(dirname(__FILE__) . '/scrollbar.obj.php');

/**
 * HScrollBar - OK Object.
 *
 * The HScrollBar is a ScrollBar with the {@link $orientation} property set to "horizontal", and
 * the {@link $width} set to "100%" by default. For more information on this object see its parent - the
 * {@link OK_Object_ScrollBar}.
 *
 * @members hide
 * @package Objects
 * @subpackage Interface
 */
class OK_Object_HScrollBar extends OK_Object_ScrollBar
{
    protected $_type = 'hscrollbar';
    protected $orientation = "horizontal";
    protected $width = '100%';
    protected $height = 16;
}
