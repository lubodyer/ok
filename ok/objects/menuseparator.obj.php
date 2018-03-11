<?php
/**
 * This file contains the MenuSeparator OK Object.
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
 * @subpackage Input
 */

/**
 * MenuSeparator - OK Object
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_MenuSeparator extends OK_Object
{
    protected $_type = 'menuseparator';

    protected $class = 'MENU_SEPARATOR';

    protected $_childof = array('menu');

    protected $_accept = null;

    protected $_params = array('class');

    protected function _toHTML()
    {
        return "<div class='$this->class' style='height:2px;'></div>";
    }
}
