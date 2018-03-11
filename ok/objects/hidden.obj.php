<?php
/**
 * This file contains the Hidden OK Object.
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
 * Hidden - OK Object
 *
 * @package Objects
 * @subpackage Input
 */
class OK_Object_Hidden extends OK_Object
{
    /**
     *
     *
     */
    protected $_type = 'hidden';

    /**
     *
     * @var string
     */
    protected $value = '';

    // --

    protected $_params = array('value');

    protected function _toHTML()
    {
        $return = '<input type="hidden" id="'.$this->id.'" value="'.addslashes($this->value).'"/>';
        return $return;
    }
}

